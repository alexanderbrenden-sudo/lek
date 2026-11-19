# Plan: datingapp for Overwatch-spillere

Arbeidsnavn: **Duo** (kan endres). Matching på lokasjon og competitive rank per rolle.

Status: **utkast v2, venter på godkjenning.** Ingen kode er skrevet ennå.
v2: eget repo, kjønn som utvidbar enum med flervalg, «hvilken som helst rolle» som standard, Unranked, BattleTag låst i databasen.

---

## 1. Teknologivalg

| Del | Valg | Hvorfor |
|---|---|---|
| App | **Expo (SDK 58), React Native, TypeScript** | Samme versjon som OW Counters i dette repoet, kjører i Expo Go på telefonen. |
| Navigasjon | **Expo Router** (filbasert) | Innebygd i Expo. Gjør det enkelt å skille innlogging, onboarding og hovedappen. |
| Backend | **Supabase** (Auth, Postgres + PostGIS, Realtime, Storage) | Passer godt, se under. |
| Swipe | `react-native-gesture-handler` + `react-native-reanimated` | Fungerer i Expo Go, ingen egen native-bygging trengs. |
| Lokasjon | `expo-location` | Trenger bare tillatelse mens appen er åpen. |
| Bilder | `expo-image-picker` + Supabase Storage | |
| Datahenting | `@tanstack/react-query` | Hurtigbuffer, lasting og feilhåndtering uten mye egen kode. |
| Validering | `zod` | Samme regler i skjemaer og før kall til databasen. |
| Tester | `jest-expo` (TypeScript-logikk) og **pgTAP** via `supabase test db` (SQL-logikk) | Matching-reglene ligger i databasen og må testes der. |

**Jeg anbefaler å beholde Supabase.** Det viktigste kravet er at begge må passe *hverandres* preferanser, pluss avstand. Det er én SQL-spørring med joins og `ST_DWithin` i Postgres. I Firebase/Firestore måtte man filtrert det meste i klienten eller i Cloud Functions, og det er både tregere og lekker data. Med Row Level Security (RLS) kan ingen klient lese andres rådata, bare det databasefunksjonene gir ut.

**Plassering:** Appen får et **eget repo** (forslag: `duo`). Appen ligger i roten av det repoet. OW Counters-repoet (`lek`) røres ikke. Denne planen flyttes dit i steg 0.

---

## 2. Rank som heltall

```
nivå (tier):  Bronze=0, Silver=1, Gold=2, Platinum=3, Emerald=4,
              Diamond=5, Master=6, Grandmaster=7, Champion=8
verdi = nivå * 5 + (6 - divisjon)        // divisjon 5..1
Top 500 = 46
```

| Rank | Verdi |
|---|---|
| Bronze 5 | 1 |
| Bronze 1 | 5 |
| Gold 3 | 13 |
| Diamond 1 | 30 |
| Champion 1 | 45 |
| Top 500 | 46 |

Tilbake fra tall: `nivå = floor((v-1)/5)`, `divisjon = 5 - ((v-1) % 5)`.
**Unranked** er et eget valg, ikke et tall i skalaen. Det lagres som `NULL`, så Unranked aldri havner «under Bronze» i et spenn. Hver bruker har alltid fire rader i `role_ranks`, én per rolle, og alle starter som Unranked. Databasen sjekker `rank IS NULL OR rank BETWEEN 1 AND 46`.
All konvertering skjer i én fil (`src/lib/rank.ts`) med enhetstester for alle 46 verdier.

---

## 3. Datamodell (Postgres)

### Typer
- `ow_role`: `tank`, `damage`, `support`, `open_queue`
- `gender`: `man`, `woman`, `nonbinary` (vises som mann, kvinne, ikke-binær). Typen kan utvides senere med en migrasjon (`ALTER TYPE gender ADD VALUE '...'`) uten å røre eksisterende data. Visningsteksten ligger i appen, ikke i databasen.

### Tabeller

**`profiles`**: én rad per bruker
| Kolonne | Type | Merknad |
|---|---|---|
| `id` | uuid PK | = `auth.users.id`, slettes med brukeren (cascade) |
| `display_name` | text | 1–30 tegn |
| `birthdate` | date | trigger avviser under 18 år |
| `gender` | gender | |
| `bio` | text | maks 500 tegn |
| `location` | geography(Point, 4326) | grovet ned til ca. 1 km før lagring |
| `location_updated_at` | timestamptz | |
| `onboarded` | bool | må være true for å vises for andre |
| `last_active_at` | timestamptz | for sortering, og for å skjule inaktive |
| `created_at` | timestamptz | |

**`role_ranks`**: rank per rolle, alltid fire rader per bruker
| `user_id` | `role` ow_role | `rank` smallint, 1–46 eller NULL (= Unranked) | PK (`user_id`, `role`) |

**`private_details`**: felt som bare eieren og matcher får se
| Kolonne | Type | Merknad |
|---|---|---|
| `user_id` | uuid PK | |
| `battletag` | text, valgfri | format `Navn#1234` |

BattleTag ligger i en egen tabell med vilje, se «BattleTag kun etter match» under.

**`preferences`**: én rad per bruker
| Kolonne | Type | Merknad |
|---|---|---|
| `user_id` | uuid PK | |
| `role` | ow_role, **NULL = hvilken som helst rolle** (standard) | hvilken rolle rankspennet gjelder |
| `min_rank`, `max_rank` | smallint 1–46 | `min_rank <= max_rank`, standard 1–46 (alle) |
| `include_unranked` | bool | «Vis også Unranked». Standard: på ved hvilken som helst rolle, av ved bestemt rolle |
| `max_distance_km` | smallint | 1–500 |
| `min_age`, `max_age` | smallint | `18 <= min_age <= max_age <= 99` |
| `show_genders` | gender[] | «Vis meg», flervalg, minst ett (`cardinality >= 1`) |

**`photos`**: `id`, `user_id`, `storage_path`, `position` (0–5). Filene ligger i en privat Storage-bøtte og vises via signerte URL-er.

**`swipes`**: `swiper_id`, `swipee_id`, `liked` bool, `created_at`. PK (`swiper_id`, `swipee_id`).

**`matches`**: `id`, `user_a`, `user_b` (alltid `user_a < user_b`, unik), `created_at`, `unmatched_at` (null = aktiv).

**`messages`**: `id`, `match_id`, `sender_id`, `body` (1–2000 tegn), `created_at`, `read_at`. Realtime er slått på for denne tabellen.

**`blocks`**: `blocker_id`, `blocked_id`. **`reports`**: `reporter_id`, `reported_id`, `reason`, `created_at`.
(Blokker og rapporter er påkrevd av App Store og Google Play for apper med brukerinnhold.)

### Indekser
- GIST på `profiles.location`
- `role_ranks (role, rank)`
- `swipes (swipee_id)`, `messages (match_id, created_at)`

### Sikkerhet (RLS)
- Man kan lese og endre **sin egen** profil, ranks, preferanser, bilder og `private_details`. Andres rader kan man ikke lese direkte.
- Andres profiler hentes bare gjennom databasefunksjoner som returnerer trygge felt: navn, **alder** (ikke fødselsdato), **avrundet avstand** (ikke koordinater), ranks, bio og bilder.
- `matches` og `messages` kan bare leses av de to i matchen. Man kan bare sende melding i en aktiv match, og bare som seg selv.
- Swipes og matcher opprettes bare via funksjoner, ikke med direkte insert.

### Databasefunksjoner (RPC)

**`get_candidates(limit int)`** returnerer profiler der *alt* dette gjelder:
1. Ikke meg selv, `onboarded = true`, aktiv siste 30 dager.
2. Jeg har ikke swipet på dem. Ingen blokkering i noen retning. Ingen eksisterende match.
3. **Avstand:** `ST_DWithin(meg, dem, least(min_maks_km, deres_maks_km) * 1000)`. Avstanden må passe begge.
4. **Alder:** deres alder er innenfor mitt spenn, og min alder er innenfor deres.
5. **Kjønn:** deres kjønn er i mine `show_genders`, og mitt kjønn er i deres.
6. **Rank:** de passer mitt rankfilter, og jeg passer deres (regelen under brukes begge veier).

**Rankregelen** (én hjelpefunksjon, `passes_rank_filter(preferanser, person)`):
- En rolle er *innenfor spennet* hvis ranken er mellom `min_rank` og `max_rank`, eller hvis rollen er Unranked og `include_unranked` er på.
- **Hvilken som helst rolle** (`role` er NULL, standard): personen passer hvis **minst én** av de fire rollene er innenfor spennet.
- **Bestemt rolle**: bare den rollen teller. Har personen ikke rank i den rollen, skjules profilen. Det eneste unntaket er hvis `include_unranked` er på. Derfor er bryteren av som standard når man velger en bestemt rolle.

Eksempel: Mitt filter er Gold 3–Diamond 1, hvilken som helst rolle. Kari er Platinum 2 Support og Master Tank. Hun passer fordi Support er innenfor. Velger jeg i stedet bare Tank, passer hun ikke.

Sortering: de som allerede har likt meg litt opp, ellers nærmest først. Avstanden vises som «< 5 km» eller avrundet til nærmeste 5 km, så man ikke kan finne noens posisjon ved å flytte seg og sammenligne avstander.

**`swipe(target uuid, liked bool)`**: sjekker på nytt at target faktisk er en gyldig kandidat (klienten kan ikke like hvem som helst), lagrer swipen og oppretter en match hvis begge har likt. Returnerer `match_id` eller null.

**`unmatch(match_id)`**, **`block_user(id)`**, **`report_user(id, reason)`**, **`delete_account()`**.

**`get_matches()`**: matcher med den andres profil, siste melding og antall uleste.

**`get_match_profile(match_id)`**: full profil for den andre i en matchen, inkludert BattleTag.

### BattleTag kun etter match
Håndheves i databasen, ikke bare i appen:
- BattleTag ligger i `private_details`, som har én RLS-regel: `user_id = auth.uid()`. Ingen andre kan lese den, uansett hvordan de spør.
- `get_candidates` returnerer en fast liste med kolonner, og BattleTag er ikke blant dem.
- Bare `get_match_profile` leser `private_details` for en annen bruker. Funksjonen sjekker først at det finnes en **aktiv** match (`unmatched_at IS NULL`) mellom innlogget bruker og den andre. Ellers gir den feil. Etter unmatch blir BattleTag borte igjen.
- `private_details` er ikke med i Realtime, så den kan ikke lekke via sanntidsstrømmen.
- pgTAP-tester sjekker alt dette: ingen treff ved direkte lesing, ingen BattleTag fra `get_candidates`, feil fra `get_match_profile` uten match og etter unmatch, og riktig BattleTag med aktiv match.

### 18+
- I appen: fødselsdato velges først. Under 18 år stopper registreringen.
- I databasen: en trigger på `profiles` avviser `birthdate` som gir under 18 år. Det holder selv om noen omgår appen.
- Alderen er selvoppgitt. Ekte alderskontroll (f.eks. BankID eller en ID-leverandør) er utenfor første versjon, men kan legges til.

---

## 4. Skjermer

```
Innlogging
  Velkommen         – kort forklaring, «Kom i gang»
  Logg inn          – e-post → 6-sifret kode (fungerer i Expo Go uten dyplenker)

Onboarding (én gang, steg for steg med fremdriftslinje)
  1 Om deg          – fødselsdato (18+-sperre), kjønn, visningsnavn
  2 Bilder          – 1–6 bilder
  3 Ranks           – rank per rolle (Tank, Damage, Support, Open Queue), hver kan settes til Unranked
  4 Hvem du ser etter – rolle («Hvilken som helst» eller én bestemt), rankspenn, «Vis også Unranked»,
                      alder, «Vis meg» (flervalg: mann, kvinne, ikke-binær), maks avstand
  5 Lokasjon        – be om tillatelse, forklar at bare grov posisjon lagres
  6 Bio + BattleTag (valgfritt)

Hovedapp (faner)
  Oppdag            – swipekort: bilde, navn, alder, avstand, rank-merker per rolle, bio
                      knapper for ✕ / ♥ i tillegg til sveip
                      «Det er en match!» vises når begge har likt
                      tom tilstand: «Ingen flere nå, prøv å utvide preferansene»
  Matcher           – liste over matcher med siste melding og uleste
  Profil            – se egen profil slik andre ser den, rediger

Andre skjermer
  Chat              – meldinger i sanntid, meny: se profil / unmatch / blokker / rapporter
  Rediger profil    – bilder, bio, ranks
  Preferanser       – samme skjema som onboarding steg 4
  Innstillinger     – logg ut, blokkerte brukere, slett konto (påkrevd av App Store)
```

Rank-merkene tegner jeg selv (farge per nivå + tall). Blizzards rank-ikoner og logoer er varemerker og bør ikke brukes.

---

## 5. Mappestruktur

```
duo/                            # eget repo
  PLAN.md
  app/                          # Expo Router (skjermer = filer)
    _layout.tsx                 # Supabase-session, sender videre til riktig gruppe
    (auth)/
      welcome.tsx
      sign-in.tsx
      verify.tsx
    (onboarding)/
      _layout.tsx
      about.tsx  photos.tsx  ranks.tsx  preferences.tsx  location.tsx  bio.tsx
    (tabs)/
      _layout.tsx
      discover.tsx
      matches.tsx
      profile.tsx
    chat/[matchId].tsx
    profile/edit.tsx
    settings/
      index.tsx  preferences.tsx  blocked.tsx
  src/
    lib/
      supabase.ts               # klient med sikker sesjonslagring
      rank.ts                   # heltall <-> «Gold 3», farger, liste for velgere
      age.ts
      location.ts               # tillatelse, nedgroving, oppdatering ved oppstart
    features/                   # hooks og spørringer per område
      auth/  profile/  discover/  matches/  chat/  safety/
    components/
      RankPicker.tsx  RankBadge.tsx  RangeSlider.tsx
      SwipeCard.tsx   SwipeDeck.tsx  PhotoGrid.tsx  Button.tsx ...
    types/
      database.ts               # generert med `supabase gen types`
    theme.ts
  supabase/
    config.toml
    migrations/
      0001_extensions_and_types.sql
      0002_profiles_ranks_preferences.sql   # inkl. private_details
      0003_photos_storage.sql
      0004_candidates.sql
      0005_swipes_matches.sql
      0006_messages.sql
      0007_safety.sql
    seed.sql                    # ~50 testbrukere rundt Oslo/Bergen med ulike ranks
    tests/                      # pgTAP-tester
      candidates_test.sql
      swipe_match_test.sql
      rank_filter_test.sql      # hvilken som helst rolle, bestemt rolle, Unranked
      battletag_test.sql        # BattleTag aldri ut før match
      rls_test.sql
  __tests__/rank.test.ts
  app.json  package.json  tsconfig.json  .env.example
```

---

## 6. Byggerekkefølge (små steg du kan teste)

Hvert steg avsluttes med en commit og noe konkret du kan sjekke.

| # | Steg | Slik tester du |
|---|---|---|
| 0 | I det nye repoet: Expo Router, TypeScript og flytt `PLAN.md` dit. Tom app med tre faner | `npx expo start`, åpne i Expo Go og se tre tomme faner |
| 1 | `rank.ts` + enhetstester | `npm test`: Bronze 5 = 1, Champion 1 = 45, Top 500 = 46, Unranked = null, alle verdier frem og tilbake |
| 2 | Migrasjon 0001–0002: typer, profiles, role_ranks, preferences, private_details, RLS, 18+-trigger | `supabase db reset` og `supabase test db`. Under 18 år avvises, andres rader og BattleTag kan ikke leses |
| 3 | Supabase-klient + innlogging med e-postkode | Logg inn på telefonen, lukk appen, åpne igjen og vær fortsatt innlogget |
| 4 | Onboarding 1: om deg (med 18+-sperre) | Prøv en fødselsdato som gir 17 år og bli stoppet. Se raden i Supabase Studio |
| 5 | Onboarding 3: RankPicker per rolle med Unranked | Lagre Gold 3 Support, se `13` i `role_ranks`. Sett Tank til Unranked, se `NULL` |
| 6 | Onboarding 4: preferanser (rolle eller hvilken som helst, rankspenn, Unranked, alder, «Vis meg», km) | Ugyldig spenn (min > maks) og tom «Vis meg» kan ikke lagres |
| 7 | Onboarding 5: lokasjon | Koordinatene i Studio er grovet ned. Avslått tillatelse gir en forklaring, ikke en krasj |
| 8 | Migrasjon 0003 + onboarding 2: bilder | Last opp 2 bilder, se dem i bøtta, og sjekk at de ikke kan åpnes uten innlogging |
| 9 | Migrasjon 0004: `get_candidates` + seed + pgTAP-tester for gjensidighet | `supabase test db`: A ser B bare når begge passer hverandre på rank, rolle, alder, kjønn og avstand. Egne tester for hvilken som helst rolle, bestemt rolle og Unranked |
| 10 | Oppdag-skjerm med knapper (ingen sveip ennå) | Logg inn som en seed-bruker og se riktige kandidater med alder, avstand og ranks |
| 11 | Migrasjon 0005: `swipe` + match | Bruker A liker B, så liker B A, og det oppstår en match. Test med to kontoer (telefon + nettleser) |
| 12 | Sveipegester + «Det er en match!» | Sveip til høyre/venstre på telefonen |
| 13 | Matcher-fanen + `get_match_profile` med BattleTag | Ny match dukker opp i lista og viser BattleTag. pgTAP: BattleTag gir feil uten match |
| 14 | Migrasjon 0006: meldinger + chat med Realtime | Send fra telefonen, og meldingen dukker opp i nettleseren uten oppdatering. Kan ikke sende uten match |
| 15 | Migrasjon 0007: unmatch, blokker, rapporter | Blokkert bruker forsvinner fra Oppdag og Matcher i begge retninger. Etter unmatch er BattleTag borte |
| 16 | Rediger profil, preferanser, innstillinger, slett konto | Slettet konto forsvinner helt (profil, bilder, meldinger) |
| 17 | Polering: tomme tilstander, feilmeldinger, lastevisning, ikon | Gå gjennom hele flyten med en ny konto |
| 18 | (Valgfritt) Push-varsler for match og melding | Krever development build via EAS (fungerer ikke i Expo Go) |
| 19 | (Senere) EAS Build → TestFlight / Google Play intern testing | Installer på telefonen fra TestFlight |

Steg 0–9 kan gjøres uten swipe-UI. Steg 9 er det viktigste å få riktig, og det er derfor det testes grundigst.

---

## 7. Dette må du sette opp selv

0. **Nytt GitHub-repo:** Lag et tomt repo, f.eks. `duo` (privat er greit), og si fra når det finnes. Da kobler jeg det til økten og starter der. Jeg kan ikke opprette repoer selv.
1. **Supabase-prosjekt** (gratisnivå holder): supabase.com → New project, region **Stockholm (eu-north-1)**.
   - Kopier **Project URL** og **anon/publishable key** til `.env` i det nye repoet som `EXPO_PUBLIC_SUPABASE_URL` og `EXPO_PUBLIC_SUPABASE_ANON_KEY`. Anon-nøkkelen er trygg i appen fordi RLS beskytter dataene. **Service role-nøkkelen skal aldri inn i appen eller på GitHub.**
2. **Innlogging med e-postkode:** Authentication → Email: slå på, og endre e-postmalen så den viser `{{ .Token }}` (koden) i stedet for bare en lenke.
   Supabase sin innebygde e-post sender bare noen få e-poster i timen. Før andre skal teste, sett opp egen SMTP (f.eks. Resend, gratisnivå) under Authentication → SMTP.
3. **Supabase CLI**, og **Docker Desktop** hvis du vil kjøre databasen lokalt (anbefalt for testing): `npm i -g supabase`, `supabase login`, `supabase link`. Migrasjonene sendes til skyen med `supabase db push`.
   Jeg kan skrive migrasjoner og tester her, men har ikke tilgang til ditt Supabase-prosjekt. Du kjører `db push` (eller gir meg beskjed om du vil ha en annen løsning).
4. **Expo Go** på telefonen (har du allerede). Senere: Expo-konto for EAS Build.
5. **For publisering (senere):** Apple Developer Program (99 USD/år) og Google Play Console (25 USD én gang).
6. **Personvern (GDPR):** En datingapp behandler sensitive opplysninger. Kjønnspreferanser kan avsløre seksuell orientering, som er en særlig kategori. Du trenger en personvernerklæring, et tydelig samtykke ved registrering og mulighet til å slette konto. Det siste er med i planen. Appstorene krever også en lenke til personvernerklæringen.
7. **Varemerke:** Ikke bruk «Overwatch» i appnavnet og ikke Blizzards logoer eller rank-ikoner. «For Overwatch-spillere» i beskrivelsen er vanligvis greit.

---

## 8. Avgjort

1. Eget repo, ikke undermappe i `lek`.
2. Kjønn: mann, kvinne, ikke-binær. Lagres som en enum som kan utvides. «Vis meg» er flervalg.
3. Standard rollefilter er «hvilken som helst rolle»: personen passer hvis minst én rolle er innenfor spennet. Et rollespesifikt filter er valgfritt, og da skjules profiler uten rank i den rollen. Unranked er et eget valg.
4. BattleTag vises bare etter match. Det håndheves i RLS og RPC.

Si «godkjent» (eventuelt med endringer) og gi meg navnet på det nye repoet, så begynner jeg på steg 0.
