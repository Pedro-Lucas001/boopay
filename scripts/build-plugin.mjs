import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
const root = resolve('plugin'), source = resolve(root, 'boopay');
const walk = path => readdirSync(path, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(resolve(path,e.name)) : [resolve(path,e.name)]);
const files = walk(source).sort();
const crc = data => { let v=0xffffffff; for (const byte of data) { v^=byte; for(let b=0;b<8;b++) v=(v>>>1)^((v&1)?0xedb88320:0); } return (v^0xffffffff)>>>0; };
const local=[], central=[]; let offset=0;
for (const file of files) {
  const name=Buffer.from(relative(root,file).replaceAll('\\','/')), body=Buffer.from(readFileSync(file,'utf8').replaceAll('\r\n','\n'));
  if (!/\.(php|js|txt|md|css)$/.test(file)) throw new Error('Unexpected distribution file');
  const header=Buffer.alloc(30); header.writeUInt32LE(0x04034b50); header.writeUInt16LE(20,4); header.writeUInt16LE(0x800,6);
  header.writeUInt16LE(0x5d4c,12); header.writeUInt32LE(crc(body),14); header.writeUInt32LE(body.length,18); header.writeUInt32LE(body.length,22); header.writeUInt16LE(name.length,26);
  local.push(header,name,body);
  const entry=Buffer.alloc(46); entry.writeUInt32LE(0x02014b50); entry.writeUInt16LE(20,4); entry.writeUInt16LE(20,6); entry.writeUInt16LE(0x800,8);
  entry.writeUInt16LE(0x5d4c,14); entry.writeUInt32LE(crc(body),16); entry.writeUInt32LE(body.length,20); entry.writeUInt32LE(body.length,24); entry.writeUInt16LE(name.length,28); entry.writeUInt32LE(offset,42);
  central.push(entry,name); offset+=header.length+name.length+body.length;
}
const directory=Buffer.concat(central), end=Buffer.alloc(22); end.writeUInt32LE(0x06054b50); end.writeUInt16LE(files.length,8); end.writeUInt16LE(files.length,10); end.writeUInt32LE(directory.length,12); end.writeUInt32LE(offset,16);
const zip=Buffer.concat([...local,directory,end]); mkdirSync('dist',{recursive:true}); writeFileSync('dist/boopay-0.1.0.zip',zip);
const manifest={version:'0.1.0',sha256:createHash('sha256').update(zip).digest('hex'),bytes:zip.length,files:files.map(f=>relative(root,f).replaceAll('\\','/'))};
writeFileSync('dist/boopay-0.1.0.manifest.json',JSON.stringify(manifest,null,2)+'\n'); console.log(JSON.stringify(manifest,null,2));
