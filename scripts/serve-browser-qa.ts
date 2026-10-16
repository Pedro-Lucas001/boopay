// Loja descartável para conferir a UI real. Nunca copiar este runner à hospedagem.
import { cpSync, copyFileSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { execFile, execFileSync, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import { createServer } from 'node:https';
import { request as forward } from 'node:http';
import { randomBytes } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { buildApp } from '../src/app';

async function main() {
  const source = process.env.BOOPAY_QA_ROOT;
  if (!source) throw new Error('Execute setup-wordpress-qa.ps1 e defina BOOPAY_QA_ROOT.');
  const root = resolve('.test-artifacts/browser-' + Date.now()), wp = join(root, 'wordpress');
  const php = process.env.PHP_BINARY || 'php';
  const args = process.env.BOOPAY_QA_PHP_INI ? ['-c', process.env.BOOPAY_QA_PHP_INI] : [];
  mkdirSync(root, { recursive: true });
  cpSync(join(source, 'wordpress'), wp, { recursive: true });
  copyFileSync(join(wp, 'wp-content/plugins/sqlite-database-integration/db.copy'), join(wp, 'wp-content/db.php'));
  mkdirSync(join(root, 'database'));
  const quote = (value: string) => "'" + value.replaceAll('\\', '/').replaceAll("'", "\\'") + "'";
  let config = '<?php\n';
  const values = { DB_NAME: 'demo', DB_USER: 'demo', DB_PASSWORD: '', DB_HOST: 'localhost', DB_CHARSET: 'utf8', DB_COLLATE: '',
    DB_DIR: join(root, 'database') + '/', DB_FILE: 'browser.sqlite', WP_HOME: 'http://localhost:8089', WP_SITEURL: 'http://localhost:8089' };
  for (const [key, value] of Object.entries(values)) config += `define('${key}',${quote(value)});\n`;
  for (const key of ['AUTH_KEY','SECURE_AUTH_KEY','LOGGED_IN_KEY','NONCE_KEY','AUTH_SALT','SECURE_AUTH_SALT','LOGGED_IN_SALT','NONCE_SALT'])
    config += `define('${key}','${randomBytes(32).toString('hex')}');\n`;
  config += "$table_prefix='wp_';\ndefine('DISABLE_WP_CRON',true);\ndefine('WP_DEBUG',true);\ndefine('WP_DEBUG_DISPLAY',false);\ndefine('WP_DEBUG_LOG',true);\ndefine('BOOPAY_ALLOWED_API_ORIGINS',['https://api.boopay.localtest.me:8443']);\nif(!defined('ABSPATH'))define('ABSPATH',__DIR__.'/');\nrequire_once ABSPATH.'wp-settings.php';\n";
  writeFileSync(join(wp, 'wp-config.php'), config);
  // Loopback e CA somente no ambiente de QA, sem alterar o plugin nem confiar CA no sistema.
  mkdirSync(join(wp, 'wp-content/mu-plugins'), { recursive: true });
  writeFileSync(join(wp, 'wp-content/mu-plugins/browser-qa.php'), `<?php
add_filter('http_request_host_is_external',static fn($allowed,$host)=>$host==='api.boopay.localtest.me'?true:$allowed,10,2);
add_filter('http_allowed_safe_ports',static fn($ports)=>array_merge($ports,[8443]));
add_filter('http_request_args',static function($args,$url){if(str_starts_with($url,'https://api.boopay.localtest.me:8443/'))$args['sslcertificates']=${quote(join(source, 'cert.pem'))};return $args;},10,2);
add_action('http_api_curl',static function($handle){curl_setopt($handle,CURLOPT_RESOLVE,['api.boopay.localtest.me:8443:127.0.0.1']);curl_setopt($handle,CURLOPT_PROXY,'');});
`);
  const file = join(root, 'api.db'); writeFileSync(file, '');
  const url = 'file:' + file.replaceAll('\\', '/');
  execFileSync(process.execPath, [resolve('node_modules/prisma/build/index.js'), 'migrate', 'deploy'], { env: { ...process.env, DATABASE_URL: url }, stdio: 'pipe' });
  const db = new PrismaClient({ datasources: { db: { url } } });
  const { app, credentials } = buildApp({ db, credentialKey: randomBytes(32).toString('hex'), adminToken: randomBytes(32).toString('hex') });
  await app.listen({ port: 3334, host: '127.0.0.1' });
  const tls = createServer({ key: readFileSync(join(source, 'key.pem')), cert: readFileSync(join(source, 'cert.pem')) }, (incoming, outgoing) => {
    const upstream = forward({ hostname: '127.0.0.1', port: 3334, path: incoming.url, method: incoming.method, headers: incoming.headers }, response => {
      outgoing.writeHead(response.statusCode || 502, response.headers); response.pipe(outgoing);
    }); upstream.on('error', () => { outgoing.writeHead(502); outgoing.end(); }); incoming.pipe(upstream);
  });
  await new Promise<void>(done => tls.listen(8443, '127.0.0.1', done));
  const merchant = await db.merchant.create({ data: { nome: 'QA UI', razao_social: 'Sintética', email: 'browser@example.invalid', consumer_key: 'unused', consumer_secretHash: 'unused' } });
  const code = await credentials.issueCode('qa-browser', merchant.id, 'https://store.example');
  const password = randomBytes(20).toString('base64url');
  // A UI fica em HTTP localhost. Pareamento HTTPS já é validado no runner principal;
  // aqui ele é feito antes da navegação, com URL lógica HTTPS e credenciais reais sintéticas.
  writeFileSync(join(root, 'setup-browser.php'), `<?php
$_SERVER['HTTP_HOST']='localhost:8089';define('WP_INSTALLING',true);
require __DIR__.'/wordpress/wp-load.php';require_once ABSPATH.'wp-admin/includes/upgrade.php';
wp_install('BooPay — QA visual','qa_admin','browser@example.invalid',false,'',getenv('BOOPAY_BROWSER_PASSWORD'));
require_once ABSPATH.'wp-admin/includes/plugin.php';activate_plugin('woocommerce/woocommerce.php');
$zip=new ZipArchive();if($zip->open(getenv('BOOPAY_QA_ZIP'))!==true)throw new RuntimeException('ZIP inválido');$zip->extractTo(WP_PLUGIN_DIR);$zip->close();activate_plugin('boopay/boopay.php');
Boopay_Plugin::boot();add_filter('home_url','boopay_browser_https',10,4);
function boopay_browser_https($url,$path,$scheme,$blog){return 'https://store.example'.($path?'/'.ltrim($path,'/'):'');}
$result=Boopay_Plugin::pairing('https://api.boopay.localtest.me:8443',getenv('BOOPAY_QA_CODE'));remove_filter('home_url','boopay_browser_https',10);
if(is_wp_error($result))throw new RuntimeException('Pareamento: '.$result->get_error_code());
update_option('boopay_tracking',true,false);update_option('woocommerce_allow_tracking','no');
`);
  await promisify(execFile)(php, [...args, join(root, 'setup-browser.php')], { env: { ...process.env, BOOPAY_QA_CODE: code.code, BOOPAY_BROWSER_PASSWORD: password, BOOPAY_QA_ZIP: resolve('dist/boopay-0.1.0.zip') }, timeout: 120000 });
  // Metadados sem segredo para inspeção CLI; senha fica em arquivo ignorado fora do docroot.
  writeFileSync('.test-artifacts/browser-current.json', JSON.stringify({ root, wp, api: file, url: 'http://localhost:8089', user: 'qa_admin' }));
  writeFileSync(join(root, 'login.txt'), password);
  const server = spawn(php, [...args, '-S', '127.0.0.1:8089', '-t', wp], { stdio: 'ignore' });
  console.log('QA UI pronta: http://localhost:8089 — somente loopback; metadados em .test-artifacts/browser-current.json');
  let stopping = false;
  const stop = async () => { if (stopping) return; stopping = true; server.kill(); await new Promise<void>(done => tls.close(() => done())); await app.close(); await db.$disconnect(); };
  process.on('SIGINT', () => void stop()); process.on('SIGTERM', () => void stop());
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', command => { if(command.toString().trim()==='q')void stop().then(()=>process.exit(0)); });
  server.on('exit', () => void stop());
}
main().catch(error => { console.error(error.message); if(error.stdout)console.error(error.stdout.toString()); if(error.stderr) console.error(error.stderr.toString()); process.exit(1); });
