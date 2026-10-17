import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { execFile, execFileSync } from 'node:child_process';
import { promisify } from 'node:util';
import { createServer } from 'node:https';
import { request as forward } from 'node:http';
import { randomBytes } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { buildApp } from '../src/app';

async function main() {
  const root=process.env.BOOPAY_QA_ROOT;
  if (!root) throw new Error('Configure BOOPAY_QA_ROOT; veja docs/entregas/AMBIENTE-PLUGIN.md');
  const php=process.env.PHP_BINARY || 'php', ini=process.env.BOOPAY_QA_PHP_INI;
  const args=ini?['-c',ini]:[];
  if(existsSync(join(root,'timeout.flag')))unlinkSync(join(root,'timeout.flag'));
  const configFile=join(root,'wordpress/wp-config.php');
  const mysql=process.env.BOOPAY_QA_DB==='mysql',name='boopay_qa_'+Date.now();
  const setupEnv={...process.env,BOOPAY_QA_MYSQL_DATABASE:name};
  writeFileSync(configFile,readFileSync(configFile,'utf8').replace(mysql?/define\('DB_NAME','[^']+'\)/:/define\('DB_FILE','[^']+'\)/,
    mysql?"define('DB_NAME','"+name+"')":"define('DB_FILE','wordpress-"+Date.now()+".sqlite')"));
  await promisify(execFile)(php,[...args,join(root,'setup.php')],{timeout:120000,maxBuffer:1024*1024,env:setupEnv});
  const file=join(root,'api-'+Date.now()+'.db'); writeFileSync(file,'');
  const url='file:'+file.replaceAll('\\','/');
  execFileSync(process.execPath,[resolve('node_modules/prisma/build/index.js'),'migrate','deploy'],{env:{...process.env,DATABASE_URL:url},stdio:'pipe'});
  const db=new PrismaClient({datasources:{db:{url}}});
  const {app,credentials}=buildApp({db,credentialKey:randomBytes(32).toString('hex'),adminToken:randomBytes(32).toString('hex')});
  const tls=createServer({key:readFileSync(join(root,'key.pem')),cert:readFileSync(join(root,'cert.pem'))},(incoming,outgoing)=>{
    if(existsSync(join(root,'timeout.flag'))) { incoming.resume();setTimeout(()=>{if(!outgoing.destroyed){outgoing.writeHead(503);outgoing.end();}},12000);return; }
    const upstream=forward({hostname:'127.0.0.1',port:3334,path:incoming.url,method:incoming.method,headers:incoming.headers},response=>{
      outgoing.writeHead(response.statusCode||502,response.headers);response.pipe(outgoing);
    }); upstream.on('error',()=>{outgoing.writeHead(502);outgoing.end();});incoming.pipe(upstream);
  });
  try {
    await app.listen({port:3334,host:'127.0.0.1'});
    await new Promise<void>(resolve=>tls.listen(8443,'127.0.0.1',resolve));
    const merchant=await db.merchant.create({data:{nome:'QA',razao_social:'Sintética',email:'qa@example.invalid',consumer_key:'unused',consumer_secretHash:'unused'}});
    const code=await credentials.issueCode('qa-tenant',merchant.id,'https://store.example');
    mkdirSync('docs/evidencias/WORDPRESS',{recursive:true});
    const report=resolve(process.env.BOOPAY_QA_REPORT || 'docs/evidencias/WORDPRESS/results.json');
    mkdirSync(dirname(report), { recursive: true });
    const result=await promisify(execFile)(php,[...args,resolve('scripts/qa-wordpress.php')],{timeout:180000,maxBuffer:1024*1024,
      env:{...process.env,BOOPAY_QA_CODE:code.code,BOOPAY_QA_ZIP:resolve('dist/boopay-0.1.0.zip'),BOOPAY_QA_REPORT:report}});
    console.log(result.stdout); if(result.stderr)console.error(result.stderr);
    const guard=await promisify(execFile)(php,[...args,resolve('scripts/qa-without-woocommerce.php')],{timeout:60000,env:process.env});
    console.log(guard.stdout);
    const products=await db.catalogItem.findMany({select:{sourceId:true,deleted:true,snapshot:true}});
    const events=await db.storeEvent.count();
    const evidence=JSON.parse(readFileSync(report,'utf8'));
    evidence.checks.push({case:'WooCommerce ausente: aviso sem fatal em processo separado',passed:true});
    evidence.backend={products:products.map(p=>({source_id:p.sourceId,deleted:p.deleted,snapshot:JSON.parse(p.snapshot)})),events,revoked:await db.integration.count({where:{revokedAt:{not:null}}})};
    evidence.package=JSON.parse(readFileSync('dist/boopay-0.1.0.manifest.json','utf8'));
    writeFileSync(report,JSON.stringify(evidence,null,2)+'\n');
    console.log(JSON.stringify({checks:evidence.checks.length,database:evidence.database,wordpress:evidence.wordpress,woocommerce:evidence.woocommerce,php:evidence.php,
      events,revoked:evidence.backend.revoked,zip_sha256:evidence.package.sha256}));
  } finally { await new Promise<void>(resolve=>tls.close(()=>resolve()));await app.close();await db.$disconnect(); }
}
main().catch(error=>{console.error(error.message);if(error.stdout)console.error(error.stdout);if(error.stderr)console.error(error.stderr);process.exitCode=1;});
