import { Pressable, SectionList, StyleSheet, Text } from 'react-native';
import { MAPS, MODES } from '../data/maps';
import { colors } from '../theme';

const SECTIONS = MODES.map((mode) => ({
  title: mode,
  data: MAPS.filter((m) => m.mode === mode).sort((a, b) => a.name.localeCompare(b.name)),
}));

export function MapListScreen({ onOpen }: { onOpen: (mapId: string) => void }) {
  return (
    <SectionList
      sections={SECTIONS}
      keyExtractor={(m) => m.id}
      contentContainerStyle={styles.content}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section }) => <Text style={styles.header}>{section.title}</Text>}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onOpen(item.id)}
          style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.cardPressed }]}
        >
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  header: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 18,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.card,
    marginBottom: 8,
  },
  name: { color: colors.text, fontSize: 16, fontWeight: '700' },
  chevron: { color: colors.muted, fontSize: 24 },
});
