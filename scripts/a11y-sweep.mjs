import { chromium } from '@playwright/test';

/**
 * Accessibility sweep.
 *
 * Checks the things this site's design decisions could plausibly have broken,
 * on the real rendered page rather than in the source:
 *
 *   - computed contrast for every text node against its painted background
 *   - a visible focus indicator on every focusable element
 *   - animated SVG carrying either a role and a label, or aria-hidden
 *   - under prefers-reduced-motion, nothing left invisible or zero-width
 *   - one h1 per page and no skipped heading levels
 */
const BASE = process.env.BASE_URL ?? 'http://localhost:3112';
const ROUTES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['/', '/modules', '/modules/answer', '/platform', '/contact'];

const browser = await chromium.launch();
const problems = [];

for (const route of ROUTES) {
  for (const reduced of [false, true]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: reduced ? 'reduce' : 'no-preference',
    });
    const page = await context.newPage();
    await page.goto(`${BASE}${route}`, { waitUntil: 'load' });
    // Scroll the page so every reveal and scene has run.
    await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
    await page.evaluate(async () => {
      // Re-read scrollHeight each step. Sections use content-visibility: auto,
      // so the document starts shorter than it ends up and a loop bounded by
      // the initial height stops before the last few sections exist.
      const step = window.innerHeight * 0.6;
      let y = 0;
      let guard = 0;
      while (y < document.body.scrollHeight - window.innerHeight && guard < 400) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 60));
        y += step;
        guard += 1;
      }
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 400));
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 250));
    });

    const found = await page.evaluate((isReduced) => {
      const out = [];

      const lum = (rgb) => {
        const [r, g, b] = rgb;
        const ch = (v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
      };
      const parse = (c) => {
        const m = c.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const p = m[1].split(',').map((v) => parseFloat(v));
        return { rgb: [p[0], p[1], p[2]], a: p[3] === undefined ? 1 : p[3] };
      };
      /**
       * Composite the background stack rather than looking for the first
       * fully opaque layer. A translucent pill over a light card genuinely
       * darkens the ground behind its text, and skipping it reported white
       * text on a near-black pill as a 1.22 contrast failure.
       */
      const bgOf = (el) => {
        const layers = [];
        let node = el;
        while (node && node !== document.documentElement) {
          const c = parse(getComputedStyle(node).backgroundColor);
          if (c && c.a > 0) {
            layers.push(c);
            if (c.a >= 0.999) break;
          }
          node = node.parentElement;
        }
        // Paint from the bottom of the stack upward.
        let out = [255, 255, 255];
        for (const layer of layers.reverse()) {
          out = out.map((v, i) => layer.rgb[i] * layer.a + v * (1 - layer.a));
        }
        return out;
      };
      const ratio = (a, b) => {
        const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
        return (x + 0.05) / (y + 0.05);
      };

      // --- contrast -------------------------------------------------------
      for (const el of document.querySelectorAll('body *')) {
        if (!el.firstChild) continue;
        const hasText = [...el.childNodes].some(
          (n) => n.nodeType === 3 && n.textContent.trim().length > 1
        );
        if (!hasText) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        if (parseFloat(cs.opacity) < 0.2) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        const fg = parse(cs.color);
        if (!fg) continue;
        const size = parseFloat(cs.fontSize);
        const bold = parseInt(cs.fontWeight, 10) >= 700;
        const large = size >= 24 || (size >= 18.66 && bold);
        const need = large ? 3 : 4.5;
        // Composite the foreground over its background before comparing.
        // Text colours on this site are frequently rgba() over a dark ground,
        // and comparing the unblended colour overstates the contrast.
        const bg = bgOf(el);
        const blended = fg.rgb.map((v, i) => v * fg.a + bg[i] * (1 - fg.a));
        const got = ratio(blended, bg);
        if (got < need) {
          out.push(
            `contrast ${got.toFixed(2)} < ${need} :: ${el.tagName.toLowerCase()}.${el.className?.toString().split(' ')[0] ?? ''} :: "${el.textContent.trim().slice(0, 40)}"`
          );
        }
      }

      // --- animated svg ----------------------------------------------------
      for (const svg of document.querySelectorAll('svg')) {
        const labelled = svg.getAttribute('role') === 'img' && svg.getAttribute('aria-label');
        const hidden = svg.getAttribute('aria-hidden') === 'true';
        if (!labelled && !hidden) {
          out.push(
            `svg with neither a label nor aria-hidden :: .${svg.getAttribute('class') ?? '?'}`
          );
        }
      }

      // --- reduced motion leaves nothing hidden -----------------------------
      if (isReduced) {
        for (const el of document.querySelectorAll('.m-rise, .m-card, .m-wipe, .m-line > *')) {
          const cs = getComputedStyle(el);
          if (parseFloat(cs.opacity) < 0.9) out.push(`reduced-motion: element still faded`);
          if (/matrix\(0/.test(cs.transform)) out.push(`reduced-motion: element still scaled to 0`);
        }
        for (const el of document.querySelectorAll('.result__barfill, .stagebar__fill')) {
          if (el.getBoundingClientRect().width < 2) {
            out.push('reduced-motion: a bar fill has zero width');
          }
        }
      }

      // --- headings ---------------------------------------------------------
      const h1s = document.querySelectorAll('h1').length;
      if (h1s !== 1) out.push(`${h1s} h1 elements`);
      let prev = 0;
      for (const h of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
        const level = Number(h.tagName[1]);
        if (prev && level > prev + 1) out.push(`heading jump h${prev} to h${level}`);
        prev = level;
      }

      return [...new Set(out)];
    }, reduced);

    /**
     * Focus indicators, driven by real keyboard tabbing.
     *
     * `element.focus()` from script does not match `:focus-visible` in Chrome,
     * so checking it that way reported every page as having an element with no
     * ring. Pressing Tab is what a keyboard user actually does.
     */
    if (!reduced) {
      const seen = new Set();
      for (let i = 0; i < 60; i += 1) {
        await page.keyboard.press('Tab');
        const info = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          const cs = getComputedStyle(el);
          const ring =
            (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) ||
            cs.boxShadow !== 'none';
          const id = `${el.tagName}.${el.className?.toString().split(' ')[0] ?? ''}`;
          return { id, ring, text: (el.textContent || '').trim().slice(0, 30) };
        });
        if (!info) break;
        if (seen.has(info.id)) continue;
        seen.add(info.id);
        if (!info.ring) found.push(`no focus ring on tab :: ${info.id} :: "${info.text}"`);
      }
    }

    if (found.length) {
      problems.push(`\n${route}${reduced ? '  [reduced motion]' : ''}`);
      for (const f of found) problems.push(`  ${f}`);
    }
    await context.close();
  }
}

await browser.close();

if (problems.length) {
  console.log('ACCESSIBILITY PROBLEMS');
  console.log(problems.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`no accessibility problems across ${ROUTES.length} routes, both motion preferences`);
}
