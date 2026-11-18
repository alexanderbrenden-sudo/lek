import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Hero, ROLE_COLOR } from '../data/heroes';
import { colors } from '../theme';

export function HeroAvatar({ hero, size = 40 }: { hero: Hero; size?: number }) {
  const initials = hero.name.replace(/[^A-Za-zÀ-ÿ ]/g, '').split(' ').map((w) => w[0]).join('').slice(0, 2);
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, borderColor: ROLE_COLOR[hero.role] },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.38, color: ROLE_COLOR[hero.role] }]}>
        {initials.toUpperCase()}
      </Text>
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
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    backgroundColor: colors.bg,
  },
  initials: { fontWeight: '800' },
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
