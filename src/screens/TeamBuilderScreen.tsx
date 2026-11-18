import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { HERO_BY_ID, HEROES, Role, ROLE_COLOR, ROLE_LABEL } from '../data/heroes';
import { MAPS } from '../data/maps';
import { recommend } from '../data/team';
import { HeroAvatar } from '../components/HeroChip';
import { Section } from '../components/Section';
import { ScanCard } from '../components/ScanCard';
import { colors } from '../theme';

export const MAX_ENEMIES = 5;

export type TeamState = { enemies: string[]; mapId: string | null; role: Role | 'all' };
export const EMPTY_TEAM: TeamState = { enemies: [], mapId: null, role: 'all' };

type Props = {
  team: TeamState;
  setTeam: (update: (t: TeamState) => TeamState) => void;
  onOpenHero: (id: string) => void;
};

const ROLES: Role[] = ['tank', 'damage', 'support'];
const SORTED_MAPS = [...MAPS].sort((a, b) => a.name.localeCompare(b.name));

function fmtScore(n: number) {
  return (n > 0 ? '+' : '') + n.toFixed(1).replace('.0', '').replace('.', ',');
}

export function TeamBuilderScreen({ team, setTeam, onOpenHero }: Props) {
  const map = MAPS.find((m) => m.id === team.mapId) ?? null;
  const full = team.enemies.length >= MAX_ENEMIES;
  const hasInput = team.enemies.length > 0 || map !== null;

  const recs = useMemo(
    () => recommend(team.enemies, map, team.role).slice(0, team.role === 'all' ? 6 : 4),
    [team.enemies, map, team.role],
  );

  const toggleEnemy = (id: string) =>
    setTeam((t) =>
      t.enemies.includes(id)
        ? { ...t, enemies: t.enemies.filter((e) => e !== id) }
        : t.enemies.length >= MAX_ENEMIES
          ? t
          : { ...t, enemies: [...t.enemies, id] },
    );

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.intro}>Velg heltene på fiendens lag, så foreslår appen hvem du bør spille.</Text>

      <ScanCard onEnemies={(ids) => setTeam((t) => ({ ...t, enemies: ids.slice(0, MAX_ENEMIES) }))} />

      {/* ---------- Fiendens lag ---------- */}
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Fiendens lag</Text>
        {hasInput ? (
          <Pressable onPress={() => setTeam((t) => ({ ...t, enemies: [], mapId: null }))} hitSlop={8}>
            <Text style={styles.reset}>Nullstill</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.slots}>
        {Array.from({ length: MAX_ENEMIES }, (_, i) => {
          const hero = HERO_BY_ID[team.enemies[i]];
          return (
            <Pressable key={i} style={styles.slot} onPress={() => hero && toggleEnemy(hero.id)} disabled={!hero}>
              {hero ? (
                <>
                  <HeroAvatar hero={hero} size={48} />
                  <Text style={styles.slotName} numberOfLines={1}>{hero.name}</Text>
                </>
              ) : (
                <>
                  <View style={styles.emptySlot}>
                    <Text style={styles.plus}>+</Text>
                  </View>
                  <Text style={styles.slotName}> </Text>
                </>
              )}
            </Pressable>
          );
        })}
      </View>
      {team.enemies.length > 0 ? <Text style={styles.hint}>Trykk på en fiende for å fjerne den.</Text> : null}

      {/* ---------- Kart ---------- */}
      <Text style={[styles.sectionTitle, styles.spaced]}>Kart (valgfritt)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
        {[null, ...SORTED_MAPS].map((m) => {
          const active = (m?.id ?? null) === team.mapId;
          return (
            <Pressable
              key={m?.id ?? 'none'}
              onPress={() => setTeam((t) => ({ ...t, mapId: m?.id ?? null }))}
              style={[styles.pill, active && styles.pillActive]}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>{m?.name ?? 'Ingen'}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ---------- Din rolle ---------- */}
      <Text style={[styles.sectionTitle, styles.spaced]}>Din rolle</Text>
      <View style={styles.roleRow}>
        {(['all', ...ROLES] as (Role | 'all')[]).map((r) => {
          const active = r === team.role;
          const tint = r === 'all' ? colors.accent : ROLE_COLOR[r];
          return (
            <Pressable
              key={r}
              onPress={() => setTeam((t) => ({ ...t, role: r }))}
              style={[styles.pill, active && { backgroundColor: tint, borderColor: tint }]}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>
                {r === 'all' ? 'Alle' : ROLE_LABEL[r]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ---------- Anbefalinger ---------- */}
      <Text style={[styles.sectionTitle, styles.spaced]}>Anbefalt for deg</Text>
      {!hasInput ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Legg til minst én fiende eller velg et kart for å få forslag.</Text>
        </View>
      ) : (
        recs.map((rec, i) => (
          <Pressable
            key={rec.hero.id}
            onPress={() => onOpenHero(rec.hero.id)}
            style={({ pressed }) => [styles.recCard, pressed && { backgroundColor: colors.cardPressed }]}
          >
            <Text style={styles.recRank}>{i + 1}</Text>
            <HeroAvatar hero={rec.hero} size={44} />
            <View style={styles.flex}>
              <View style={styles.recHead}>
                <Text style={styles.recName}>{rec.hero.name}</Text>
                <Text style={[styles.recRole, { color: ROLE_COLOR[rec.hero.role] }]}>{ROLE_LABEL[rec.hero.role]}</Text>
              </View>
              {rec.beats.length > 0 ? (
                <Text style={styles.good}>✓ Sterk mot {rec.beats.map((h) => h.name).join(', ')}</Text>
              ) : null}
              {rec.weakTo.length > 0 ? (
                <Text style={styles.bad}>✗ Svak mot {rec.weakTo.map((h) => h.name).join(', ')}</Text>
              ) : null}
              {rec.mapRank && map ? (
                <Text style={styles.mapLine}>🗺️ Nr. {rec.mapRank} på {map.name}</Text>
              ) : null}
            </View>
            <View
              style={[
                styles.scoreBadge,
                rec.score < 0 && { backgroundColor: colors.bad },
                rec.score === 0 && { backgroundColor: colors.border },
              ]}
            >
              <Text style={styles.scoreText}>{fmtScore(rec.score)}</Text>
            </View>
          </Pressable>
        ))
      )}

      {/* ---------- Velg fiender ---------- */}
      <Text style={[styles.sectionTitle, styles.spaced]}>
        Legg til fiende {full ? '(laget er fullt)' : `(${team.enemies.length}/${MAX_ENEMIES})`}
      </Text>
      {ROLES.map((role) => (
        <Section key={role} title={ROLE_LABEL[role]} color={ROLE_COLOR[role]}>
          <View style={styles.grid}>
            {HEROES.filter((h) => h.role === role)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((h) => {
                const selected = team.enemies.includes(h.id);
                const disabled = full && !selected;
                return (
                  <Pressable
                    key={h.id}
                    onPress={() => toggleEnemy(h.id)}
                    disabled={disabled}
                    style={[styles.gridItem, disabled && { opacity: 0.35 }]}
                  >
                    <View style={selected ? styles.selectedRing : styles.unselectedRing}>
                      <HeroAvatar hero={h} size={44} />
                    </View>
                    <Text style={[styles.gridName, selected && { color: colors.accent }]} numberOfLines={1}>
                      {h.name}
                    </Text>
                  </Pressable>
                );
              })}
          </View>
        </Section>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  intro: { color: colors.muted, fontSize: 15, lineHeight: 21, marginBottom: 18 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  spaced: { marginTop: 22 },
  reset: { color: colors.accent, fontWeight: '700', marginBottom: 10 },
  slots: { flexDirection: 'row', justifyContent: 'space-between' },
  slot: { width: '19%', alignItems: 'center' },
  emptySlot: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: { color: colors.muted, fontSize: 24, fontWeight: '300' },
  slotName: { color: colors.text, fontSize: 11, fontWeight: '600', marginTop: 4 },
  hint: { color: colors.muted, fontSize: 12, marginTop: 8, textAlign: 'center' },
  hScroll: { gap: 8, paddingRight: 16 },
  roleRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  pillText: { color: colors.text, fontWeight: '700' },
  pillTextActive: { color: colors.bg },
  emptyBox: { backgroundColor: colors.card, borderRadius: 12, padding: 16 },
  emptyText: { color: colors.muted, textAlign: 'center' },
  recCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.card,
    marginBottom: 8,
  },
  recRank: { color: colors.muted, fontWeight: '900', width: 14, textAlign: 'center' },
  recHead: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 2 },
  recName: { color: colors.text, fontSize: 16, fontWeight: '800' },
  recRole: { fontSize: 12, fontWeight: '700' },
  good: { color: colors.good, fontSize: 13, marginTop: 1 },
  bad: { color: colors.bad, fontSize: 13, marginTop: 1 },
  mapLine: { color: colors.accent, fontSize: 13, marginTop: 1 },
  scoreBadge: {
    minWidth: 40,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.good,
    alignItems: 'center',
  },
  scoreText: { color: colors.bg, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 12 },
  gridItem: { width: '20%', alignItems: 'center' },
  selectedRing: { borderRadius: 30, borderWidth: 2, borderColor: colors.accent, padding: 2 },
  unselectedRing: { borderRadius: 30, borderWidth: 2, borderColor: 'transparent', padding: 2 },
  gridName: { color: colors.text, fontSize: 11, fontWeight: '600', marginTop: 4, maxWidth: '95%' },
});
