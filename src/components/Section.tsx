import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export function Section({ title, color, children }: { title: string; color?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.title, color ? { color } : null]}>{title}</Text>
      {children}
    </View>
  );
}

export function ChipRow({ children }: { children: ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  section: { marginBottom: 22 },
  title: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
