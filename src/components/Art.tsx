import { useId, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import type { Hero, Role } from '../data/heroes';
import type { GameMap, Scene } from '../data/maps';

// ---------- Hjelpere ----------

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministisk tilfeldig-generator: samme id gir alltid samme bilde. */
function rng(seed: string) {
  let a = hash(seed);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function useSvgId() {
  return 'g' + useId().replace(/[^a-zA-Z0-9]/g, '');
}

/** Legger et eget bilde over den genererte kunsten hvis en URL er satt. */
function ImageOverride({ uri }: { uri?: string }) {
  const [failed, setFailed] = useState(false);
  if (!uri || failed) return null;
  return (
    <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="cover" onError={() => setFailed(true)} />
  );
}

// ---------- Helter ----------

const ROLE_HUE: Record<Role, number> = { tank: 212, damage: 4, support: 145 };

function heroColors(hero: Hero) {
  const r = rng(hero.id);
  const hue = Math.round(ROLE_HUE[hero.role] + (r() - 0.5) * 50);
  return {
    light: `hsl(${hue}, 85%, 62%)`,
    mid: `hsl(${hue + 18}, 70%, 38%)`,
    dark: `hsl(${hue + 30}, 60%, 14%)`,
    angle: r(),
  };
}

function initialsOf(name: string) {
  return name
    .replace(/[^A-Za-zÀ-ÿ ]/g, '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function RoleEmblem({ role, color, opacity }: { role: Role; color: string; opacity: number }) {
  if (role === 'tank') {
    return (
      <Path d="M50 5 L90 20 V50 C90 75 70 90 50 97 C30 90 10 75 10 50 V20 Z" fill={color} opacity={opacity} />
    );
  }
  if (role === 'support') {
    return <Path d="M38 8 H62 V38 H92 V62 H62 V92 H38 V62 H8 V38 H38 Z" fill={color} opacity={opacity} />;
  }
  return (
    <G opacity={opacity} stroke={color} strokeWidth={8} fill="none">
      <Circle cx={50} cy={50} r={32} />
      <Line x1={50} y1={2} x2={50} y2={34} />
      <Line x1={50} y1={66} x2={50} y2={98} />
      <Line x1={2} y1={50} x2={34} y2={50} />
      <Line x1={66} y1={50} x2={98} y2={50} />
      <Circle cx={50} cy={50} r={5} fill={color} stroke="none" />
    </G>
  );
}

/** Rundt portrett med gradient, rolle-emblem og initialer. */
export function HeroPortrait({ hero, size = 40 }: { hero: Hero; size?: number }) {
  const id = useSvgId();
  const c = heroColors(hero);
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={c.light} />
            <Stop offset="1" stopColor={c.dark} />
          </LinearGradient>
        </Defs>
        <Rect width={100} height={100} fill={`url(#${id})`} />
        <G transform="translate(10 10) scale(0.8)">
          <RoleEmblem role={hero.role} color="#fff" opacity={0.18} />
        </G>
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initialsOf(hero.name)}</Text>
      </View>
      <ImageOverride uri={hero.image} />
    </View>
  );
}

/** Bredt cover-bilde øverst på heltesiden. */
export function HeroBanner({ hero, height = 170 }: { hero: Hero; height?: number }) {
  const id = useSvgId();
  const c = heroColors(hero);
  const r = rng(hero.id + 'banner');
  const stripes = Array.from({ length: 7 }, (_, i) => ({
    x: i * 70 + r() * 30,
    w: 6 + r() * 26,
    o: 0.05 + r() * 0.1,
  }));
  return (
    <View style={[styles.banner, { height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 400 170" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2={String(0.4 + c.angle * 0.6)}>
            <Stop offset="0" stopColor={c.dark} />
            <Stop offset="0.55" stopColor={c.mid} />
            <Stop offset="1" stopColor={c.light} />
          </LinearGradient>
        </Defs>
        <Rect width={400} height={170} fill={`url(#${id})`} />
        {stripes.map((s, i) => (
          <Path key={i} d={`M${s.x} 170 L${s.x + 90} 0 H${s.x + 90 + s.w} L${s.x + s.w} 170 Z`} fill="#fff" opacity={s.o} />
        ))}
        <G transform="translate(250 15) scale(1.4)">
          <RoleEmblem role={hero.role} color="#fff" opacity={0.22} />
        </G>
      </Svg>
      <ImageOverride uri={hero.image} />
    </View>
  );
}

// ---------- Kart ----------

const SCENE_EMOJI: Record<Scene, string> = {
  city: '🏙️',
  mountain: '⛰️',
  snow: '🏔️',
  desert: '🏜️',
  coast: '🌊',
};

/** Myk bølgende silhuett (åser, sanddyner, fjell). */
function ridge(r: () => number, base: number, amp: number, step: number, sharp: boolean) {
  let d = `M0 200 L0 ${base}`;
  let x = 0;
  let prevY = base;
  while (x < 400) {
    const nx = x + step * (0.6 + r() * 0.8);
    const ny = base - r() * amp;
    if (sharp) d += ` L${nx} ${ny}`;
    else d += ` Q${(x + nx) / 2} ${Math.min(prevY, ny) - amp * 0.3} ${nx} ${ny}`;
    x = nx;
    prevY = ny;
  }
  return d + ' L400 200 Z';
}

function skyline(r: () => number, base: number, minH: number, maxH: number) {
  const rects: { x: number; y: number; w: number; h: number }[] = [];
  let x = -10;
  while (x < 410) {
    const w = 14 + r() * 30;
    const h = minH + r() * (maxH - minH);
    rects.push({ x, y: base - h, w, h: h + 200 - base });
    x += w + r() * 4;
  }
  return rects;
}

function SceneLayers({ map, r }: { map: GameMap; r: () => number }) {
  const { far, near, sun } = map.art;
  switch (map.art.scene) {
    case 'city': {
      const back = skyline(r, 150, 30, 90);
      const front = skyline(r, 175, 20, 70);
      return (
        <G>
          {back.map((b, i) => (
            <Rect key={'b' + i} x={b.x} y={b.y} width={b.w} height={b.h} fill={far} />
          ))}
          {front.map((b, i) => (
            <G key={'f' + i}>
              <Rect x={b.x} y={b.y} width={b.w} height={b.h} fill={near} />
              {Array.from({ length: Math.floor(b.h / 14) }, (_, j) =>
                r() > 0.55 ? (
                  <Rect key={j} x={b.x + 4} y={b.y + 6 + j * 14} width={Math.max(3, b.w - 8)} height={3} fill={sun} opacity={0.5} />
                ) : null,
              )}
            </G>
          ))}
        </G>
      );
    }
    case 'snow':
    case 'mountain':
      return (
        <G>
          <Path d={ridge(r, 120, 70, 60, true)} fill={far} />
          <Path d={ridge(r, 165, 45, 45, map.art.scene === 'snow')} fill={near} />
        </G>
      );
    case 'desert': {
      const mesa = 60 + r() * 220;
      return (
        <G>
          <Path d={`M${mesa} 200 L${mesa + 15} 120 H${mesa + 85} L${mesa + 100} 200 Z`} fill={far} />
          <Path d={ridge(r, 165, 25, 90, false)} fill={far} opacity={0.8} />
          <Path d={ridge(r, 185, 20, 110, false)} fill={near} />
        </G>
      );
    }
    case 'coast': {
      const land = skyline(r, 145, 10, 55).filter((b) => b.x < 170);
      return (
        <G>
          <Path d={ridge(r, 140, 40, 70, false)} fill={far} />
          {land.map((b, i) => (
            <Rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill={near} />
          ))}
          <Rect x={0} y={160} width={400} height={40} fill={near} opacity={0.85} />
          {Array.from({ length: 6 }, (_, i) => (
            <Rect key={'w' + i} x={180 + r() * 180} y={165 + i * 5} width={20 + r() * 40} height={1.5} fill={sun} opacity={0.6} />
          ))}
        </G>
      );
    }
  }
}

/** Generert landskaps-cover for et kart. */
export function MapCover({ map, height = 110, showTitle = true }: { map: GameMap; height?: number; showTitle?: boolean }) {
  const id = useSvgId();
  const r = rng(map.id);
  const { skyTop, skyBottom, sun } = map.art;
  const sunX = 60 + r() * 280;
  const sunY = 40 + r() * 40;
  return (
    <View style={[styles.cover, { height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id={id + 's'} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={skyTop} />
            <Stop offset="1" stopColor={skyBottom} />
          </LinearGradient>
          <LinearGradient id={id + 'f'} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0.4" stopColor="#000" stopOpacity={0} />
            <Stop offset="1" stopColor="#000" stopOpacity={0.75} />
          </LinearGradient>
        </Defs>
        <Rect width={400} height={200} fill={`url(#${id}s)`} />
        <Circle cx={sunX} cy={sunY} r={34} fill={sun} opacity={0.25} />
        <Circle cx={sunX} cy={sunY} r={20} fill={sun} opacity={0.9} />
        <SceneLayers map={map} r={r} />
        {showTitle ? <Rect width={400} height={200} fill={`url(#${id}f)`} /> : null}
      </Svg>
      <ImageOverride uri={map.image} />
      {showTitle ? (
        <View style={styles.coverText}>
          <Text style={styles.coverMode}>
            {SCENE_EMOJI[map.art.scene]} {map.mode}
          </Text>
          <Text style={styles.coverName} numberOfLines={1}>
            {map.name}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  initials: {
    color: '#fff',
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowRadius: 4,
  },
  banner: { width: '100%', borderRadius: 16, overflow: 'hidden' },
  cover: { width: '100%', borderRadius: 14, overflow: 'hidden' },
  coverText: { position: 'absolute', left: 14, right: 14, bottom: 10 },
  coverMode: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  coverName: { color: '#fff', fontSize: 20, fontWeight: '900', marginTop: 2 },
});
