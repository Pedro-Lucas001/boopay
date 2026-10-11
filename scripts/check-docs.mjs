import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
const files = ['README.md', 'CONTRIBUTING.md'];
function walk(path) {
  if (!existsSync(path)) return;
  for (const item of readdirSync(path, { withFileTypes: true })) {
    const target = resolve(path, item.name);
    if (item.isDirectory()) walk(target);
    else if (target.endsWith('.md')) files.push(target);
  }
}
walk('docs');
let failures = 0;
for (const file of files) {
  if (!existsSync(file)) { console.error('Arquivo ausente:', file); failures++; continue; }
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
    const href = match[1].split('#')[0];
    if (!href || /^(?:https?:|mailto:)/.test(href)) continue;
    if (!existsSync(resolve(dirname(file), href))) { console.error(file, '→ link ausente:', href); failures++; }
  }
}
if (failures) process.exit(1);
console.log(`Documentação: ${files.length} arquivos, links relativos válidos.`);
