import type { Role } from './heroes';

export type Mode = 'Control' | 'Escort' | 'Hybrid' | 'Push' | 'Flashpoint' | 'Clash';

export type Scene = 'city' | 'mountain' | 'snow' | 'desert' | 'coast';

export type MapArt = {
  scene: Scene;
  skyTop: string;
  skyBottom: string;
  far: string;
  near: string;
  sun: string;
};

export type GameMap = {
  id: string;
  name: string;
  mode: Mode;
  /** Farger og motiv for det genererte cover-bildet. */
  art: MapArt;
  /** Valgfri URL til et eget bilde som legges over det genererte. */
  image?: string;
  /** Gode helter per rolle, best først. */
  best: Record<Role, string[]>;
  note: string;
};

export const MODES: Mode[] = ['Control', 'Escort', 'Hybrid', 'Push', 'Flashpoint', 'Clash'];

// Grove arketyper brukt nedenfor:
//  - Brawl: trange rom og korte avstander
//  - Dive: mye høyde og flankeruter
//  - Poke: lange siktelinjer
const BRAWL = { tank: ['reinhardt', 'junkerqueen', 'mauga'], support: ['lucio', 'kiriko', 'brigitte'] };
const DIVE = { tank: ['winston', 'dva', 'wreckingball'], support: ['kiriko', 'zenyatta', 'juno'] };
const POKE = { tank: ['sigma', 'ramattra', 'orisa'], support: ['ana', 'baptiste', 'zenyatta'] };


const PALETTES = {
  day: { skyTop: '#4A90D9', skyBottom: '#BFE3F5', far: '#6E8FB0', near: '#2C3E55', sun: '#FFF3B0' },
  sunset: { skyTop: '#2B1B4A', skyBottom: '#F58A5B', far: '#6B3A5E', near: '#2A1630', sun: '#FFD27A' },
  night: { skyTop: '#0B1030', skyBottom: '#3A2A6A', far: '#2A2350', near: '#120E26', sun: '#FFE9A8' },
  neon: { skyTop: '#12052A', skyBottom: '#6A1B6E', far: '#3D1450', near: '#17071F', sun: '#FF5FD2' },
  snow: { skyTop: '#8FB8DE', skyBottom: '#E8F2FA', far: '#F4F8FC', near: '#9DB4C8', sun: '#FFFFFF' },
  desert: { skyTop: '#E9965A', skyBottom: '#F8D9A0', far: '#C26D3F', near: '#8E4A2A', sun: '#FFF1C4' },
  tropical: { skyTop: '#2FB4D6', skyBottom: '#B6F0E6', far: '#3C8C6A', near: '#1C5A6E', sun: '#FFF7C2' },
  jungle: { skyTop: '#6FB89A', skyBottom: '#E2F2C8', far: '#3F7A55', near: '#1F4A33', sun: '#FFF0B0' },
  dusk: { skyTop: '#1E2A4A', skyBottom: '#8A6FA0', far: '#3E3A5C', near: '#1A1A2E', sun: '#F7D9A0' },
  crimson: { skyTop: '#2A0A14', skyBottom: '#A8323E', far: '#5A1A2A', near: '#1E070D', sun: '#FFC2A0' },
};

function art(scene: Scene, palette: keyof typeof PALETTES): MapArt {
  return { scene, ...PALETTES[palette] };
}

export const MAPS: GameMap[] = [
  // ---------- CONTROL ----------
  {
    id: 'antarctic', name: 'Antarctic Peninsula', mode: 'Control',
    art: art('snow', 'snow'),
    best: { ...BRAWL, damage: ['mei', 'reaper', 'sojourn'] },
    note: 'Mange innendørs områder og trange korridorer gir brawl-komper en fordel.',
  },
  {
    id: 'busan', name: 'Busan', mode: 'Control',
    art: art('city', 'neon'),
    best: { ...DIVE, damage: ['tracer', 'genji', 'sojourn'] },
    note: 'Mye høyde og flankeruter, særlig på Downtown og Sanctuary.',
  },
  {
    id: 'ilios', name: 'Ilios', mode: 'Control',
    art: art('coast', 'tropical'),
    best: { tank: ['winston', 'dva', 'roadhog'], damage: ['pharah', 'widowmaker', 'sojourn'], support: ['ana', 'kiriko', 'lucio'] },
    note: 'Well og Ruins har kanter man kan dytte fiender ned fra – Lúcio og Roadhog trives.',
  },
  {
    id: 'lijiang', name: 'Lijiang Tower', mode: 'Control',
    art: art('city', 'crimson'),
    best: { ...DIVE, damage: ['tracer', 'genji', 'cassidy'] },
    note: 'Tette punkter med mye høyde rundt – dive og flankere er sterke.',
  },
  {
    id: 'nepal', name: 'Nepal', mode: 'Control',
    art: art('snow', 'snow'),
    best: { tank: ['winston', 'dva', 'reinhardt'], damage: ['tracer', 'genji', 'pharah'], support: ['lucio', 'kiriko', 'ana'] },
    note: 'Village og Shrine har mye vertikalitet; Sanctum er et lite brawl-punkt.',
  },
  {
    id: 'oasis', name: 'Oasis', mode: 'Control',
    art: art('desert', 'day'),
    best: { ...DIVE, damage: ['pharah', 'echo', 'tracer'] },
    note: 'Åpne områder med mye luftrom – Pharah og Echo får boltre seg.',
  },
  {
    id: 'samoa', name: 'Samoa', mode: 'Control',
    art: art('coast', 'tropical'),
    best: { tank: ['winston', 'dva', 'sigma'], damage: ['sojourn', 'ashe', 'tracer'], support: ['kiriko', 'ana', 'lucio'] },
    note: 'Store, åpne punkter med lange siktelinjer og mye høyde.',
  },

  // ---------- ESCORT ----------
  {
    id: 'circuitroyal', name: 'Circuit Royal', mode: 'Escort',
    art: art('coast', 'night'),
    best: { ...POKE, damage: ['widowmaker', 'ashe', 'hanzo'] },
    note: 'Ekstremt lange siktelinjer – en av de beste Widowmaker-kartene.',
  },
  {
    id: 'dorado', name: 'Dorado', mode: 'Escort',
    art: art('city', 'sunset'),
    best: { tank: ['winston', 'sigma', 'dva'], damage: ['sojourn', 'widowmaker', 'ashe'], support: ['ana', 'baptiste', 'kiriko'] },
    note: 'Første punkt er åpent med høyde på begge sider; senere blir det trangere.',
  },
  {
    id: 'havana', name: 'Havana', mode: 'Escort',
    art: art('coast', 'sunset'),
    best: { ...POKE, damage: ['widowmaker', 'ashe', 'sojourn'] },
    note: 'Lange gater og siktelinjer belønner poke og snipere.',
  },
  {
    id: 'junkertown', name: 'Junkertown', mode: 'Escort',
    art: art('desert', 'desert'),
    best: { ...POKE, damage: ['widowmaker', 'ashe', 'pharah'] },
    note: 'Svært åpent første punkt – mye plass til snipere og Pharah.',
  },
  {
    id: 'rialto', name: 'Rialto', mode: 'Escort',
    art: art('coast', 'dusk'),
    best: { ...BRAWL, damage: ['reaper', 'mei', 'cassidy'] },
    note: 'Trange gater og broer – brawl og Reinhardt-spill er sterkt.',
  },
  {
    id: 'route66', name: 'Route 66', mode: 'Escort',
    art: art('desert', 'desert'),
    best: { tank: ['sigma', 'winston', 'dva'], damage: ['widowmaker', 'ashe', 'sojourn'], support: ['ana', 'baptiste', 'kiriko'] },
    note: 'Lange, åpne områder med god høyde for snipere.',
  },
  {
    id: 'shambali', name: 'Shambali Monastery', mode: 'Escort',
    art: art('snow', 'dusk'),
    best: { ...DIVE, damage: ['tracer', 'genji', 'sojourn'] },
    note: 'Mye høyde og flankeruter – dive-komper trives.',
  },
  {
    id: 'gibraltar', name: 'Watchpoint: Gibraltar', mode: 'Escort',
    art: art('coast', 'day'),
    best: { ...DIVE, damage: ['pharah', 'echo', 'tracer'] },
    note: 'Høye plattformer og mye luftrom – Pharah, Echo og Winston er sterke.',
  },

  // ---------- HYBRID ----------
  {
    id: 'blizzardworld', name: 'Blizzard World', mode: 'Hybrid',
    art: art('city', 'day'),
    best: { tank: ['reinhardt', 'dva', 'winston'], damage: ['sojourn', 'cassidy', 'tracer'], support: ['lucio', 'kiriko', 'ana'] },
    note: 'Blanding av trange og åpne områder – fleksible komper fungerer.',
  },
  {
    id: 'eichenwalde', name: 'Eichenwalde', mode: 'Hybrid',
    art: art('mountain', 'dusk'),
    best: { ...BRAWL, damage: ['junkrat', 'reaper', 'mei'] },
    note: 'Klassisk brawl-kart med choke-punkter og slottet til slutt.',
  },
  {
    id: 'hollywood', name: 'Hollywood', mode: 'Hybrid',
    art: art('city', 'sunset'),
    best: { tank: ['reinhardt', 'sigma', 'dva'], damage: ['widowmaker', 'cassidy', 'sojourn'], support: ['ana', 'kiriko', 'lucio'] },
    note: 'Lange gater med mange hjørner – både poke og brawl kan fungere.',
  },
  {
    id: 'kingsrow', name: "King's Row", mode: 'Hybrid',
    art: art('city', 'night'),
    best: { ...BRAWL, damage: ['junkrat', 'reaper', 'mei'] },
    note: 'Trange gater og choke-punkter – perfekt for Reinhardt og Junkrat.',
  },
  {
    id: 'midtown', name: 'Midtown', mode: 'Hybrid',
    art: art('city', 'day'),
    best: { tank: ['sigma', 'reinhardt', 'ramattra'], damage: ['sojourn', 'cassidy', 'ashe'], support: ['ana', 'baptiste', 'lucio'] },
    note: 'Lange gater og t-bane-stasjon – middels avstander.',
  },
  {
    id: 'numbani', name: 'Numbani', mode: 'Hybrid',
    art: art('city', 'day'),
    best: { ...DIVE, damage: ['pharah', 'echo', 'tracer'] },
    note: 'Åpent første punkt med mye luftrom – Pharah er sterk.',
  },
  {
    id: 'paraiso', name: 'Paraíso', mode: 'Hybrid',
    art: art('coast', 'sunset'),
    best: { tank: ['reinhardt', 'junkerqueen', 'dva'], damage: ['cassidy', 'sojourn', 'mei'], support: ['lucio', 'kiriko', 'ana'] },
    note: 'Mest trange gater – brawl-komper fungerer godt.',
  },

  // ---------- PUSH ----------
  {
    id: 'colosseo', name: 'Colosseo', mode: 'Push',
    art: art('city', 'sunset'),
    best: { ...POKE, damage: ['widowmaker', 'ashe', 'sojourn'] },
    note: 'Lange, rette gater med siktelinjer langs ruten til roboten.',
  },
  {
    id: 'esperanca', name: 'Esperança', mode: 'Push',
    art: art('coast', 'day'),
    best: { ...BRAWL, damage: ['reaper', 'mei', 'sojourn'] },
    note: 'Trangere gater og mange hjørner – brawl er sterkt.',
  },
  {
    id: 'newqueenstreet', name: 'New Queen Street', mode: 'Push',
    art: art('city', 'night'),
    best: { tank: ['sigma', 'reinhardt', 'dva'], damage: ['sojourn', 'ashe', 'cassidy'], support: ['ana', 'baptiste', 'lucio'] },
    note: 'Bred midtgate med mulighet for både poke og brawl.',
  },
  {
    id: 'runasapi', name: 'Runasapi', mode: 'Push',
    art: art('mountain', 'jungle'),
    best: { ...DIVE, damage: ['tracer', 'genji', 'sojourn'] },
    note: 'Mye høyde og terrassert terreng – dive fungerer godt.',
  },

  // ---------- FLASHPOINT ----------
  {
    id: 'newjunkcity', name: 'New Junk City', mode: 'Flashpoint',
    art: art('desert', 'sunset'),
    best: { tank: ['winston', 'dva', 'wreckingball'], damage: ['tracer', 'sojourn', 'venture'], support: ['lucio', 'kiriko', 'juno'] },
    note: 'Store avstander mellom punktene – mobilitet er gull.',
  },
  {
    id: 'suravasa', name: 'Suravasa', mode: 'Flashpoint',
    art: art('mountain', 'jungle'),
    best: { tank: ['winston', 'dva', 'wreckingball'], damage: ['tracer', 'sojourn', 'genji'], support: ['lucio', 'kiriko', 'juno'] },
    note: 'Raske rotasjoner mellom punkter – mobile helter vinner.',
  },
  {
    id: 'aatlis', name: 'Aatlis', mode: 'Flashpoint',
    art: art('coast', 'tropical'),
    best: { tank: ['winston', 'dva', 'wreckingball'], damage: ['tracer', 'sojourn', 'echo'], support: ['lucio', 'kiriko', 'juno'] },
    note: 'Mye høyde og lange rotasjoner – mobilitet og dive er sterkt.',
  },

  // ---------- CLASH ----------
  {
    id: 'hanaoka', name: 'Hanaoka', mode: 'Clash',
    art: art('city', 'crimson'),
    best: { ...BRAWL, damage: ['reaper', 'mei', 'cassidy'] },
    note: 'Tette punkter med korte avstander.',
  },
  {
    id: 'anubis', name: 'Throne of Anubis', mode: 'Clash',
    art: art('desert', 'night'),
    best: { tank: ['reinhardt', 'dva', 'sigma'], damage: ['cassidy', 'sojourn', 'widowmaker'], support: ['ana', 'kiriko', 'lucio'] },
    note: 'Blanding av choke-punkter og lange siktelinjer.',
  },
];

/** Kart der en helt er anbefalt. */
export function mapsForHero(heroId: string): GameMap[] {
  return MAPS.filter((m) => Object.values(m.best).some((ids) => ids.includes(heroId)));
}
