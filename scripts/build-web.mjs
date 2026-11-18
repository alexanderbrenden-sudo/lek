// Bygger en installerbar web-app (PWA) i mappen dist/.
// Bruker relative stier, så den fungerer også under en undermappe (f.eks. GitHub Pages /lek/).
import { execSync } from 'node:child_process';
import { copyFileSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const out = 'dist';
rmSync(out, { recursive: true, force: true });
execSync(`npx expo export --platform web --output-dir ${out}`, {
  stdio: 'inherit',
  env: { ...process.env, EXPO_OFFLINE: '1', CI: '1' },
});

const jsDir = join(out, '_expo/static/js/web');
const bundle = readdirSync(jsDir).find((f) => f.endsWith('.js'));
if (!bundle) throw new Error('Fant ikke JS-bundle');

const html = readFileSync('web/index.html', 'utf8').replace('__BUNDLE__', `_expo/static/js/web/${bundle}`);
writeFileSync(join(out, 'index.html'), html);
for (const f of ['manifest.json', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png']) {
  copyFileSync(join('web', f), join(out, f));
}
writeFileSync(join(out, '.nojekyll'), '');
console.log(`\nFerdig: ${out}/index.html`);
