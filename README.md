# OW Counters

En mobilapp (Expo / React Native) for Overwatch 2:

- **Helter** – søk og filtrer på rolle. Hver helt viser hvem som kontrer den, hvem den er sterk mot, et tips om hvordan man slår den, og hvilke kart den passer på.
- **Kart** – alle kart sortert etter modus, med de beste heltene per rolle (tank, damage, support).

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

Dataene er basert på generell kunnskap fra miljøet og er ment som en pekepinn, ikke fasit.
