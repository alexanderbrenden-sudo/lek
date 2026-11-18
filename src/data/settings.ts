// Enkel lagring av innstillinger på enheten.
// På web (iPhone-appen fra Hjem-skjermen) brukes localStorage, som bare finnes på denne telefonen.
const memory: Record<string, string> = {};

function storage(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

export function getSetting(key: string): string | null {
  try {
    return storage()?.getItem(key) ?? memory[key] ?? null;
  } catch {
    return memory[key] ?? null;
  }
}

export function setSetting(key: string, value: string | null) {
  try {
    const s = storage();
    if (value === null) s?.removeItem(key);
    else s?.setItem(key, value);
  } catch {
    // Ignorer: faller tilbake til minnet under.
  }
  if (value === null) delete memory[key];
  else memory[key] = value;
}

export const API_KEY_SETTING = 'anthropicApiKey';
