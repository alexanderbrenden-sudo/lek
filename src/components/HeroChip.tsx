import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Hero, ROLE_COLOR } from '../data/heroes';
import { colors } from '../theme';
import { HeroPortrait } from './Art';

export function HeroAvatar({ hero, size = 40 }: { hero: Hero; size?: number }) {
  return (
    <View style={[styles.ring, { borderRadius: size / 2 + 3, borderColor: ROLE_COLOR[hero.role] }]}>
      <HeroPortrait hero={hero} size={size} />
    </View>
  );
}

export function HeroChip({ hero, onPress }: { hero: Hero; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.chip, pressed && { backgroundColor: colors.cardPressed }]}
    >
      <HeroAvatar hero={hero} size={28} />
      <Text style={styles.chipText}>{hero.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ring: { borderWidth: 2, padding: 1 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 12,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: { color: colors.text, fontWeight: '600' },
});
