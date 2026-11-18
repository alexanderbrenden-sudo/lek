export type Role = 'tank' | 'damage' | 'support';

export type Hero = {
  id: string;
  name: string;
  role: Role;
  /** Helter som er sterke mot denne helten. */
  counteredBy: string[];
  /** Kort tips om hvordan man spiller mot helten. */
  tip: string;
};

export const ROLE_LABEL: Record<Role, string> = {
  tank: 'Tank',
  damage: 'Damage',
  support: 'Support',
};

export const ROLE_COLOR: Record<Role, string> = {
  tank: '#4FA3FF',
  damage: '#FF6B5E',
  support: '#5BD68A',
};

export const HEROES: Hero[] = [
  // ---------- TANK ----------
  {
    id: 'dva', name: 'D.Va', role: 'tank',
    counteredBy: ['zarya', 'symmetra', 'mei', 'ramattra', 'sombra'],
    tip: 'Bjelker og stråler går gjennom Defense Matrix. Tving henne ut av meken og fokuser baby-D.Va.',
  },
  {
    id: 'doomfist', name: 'Doomfist', role: 'tank',
    counteredBy: ['cassidy', 'sombra', 'ana', 'orisa', 'brigitte'],
    tip: 'Stun, hack eller sleep ham når han dykker inn. Ikke stå samlet mot veggen.',
  },
  {
    id: 'hazard', name: 'Hazard', role: 'tank',
    counteredBy: ['reaper', 'ana', 'pharah', 'echo', 'mauga'],
    tip: 'Hold avstand eller angrip fra lufta. Anti-nade stopper healingen hans.',
  },
  {
    id: 'junkerqueen', name: 'Junker Queen', role: 'tank',
    counteredBy: ['pharah', 'echo', 'ana', 'kiriko', 'zarya'],
    tip: 'Ikke slåss på kort hold. Kiriko kan rense sårene, og luftbårne helter er utenfor rekkevidde.',
  },
  {
    id: 'mauga', name: 'Mauga', role: 'tank',
    counteredBy: ['ana', 'zarya', 'dva', 'sombra', 'kiriko'],
    tip: 'Anti-nade stopper livsstjelingen. D.Va-matrise spiser kulene hans.',
  },
  {
    id: 'orisa', name: 'Orisa', role: 'tank',
    counteredBy: ['zarya', 'reaper', 'sombra', 'ana', 'mauga'],
    tip: 'Vent til Fortify er brukt opp, og press henne så. Zarya-bobler stopper Javelin.',
  },
  {
    id: 'ramattra', name: 'Ramattra', role: 'tank',
    counteredBy: ['reaper', 'zarya', 'bastion', 'pharah', 'ana'],
    tip: 'Kom deg vekk når han går i Nemesis-form. Mye skade på kort tid knekker ham.',
  },
  {
    id: 'reinhardt', name: 'Reinhardt', role: 'tank',
    counteredBy: ['reaper', 'junkrat', 'bastion', 'orisa', 'ana'],
    tip: 'Skyt over eller rundt skjoldet. Hold avstand – han er farlig på nært hold.',
  },
  {
    id: 'roadhog', name: 'Roadhog', role: 'tank',
    counteredBy: ['ana', 'reaper', 'zarya', 'kiriko', 'sombra'],
    tip: 'Anti-nade når han tar en Breather. Stå bak dekning for å unngå hooken.',
  },
  {
    id: 'sigma', name: 'Sigma', role: 'tank',
    counteredBy: ['winston', 'wreckingball', 'genji', 'reaper', 'tracer'],
    tip: 'Dykk inn bak skjoldet hans. Han sliter mot mobile helter på kort avstand.',
  },
  {
    id: 'winston', name: 'Winston', role: 'tank',
    counteredBy: ['reaper', 'roadhog', 'bastion', 'cassidy', 'hazard'],
    tip: 'Høy skade på nært hold straffer ham. Hold samlet så han ikke får isolere noen.',
  },
  {
    id: 'wreckingball', name: 'Wrecking Ball', role: 'tank',
    counteredBy: ['sombra', 'cassidy', 'roadhog', 'ana', 'mei'],
    tip: 'Hack, stun eller frys ham ut av ball-form. Da er han et lett mål.',
  },
  {
    id: 'zarya', name: 'Zarya', role: 'tank',
    counteredBy: ['pharah', 'echo', 'junkrat', 'widowmaker', 'hanzo'],
    tip: 'Ikke skyt boblene – du gir henne energi. Vent til boblene er borte.',
  },

  // ---------- DAMAGE ----------
  {
    id: 'ashe', name: 'Ashe', role: 'damage',
    counteredBy: ['winston', 'dva', 'genji', 'tracer', 'sombra'],
    tip: 'Dykk henne. Hun er svak når fiender kommer tett på.',
  },
  {
    id: 'bastion', name: 'Bastion', role: 'damage',
    counteredBy: ['junkrat', 'genji', 'sombra', 'ana', 'sigma'],
    tip: 'Ikke stå i siktelinja når han er i turret-form. Spam rundt hjørner.',
  },
  {
    id: 'cassidy', name: 'Cassidy', role: 'damage',
    counteredBy: ['widowmaker', 'hanzo', 'ashe', 'sigma', 'dva'],
    tip: 'Skyt ham fra lang avstand – han taper mot snipere.',
  },
  {
    id: 'echo', name: 'Echo', role: 'damage',
    counteredBy: ['soldier76', 'cassidy', 'ashe', 'widowmaker', 'sojourn'],
    tip: 'Hitscan-helter skyter henne ned fra lufta.',
  },
  {
    id: 'freja', name: 'Freja', role: 'damage',
    counteredBy: ['winston', 'dva', 'genji', 'tracer', 'sombra'],
    tip: 'Press henne når hun har brukt dashen. Dykkere tar henne lett.',
  },
  {
    id: 'genji', name: 'Genji', role: 'damage',
    counteredBy: ['moira', 'winston', 'zarya', 'mei', 'brigitte'],
    tip: 'Bruk helter som ikke kan deflectes (stråler, Mei-is). Ikke skyt inn i Deflect.',
  },
  {
    id: 'hanzo', name: 'Hanzo', role: 'damage',
    counteredBy: ['winston', 'dva', 'tracer', 'genji', 'wreckingball'],
    tip: 'Dykk inn på ham – han sliter på kort avstand.',
  },
  {
    id: 'junkrat', name: 'Junkrat', role: 'damage',
    counteredBy: ['widowmaker', 'pharah', 'echo', 'ashe', 'cassidy'],
    tip: 'Hold avstand og ta høyden. Han har vanskelig for å treffe mål i lufta.',
  },
  {
    id: 'mei', name: 'Mei', role: 'damage',
    counteredBy: ['pharah', 'echo', 'widowmaker', 'junkrat', 'zarya'],
    tip: 'Ikke slåss på kort hold. Angrip fra lang avstand eller fra lufta.',
  },
  {
    id: 'pharah', name: 'Pharah', role: 'damage',
    counteredBy: ['soldier76', 'cassidy', 'ashe', 'widowmaker', 'dva'],
    tip: 'Hitscan-helter er nøkkelen. D.Va kan spise rakettene.',
  },
  {
    id: 'reaper', name: 'Reaper', role: 'damage',
    counteredBy: ['pharah', 'echo', 'junkrat', 'widowmaker', 'cassidy'],
    tip: 'Hold avstand. Han har nesten ingen skade på lang avstand.',
  },
  {
    id: 'sojourn', name: 'Sojourn', role: 'damage',
    counteredBy: ['winston', 'dva', 'genji', 'tracer', 'sombra'],
    tip: 'Press henne på nært hold før hun får ladet railgunen.',
  },
  {
    id: 'soldier76', name: 'Soldier: 76', role: 'damage',
    counteredBy: ['widowmaker', 'hanzo', 'sojourn', 'dva', 'sigma'],
    tip: 'Snipere vinner duellen på lang avstand. D.Va-matrise tar Helix-rakettene.',
  },
  {
    id: 'sombra', name: 'Sombra', role: 'damage',
    counteredBy: ['cassidy', 'brigitte', 'torbjorn', 'symmetra', 'moira'],
    tip: 'Turrets og områdeskade avslører henne. Stun henne når hun dukker opp.',
  },
  {
    id: 'symmetra', name: 'Symmetra', role: 'damage',
    counteredBy: ['pharah', 'echo', 'junkrat', 'widowmaker', 'hanzo'],
    tip: 'Ødelegg turretene på avstand og unngå å slåss i trange rom.',
  },
  {
    id: 'torbjorn', name: 'Torbjörn', role: 'damage',
    counteredBy: ['pharah', 'junkrat', 'widowmaker', 'hanzo', 'echo'],
    tip: 'Ta ut turreten fra lang avstand eller fra lufta.',
  },
  {
    id: 'tracer', name: 'Tracer', role: 'damage',
    counteredBy: ['cassidy', 'brigitte', 'torbjorn', 'moira', 'symmetra'],
    tip: 'Stun og automatisk sikte straffer henne. Hun har lite liv.',
  },
  {
    id: 'venture', name: 'Venture', role: 'damage',
    counteredBy: ['pharah', 'echo', 'cassidy', 'sombra', 'mei'],
    tip: 'Angrip fra lufta, og stun eller hack henne når hun kommer opp av bakken.',
  },
  {
    id: 'widowmaker', name: 'Widowmaker', role: 'damage',
    counteredBy: ['winston', 'dva', 'tracer', 'genji', 'sombra'],
    tip: 'Dykk henne. Unngå åpne siktelinjer når du ikke har dekning.',
  },

  // ---------- SUPPORT ----------
  {
    id: 'ana', name: 'Ana', role: 'support',
    counteredBy: ['winston', 'dva', 'genji', 'tracer', 'sombra'],
    tip: 'Dykk henne når Sleep Dart er brukt. Hun har ingen fluktmulighet.',
  },
  {
    id: 'baptiste', name: 'Baptiste', role: 'support',
    counteredBy: ['winston', 'genji', 'tracer', 'sombra', 'reaper'],
    tip: 'Ødelegg Immortality Field raskt. Dykk ham når feltet er brukt.',
  },
  {
    id: 'brigitte', name: 'Brigitte', role: 'support',
    counteredBy: ['pharah', 'echo', 'junkrat', 'mei', 'widowmaker'],
    tip: 'Hold deg utenfor rekkevidden hennes. Hun er sterk på kort hold, svak på lang.',
  },
  {
    id: 'illari', name: 'Illari', role: 'support',
    counteredBy: ['winston', 'dva', 'genji', 'tracer', 'sombra'],
    tip: 'Ødelegg healing-pylonen og dykk henne.',
  },
  {
    id: 'juno', name: 'Juno', role: 'support',
    counteredBy: ['soldier76', 'cassidy', 'widowmaker', 'ashe', 'sojourn'],
    tip: 'Hitscan treffer henne lett når hun svever.',
  },
  {
    id: 'kiriko', name: 'Kiriko', role: 'support',
    counteredBy: ['cassidy', 'tracer', 'brigitte', 'sombra', 'winston'],
    tip: 'Press henne når Swift Step og Protection Suzu er brukt.',
  },
  {
    id: 'lifeweaver', name: 'Lifeweaver', role: 'support',
    counteredBy: ['winston', 'tracer', 'sombra', 'genji', 'widowmaker'],
    tip: 'Han er et stort mål. Dykk ham og ødelegg Tree of Life raskt.',
  },
  {
    id: 'lucio', name: 'Lúcio', role: 'support',
    counteredBy: ['cassidy', 'brigitte', 'roadhog', 'mei', 'torbjorn'],
    tip: 'Stun, hook eller frys ham. Automatisk sikte treffer ham lett.',
  },
  {
    id: 'mercy', name: 'Mercy', role: 'support',
    counteredBy: ['widowmaker', 'cassidy', 'ashe', 'soldier76', 'sombra'],
    tip: 'Hitscan skyter henne ned når hun flyr. Fokuser henne først.',
  },
  {
    id: 'moira', name: 'Moira', role: 'support',
    counteredBy: ['pharah', 'echo', 'ana', 'widowmaker', 'roadhog'],
    tip: 'Hold avstand – hun har kort rekkevidde. Anti-nade stopper henne.',
  },
  {
    id: 'wuyang', name: 'Wuyang', role: 'support',
    counteredBy: ['dva', 'winston', 'tracer', 'genji', 'sombra'],
    tip: 'Dykk ham og press ham på kort avstand.',
  },
  {
    id: 'zenyatta', name: 'Zenyatta', role: 'support',
    counteredBy: ['winston', 'tracer', 'genji', 'sombra', 'wreckingball'],
    tip: 'Han har ingen fluktmulighet. Dykk ham, men vent til Transcendence er brukt.',
  },
];

export const HERO_BY_ID: Record<string, Hero> = Object.fromEntries(
  HEROES.map((h) => [h.id, h]),
);

/** Helter som denne helten er sterk mot (motsatt vei av counteredBy). */
export function strongAgainst(heroId: string): Hero[] {
  return HEROES.filter((h) => h.counteredBy.includes(heroId));
}
