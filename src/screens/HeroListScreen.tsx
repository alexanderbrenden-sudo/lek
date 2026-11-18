import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { HEROES, Role, ROLE_COLOR, ROLE_LABEL } from '../data/heroes';
import { HeroAvatar } from '../components/HeroChip';
import { colors } from '../theme';

const FILTERS: (Role | 'all')[] = ['all', 'tank', 'damage', 'support'];

export function HeroListScreen({ onOpen }: { onOpen: (heroId: string) => void }) {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<Role | 'all'>('all');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return HEROES.filter(
      (h) => (role === 'all' || h.role === role) && (!q || h.name.toLowerCase().includes(q)),
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [query, role]);

  return (
    <View style={styles.flex}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Søk etter helt…"
        placeholderTextColor={colors.muted}
        style={styles.search}
        autoCorrect={false}
      />
      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const active = f === role;
          const tint = f === 'all' ? colors.accent : ROLE_COLOR[f];
          return (
            <Pressable
              key={f}
              onPress={() => setRole(f)}
              style={[styles.filter, active && { backgroundColor: tint, borderColor: tint }]}
            >
              <Text style={[styles.filterText, active && { color: colors.bg }]}>
                {f === 'all' ? 'Alle' : ROLE_LABEL[f]}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <FlatList
        data={list}
        keyExtractor={(h) => h.id}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text style={styles.empty}>Ingen helter funnet.</Text>}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onOpen(item.id)}
            style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.cardPressed }]}
          >
            <HeroAvatar hero={item} />
            <View style={styles.flex}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={[styles.role, { color: ROLE_COLOR[item.role] }]}>{ROLE_LABEL[item.role]}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  search: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.card,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filters: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  filter: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterText: { color: colors.text, fontWeight: '700' },
  listContent: { paddingHorizontal: 16, paddingBottom: 24, gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.card,
  },
  name: { color: colors.text, fontSize: 16, fontWeight: '700' },
  role: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  chevron: { color: colors.muted, fontSize: 24 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 40 },
});
