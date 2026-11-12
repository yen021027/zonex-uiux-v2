const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'public');
const original = require('../src/original-public.json');
const base = '/zonex-uiux-v2/';
const official = 'https://zonex-transport.com.tw/';
const line = 'https://line.me/ti/p/swxaMQm3yw';
const mapLink = 'https://www.google.com/maps/search/?api=1&amp;query=台中市西屯區西屯路三段90之30巷5號';
const assetNames = fs.readdirSync(path.join(out,'assets'));
const asset = name => base + 'assets/' + assetNames.find(f => f.startsWith(name + '.') || f === name);
const photo = (name,alt,sizes='(max-width: 760px) 100vw, 50vw',hero=false) => {
  const widths = name === 'hero' ? [800,1200,1600] : [480,720,960];
  const w = widths.at(-1); const height = name === 'liftgate' ? w * 4/3 : name.startsWith('exhibition') ? w * 9/16 : w * 3/4;
  return `<img src="${asset(name + '-' + w)}" srcset="${widths.map(n=>`${asset(name + '-' + n)} ${n}w`).join(', ')}" sizes="${sizes}" width="${w}" height="${height}" alt="${alt}" decoding="async" ${hero?'fetchpriority="high"':'loading="lazy"'}>`;
};
const services = [
  {id:'logistics',num:'01',name:'物流倉儲轉運',en:'WAREHOUSE TRANSFER',photo:'warehouse',alt:'整齊排列於鷗翼車上的箱裝棧板貨物',slug:'warehouse-transfer',copy:'承接倉庫間、倉庫至收貨端的貨物配送。箱裝、棧板分項列出，依取送地址與收貨條件確認安排。',tags:['箱裝貨物','棧板配送','倉儲轉移']},
  {id:'relocation',num:'02',name:'工廠搬遷',en:'FACTORY RELOCATION',photo:'factory',alt:'工廠物料與設備裝載於鷗翼貨車',slug:'factory-relocation',copy:'承接廠內設備、物料與貨品搬遷。請先整理品項、數量、尺寸與現場條件，確認運送安排。',tags:['廠內設備','物料搬遷','分項確認']},
  {id:'equipment',num:'03',name:'機械設備運送',en:'MACHINERY TRANSPORT',photo:'machine',alt:'木箱與包裝完成的設備運送實況',slug:'machinery-transport',copy:'從機器、設備到展覽器材，依貨物尺寸、重量與裝卸現場條件，確認適合的車趟。',tags:['機械設備','木箱包裝','現場裝卸']},
  {id:'materials',num:'04',name:'建材運送',en:'BUILDING MATERIALS',photo:'materials',alt:'箱型鷗翼尾門車配送包裝建材',slug:'building-materials',copy:'承接板材、木材與棧板建材，銜接建材行、工廠及工地，事先確認卸貨位置與到貨時段。',tags:['板材木材','棧板建材','工地配送']},
  {id:'industrial',num:'05',name:'工業原料運送',en:'INDUSTRIAL MATERIALS',photo:'chemical',alt:'工業化學原料桶槽與箱裝原料配送',copy:'承接工業化學原料運送。請先提供品項、包裝方式與重量，確認承運條件後再安排車趟。',tags:['品項確認','包裝資訊','承運條件']},
  {id:'exhibition',num:'06',name:'展覽進退場',en:'EXHIBITION LOGISTICS',photo:'exhibition1',alt:'展覽現場棧板貨物與宗錸貨車運送實況',slug:'exhibition-logistics',copy:'承接展前進場與展後載回。分別核對場館、進退場時段、展品資料與現場裝卸條件。',tags:['世貿展覽','展品配送','撤展載回']}
];
function brand(home=true) { return `<a class="brand" href="${base}${home?'#main':''}" aria-label="宗錸物流 ZONEX TRANSPORT 首頁"><svg viewBox="0 0 84 64" width="47" height="36" aria-hidden="true" focusable="false"><path fill="#112b3a" d="M8 8h43l-3 11-30 26h24l-3 11H0l3-11 30-26H5z"/><path fill="#e8792d" d="M48 8h36l-3 12H69l-9 36H46l9-36H45z"/></svg><span>宗錸物流<small>ZONEX TRANSPORT</small></span></a>`; }
const nav = () => `<a href="${base}#services">運送服務</a><a href="${base}#equipment">車輛設備</a><a href="${base}#coverage">配送範圍</a><a href="${base}#process">洽詢流程</a>`;
function header(home=true) { return `<div class="preview-bar" role="region" aria-label="設計預覽說明"><div class="wrap"><span>宗錸物流 · 設計預覽版</span><a href="${official}" target="_blank" rel="noopener">瀏覽正式網站</a></div></div><header class="site-header"><div class="wrap header-inner">${brand(home)}<nav class="desktop-nav" aria-label="主選單">${nav()}</nav><a class="header-contact" href="${base}#contact">聯絡洽詢</a><button class="menu-toggle" type="button" hidden aria-expanded="false" aria-controls="mobile-nav" aria-label="開啟選單"><span class="menu-lines" aria-hidden="true"></span><span class="menu-label">選單</span></button></div><nav class="mobile-nav wrap" id="mobile-nav" aria-label="手機選單" hidden>${nav()}<a href="${base}#contact">聯絡洽詢</a></nav></header><noscript><nav class="fallback-nav wrap" aria-label="網站導覽">${nav()}<a href="${base}#contact">聯絡洽詢</a></nav></noscript>`; }
function footer(){return `<footer class="site-footer"><div class="wrap footer-top"><div><a class="footer-name" href="${base}">宗錸物流</a><p>台中貨運 · 全省配送 · 回頭車服務</p></div><nav aria-label="服務頁面">${Object.entries(original.pages).map(([slug,p])=>`<a href="${base}services/${slug}/">${p.schema['@graph'].find(x=>x['@type']==='Service').name}</a>`).join('')}</nav></div><div class="wrap footer-bottom"><span>© 2026 宗錸物流公司</span><span>獨立設計預覽 · 正式服務請聯絡宗錸確認</span><a href="#main">回到頂端</a></div></footer><div class="mobile-contact" role="navigation" aria-label="快速聯絡"><a href="tel:0919083060">電話洽詢</a><a href="${line}" target="_blank" rel="noopener">LINE 聯絡</a></div>`;}
function contactDetails(){return `<div class="contact-details"><div class="contact-row"><span class="micro">電話洽詢</span><a class="phone-primary" href="tel:0919083060">0919-083-060</a><a class="phone-secondary" href="tel:0426633352">市內電話　04-2663-3352</a></div><div class="contact-row"><span class="micro">公司地址</span><a class="address" href="${mapLink}" target="_blank" rel="noopener">台中市西屯區<br>西屯路三段90之30巷5號</a></div></div>`;}
function contact(full=true){return `<section id="contact" class="contact section-anchor"><div class="wrap"><div class="contact-top"><div><p class="eyebrow">聯絡宗錸</p><h2>貨物、地點、日期。<br>我們電話裡談。</h2><p>提供需求後，由宗錸確認車趟與報價。</p><div class="action-row"><a class="button primary" href="${line}" target="_blank" rel="noopener">LINE 洽詢運送</a><a class="text-link" href="tel:0919083060">直接電話聯絡</a></div></div>${contactDetails()}</div>${full?`<div class="preparation"><div class="preparation-intro"><span class="step-index">洽詢資料</span><h3>照著清單，<br>整理這一趟需求。</h3><p>選擇運送服務，查看需要準備的資訊。</p><label for="request-service" hidden>我要洽詢的服務</label><select id="request-service" hidden>${services.map(s=>`<option value="${s.id}">${s.name}</option>`).join('')}<option value="nationwide">全省配送</option><option value="return">回頭車服務</option></select></div><div class="preparation-content"><p class="checklist-heading"><span>洽詢準備清單</span><strong id="request-service-label">物流倉儲轉運</strong></p><ol id="request-guidance" aria-live="polite" aria-atomic="true"><li>貨物品項、件數、尺寸、總重量與包裝方式。</li><li>上下貨地址，以及現場是否可使用拖板車。</li><li>希望運送日期、時段與貨物照片。</li></ol><button class="button secondary copy-template" type="button" hidden>複製洽詢範本</button><p class="copy-status" role="status" aria-live="polite"></p><div id="copy-fallback" hidden><label for="template-text">請選取下方文字後複製</label><textarea id="template-text" rows="7" readonly></textarea></div><p class="privacy-note">範本只在你的裝置產生，不會自動傳送或送出預約。車趟與承運條件請另行確認。</p></div></div>`:''}</div></section>`;}
const hashes = {};
for (const file of ['style.css','app.js']) {
  const content = fs.readFileSync(path.join(root,'src',file));
  const hash = crypto.createHash('sha256').update(content).digest('hex').slice(0,10);
  const ext = path.extname(file); const name = path.basename(file,ext) + '.' + hash + ext;
  for (const prev of fs.readdirSync(out)) if (new RegExp(`^${path.basename(file,ext)}\\.[a-f0-9]{10}\\${ext}$`).test(prev)) fs.unlinkSync(path.join(out,prev));
  fs.writeFileSync(path.join(out,name),content); hashes[file]=name;
}
function page(title,desc,slug,content,home=false,schema){
  const json = JSON.stringify(schema || original.businessSchema);
  const sha = crypto.createHash('sha256').update(json).digest('base64');
  const csp = `default-src 'self'; script-src 'self' 'sha256-${sha}'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; upgrade-insecure-requests`;
  return `<!doctype html><html lang="zh-Hant-TW"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="${csp}"><meta name="referrer" content="strict-origin-when-cross-origin"><title>${title}｜設計預覽</title><meta name="description" content="${desc}"><meta name="robots" content="noindex, follow"><link rel="canonical" href="${official}${slug}"><meta name="theme-color" content="#f6f4ee"><meta property="og:type" content="website"><meta property="og:locale" content="zh_TW"><meta property="og:title" content="${title}｜設計預覽"><meta property="og:description" content="宗錸物流獨立 UI/UX 設計預覽版。正式服務資訊請洽宗錸確認。"><meta property="og:url" content="https://yen021027.github.io${base}${slug}"><meta property="og:image" content="https://yen021027.github.io${asset('hero-1200')}"><link rel="icon" href="${asset('favicon-zonex.svg')}" type="image/svg+xml"><link rel="preload" href="${asset('noto-sans-tc.a2923570cd.woff2')}" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="${base}${hashes['style.css']}"><script src="${base}${hashes['app.js']}" defer></script><script type="application/ld+json">${json}</script></head><body class="${home?'home-page':'service-page'}"><a class="skip-link" href="#main">跳至主要內容</a>${header(home)}<main id="main" tabindex="-1">${content}</main>${footer()}</body></html>`;
}
const home = require('../src/home.cjs')({photo,services,base,contact});
fs.writeFileSync(path.join(out,'index.html'),page('宗錸物流｜中部叫車，全省配送','宗錸物流提供台中貨運、全省配送、回頭車、工廠搬遷、機械設備與展覽進退場運送。獨立 UI/UX 設計預覽。','',home,true));
for (const [slug,data] of Object.entries(original.pages)) {
  let main = data.main.replace(/<section id="contact"[\s\S]*?<\/section>/,contact(false));
  main = main.replace(/(?:src|href)="\/(?=assets\/|services\/|#|")/g, x=>x.slice(0,-1)+base).replace(/srcset="([^"]+)"/g,(_,v)=>'srcset="'+v.replace(/\/assets\//g,base+'assets/')+'"');
  main = main.replace(/sizes="auto, /g,'sizes="');
  main = main.replace('設備尺寸、包裝與裝卸方式，一起確認。', '尺寸、包裝、裝卸。<br>運送前一起確認。');
  main = main.replace(/<p class="eyebrow(?: light)?">[^<]*<\/p>/g, '');
  main = main.replace(/<span class="detail-number">(\d+) \/ SERVICE<\/span>/g, '<span class="detail-number">$1</span>');
  fs.mkdirSync(path.join(out,'services',slug),{recursive:true});
  fs.writeFileSync(path.join(out,'services',slug,'index.html'),page(data.title,data.description,'services/'+slug+'/',main,false,data.schema));
}
const missing = `<section class="missing wrap section-pad"><p class="eyebrow">404 / PAGE NOT FOUND</p><h1>這一站，<br>不在路線上。</h1><p>這個網址不存在，可能已變更或輸入有誤。</p><a class="button primary" href="${base}">返回首頁</a><a class="text-link" href="${base}#contact">聯絡宗錸</a></section>`;
fs.writeFileSync(path.join(out,'404.html'),page('找不到頁面｜宗錸物流','此頁面不存在。','',missing));
fs.writeFileSync(path.join(out,'.nojekyll'),'');
fs.writeFileSync(path.join(out,'robots.txt'),'# Design preview: all HTML pages declare noindex.\nUser-agent: *\nAllow: /\n');
console.log('Built homepage, 7 service pages, and real 404 document.',hashes);
