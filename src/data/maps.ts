import type { Role } from './heroes';

export type Mode = 'Control' | 'Escort' | 'Hybrid' | 'Push' | 'Flashpoint' | 'Clash';

export type GameMap = {
  id: string;
  name: string;
  mode: Mode;
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

export const MAPS: GameMap[] = [
  // ---------- CONTROL ----------
  {
    id: 'antarctic', name: 'Antarctic Peninsula', mode: 'Control',
    best: { ...BRAWL, damage: ['mei', 'reaper', 'sojourn'] },
    note: 'Mange innendørs områder og trange korridorer gir brawl-komper en fordel.',
  },
  {
    id: 'busan', name: 'Busan', mode: 'Control',
    best: { ...DIVE, damage: ['tracer', 'genji', 'sojourn'] },
    note: 'Mye høyde og flankeruter, særlig på Downtown og Sanctuary.',
  },
  {
    id: 'ilios', name: 'Ilios', mode: 'Control',
    best: { tank: ['winston', 'dva', 'roadhog'], damage: ['pharah', 'widowmaker', 'sojourn'], support: ['ana', 'kiriko', 'lucio'] },
    note: 'Well og Ruins har kanter man kan dytte fiender ned fra – Lúcio og Roadhog trives.',
  },
  {
    id: 'lijiang', name: 'Lijiang Tower', mode: 'Control',
    best: { ...DIVE, damage: ['tracer', 'genji', 'cassidy'] },
    note: 'Tette punkter med mye høyde rundt – dive og flankere er sterke.',
  },
  {
    id: 'nepal', name: 'Nepal', mode: 'Control',
    best: { tank: ['winston', 'dva', 'reinhardt'], damage: ['tracer', 'genji', 'pharah'], support: ['lucio', 'kiriko', 'ana'] },
    note: 'Village og Shrine har mye vertikalitet; Sanctum er et lite brawl-punkt.',
  },
  {
    id: 'oasis', name: 'Oasis', mode: 'Control',
    best: { ...DIVE, damage: ['pharah', 'echo', 'tracer'] },
    note: 'Åpne områder med mye luftrom – Pharah og Echo får boltre seg.',
  },
  {
    id: 'samoa', name: 'Samoa', mode: 'Control',
    best: { tank: ['winston', 'dva', 'sigma'], damage: ['sojourn', 'ashe', 'tracer'], support: ['kiriko', 'ana', 'lucio'] },
    note: 'Store, åpne punkter med lange siktelinjer og mye høyde.',
  },

  // ---------- ESCORT ----------
  {
    id: 'circuitroyal', name: 'Circuit Royal', mode: 'Escort',
    best: { ...POKE, damage: ['widowmaker', 'ashe', 'hanzo'] },
    note: 'Ekstremt lange siktelinjer – en av de beste Widowmaker-kartene.',
  },
  {
    id: 'dorado', name: 'Dorado', mode: 'Escort',
    best: { tank: ['winston', 'sigma', 'dva'], damage: ['sojourn', 'widowmaker', 'ashe'], support: ['ana', 'baptiste', 'kiriko'] },
    note: 'Første punkt er åpent med høyde på begge sider; senere blir det trangere.',
  },
  {
    id: 'havana', name: 'Havana', mode: 'Escort',
    best: { ...POKE, damage: ['widowmaker', 'ashe', 'sojourn'] },
    note: 'Lange gater og siktelinjer belønner poke og snipere.',
  },
  {
    id: 'junkertown', name: 'Junkertown', mode: 'Escort',
    best: { ...POKE, damage: ['widowmaker', 'ashe', 'pharah'] },
    note: 'Svært åpent første punkt – mye plass til snipere og Pharah.',
  },
  {
    id: 'rialto', name: 'Rialto', mode: 'Escort',
    best: { ...BRAWL, damage: ['reaper', 'mei', 'cassidy'] },
    note: 'Trange gater og broer – brawl og Reinhardt-spill er sterkt.',
  },
  {
    id: 'route66', name: 'Route 66', mode: 'Escort',
    best: { tank: ['sigma', 'winston', 'dva'], damage: ['widowmaker', 'ashe', 'sojourn'], support: ['ana', 'baptiste', 'kiriko'] },
    note: 'Lange, åpne områder med god høyde for snipere.',
  },
  {
    id: 'shambali', name: 'Shambali Monastery', mode: 'Escort',
    best: { ...DIVE, damage: ['tracer', 'genji', 'sojourn'] },
    note: 'Mye høyde og flankeruter – dive-komper trives.',
  },
  {
    id: 'gibraltar', name: 'Watchpoint: Gibraltar', mode: 'Escort',
    best: { ...DIVE, damage: ['pharah', 'echo', 'tracer'] },
    note: 'Høye plattformer og mye luftrom – Pharah, Echo og Winston er sterke.',
  },

  // ---------- HYBRID ----------
  {
    id: 'blizzardworld', name: 'Blizzard World', mode: 'Hybrid',
    best: { tank: ['reinhardt', 'dva', 'winston'], damage: ['sojourn', 'cassidy', 'tracer'], support: ['lucio', 'kiriko', 'ana'] },
    note: 'Blanding av trange og åpne områder – fleksible komper fungerer.',
  },
  {
    id: 'eichenwalde', name: 'Eichenwalde', mode: 'Hybrid',
    best: { ...BRAWL, damage: ['junkrat', 'reaper', 'mei'] },
    note: 'Klassisk brawl-kart med choke-punkter og slottet til slutt.',
  },
  {
    id: 'hollywood', name: 'Hollywood', mode: 'Hybrid',
    best: { tank: ['reinhardt', 'sigma', 'dva'], damage: ['widowmaker', 'cassidy', 'sojourn'], support: ['ana', 'kiriko', 'lucio'] },
    note: 'Lange gater med mange hjørner – både poke og brawl kan fungere.',
  },
  {
    id: 'kingsrow', name: "King's Row", mode: 'Hybrid',
    best: { ...BRAWL, damage: ['junkrat', 'reaper', 'mei'] },
    note: 'Trange gater og choke-punkter – perfekt for Reinhardt og Junkrat.',
  },
  {
    id: 'midtown', name: 'Midtown', mode: 'Hybrid',
    best: { tank: ['sigma', 'reinhardt', 'ramattra'], damage: ['sojourn', 'cassidy', 'ashe'], support: ['ana', 'baptiste', 'lucio'] },
    note: 'Lange gater og t-bane-stasjon – middels avstander.',
  },
  {
    id: 'numbani', name: 'Numbani', mode: 'Hybrid',
    best: { ...DIVE, damage: ['pharah', 'echo', 'tracer'] },
    note: 'Åpent første punkt med mye luftrom – Pharah er sterk.',
  },
  {
    id: 'paraiso', name: 'Paraíso', mode: 'Hybrid',
    best: { tank: ['reinhardt', 'junkerqueen', 'dva'], damage: ['cassidy', 'sojourn', 'mei'], support: ['lucio', 'kiriko', 'ana'] },
    note: 'Mest trange gater – brawl-komper fungerer godt.',
  },

  // ---------- PUSH ----------
  {
    id: 'colosseo', name: 'Colosseo', mode: 'Push',
    best: { ...POKE, damage: ['widowmaker', 'ashe', 'sojourn'] },
    note: 'Lange, rette gater med siktelinjer langs ruten til roboten.',
  },
  {
    id: 'esperanca', name: 'Esperança', mode: 'Push',
    best: { ...BRAWL, damage: ['reaper', 'mei', 'sojourn'] },
    note: 'Trangere gater og mange hjørner – brawl er sterkt.',
  },
  {
    id: 'newqueenstreet', name: 'New Queen Street', mode: 'Push',
    best: { tank: ['sigma', 'reinhardt', 'dva'], damage: ['sojourn', 'ashe', 'cassidy'], support: ['ana', 'baptiste', 'lucio'] },
    note: 'Bred midtgate med mulighet for både poke og brawl.',
  },
  {
    id: 'runasapi', name: 'Runasapi', mode: 'Push',
    best: { ...DIVE, damage: ['tracer', 'genji', 'sojourn'] },
    note: 'Mye høyde og terrassert terreng – dive fungerer godt.',
  },

  // ---------- FLASHPOINT ----------
  {
    id: 'newjunkcity', name: 'New Junk City', mode: 'Flashpoint',
    best: { tank: ['winston', 'dva', 'wreckingball'], damage: ['tracer', 'sojourn', 'venture'], support: ['lucio', 'kiriko', 'juno'] },
    note: 'Store avstander mellom punktene – mobilitet er gull.',
  },
  {
    id: 'suravasa', name: 'Suravasa', mode: 'Flashpoint',
    best: { tank: ['winston', 'dva', 'wreckingball'], damage: ['tracer', 'sojourn', 'genji'], support: ['lucio', 'kiriko', 'juno'] },
    note: 'Raske rotasjoner mellom punkter – mobile helter vinner.',
  },
  {
    id: 'aatlis', name: 'Aatlis', mode: 'Flashpoint',
    best: { tank: ['winston', 'dva', 'wreckingball'], damage: ['tracer', 'sojourn', 'echo'], support: ['lucio', 'kiriko', 'juno'] },
    note: 'Mye høyde og lange rotasjoner – mobilitet og dive er sterkt.',
  },

  // ---------- CLASH ----------
  {
    id: 'hanaoka', name: 'Hanaoka', mode: 'Clash',
    best: { ...BRAWL, damage: ['reaper', 'mei', 'cassidy'] },
    note: 'Tette punkter med korte avstander.',
  },
  {
    id: 'anubis', name: 'Throne of Anubis', mode: 'Clash',
    best: { tank: ['reinhardt', 'dva', 'sigma'], damage: ['cassidy', 'sojourn', 'widowmaker'], support: ['ana', 'kiriko', 'lucio'] },
    note: 'Blanding av choke-punkter og lange siktelinjer.',
  },
];

/** Kart der en helt er anbefalt. */
export function mapsForHero(heroId: string): GameMap[] {
  return MAPS.filter((m) => Object.values(m.best).some((ids) => ids.includes(heroId)));
}
