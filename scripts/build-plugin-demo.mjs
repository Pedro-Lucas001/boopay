import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const folder = resolve('docs/evidencias/RB-022');
const reportPath = join(folder, 'wordpress.json');
if (!existsSync(reportPath)) throw new Error('Execute a QA com BOOPAY_QA_REPORT=docs/evidencias/RB-022/wordpress.json antes de montar a demonstração.');
const report = JSON.parse(readFileSync(reportPath, 'utf8'));
if (!Array.isArray(report.checks) || !report.checks.length || report.checks.some(c => c.passed !== true))
  throw new Error('Relatório ausente/inválido ou com falhas; não apresentar como demonstração aprovada.');
if (!/^[a-f0-9]{64}$/.test(report.package?.sha256 || '')) throw new Error('Manifesto do ZIP não está vinculado à QA.');
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const commit = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' });
if (commit.status !== 0 || !/^[a-f0-9]{40}$/.test(commit.stdout.trim())) throw new Error('Não foi possível identificar a versão da demonstração.');
const evidence = { builtAt: new Date().toISOString(), codeBaseCommit: commit.stdout.trim(), qaExecutedAt: report.date,
  environment: 'WordPress descartável local / dados sintéticos', wordpress: report.wordpress, woocommerce: report.woocommerce,
  php: report.php, database: report.database, passedChecks: report.checks.length, zipSha256: report.package.sha256,
  backendEvents: report.backend.events, revokedIntegrations: report.backend.revoked,
  timeoutSeconds: report.timeout_seconds, humanRehearsal: false, mentorSubmission: false };
const photos = [['admin-connected.png', 'Plugin conectado na administração WooCommerce'],
  ['product-consent.png', 'Produto e consentimento na loja descartável'], ['admin-disconnected.png', 'Plugin após desconexão']]
  .filter(([file]) => existsSync(join(folder, file)));
const gallery = photos.map(([file, title]) => `<figure><img src="${file}" alt="${escape(title)}"><figcaption>${escape(title)}</figcaption></figure>`).join('\n');
const rows = report.checks.map(c => `<tr><td>${escape(c.case)}</td><td>Passou</td></tr>`).join('\n');
const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Demonstração WooCommerce · Boopay</title><style>
body{font:16px/1.5 system-ui,sans-serif;color:#18212a;background:#f4f6f8;margin:0}main{max-width:1000px;margin:auto;padding:32px 20px}h1{line-height:1.15}p{max-width:75ch}dt{font-weight:650;margin-top:12px}dd{margin:0;overflow-wrap:anywhere}table{border-collapse:collapse;width:100%;background:white}th,td{text-align:left;padding:12px;border-bottom:1px solid #ccd4dc}th{background:#e8edf2}figure{margin:24px 0}img{display:block;max-width:100%;height:auto}figcaption{margin-top:8px}a{color:#145e96}code{overflow-wrap:anywhere}
</style><main><h1>Boopay · demonstração do plugin WooCommerce</h1>
<p>Plano B offline com resultados executados e capturas reais de QA. Ambiente local descartável e dados sintéticos. Este relatório não comprova ensaio humano, apresentação ao mentor, hospedagem ou pagamento.</p>
<dl><dt>QA executada</dt><dd>${escape(evidence.qaExecutedAt)}</dd><dt>Base de código</dt><dd><code>${escape(evidence.codeBaseCommit)}</code></dd>
<dt>Versões</dt><dd>WordPress ${escape(report.wordpress)} · WooCommerce ${escape(report.woocommerce)} · PHP ${escape(report.php)} · ${escape(report.database)}</dd>
<dt>ZIP SHA256</dt><dd><code>${escape(evidence.zipSha256)}</code></dd><dt>Resultados</dt><dd>${report.checks.length} verificações passaram · ${escape(report.backend.events)} eventos recebidos · ${escape(report.backend.revoked)} integração(ões) revogada(s)</dd>
<dt>Falha controlada</dt><dd>Timeout observado: ${escape(report.timeout_seconds)} segundos. Cenários de retry/recuperação estão na tabela.</dd></dl>
<p><a href="wordpress.json">Relatório original da execução</a> · <a href="demo-manifest.json">Manifesto da demonstração</a></p>
${gallery}<h2>Verificações executadas</h2><table><thead><tr><th scope="col">Cenário</th><th scope="col">Resultado</th></tr></thead><tbody>${rows}</tbody></table></main></html>`;
mkdirSync(folder, { recursive: true });
writeFileSync(join(folder, 'demo-manifest.json'), JSON.stringify(evidence, null, 2) + '\n');
writeFileSync(join(folder, 'demo.html'), html);
console.log(JSON.stringify({ path: 'docs/evidencias/RB-022/demo.html', checks: report.checks.length,
  screenshots: photos.length, zipSha256: evidence.zipSha256, rehearsal: false, submitted: false }));
