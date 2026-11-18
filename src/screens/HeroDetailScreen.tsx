import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { HERO_BY_ID, ROLE_COLOR, ROLE_LABEL, strongAgainst } from '../data/heroes';
import { mapsForHero } from '../data/maps';
import { HeroAvatar, HeroChip } from '../components/HeroChip';
import { ChipRow, Section } from '../components/Section';
import { colors } from '../theme';

type Props = {
  heroId: string;
  onOpenHero: (id: string) => void;
  onOpenMap: (id: string) => void;
};

export function HeroDetailScreen({ heroId, onOpenHero, onOpenMap }: Props) {
  const hero = HERO_BY_ID[heroId];
  if (!hero) return null;
  const counters = hero.counteredBy.map((id) => HERO_BY_ID[id]).filter(Boolean);
  const strong = strongAgainst(hero.id);
  const maps = mapsForHero(hero.id);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <HeroAvatar hero={hero} size={72} />
        <View>
          <Text style={styles.name}>{hero.name}</Text>
          <Text style={[styles.role, { color: ROLE_COLOR[hero.role] }]}>{ROLE_LABEL[hero.role]}</Text>
        </View>
      </View>

      <View style={styles.tipBox}>
        <Text style={styles.tipLabel}>Slik slår du {hero.name}</Text>
        <Text style={styles.tip}>{hero.tip}</Text>
      </View>

      <Section title={`Kontres av`} color={colors.bad}>
        <Text style={styles.help}>Velg disse når fienden spiller {hero.name}.</Text>
        <ChipRow>
          {counters.map((h) => (
            <HeroChip key={h.id} hero={h} onPress={() => onOpenHero(h.id)} />
          ))}
        </ChipRow>
      </Section>

      <Section title="Sterk mot" color={colors.good}>
        {strong.length === 0 ? (
          <Text style={styles.help}>Ingen registrerte.</Text>
        ) : (
          <>
            <Text style={styles.help}>{hero.name} er et godt valg mot disse.</Text>
            <ChipRow>
              {strong.map((h) => (
                <HeroChip key={h.id} hero={h} onPress={() => onOpenHero(h.id)} />
              ))}
            </ChipRow>
          </>
        )}
      </Section>

      <Section title="Gode kart">
        {maps.length === 0 ? (
          <Text style={styles.help}>Ikke blant toppvalgene på noen kart – kan likevel fungere fint!</Text>
        ) : (
          <ChipRow>
            {maps.map((m) => (
              <Pressable
                key={m.id}
                onPress={() => onOpenMap(m.id)}
                style={({ pressed }) => [styles.mapChip, pressed && { backgroundColor: colors.cardPressed }]}
              >
                <Text style={styles.mapName}>{m.name}</Text>
                <Text style={styles.mapMode}>{m.mode}</Text>
              </Pressable>
            ))}
          </ChipRow>
        )}
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  name: { color: colors.text, fontSize: 28, fontWeight: '800' },
  role: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  tipBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 22,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  tipLabel: { color: colors.accent, fontWeight: '700', marginBottom: 4 },
  tip: { color: colors.text, fontSize: 15, lineHeight: 21 },
  help: { color: colors.muted, marginBottom: 10 },
  mapChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapName: { color: colors.text, fontWeight: '700' },
  mapMode: { color: colors.muted, fontSize: 12, marginTop: 2 },
});
