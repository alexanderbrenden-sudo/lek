import { useState } from 'react';
import { ActivityIndicator, Linking, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { API_KEY_SETTING, getSetting, setSetting } from '../data/settings';
import { scanEnemies, ScanError } from '../data/scan';
import { HERO_BY_ID } from '../data/heroes';
import { colors } from '../theme';

const MAX_SIDE = 1568; // Større bilder skaleres uansett ned av AI-tjenesten.

type Props = { onEnemies: (ids: string[]) => void };

async function pickImage(source: 'camera' | 'library') {
  if (source === 'camera' && Platform.OS !== 'web') {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) throw new ScanError('Appen fikk ikke tilgang til kameraet.');
  }
  const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 1 };
  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);
  if (result.canceled || !result.assets?.[0]) return null;

  const asset = result.assets[0];
  const longest = Math.max(asset.width || 0, asset.height || 0);
  const resize =
    longest > MAX_SIDE
      ? [{ resize: asset.width >= asset.height ? { width: MAX_SIDE } : { height: MAX_SIDE } }]
      : [];
  const out = await manipulateAsync(asset.uri, resize, { compress: 0.8, format: SaveFormat.JPEG, base64: true });
  if (!out.base64) throw new ScanError('Kunne ikke lese bildet.');
  return out.base64.replace(/^data:image\/\w+;base64,/, '');
}

export function ScanCard({ onEnemies }: Props) {
  const [apiKey, setApiKey] = useState(() => getSetting(API_KEY_SETTING));
  const [editingKey, setEditingKey] = useState(false);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const saveKey = () => {
    const key = draft.trim();
    if (!key) return;
    setSetting(API_KEY_SETTING, key);
    setApiKey(key);
    setDraft('');
    setEditingKey(false);
    setError(null);
  };

  const removeKey = () => {
    setSetting(API_KEY_SETTING, null);
    setApiKey(null);
    setEditingKey(false);
  };

  const scan = async (source: 'camera' | 'library') => {
    if (!apiKey) return;
    setError(null);
    setMessage(null);
    try {
      const image = await pickImage(source);
      if (!image) return;
      setBusy(true);
      const result = await scanEnemies(apiKey, image);
      if (result.enemies.length === 0) {
        setError(result.note || 'Fant ingen fiendehelter i bildet. Prøv et bilde av scoreboardet.');
      } else {
        onEnemies(result.enemies);
        const names = result.enemies.map((id) => HERO_BY_ID[id]?.name).join(', ');
        setMessage(`Fant ${result.enemies.length}: ${names}.${result.note ? ' ' + result.note : ''}`);
      }
    } catch (e) {
      setError(e instanceof ScanError ? e.message : 'Noe gikk galt. Prøv igjen.');
    } finally {
      setBusy(false);
    }
  };

  // ---------- Oppsett av API-nøkkel ----------
  if (!apiKey || editingKey) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>📷 Skann skjermen</Text>
        <Text style={styles.body}>
          Ta bilde av scoreboardet på TV-en, så finner AI-en (Claude) fiendens helter for deg. Det krever en egen
          API-nøkkel fra Anthropic. Hvert bilde koster omtrent 20–50 øre, betalt fra din Anthropic-konto.
        </Text>
        <Text style={styles.body}>
          Nøkkelen lagres bare på denne telefonen og sendes kun til Anthropic.
        </Text>
        <Pressable onPress={() => Linking.openURL('https://console.anthropic.com/settings/keys')}>
          <Text style={styles.link}>Lag en nøkkel på console.anthropic.com →</Text>
        </Pressable>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="sk-ant-…"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          style={styles.input}
        />
        <View style={styles.row}>
          <Pressable onPress={saveKey} style={[styles.button, !draft.trim() && { opacity: 0.4 }]} disabled={!draft.trim()}>
            <Text style={styles.buttonText}>Lagre nøkkel</Text>
          </Pressable>
          {apiKey ? (
            <Pressable onPress={() => setEditingKey(false)} style={styles.ghost}>
              <Text style={styles.ghostText}>Avbryt</Text>
            </Pressable>
          ) : null}
        </View>
        {apiKey ? (
          <Pressable onPress={removeKey}>
            <Text style={[styles.link, { color: colors.bad }]}>Fjern lagret nøkkel</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  // ---------- Skanning ----------
  return (
    <View style={styles.card}>
      <View style={styles.headRow}>
        <Text style={styles.title}>📷 Skann skjermen</Text>
        <Pressable onPress={() => setEditingKey(true)} hitSlop={10}>
          <Text style={styles.gear}>⚙️</Text>
        </Pressable>
      </View>
      <Text style={styles.body}>Hold inne touchpaden for scoreboardet, og ta bilde av TV-en.</Text>
      {busy ? (
        <View style={styles.busy}>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.body}>Ser på bildet…</Text>
        </View>
      ) : (
        <View style={styles.row}>
          <Pressable onPress={() => scan('camera')} style={[styles.button, styles.flex]}>
            <Text style={styles.buttonText}>Ta bilde</Text>
          </Pressable>
          <Pressable onPress={() => scan('library')} style={styles.ghost}>
            <Text style={styles.ghostText}>Fra bilder</Text>
          </Pressable>
        </View>
      )}
      {message ? <Text style={styles.ok}>✓ {message}</Text> : null}
      {error ? <Text style={styles.err}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text, fontSize: 17, fontWeight: '800' },
  gear: { fontSize: 18 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  link: { color: colors.accent, fontWeight: '700', fontSize: 14 },
  input: {
    backgroundColor: colors.bg,
    color: colors.text,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonText: { color: colors.bg, fontWeight: '900', fontSize: 15 },
  ghost: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  ghostText: { color: colors.text, fontWeight: '700' },
  busy: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  ok: { color: colors.good, fontSize: 14, lineHeight: 20 },
  err: { color: colors.bad, fontSize: 14, lineHeight: 20 },
});
