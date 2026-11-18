import { Hero, HERO_BY_ID, HEROES, Role } from './heroes';
import { GameMap } from './maps';

export type Recommendation = {
  hero: Hero;
  score: number;
  /** Fiender denne helten er sterk mot. */
  beats: Hero[];
  /** Fiender som kontrer denne helten. */
  weakTo: Hero[];
  /** Plassering (1–3) blant beste helter på valgt kart, ellers null. */
  mapRank: number | null;
};

const BEATS_POINTS = 2;
const WEAK_POINTS = 1.5;
const MAP_POINTS = [1.5, 1, 0.5];

/**
 * Gir hver helt en poengsum ut fra fiendens lag (og eventuelt kart):
 *  +2 for hver fiende helten kontrer
 *  −1,5 for hver fiende som kontrer helten
 *  +1,5 / +1 / +0,5 hvis helten er topp 3 på kartet
 */
export function recommend(enemyIds: string[], map: GameMap | null, role: Role | 'all'): Recommendation[] {
  const enemies = enemyIds.map((id) => HERO_BY_ID[id]).filter(Boolean);

  return HEROES.filter((h) => role === 'all' || h.role === role)
    .map((hero) => {
      const beats = enemies.filter((e) => e.counteredBy.includes(hero.id));
      const weakTo = enemies.filter((e) => hero.counteredBy.includes(e.id));
      const rankIndex = map ? map.best[hero.role].indexOf(hero.id) : -1;
      const mapRank = rankIndex >= 0 ? rankIndex + 1 : null;
      const score =
        beats.length * BEATS_POINTS - weakTo.length * WEAK_POINTS + (mapRank ? MAP_POINTS[mapRank - 1] : 0);
      return { hero, score, beats, weakTo, mapRank };
    })
    .sort((a, b) => b.score - a.score || b.beats.length - a.beats.length || a.hero.name.localeCompare(b.hero.name));
}
