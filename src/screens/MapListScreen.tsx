import { Pressable, SectionList, StyleSheet, Text } from 'react-native';
import { MAPS, MODES } from '../data/maps';
import { colors } from '../theme';
import { MapCover } from '../components/Art';

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
          style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
        >
          <MapCover map={item} height={104} />
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
  card: { marginBottom: 10 },
});
