import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
function walk(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? walk(join(path, entry.name)) : [join(path, entry.name)]);
}
const files = ['scripts', 'tests', 'integrations'].flatMap(path => {
  try { return walk(path); } catch (error) { if (error.code === 'ENOENT') return []; throw error; }
}).filter(path => /\.(mjs|cjs|js)$/.test(path));
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(1);
}
console.log(`JavaScript: ${files.length} arquivos verificados.`);
