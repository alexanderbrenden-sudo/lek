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
