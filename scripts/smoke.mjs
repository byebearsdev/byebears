/**
 * Browser smoke test.
 *
 * Drives the real page in Chrome: clicks through the start-up sequence
 * (check-in → departures reel → loading bar), then exercises the menu, a
 * snack prop and the terminal popup — capturing every console message and
 * network failure along the way.
 *
 * Run with the dev server up:  node scripts/smoke.mjs [url]
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const URL = process.argv[2] ?? 'http://localhost:5199/';
const SHOTS = 'scripts/screenshots';

mkdirSync(SHOTS, { recursive: true });

const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];

const browser = await chromium.launch({ channel: 'chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
    }
});
page.on('pageerror', (err) => pageErrors.push(String(err)));
page.on('requestfailed', (req) => {
    // Media that the browser aborts on purpose is not a real failure.
    const failure = req.failure()?.errorText ?? '';
    failedRequests.push(`${req.url()} — ${failure}`);
});

const step = async (name, fn) => {
    process.stdout.write(`• ${name} … `);
    try {
        await fn();
        console.log('ok');
    } catch (err) {
        console.log(`FAILED: ${err.message}`);
        process.exitCode = 1;
    }
};

await step('load page', async () => {
    await page.goto(URL, { waitUntil: 'load' });
});

await step('enter screen rendered', async () => {
    await page.waitForSelector('#enterBtn', { state: 'visible', timeout: 5000 });
});

await step('section count', async () => {
    const n = await page.locator('.scroll-container > section, .scroll-container > footer').count();
    if (n !== 7) throw new Error(`expected 7 sections, found ${n}`);
});

await step('repeated components rendered', async () => {
    const counts = await page.evaluate(() => ({
        menuItems:    document.querySelectorAll('.arcade-menu-item').length,
        snackItems:   document.querySelectorAll('.snack-item').length,
        phoneAppButtons: document.querySelectorAll('.phone-app-btn').length,
        fireStageCharacters: document.querySelectorAll('.character-video').length,
        themeAudio:   document.querySelectorAll('audio[id^="theme-"]').length,
        loadingLights: document.querySelectorAll('.loading-light').length,
        flapChars:    document.querySelectorAll('#boardRow .flap-char').length,
    }));
    const expected = {
        menuItems: 6, snackItems: 9,
        phoneAppButtons: 6, fireStageCharacters: 4, themeAudio: 0, loadingLights: 10,
        flapChars: 8 + 14 + 10, // CODE_WIDTH + NAME_WIDTH + STATUS_WIDTH, see SeasonSelect.js
    };
    for (const [key, want] of Object.entries(expected)) {
        if (counts[key] !== want) throw new Error(`${key}: expected ${want}, got ${counts[key]}`);
    }
});

await page.screenshot({ path: `${SHOTS}/1-enter.png` });

await step('CHECK IN advances to departures reel', async () => {
    await page.click('#enterBtn');
    await page.waitForFunction(
        () => document.getElementById('enterScreen').classList.contains('is-hidden'),
        { timeout: 5000 },
    );
    await page.waitForTimeout(1200);
});

await page.screenshot({ path: `${SHOTS}/2-season-select.png` });

await step('departures board flips to $ALTSUMR and boards', async () => {
    await page.waitForSelector('#boardRow.is-final', { timeout: 10000 });
    // textContent, not innerText — each flap cell is a flex box, so innerText
    // inserts a newline between them.
    const code = await page.locator('#boardCode').evaluate((el) => el.textContent.replace(/\s/g, ''));
    if (code !== 'ALTSUMR') throw new Error(`landed on "${code}" instead of ALTSUMR`);
});

await step('loading screen then page reveal', async () => {
    await page.waitForFunction(
        () => document.getElementById('scrollContainer').style.visibility === 'visible',
        { timeout: 20000 },
    );
});

await page.waitForTimeout(1500);
await page.screenshot({ path: `${SHOTS}/3-hero.png` });

await step('pixel motes generated', async () => {
    const mote = await page.evaluate(() => document.querySelectorAll('.pixel-mote').length);
    if (mote !== 50) throw new Error(`motes: expected 50, got ${mote}`);
});

await step('sandcastle bear: dig reveals it, then whacking it updates the combo', async () => {
    const mound = page.locator('#sandcastleBearMound');
    const clickBottom = async () => {
        const box = await mound.boundingBox();
        await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.92);
    };
    await mound.scrollIntoViewIfNeeded();
    await clickBottom();
    await clickBottom();
    await clickBottom();
    await page.waitForSelector('#sandcastleBearFace:not([disabled])', { timeout: 3000 });
    await page.click('#sandcastleBearFace');
    await page.click('#sandcastleBearFace');
    const combo = await page.locator('#sandcastleBearCombo').innerText();
    if (combo !== 'x2') throw new Error(`expected combo "x2", got "${combo}"`);
});

await step('hero background video renders', async () => {
    const state = await page.evaluate(() => {
        const v = document.getElementById('videoHeroSunset');
        return v ? { readyState: v.readyState, paused: v.paused } : null;
    });
    if (!state) throw new Error('hero video element not found');
    if (state.readyState < 1) throw new Error(`hero video has no metadata (readyState ${state.readyState})`);
});

await step('menu button visible and opens menu', async () => {
    await page.click('#menuButton');
    await page.waitForSelector('#arcadeMenuOverlay.is-open', { timeout: 3000 });
});

await page.screenshot({ path: `${SHOTS}/4-menu.png` });

await step('menu closes on Escape', async () => {
    await page.keyboard.press('Escape');
    await page.waitForFunction(
        () => !document.getElementById('arcadeMenuOverlay').classList.contains('is-open'),
        { timeout: 3000 },
    );
});

await step('snack prop opens terminal popup', async () => {
    await page.locator('#snackTable').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.click('#snack-tikiSign', { force: true });
    await page.waitForSelector('#terminalPopupOverlay.is-open', { timeout: 3000 });
    const lines = await page.locator('.terminal-line').count();
    if (lines !== 8) throw new Error(`expected 8 terminal lines, got ${lines}`);
});

await page.screenshot({ path: `${SHOTS}/5-terminal.png` });

await step('terminal popup closes on Escape', async () => {
    await page.keyboard.press('Escape');
    await page.waitForFunction(
        () => !document.getElementById('terminalPopupOverlay').classList.contains('is-open'),
        { timeout: 3000 },
    );
});

await step('tub scene boat zooms in and back out on click', async () => {
    await page.locator('.tub-scene').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.click('#tubSceneBoat');
    await page.waitForSelector('#tubSceneStage.is-zoomed', { timeout: 2000 });
    await page.click('#tubSceneBoat');
    await page.waitForFunction(
        () => !document.getElementById('tubSceneStage').classList.contains('is-zoomed'),
        { timeout: 2000 },
    );
});

await step('phone menu reachable, screen overlay tracks the video', async () => {
    await page.locator('.phone-menu').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    const state = await page.evaluate(() => {
        const v = document.getElementById('videoPhoneMenu');
        const overlay = document.querySelector('.phone-screen-overlay');
        return { readyState: v?.readyState, overlayWidth: overlay?.getBoundingClientRect().width };
    });
    if (!state.readyState || state.readyState < 1) throw new Error('phone menu video has no metadata');
    if (!state.overlayWidth || state.overlayWidth < 20) throw new Error(`phone screen overlay too small: ${state.overlayWidth}`);
});

await page.screenshot({ path: `${SHOTS}/6-phone-menu.png` });

await step('iceberg: filling the meter melts it and pops the payoff message', async () => {
    for (let i = 0; i < 8; i++) {
        await page.click('#phoneMenuIceberg', { force: true });
    }
    await page.waitForSelector('#icebergPayoff.is-active', { timeout: 2000 });
    await page.waitForSelector('#phoneMenuIceberg.is-melted', { timeout: 2000 });
    await page.waitForFunction(
        () => !document.getElementById('phoneMenuIceberg').classList.contains('is-melted'),
        { timeout: 3000 },
    );
});

await step('disclaimer words split and lit', async () => {
    await page.locator('.disclaimer-panel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    const lit = await page.locator('.neon-word.is-lit').count();
    if (lit === 0) throw new Error('no neon words lit');
});

await page.screenshot({ path: `${SHOTS}/7-disclaimer.png`, fullPage: false });

await browser.close();

/* ---------- Report ---------- */
const section = (title, items) => {
    console.log(`\n${title}: ${items.length}`);
    items.forEach((i) => console.log(`   ${i}`));
};

section('Page errors (uncaught exceptions)', pageErrors);
section('Console errors/warnings', consoleErrors);
section('Failed requests', failedRequests);

if (pageErrors.length) process.exitCode = 1;
console.log(`\nScreenshots written to ${SHOTS}/`);
