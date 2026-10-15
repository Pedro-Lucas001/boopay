import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const cases = [
  ['compilacao', ['node_modules/typescript/bin/tsc', '--noEmit']],
  ['javascript', ['scripts/check-javascript.mjs']],
  ['php', ['scripts/check-php.mjs']],
  ['documentacao', ['scripts/check-docs.mjs']],
  ['testes', ['--import', 'tsx', '--test', ...readdirSync('tests').filter(x => x.endsWith('.test.ts')).map(x => 'tests/' + x)]]
];
const git = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' });
const results = [];
mkdirSync('docs/evidencias/RB-020', { recursive: true });
writeFileSync('docs/evidencias/RB-020/backend-local.json', JSON.stringify({ state: 'collecting', passed: false }) + '\n');
for (const [name, args] of cases) {
  const run = spawnSync(process.execPath, args, { encoding: 'utf8' });
  const output = ((run.stdout || '') + (run.stderr || '')).replaceAll(process.cwd(), '<checkout>');
  results.push({ name, command: 'node ' + args.join(' '), exitCode: run.status, output });
  console.log(name + ': ' + (run.status === 0 ? 'PASS' : 'FAIL'));
}
mkdirSync('docs/evidencias/RB-020', { recursive: true });
const report = { recordedAt: new Date().toISOString(), platform: process.platform,
  node: process.version, codeBaseCommit: git.stdout.trim(),
  scope: 'Backend local e cliente PHP isolado. Não valida plugin instalado, loja limpa, rede WordPress nem HPOS.',
  passed: results.every(x => x.exitCode === 0), results };
writeFileSync('docs/evidencias/RB-020/backend-local.json', JSON.stringify(report, null, 2) + '\n');
if (!report.passed) process.exit(1);
