const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname,'../public');
const base = '/zonex-uiux-v2/';
const all = [];
function walk(dir){for(const d of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,d.name);if(d.isDirectory())walk(file);else all.push(file)}}
walk(root);
const htmls=all.filter(f=>f.endsWith('.html'));
assert.equal(htmls.length,9,'homepage + 7 detail pages + 404');
let refs=0, jpgs=0;
const arrow=/[\u2190-\u21ff\u2794\u2798-\u27af\u{1f800}-\u{1f8ff}]/u;
for(const file of htmls){
  const html=fs.readFileSync(file,'utf8');
  assert.equal((html.match(/<h1(?: |>|\n)/g)||[]).length,1,file+' h1');
  assert(html.includes('content="noindex, follow"'),file+' noindex');
  assert(html.includes('rel="canonical" href="https://zonex-transport.com.tw/'),file+' canonical');
  assert(html.includes('form-action \'none\''),file+' CSP');
  assert(html.includes('connect-src \'none\''),file+' CSP no data collection');
  assert(!html.includes('undefined'),file+' undefined');
  assert(!html.includes('unsafe-inline'),file+' unsafe-inline');
  assert(!/<form\b/i.test(html),file+' no submission forms');
  const visible=html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,'');
  assert(!arrow.test(visible),file+' arrows');
  assert(!/\p{Extended_Pictographic}/u.test(visible.replace(/[©®™]/g,'')),file+' emoji');
  assert(!/LINE\s*ID|ID-copy|swxaMQm3yw/.test(visible),file+' no LINE ID displayed');
  for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
    const url=match[1];
    if(url.startsWith('#')){
      assert(html.includes('id="'+url.slice(1)+'"'),file+' missing anchor '+url);continue;
    }
    if(/^(https:|tel:)/.test(url))continue;
    assert(url.startsWith(base),file+' wrong prefix '+url);
    const parts=url.slice(base.length).split('#');
    let target=path.join(root,parts[0]);
    if(url.split('#')[0].endsWith('/'))target=path.join(target,'index.html');
    assert(fs.existsSync(target),file+' missing '+url);refs++;
    if(parts[1]) assert(fs.readFileSync(target,'utf8').includes('id="'+parts[1]+'"'),file+' invalid target '+url);
  }
  for(const match of html.matchAll(/srcset="([^"]+)"/g)){
    for(const item of match[1].split(',')){
      const url=item.trim().split(' ')[0];
      assert(url.startsWith(base));assert(fs.existsSync(path.join(root,url.slice(base.length))),file+' srcset '+url);refs++;
    }
  }
  for(const tag of html.matchAll(/<img\b[^>]+>/g))assert(/\bwidth="\d+"/.test(tag[0])&&/\bheight="\d+"/.test(tag[0])&&/\balt="[^"]+"/.test(tag[0]),file+' image dimensions and alt');
  for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(m[1]);
}
for(const f of all.filter(f=>f.endsWith('.jpg'))){
  const b=fs.readFileSync(f);let i=2;assert.equal(b.readUInt16BE(0),0xffd8);
  while(i<b.length-4){if(b[i]!==0xff)break;const mark=b[i+1];i+=2;if(mark===0xda||mark===0xd9)break;if(mark===0x00||mark===0x01||(mark>=0xd0&&mark<=0xd7))continue;const size=b.readUInt16BE(i);assert.notEqual(mark,0xe1,'EXIF/XMP APP1 metadata in '+f);i+=size;}jpgs++;
}
for(const f of all)assert(!/(?:\.env|wrangler|hosting\.json|credentials|headers|original-|\.rar|\.git)/i.test(path.relative(root,f)),'private/config file '+f);
console.log(`PASS: ${htmls.length} HTML pages, ${refs} local references, ${jpgs} metadata-free JPEGs; no forms, secrets/configs, emoji or arrows.`);
