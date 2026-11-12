'use strict';

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-nav');
const desktopMedia = matchMedia('(min-width: 961px)');
if (menuToggle && mobileMenu) {
  menuToggle.hidden = false;
  const label = menuToggle.querySelector('.menu-label');
  function closeMenu(returnFocus = false) {
    mobileMenu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', '開啟選單');
    label.textContent = '選單';
    if (returnFocus) menuToggle.focus({preventScroll:true});
  }
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    mobileMenu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
    label.textContent = open ? '關閉' : '選單';
  });
  mobileMenu.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mobileMenu.hidden) closeMenu(true); });
  document.addEventListener('click', e => {
    if (!mobileMenu.hidden && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu(mobileMenu.contains(document.activeElement));
    }
  });
  document.addEventListener('focusin', e => {
    if (!mobileMenu.hidden && !mobileMenu.contains(e.target) && e.target !== menuToggle) closeMenu();
  });
  desktopMedia.addEventListener('change', e => {
    if (!e.matches) return;
    const current = mobileMenu.contains(document.activeElement) ? document.activeElement.closest('a') : null;
    closeMenu();
    if (current) {
      const equivalent = [...document.querySelectorAll('.desktop-nav a, .header-contact')].find(a=>a.href === current.href);
      equivalent?.focus({preventScroll:true});
    } else if (document.activeElement === menuToggle) document.querySelector('.brand').focus({preventScroll:true});
  });
  addEventListener('popstate', () => closeMenu());
  addEventListener('pageshow', () => closeMenu());
}

const serviceTabs = [...document.querySelectorAll('[data-service-tab]')];
const tabList = document.querySelector('.service-menu');
if (tabList && serviceTabs.length) {
  tabList.hidden = false;
  const mobileTabs = matchMedia('(max-width: 760px)');
  const setOrientation = () => tabList.setAttribute('aria-orientation', mobileTabs.matches ? 'horizontal' : 'vertical');
  setOrientation();
  mobileTabs.addEventListener('change', setOrientation);
  function selectTab(tab) {
    for (const item of serviceTabs) {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
    }
  }
  serviceTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      const next = mobileTabs.matches ? 'ArrowRight' : 'ArrowDown';
      const previous = mobileTabs.matches ? 'ArrowLeft' : 'ArrowUp';
      let target;
      if (event.key === next) target = (index + 1) % serviceTabs.length;
      else if (event.key === previous) target = (index - 1 + serviceTabs.length) % serviceTabs.length;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = serviceTabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(serviceTabs[target]);
      serviceTabs[target].focus({preventScroll:true});
    });
  });
}

const guidance = {
  logistics: {label:'物流倉儲轉運',details:['貨物品項、件數、尺寸、總重量與包裝方式。','上下貨地址，以及現場是否可使用拖板車。','希望運送日期、時段與貨物照片。']},
  relocation: {label:'工廠搬遷',details:['待搬貨物清單、各件尺寸、重量與包裝方式。','搬出與搬入地址，以及樓層、通道與裝卸條件。','希望搬遷日期、可作業時段與現場照片。']},
  equipment: {label:'機械設備運送',details:['設備名稱、尺寸、重量，以及包裝或棧板固定方式。','上下貨地址、現場裝卸條件與設備照片。','希望運送日期與時段，方便確認車趟。']},
  materials: {label:'建材運送',details:['建材品項、數量、尺寸、重量與包裝方式。','取貨與送達地址、卸貨位置及現場裝卸條件。','希望運送日期、到貨時段與貨物照片。']},
  industrial: {label:'工業原料運送',details:['原料品項、包裝方式、件數與總重量。','上下貨地址、現場裝卸條件與希望運送日期。','先提供貨物資料，確認承運條件後再安排車趟。']},
  exhibition: {label:'展覽進退場',details:['展覽名稱、場館、進場與退場日期及指定時段。','展品品項、件數、尺寸、重量與包裝方式。','上下貨地址、現場裝卸條件與展品照片。']},
  nationwide: {label:'全省配送',details:['貨物品項、件數、尺寸、總重量與包裝方式。','取貨及送達地址，以及兩端裝卸條件。','希望運送日期、時段與貨物照片。']},
  return: {label:'回頭車服務',details:['貨物品項、件數、尺寸、重量與包裝方式。','取貨及送達地點，確認是否可配合車趟路線。','希望日期與可彈性配合的時段，實際安排另行確認。']}
};
const select = document.querySelector('#request-service');
const guidanceList = document.querySelector('#request-guidance');
const serviceLabel = document.querySelector('#request-service-label');
const copyButton = document.querySelector('.copy-template');
const copyStatus = document.querySelector('.copy-status');
const fallback = document.querySelector('#copy-fallback');
const templateText = document.querySelector('#template-text');
let copyGeneration = 0;
function updateGuidance(id) {
  if (!guidance[id] || !select) return;
  select.value = id;
  serviceLabel.textContent = guidance[id].label;
  guidanceList.replaceChildren(...guidance[id].details.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  copyGeneration++;
  copyStatus.textContent = '';
  fallback.hidden = true;
}
if (select && guidanceList) {
  select.hidden = false;
  document.querySelector('label[for="request-service"]').hidden = false;
  copyButton.hidden = false;
  select.addEventListener('change', () => updateGuidance(select.value));
  document.querySelectorAll('a[data-service]').forEach(link=>link.addEventListener('click',()=>updateGuidance(link.dataset.service)));
  copyButton.addEventListener('click', async () => {
    const generation = ++copyGeneration;
    const current = guidance[select.value];
    const template = `您好，我想洽詢「${current.label}」。\n\n貨物品項與數量：\n尺寸、重量與包裝：\n取貨地址：\n送達地址：\n希望日期與時段：\n現場裝卸條件：\n${select.value==='exhibition'?'展覽名稱、場館與進退場時段：\n':''}\n我會另附貨物照片，請協助確認承運條件與車趟。`;
    copyButton.disabled = true;
    copyButton.textContent = '準備範本中';
    copyStatus.textContent = '';
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(template);
      if (generation === copyGeneration) {
        fallback.hidden = true;
        copyStatus.textContent = '已複製。貼到 LINE、補齊資料後，再自行傳送。';
      }
    } catch {
      if (generation === copyGeneration) {
        templateText.value = template;
        fallback.hidden = false;
        copyStatus.textContent = '瀏覽器無法自動複製，請手動選取下方範本。';
        templateText.focus();
        templateText.select();
      }
    } finally {
      copyButton.disabled = false;
      copyButton.textContent = '複製洽詢範本';
    }
  });
}

document.querySelectorAll('a[href*="#"]').forEach(link=>link.addEventListener('click',()=>{
  const url = new URL(link.href);
  if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!target) return;
  // Move focus during the activation, never in a later frame that could steal
  // focus back after a visitor has already pressed Tab again.
  const temporary = !target.hasAttribute('tabindex');
  if (temporary) target.setAttribute('tabindex','-1');
  target.focus({preventScroll:true});
  if (temporary) target.addEventListener('blur',()=>target.removeAttribute('tabindex'),{once:true});
}));

if ('IntersectionObserver' in window) {
  const links = [...document.querySelectorAll('.desktop-nav a')];
  const sections = links.map(a=>document.getElementById(new URL(a.href).hash.slice(1))).filter(Boolean);
  const visible = new Set();
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(e=>e.isIntersecting?visible.add(e.target):visible.delete(e.target));
    const active = [...visible].sort((a,b)=>Math.abs(a.getBoundingClientRect().top-150)-Math.abs(b.getBoundingClientRect().top-150))[0];
    links.forEach(a=>active && a.hash === '#'+active.id ? a.setAttribute('aria-current','location') : a.removeAttribute('aria-current'));
  },{rootMargin:'-20% 0px -50% 0px',threshold:0});
  sections.forEach(s=>observer.observe(s));
}
