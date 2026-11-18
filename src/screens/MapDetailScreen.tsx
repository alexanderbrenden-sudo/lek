import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HERO_BY_ID, Role, ROLE_COLOR, ROLE_LABEL } from '../data/heroes';
import { MAPS } from '../data/maps';
import { HeroChip } from '../components/HeroChip';
import { ChipRow, Section } from '../components/Section';
import { colors } from '../theme';

const ROLES: Role[] = ['tank', 'damage', 'support'];

export function MapDetailScreen({ mapId, onOpenHero }: { mapId: string; onOpenHero: (id: string) => void }) {
  const map = MAPS.find((m) => m.id === mapId);
  if (!map) return null;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.mode}>{map.mode}</Text>
      <Text style={styles.name}>{map.name}</Text>
      <View style={styles.noteBox}>
        <Text style={styles.note}>{map.note}</Text>
      </View>

      {ROLES.map((role) => (
        <Section key={role} title={`Beste ${ROLE_LABEL[role]}`} color={ROLE_COLOR[role]}>
          <ChipRow>
            {map.best[role]
              .map((id) => HERO_BY_ID[id])
              .filter(Boolean)
              .map((h, i) => (
                <View key={h.id} style={styles.ranked}>
                  <Text style={styles.rank}>{i + 1}</Text>
                  <HeroChip hero={h} onPress={() => onOpenHero(h.id)} />
                </View>
              ))}
          </ChipRow>
        </Section>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40 },
  mode: { color: colors.accent, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  name: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 2, marginBottom: 14 },
  noteBox: { backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 22 },
  note: { color: colors.text, fontSize: 15, lineHeight: 21 },
  ranked: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rank: { color: colors.muted, fontWeight: '800', width: 12 },
});
