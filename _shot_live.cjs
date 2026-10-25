const { chromium } = require('playwright');
(async () => {
  const url = process.argv[2] || 'https://ericlin1994.github.io/quanzhi-card/';
  const out = process.argv[3] || '_live.png';
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 2 });
  const errs = [];
  p.on('requestfailed', r => errs.push('FAIL ' + r.url() + ' :: ' + (r.failure() && r.failure().errorText)));
  p.on('response', r => { if (r.status() >= 400) errs.push('HTTP ' + r.status() + ' ' + r.url()); });
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  await p.evaluate(async () => { window.scrollTo(0, document.body.scrollHeight); await new Promise(r=>setTimeout(r,1500)); window.scrollTo(0,0); await new Promise(r=>setTimeout(r,500)); });
  await p.screenshot({ path: out, fullPage: true });
  console.log('TITLE:', await p.title());
  console.log('ERRORS:', errs.length ? errs.join('\n') : 'none');
  await b.close();
})();
