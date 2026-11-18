import { useCallback, useEffect, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { HeroListScreen } from './src/screens/HeroListScreen';
import { HeroDetailScreen } from './src/screens/HeroDetailScreen';
import { MapListScreen } from './src/screens/MapListScreen';
import { MapDetailScreen } from './src/screens/MapDetailScreen';
import { HERO_BY_ID } from './src/data/heroes';
import { MAPS } from './src/data/maps';
import { colors } from './src/theme';

type Tab = 'heroes' | 'maps';
type Route = { name: 'hero'; id: string } | { name: 'map'; id: string };

export default function App() {
  const [tab, setTab] = useState<Tab>('heroes');
  // Én navigasjonsstabel per fane.
  const [stacks, setStacks] = useState<Record<Tab, Route[]>>({ heroes: [], maps: [] });
  const stack = stacks[tab];
  const current = stack[stack.length - 1];

  const push = (route: Route) => setStacks((s) => ({ ...s, [tab]: [...s[tab], route] }));
  const goBack = useCallback(() => {
    if (stacks[tab].length === 0) return false;
    setStacks((s) => ({ ...s, [tab]: s[tab].slice(0, -1) }));
    return true;
  }, [stacks, tab]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', goBack);
    return () => sub.remove();
  }, [goBack]);

  const openHero = (id: string) => push({ name: 'hero', id });
  const openMap = (id: string) => push({ name: 'map', id });

  let title = tab === 'heroes' ? 'Helter' : 'Kart';
  if (current?.name === 'hero') title = HERO_BY_ID[current.id]?.name ?? title;
  if (current?.name === 'map') title = MAPS.find((m) => m.id === current.id)?.name ?? title;

  let screen;
  if (current?.name === 'hero') {
    screen = <HeroDetailScreen key={stack.length} heroId={current.id} onOpenHero={openHero} onOpenMap={openMap} />;
  } else if (current?.name === 'map') {
    screen = <MapDetailScreen key={stack.length} mapId={current.id} onOpenHero={openHero} />;
  } else if (tab === 'heroes') {
    screen = <HeroListScreen onOpen={openHero} />;
  } else {
    screen = <MapListScreen onOpen={openMap} />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <View style={styles.topBar}>
          {current ? (
            <Pressable onPress={goBack} hitSlop={12} style={styles.back}>
              <Text style={styles.backText}>‹ Tilbake</Text>
            </Pressable>
          ) : (
            <Text style={styles.appName}>OW Counters</Text>
          )}
          {current ? (
            <Text style={styles.topTitle} numberOfLines={1}>{title}</Text>
          ) : null}
        </View>

        <View style={styles.body}>{screen}</View>

        <View style={styles.tabBar}>
          {(['heroes', 'maps'] as Tab[]).map((t) => {
            const active = t === tab;
            return (
              <Pressable
                key={t}
                style={styles.tab}
                onPress={() => {
                  // Trykk på aktiv fane går tilbake til listen.
                  if (active) setStacks((s) => ({ ...s, [t]: [] }));
                  setTab(t);
                }}
              >
                <Text style={[styles.tabIcon, active && styles.tabActive]}>{t === 'heroes' ? '🛡️' : '🗺️'}</Text>
                <Text style={[styles.tabText, active && styles.tabActive]}>
                  {t === 'heroes' ? 'Helter' : 'Kart'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  appName: { color: colors.accent, fontSize: 22, fontWeight: '900', letterSpacing: 0.5 },
  back: { paddingVertical: 6 },
  backText: { color: colors.accent, fontSize: 17, fontWeight: '700' },
  topTitle: { flex: 1, color: colors.text, fontSize: 17, fontWeight: '700', textAlign: 'right' },
  body: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  tabIcon: { fontSize: 20, opacity: 0.5 },
  tabText: { color: colors.muted, fontSize: 12, fontWeight: '700', marginTop: 2 },
  tabActive: { color: colors.accent, opacity: 1 },
});
