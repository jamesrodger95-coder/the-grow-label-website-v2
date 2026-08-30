import { chromium } from '@playwright/test';
const url = process.argv[2] || 'https://eloadvisors.com/';
const out = process.argv[3] || 'artifacts/research';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(e=>console.log('nav:',e.message));
await p.waitForTimeout(3000);
const info = await p.evaluate(() => {
  const fonts = new Set(); const colors = new Set(); const bgs = new Set(); const sizes = new Set();
  document.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    if (el.textContent && el.textContent.trim().length) { fonts.add(cs.fontFamily); }
    colors.add(cs.color); bgs.add(cs.backgroundColor);
    const fs = parseFloat(cs.fontSize); if (fs > 30) sizes.add(Math.round(fs)+'px|'+cs.fontFamily.split(',')[0]+'|'+cs.fontWeight+'|'+cs.fontStyle+'|'+(cs.letterSpacing));
  });
  const heads = [...document.querySelectorAll('h1,h2,h3,h4')].slice(0,50).map(h=>h.tagName+': '+h.textContent.trim().replace(/\s+/g,' ').slice(0,120));
  const sections = [...document.querySelectorAll('section,main > div')].slice(0,40).map((s,i)=>{
    const cs=getComputedStyle(s); const r=s.getBoundingClientRect();
    return `${i} bg=${cs.backgroundColor} h=${Math.round(r.height)}`;
  });
  return {
    title: document.title,
    fonts: [...fonts].slice(0,20),
    colors: [...colors].slice(0,30),
    bgs: [...bgs].slice(0,20),
    bigType: [...sizes].sort((a,b)=>parseInt(b)-parseInt(a)).slice(0,25),
    heads, sections,
    scripts: [...document.scripts].map(s=>s.src).filter(Boolean).slice(0,25),
    docH: document.documentElement.scrollHeight,
  };
});
console.log(JSON.stringify(info, null, 2));
const H = info.docH;
for (let i=0;i<Math.min(8, Math.ceil(H/1000));i++){
  await p.evaluate(y=>window.scrollTo(0,y), i*1000);
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${out}/ref-${String(i).padStart(2,'0')}.png` });
}
await b.close();
