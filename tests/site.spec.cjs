/* Run against the built static server with npm test. See tests/README.md. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
function dependency(name) {
  try { return require(name); } catch (error) {
    if (!process.env.QA_NODE_MODULES) throw error;
    return require(path.join(process.env.QA_NODE_MODULES, name));
  }
}
const { chromium } = dependency('@playwright/test');
const AxeBuilder = dependency('@axe-core/playwright').default;
const origin = process.env.QA_ORIGIN || 'http://127.0.0.1:4176';
const prefix = process.env.QA_PREFIX || '/zonex-uiux-v2/';
const home = new URL(prefix, origin).href;
const routes = ['', ...['warehouse-transfer', 'factory-relocation', 'machinery-transport', 'building-materials', 'exhibition-logistics', 'nationwide-delivery', 'return-truck'].map(s => `services/${s}/`)];
const widths = [320, 375, 390, 768, 1024, 1440];
const output = path.resolve(__dirname, '../test-results');
fs.mkdirSync(output, { recursive: true });
const results = [];
let browser;
async function test(name, run) {
  const start = Date.now();
  try { await run(); results.push({name, status: 'passed', durationMs: Date.now()-start}); console.log(`PASS ${name}`); }
  catch (e) { results.push({name, status:'failed', error:e.stack || String(e), durationMs:Date.now()-start}); console.error(`FAIL ${name}: ${e.message}`); }
}
async function withPage(options, run) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  try { return await run(page, context); } finally { await context.close(); }
}
async function checkLayout(page) {
  const layout = await page.evaluate(() => ({viewport:innerWidth, width:document.documentElement.scrollWidth, bad: [...document.querySelectorAll('main *')].filter(el => {
    const r = el.getBoundingClientRect(); const style=getComputedStyle(el);
    return r.width > 0 && style.position !== 'fixed' && (r.right > innerWidth+2 || r.left < -2);
  }).slice(0,8).map(el=>`${el.tagName}.${el.className}`)}));
  assert(layout.width <= layout.viewport + 1, JSON.stringify(layout));
}
async function loadImages(page) {
  await page.evaluate(async () => {
    for (const img of document.images) { img.loading = 'eager'; }
    await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
  });
  const broken = await page.locator('img').evaluateAll(images => images.filter(i=> !i.complete || i.naturalWidth === 0 || !i.hasAttribute('alt')).map(i=>i.getAttribute('src')));
  assert.deepEqual(broken, [], `Broken image or missing alt: ${broken.join(', ')}`);
}
async function inspectLinks(page) {
  const links = await page.locator('a[href]').evaluateAll(nodes=>nodes.map(a=>({href:a.href, raw:a.getAttribute('href'), target:a.target, rel:a.rel})));
  for(const a of links) {
    assert(!/^javascript:/i.test(a.raw), `JavaScript link ${a.raw}`);
    assert(a.raw !== '#', 'Placeholder link');
    if(a.href.startsWith(origin)) {
      const url = new URL(a.href);
      assert(url.pathname.startsWith(prefix), `Escapes GitHub Pages subpath: ${a.raw}`);
      if(url.pathname === new URL(page.url()).pathname && url.hash) assert(await page.locator(`[id="${decodeURIComponent(url.hash.slice(1))}"]`).count() > 0, `Missing anchor ${a.raw}`);
    }
    if(a.target === '_blank') assert(/noopener|noreferrer/.test(a.rel), `Unsafe new tab ${a.href}`);
  }
}
const menuSelector = process.env.QA_MENU_SELECTOR || 'button[aria-controls][aria-expanded]';
async function menu(page) { return page.locator(menuSelector).first(); }

(async()=> {
  browser = await chromium.launch({headless:true});
  for(const route of routes) {
    await test(`Route, assets, links, content, privacy: /${route}`, ()=>withPage({viewport:{width:1440,height:1000}}, async page => {
      const thirdParty=[]; const errors=[];
      page.on('request', req=>{if(!req.url().startsWith(origin) && !/^(data|blob):/.test(req.url())) thirdParty.push(req.url());});
      page.on('pageerror', error=>errors.push(error.message));
      const response = await page.goto(new URL(route,home).href, {waitUntil:'networkidle'});
      assert.equal(response.status(),200);
      assert.equal(await page.locator('main').count(),1);
      assert.equal(await page.locator('h1').count(),1);
      assert(await page.title());
      assert(await page.locator('html').getAttribute('lang'));
      await loadImages(page); await inspectLinks(page);
      const text = await page.locator('body').innerText();
      assert(!/[\u2190-\u21ff\u27f0-\u27ff\u2900-\u297f\u2b00-\u2bff]|\p{Extended_Pictographic}/u.test(text.replace(/[©®™]/g,'')), 'Visible arrow or emoji');
      assert(!/LINE\s*ID|複製\s*(?:LINE|ID)|即時追蹤|24\s*小時|五星|ISO\s*\d/i.test(text), 'Unsupported content or prohibited LINE ID UI');
      assert.deepEqual(errors,[], 'Page JavaScript errors');
      assert.deepEqual(thirdParty,[], 'Unexpected third-party automatic requests');
    }));
    for(const width of widths) await test(`Layout ${width}px: /${route}`, ()=>withPage({viewport:{width,height:900}}, async page=>{
      await page.goto(new URL(route,home).href); await loadImages(page); await checkLayout(page);
    }));
    await test(`WCAG axe: /${route}`, ()=>withPage({viewport:{width:390,height:844}}, async page=>{
      await page.goto(new URL(route,home).href); await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(1000);
      const scan = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice']).analyze();
      fs.writeFileSync(path.join(output,`axe-${route.replaceAll('/','-')||'home'}.json`),JSON.stringify(scan.violations,null,2));
      assert.deepEqual(scan.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),[]);
    }));
  }
  await test('Mobile menu repeated open/close, Escape, outside, resize, navigation history', ()=>withPage({viewport:{width:390,height:844}}, async page=>{
    await page.goto(home); const toggle=await menu(page);
    assert.equal(await toggle.count(),1,'Menu toggle missing');
    for(let i=0;i<3;i++) {
      await toggle.click(); assert.equal(await toggle.getAttribute('aria-expanded'),'true');
      await page.keyboard.press('Escape'); assert.equal(await toggle.getAttribute('aria-expanded'),'false');
    }
    await toggle.click(); await page.locator('h1').click({force:true});
    assert.equal(await toggle.getAttribute('aria-expanded'),'false','Outside click should dismiss');
    await toggle.click(); await page.setViewportSize({width:1440,height:900});
    await page.setViewportSize({width:390,height:844});
    assert.equal(await toggle.getAttribute('aria-expanded'),'false','Resize leaves stale menu state');
    await toggle.click(); const controls=await toggle.getAttribute('aria-controls');
    const link=page.locator(`[id="${controls}"] a[href]`).first();
    await link.click(); await page.waitForTimeout(100);
    assert.equal(await toggle.getAttribute('aria-expanded'),'false','Navigation should dismiss menu');
    await page.goBack(); await page.waitForTimeout(100);
    assert.equal(await (await menu(page)).getAttribute('aria-expanded'),'false','History restored open menu');
  }));
  await test('Keyboard skip link and visible focus', ()=>withPage({viewport:{width:1440,height:900}},async page=>{
    await page.goto(home); await page.keyboard.press('Tab');
    const first=await page.locator(':focus').evaluate(el=>({tag:el.tagName,href:el.getAttribute('href'),text:el.textContent}));
    assert(first.tag==='A' && /^#/.test(first.href),'First tab stop should skip to main content');
    await page.keyboard.press('Enter');
    assert(await page.evaluate(()=>document.activeElement.closest('main') !== null),'Skip link did not move focus into main');
    for(let i=0;i<15;i++) {
      await page.keyboard.press('Tab');
      if(i===0) {
        assert.equal(await page.locator(':focus').getAttribute('href'),'#contact','First Tab after skip link must reach hero CTA, not be reset to MAIN');
        assert(await page.locator('.hero .button.primary:focus').count()===1,'Skip link must preserve natural next focus target');
      }
      const focus=await page.locator(':focus').evaluate(el=>{const s=getComputedStyle(el); return {visible:el.getBoundingClientRect().width>0, ring:s.outlineStyle!=='none'&&parseFloat(s.outlineWidth)>0, shadow:s.boxShadow!=='none'};});
      assert(focus.visible && (focus.ring||focus.shadow),'Keyboard target lacks visible focus');
    }
  }));
  await test('Reduced-motion preference', ()=>withPage({reducedMotion:'reduce',viewport:{width:390,height:844}},async page=>{
    await page.goto(home);
    const motion=await page.evaluate(()=>({scroll:getComputedStyle(document.documentElement).scrollBehavior, animated:[...document.querySelectorAll('*')].filter(el=>{const s=getComputedStyle(el); return s.animationName!=='none' && parseFloat(s.animationDuration)>0.01;}).length}));
    assert.notEqual(motion.scroll,'smooth'); assert.equal(motion.animated,0);
  }));
  await test('No-JavaScript core navigation and contact remain usable', ()=>withPage({javaScriptEnabled:false,viewport:{width:390,height:844}},async page=>{
    await page.goto(home); await checkLayout(page);
    assert(await page.locator('a[href^="tel:"]').count()>0,'Telephone link missing');
    assert(await page.locator('a[href*="line.me"]').count()>0,'LINE link missing');
    const services=page.locator(`a[href*="services/"]`); assert(await services.count()>=7);
    await services.first().click(); assert(page.url().includes('/services/')); assert(await page.locator('h1').isVisible());
  }));
  await test('404 is real HTTP 404 with working recovery links',()=>withPage({},async page=>{
    const response=await page.goto(new URL('missing-qa-route/',home).href);
    assert.equal(response.status(),404);
    assert(await page.locator('h1').isVisible()); await inspectLinks(page);
    assert(await page.locator(`a[href="${prefix}"]`).count()>0,'404 needs home recovery');
  }));
  await test('404 responsive layout, image and accessibility coverage',()=>withPage({viewport:{width:390,height:844}},async page=>{
    await page.goto(new URL('missing-qa-route/',home).href);
    await loadImages(page); await page.waitForTimeout(1000);
    const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice']).analyze();
    assert.deepEqual(scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
    for(const width of widths) {await page.setViewportSize({width,height:900});await checkLayout(page);}
  }));
  await test('Service tabs, roving keyboard focus and responsive orientation',()=>withPage({viewport:{width:1440,height:1000}},async page=>{
    await page.goto(home);
    const tabs=page.locator('[data-service-tab]'); const count=await tabs.count(); assert(count>1);
    assert.equal(await page.locator('.service-menu').getAttribute('aria-orientation'),'vertical');
    for(let i=0;i<count;i++) {
      const tab=tabs.nth(i); await tab.click();
      assert.equal(await tab.getAttribute('aria-selected'),'true');
      const panel=page.locator('#'+await tab.getAttribute('aria-controls'));
      assert(await panel.isVisible());
      assert.equal(await page.locator('[data-service-tab][aria-selected="true"]').count(),1);
      assert.equal(await page.locator('[data-service-tab][tabindex="0"]').count(),1);
    }
    await tabs.first().focus(); await page.keyboard.press('ArrowDown'); assert.equal(await tabs.nth(1).getAttribute('aria-selected'),'true');
    await page.keyboard.press('End'); assert.equal(await tabs.last().getAttribute('aria-selected'),'true');
    await page.keyboard.press('Home'); assert.equal(await tabs.first().getAttribute('aria-selected'),'true');
    await page.setViewportSize({width:390,height:844});
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.service-menu').getAttribute('aria-orientation'),'horizontal');
    await tabs.first().focus(); await page.keyboard.press('ArrowRight'); assert.equal(await tabs.nth(1).getAttribute('aria-selected'),'true');
    await page.keyboard.press('ArrowLeft'); assert.equal(await tabs.first().getAttribute('aria-selected'),'true');
  }));
  await test('Service guide selection, CTA synchronization, clipboard success and fallback',()=>withPage({viewport:{width:390,height:844}},async page=>{
    await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copied=text;}}}));
    await page.goto(home);
    const select=page.locator('#request-service');
    const options=await select.locator('option').evaluateAll(nodes=>nodes.map(n=>({value:n.value,text:n.textContent})));
    for(const option of options) {
      await select.selectOption(option.value);
      assert.equal((await page.locator('#request-service-label').innerText()).trim(),option.text.trim());
      assert.equal(await page.locator('#request-guidance li').count(),3);
    }
    const cta=page.locator('a[data-service]:visible').first();
    const service=await cta.getAttribute('data-service'); await cta.click(); assert.equal(await select.inputValue(),service);
    await page.locator('.copy-template').click();
    assert((await page.evaluate(()=>window.__copied)).includes(await page.locator('#request-service-label').innerText()));
    assert(await page.locator('.copy-status').innerText()); assert(await page.locator('#copy-fallback').isHidden());
    await page.evaluate(()=>navigator.clipboard.writeText=async()=>{throw new Error('QA permission denial');});
    await page.locator('.copy-template').click();
    assert(await page.locator('#copy-fallback').isVisible());
    assert.equal(await page.locator(':focus').getAttribute('id'),'template-text');
    const selected=await page.locator('#template-text').evaluate(el=>({length:el.value.length,selected:el.selectionEnd-el.selectionStart}));
    assert(selected.length>30 && selected.selected===selected.length);
    await select.selectOption(options.find(o=>o.value!==service).value);
    assert(await page.locator('#copy-fallback').isHidden());
    assert.equal(await page.locator('.copy-status').innerText(),'');
    await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:undefined}));
    await page.locator('.copy-template').click(); assert(await page.locator('#copy-fallback').isVisible());
  }));
  await test('Expanded menu and desktop axe',()=>withPage({viewport:{width:390,height:844}},async page=>{
    await page.goto(home); await page.waitForTimeout(1000); await (await menu(page)).click();
    const expanded=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    assert.deepEqual(expanded.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
    await page.setViewportSize({width:1440,height:1000});
    const desktop=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    assert.deepEqual(desktop.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
  }));
  await test('Reference screenshots',()=>withPage({viewport:{width:1440,height:1000}},async page=>{
    await page.goto(home); await loadImages(page); await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(1000); await page.screenshot({path:path.join(output,'home-desktop.png'),fullPage:true});
    await page.setViewportSize({width:390,height:844}); await page.screenshot({path:path.join(output,'home-mobile.png'),fullPage:true});
    await page.goto(new URL('services/machinery-transport/',home).href); await loadImages(page); await page.screenshot({path:path.join(output,'service-mobile.png'),fullPage:true});
  }));
})().catch(error=>results.push({name:'Harness setup',status:'failed',error:error.stack})).finally(async()=>{
  await browser?.close();
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({testedAt:new Date().toISOString(),home,results},null,2));
  const failures=results.filter(r=>r.status==='failed');
  console.log(`\n${results.length-failures.length}/${results.length} checks passed. Artifacts: ${output}`);
  process.exitCode=failures.length ? 1 : 0;
});
