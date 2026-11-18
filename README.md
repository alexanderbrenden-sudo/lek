# OW Counters

En mobilapp (Expo / React Native) for Overwatch 2:

- **Helter** – søk og filtrer på rolle. Hver helt viser hvem som kontrer den, hvem den er sterk mot, et tips om hvordan man slår den, og hvilke kart den passer på.
- **Lagbygger** – velg opptil 5 helter på fiendens lag (og eventuelt kart og din rolle), så får du forslag til hvem du bør spille, med begrunnelse.
- **Kart** – alle kart sortert etter modus, med de beste heltene per rolle (tank, damage, support).

Alle helter og kart har eget, generert cover art (portretter, bannere og landskap).

## Kom i gang

```bash
npm install
npx expo start
```

Skann QR-koden med **Expo Go**-appen på telefonen (iPhone eller Android), så åpnes appen.
Du kan også kjøre `npx expo start --web` for å teste i nettleseren.

## Skann skjermen (AI)

I lagbyggeren kan du ta bilde av scoreboardet på TV-en (hold inne touchpaden på PlayStation). Claude Opus 5.5 kjenner igjen fiendens helter og fyller inn laget.

- Krever en egen API-nøkkel fra Anthropic (console.anthropic.com → API Keys). Lim den inn i appen første gang.
- Nøkkelen lagres bare på telefonen (localStorage) og sendes kun til api.anthropic.com. Den ligger aldri i koden eller på GitHub.
- Hvert bilde koster omtrent 20–50 øre fra Anthropic-kontoen din. Sett gjerne en månedlig grense i Console.
- Koden ligger i `src/data/scan.ts` (AI-kallet) og `src/components/ScanCard.tsx` (kamera og oppsett).

## Installer på iPhone (gratis)

Appen kan installeres som en web-app med eget ikon på Hjem-skjermen. Den åpnes i fullskjerm uten Safari-menyer.

**Engangsoppsett på GitHub:**
1. Repoet må være offentlig (Settings → General → Danger Zone → Change visibility), fordi GitHub Pages er gratis bare for offentlige repoer.
2. Settings → Pages → Source: **GitHub Actions**.
3. Når koden ligger på `main`, bygges og publiseres appen automatisk (`.github/workflows/pages.yml`) på
   `https://<brukernavn>.github.io/lek/`.

**På iPhonen:**
1. Åpne adressen over i **Safari**.
2. Trykk på Del-knappen (firkant med pil opp).
3. Velg **Legg til på Hjem-skjerm**, og trykk **Legg til**.

Bygg web-versjonen lokalt med `npm run build:web` (havner i `dist/`).

## Endre data

All data ligger i to filer, og er lett å justere når spillet blir balansert om:

- `src/data/heroes.ts` – helter, rolle, `counteredBy` (hvem som kontrer helten) og tips.
  «Sterk mot» regnes ut automatisk.
- `src/data/maps.ts` – kart, modus og beste helter per rolle.

### Lagbyggerens poeng

For hver helt: **+2** per fiende den kontrer, **−1,5** per fiende som kontrer den, og **+1,5 / +1 / +0,5** hvis den er nr. 1/2/3 på valgt kart. Vektene ligger i `src/data/team.ts`.

### Egne bilder

Cover art-en lages automatisk (`src/components/Art.tsx`). Vil du bruke ekte bilder, legg til `image: 'https://…'` på en helt i `heroes.ts` eller et kart i `maps.ts`. Bildet legges da over den genererte kunsten, og hvis det ikke laster, vises den genererte i stedet.
Fargene og motivet (by, fjell, snø, ørken, kyst) for hvert kart styres av `art: art('city', 'night')` i `maps.ts`.

Dataene er basert på generell kunnskap fra miljøet og er ment som en pekepinn, ikke fasit.
