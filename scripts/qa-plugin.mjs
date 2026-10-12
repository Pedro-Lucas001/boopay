import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const args = process.argv.slice(2);
const option = name => { const i = args.indexOf(name); return i < 0 ? undefined : args[i + 1]; };
const zip = option('--plugin-zip');
const envFile = option('--environment');
const checks = [];
let sha256 = null;
if (zip && existsSync(zip)) {
  const bytes = readFileSync(zip);
  const isZip = bytes.length > 4 && bytes[0] === 0x50 && bytes[1] === 0x4b;
  checks.push({ id: 'zip-presente', status: isZip ? 'disponivel' : 'bloqueado', note: 'Presença/formato não comprovam instalação nem conteúdo.' });
  if (isZip) sha256 = createHash('sha256').update(bytes).digest('hex');
} else checks.push({ id: 'zip-presente', status: 'bloqueado', note: 'ZIP do plugin do sprint não fornecido.' });
let environment = null;
if (envFile && existsSync(envFile)) {
  const input = JSON.parse(readFileSync(envFile, 'utf8'));
  const fields = ['wordpress', 'woocommerce', 'php', 'database', 'hpos'];
  // Só copiar versões/status conhecidos, nunca URLs, tokens ou corpo de configuração.
  environment = Object.fromEntries(fields.map(key => [key, String(input[key] ?? '').slice(0, 100)]));
  checks.push({ id: 'versoes', status: fields.every(key => environment[key]) ? 'informado-nao-validado' : 'bloqueado',
    note: 'Versões precisam ser confirmadas no ambiente; informação não é teste aprovado.' });
} else checks.push({ id: 'versoes', status: 'bloqueado', note: 'Versões e ambiente de loja limpa não fornecidos.' });
const report = { recordedAt: new Date().toISOString(), sha256, environment, checks,
  acceptance: 'PENDENTE', pluginInstalled: false, hposValidated: false,
  note: 'Preflight não instala nem executa o plugin. P01–P17 devem ser executados e revisados na loja.' };
mkdirSync('docs/evidencias/RB-020', { recursive: true });
writeFileSync('docs/evidencias/RB-020/plugin-preflight.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
process.exit(checks.some(c => c.status === 'bloqueado') ? 2 : 0);
