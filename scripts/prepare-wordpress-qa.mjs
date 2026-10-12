import { writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const root=resolve(process.env.BOOPAY_QA_ROOT||'.test-artifacts/wordpress-qa'),wp=join(root,'wordpress');
const php=process.env.PHP_BINARY||'php', args=process.env.BOOPAY_QA_PHP_INI?['-c',process.env.BOOPAY_QA_PHP_INI]:[];
mkdirSync(join(root,'database'),{recursive:true});
const mysql=process.env.BOOPAY_QA_DB==='mysql';
if(mysql && existsSync(join(wp,'wp-content/db.php')))throw new Error('Use um BOOPAY_QA_ROOT novo para MySQL; não substituir drop-in existente.');
if(!mysql)copyFileSync(join(wp,'wp-content/plugins/sqlite-database-integration/db.copy'),join(wp,'wp-content/db.php'));
const quote=value=>"'"+value.replaceAll('\\','/').replaceAll("'","\\'")+"'";
let config="<?php\n";
const values={DB_NAME:mysql?'boopay_qa_initial':'demo',DB_USER:mysql?(process.env.BOOPAY_QA_MYSQL_USER||'root'):'demo',
  DB_PASSWORD:mysql?(process.env.BOOPAY_QA_MYSQL_PASSWORD||''):'',DB_HOST:mysql?(process.env.BOOPAY_QA_MYSQL_HOST||'127.0.0.1:3306'):'localhost',DB_CHARSET:'utf8',DB_COLLATE:'',
  DB_DIR:join(root,'database')+'/',DB_FILE:'wordpress.sqlite',WP_HOME:'https://store.example',WP_SITEURL:'https://store.example'};
for(const [key,value] of Object.entries(values))config+=`define('${key}',${quote(value)});\n`;
for(const key of ['AUTH_KEY','SECURE_AUTH_KEY','LOGGED_IN_KEY','NONCE_KEY','AUTH_SALT','SECURE_AUTH_SALT','LOGGED_IN_SALT','NONCE_SALT'])config+=`define('${key}','${randomBytes(32).toString('hex')}');\n`;
config+="$table_prefix='wp_';\ndefine('DISABLE_WP_CRON',true);\ndefine('WP_DEBUG',true);\ndefine('WP_DEBUG_DISPLAY',false);\ndefine('WP_DEBUG_LOG',true);\ndefine('BOOPAY_ALLOWED_API_ORIGINS',['https://api.boopay.localtest.me:8443']);\nif(!defined('ABSPATH'))define('ABSPATH',__DIR__.'/');\nrequire_once ABSPATH.'wp-settings.php';\n";
writeFileSync(join(wp,'wp-config.php'),config);
writeFileSync(join(root,'tls.cnf'),'[req]\ndistinguished_name=dn\nx509_extensions=v3\nprompt=no\n[dn]\nCN=api.boopay.localtest.me\n[v3]\nsubjectAltName=DNS:api.boopay.localtest.me\nbasicConstraints=critical,CA:TRUE\nkeyUsage=critical,digitalSignature,keyEncipherment,keyCertSign\nextendedKeyUsage=serverAuth\n');
writeFileSync(join(root,'cert.php'),`<?php
$root=__DIR__; $config=['config'=>$root.'/tls.cnf','private_key_bits'=>2048,'private_key_type'=>OPENSSL_KEYTYPE_RSA,'digest_alg'=>'sha256','x509_extensions'=>'v3'];
$key=openssl_pkey_new($config); $csr=openssl_csr_new(['commonName'=>'api.boopay.localtest.me'],$key,$config);
$cert=openssl_csr_sign($csr,null,$key,2,$config); openssl_x509_export($cert,$pem); openssl_pkey_export($key,$private,null,$config);
file_put_contents($root.'/cert.pem',$pem); file_put_contents($root.'/key.pem',$private);
`);
writeFileSync(join(root,'setup.php'),`<?php
$_SERVER['HTTP_HOST']='store.example';$_SERVER['HTTPS']='on';define('WP_INSTALLING',true);
if(getenv('BOOPAY_QA_DB')==='mysql'){
    $name=getenv('BOOPAY_QA_MYSQL_DATABASE');
    if(!preg_match('/^boopay_qa_[0-9]+$/',$name))throw new RuntimeException('Nome de banco QA inválido.');
    $host=explode(':',getenv('BOOPAY_QA_MYSQL_HOST')?:'127.0.0.1:3306');
    $connection=new mysqli($host[0],getenv('BOOPAY_QA_MYSQL_USER')?:'root',getenv('BOOPAY_QA_MYSQL_PASSWORD')?:'',null,(int)($host[1]??3306));
    $connection->query('CREATE DATABASE '.$name.' CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    $connection->close();
}
require __DIR__.'/wordpress/wp-load.php';require_once ABSPATH.'wp-admin/includes/upgrade.php';
if(!is_blog_installed())wp_install('BooPay QA','qa_admin','qa@example.invalid',false,'',bin2hex(random_bytes(24)));
require_once ABSPATH.'wp-admin/includes/plugin.php';$result=activate_plugin('woocommerce/woocommerce.php');
if(is_wp_error($result))throw new RuntimeException($result->get_error_message());
`);
execFileSync(php,[...args,join(root,'cert.php')],{stdio:'inherit'});
console.log('Configuração sintética e CA local geradas; nenhum segredo impresso.');
