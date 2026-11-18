import Anthropic from '@anthropic-ai/sdk';
import { HEROES } from './heroes';

export type ScanResult = {
  enemies: string[];
  note: string;
};

const HERO_IDS = HEROES.map((h) => h.id);
const HERO_LIST = HEROES.map((h) => `${h.id} = ${h.name}`).join('\n');

const SYSTEM = `Du hjelper en Overwatch 2-spiller på PlayStation. Brukeren tar bilde av TV-skjermen med mobilen, ofte skrått, med gjenskinn eller uskarpt.
Bildet viser vanligvis scoreboardet (holdes inne med touchpad), heltevalget eller spillet med drepefeeden.
Finn heltene på FIENDENS lag (vanligvis rød farge / nederste eller høyre rad; brukerens eget lag er blått).
Kjenn igjen heltene ut fra portrettene, våpen og utseende, ikke spillernavnene.
Returner bare helter du er rimelig sikker på, maks 5, med disse id-ene:
${HERO_LIST}
Skriv en kort merknad på norsk i "note" hvis noe var usikkert eller bildet ikke viste fiendene (ellers tom streng).`;

const SCHEMA = {
  type: 'object',
  properties: {
    enemies: { type: 'array', items: { type: 'string', enum: HERO_IDS } },
    note: { type: 'string' },
  },
  required: ['enemies', 'note'],
  additionalProperties: false,
};

export class ScanError extends Error {}

/** Sender et bilde av skjermen til Claude og får tilbake fiendens helter. */
export async function scanEnemies(apiKey: string, jpegBase64: string): Promise<ScanResult> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  let response;
  try {
    response = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'medium', format: { type: 'json_schema', schema: SCHEMA } },
      system: SYSTEM,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: jpegBase64 } },
            { type: 'text', text: 'Hvilke helter spiller fiendens lag?' },
          ],
        },
      ],
    });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      throw new ScanError('API-nøkkelen ble avvist. Sjekk at den er riktig under ⚙️ Innstillinger.');
    } else if (error instanceof Anthropic.PermissionDeniedError) {
      throw new ScanError('API-nøkkelen har ikke tilgang. Sjekk kontoen din på console.anthropic.com.');
    } else if (error instanceof Anthropic.RateLimitError) {
      throw new ScanError('For mange forespørsler, eller tom for kreditt. Vent litt og prøv igjen.');
    } else if (error instanceof Anthropic.BadRequestError) {
      throw new ScanError(`Forespørselen ble avvist: ${error.message}`);
    } else if (error instanceof Anthropic.APIError) {
      throw new ScanError(`Feil fra AI-tjenesten (${error.status ?? 'ukjent'}). Prøv igjen.`);
    }
    throw new ScanError('Fikk ikke kontakt med AI-tjenesten. Sjekk internett og prøv igjen.');
  }

  if (response.stop_reason === 'refusal') {
    throw new ScanError('AI-en ville ikke analysere dette bildet. Prøv et nytt bilde av scoreboardet.');
  }
  if (response.stop_reason === 'max_tokens') {
    throw new ScanError('Svaret ble avbrutt. Prøv igjen.');
  }

  const text = response.content.find((b) => b.type === 'text');
  if (!text || text.type !== 'text') throw new ScanError('Fikk ikke noe svar. Prøv igjen.');

  let parsed: ScanResult;
  try {
    parsed = JSON.parse(text.text);
  } catch {
    throw new ScanError('Kunne ikke lese svaret. Prøv igjen.');
  }
  const unique = [...new Set(parsed.enemies.filter((id) => HERO_IDS.includes(id)))].slice(0, 5);
  return { enemies: unique, note: parsed.note ?? '' };
}
