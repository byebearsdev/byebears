/**
 * Visual comparison: refactored page vs. the original single-file version.
 *
 * Drives both through the same start-up sequence and captures the same views,
 * so the screenshots can be compared frame for frame.
 *
 * Requires the dev server, and `public/__original.html` (a copy of
 * reference/index.original.html) so the original resolves its `images/` paths.
 *
 * Run with:  node scripts/compare.mjs
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:5199';
const OUT = 'scripts/screenshots/compare';
mkdirSync(OUT, { recursive: true });

/** Section selectors, refactored → original. */
const VIEWS = [
    { name: 'hero',        now: '.hero-sunset',      before: '.hero-section' },
    { name: 'arcade-hall', now: '.arcade-hall',      before: '.section-1' },
    { name: 'fire-stage',  now: '.fire-meme-stage',  before: '.section-2' },
    { name: 'snack-table', now: '#snackTable',       before: '#s4Container' },
    { name: 'tub-scene',   now: '.tub-scene',        before: '.section-3' },
    { name: 'phone-menu',  now: '.phone-menu',       before: '.section-5' },
    { name: 'disclaimer',  now: '.disclaimer-panel', before: '.section-6' },
];

async function capture(label, url, selectorKey) {
    const browser = await chromium.launch({
        channel: 'chrome',
        args: ['--autoplay-policy=no-user-gesture-required'],
    });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    await page.goto(url, { waitUntil: 'load' });

    // Both builds gate behind PRESS START.
    await page.waitForSelector('#enterBtn', { state: 'visible', timeout: 10000 });
    await page.screenshot({ path: `${OUT}/00-enter-${label}.png` });

    await page.click('#enterBtn');

    // Wait for the scroll container to be revealed by the loading screen.
    await page.waitForFunction(
        () => document.getElementById('scrollContainer')?.style.visibility === 'visible',
        { timeout: 30000 },
    );
    await page.waitForTimeout(2500); // let videos and canvases settle

    for (const view of VIEWS) {
        const selector = view[selectorKey];
        const el = page.locator(selector).first();
        if (await el.count() === 0) {
            console.log(`   ! ${label}: "${selector}" not found`);
            continue;
        }
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(700);
        await page.screenshot({ path: `${OUT}/${view.name}-${label}.png` });
    }

    // Terminal popup, driven from the same prop in both builds.
    const propSelector = selectorKey === 'now' ? '#snack-gameboy' : '#s4-gameboy';
    await page.locator(selectorKey === 'now' ? '#snackTable' : '#s4Container').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.click(propSelector, { force: true });
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `${OUT}/terminal-${label}.png` });

    await browser.close();
}

console.log('Capturing refactored build …');
await capture('after', `${BASE}/`, 'now');

console.log('Capturing original build …');
await capture('before', `${BASE}/__original.html`, 'before');

console.log(`\nScreenshot pairs written to ${OUT}/`);
