import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
function walk(path) {
  return existsSync(path) ? readdirSync(path, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? walk(join(path, entry.name)) : [join(path, entry.name)]) : [];
}
const files = ['integrations', 'plugin', 'tests'].flatMap(walk).filter(path => path.endsWith('.php'));
if (!files.length) {
  console.log('PHP: nenhum arquivo PHP presente nesta branch; integração WooCommerce ainda pendente.');
} else {
  for (const file of files) {
    const result = spawnSync(process.env.PHP_BINARY || 'php', ['-l', file], { stdio: 'inherit' });
    if (result.error) { console.error('PHP não disponível. Configure PHP_BINARY ou instale PHP.'); process.exit(1); }
    if (result.status !== 0) process.exit(1);
  }
}
