/**
 * Render audit.
 *
 * Executes the real component tree in Node (with just enough browser stubs to
 * let the modules load) and audits the HTML they actually produce. Unlike a
 * regex scan, this resolves every `${...}` interpolation, so modifier classes
 * such as `meme-gif--popcat` are checked as they really appear.
 *
 * Run with:  node scripts/audit-render.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

/* ---------- Minimal browser stubs ---------- */
const noop = () => {};
globalThis.window = {
    AudioContext: function AudioContext() {},
    matchMedia: () => ({ matches: false }),
    addEventListener: noop,
};
globalThis.document = {
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: noop,
    body: { addEventListener: noop, insertAdjacentHTML: noop },
    createElement: () => ({ style: {}, setAttribute: noop, appendChild: noop }),
};
globalThis.navigator = { clipboard: null };
globalThis.Audio = function Audio() {};
globalThis.IntersectionObserver = function IntersectionObserver() {
    return { observe: noop };
};

/* ---------- Render everything ---------- */
const { ArcadeBackdrop, GlobalHeatHaze, GlobalSunGlow, MarqueeBar, SiteHeader } = await import('../src/chrome/PageChrome.js');
const { BgmToggle, MenuButton } = await import('../src/chrome/ChromeButtons.js');
const { ScrollIndicator } = await import('../src/chrome/ScrollIndicator.js');
const { RotateDeviceGate } = await import('../src/overlays/RotateDeviceGate.js');
const { EnterScreen } = await import('../src/overlays/EnterScreen.js');
const { SeasonSelect } = await import('../src/overlays/SeasonSelect.js');
const { LoadingScreen } = await import('../src/overlays/LoadingScreen.js');
const { ArcadeMenu } = await import('../src/overlays/ArcadeMenu.js');
const { TerminalPopup } = await import('../src/overlays/TerminalPopup.js');
const { VideoModal } = await import('../src/overlays/VideoModal.js');
const { GameModal } = await import('../src/overlays/GameModal.js');
const { DesktopOnlyNotice } = await import('../src/overlays/DesktopOnlyNotice.js');
const { HeroSunset } = await import('../src/sections/HeroSunset.js');
const { ArcadeHall } = await import('../src/sections/ArcadeHall.js');
const { FireMemeStage } = await import('../src/sections/FireMemeStage.js');
const { SnackTable } = await import('../src/sections/SnackTable.js');
const { TubScene } = await import('../src/sections/TubScene.js');
const { PhoneMenu } = await import('../src/sections/PhoneMenu.js');
const { DisclaimerPanel } = await import('../src/sections/DisclaimerPanel.js');

const html = [
    RotateDeviceGate(), EnterScreen(), SeasonSelect(), LoadingScreen(),
    ScrollIndicator(), GlobalHeatHaze(), GlobalSunGlow(), MarqueeBar(), SiteHeader(),
    BgmToggle(), MenuButton(), ArcadeBackdrop(), ArcadeMenu(),
    HeroSunset(), ArcadeHall(), FireMemeStage(),
    SnackTable(), TubScene(), PhoneMenu(), DisclaimerPanel(),
    TerminalPopup(), VideoModal(), GameModal(), DesktopOnlyNotice(),
].join('\n');

/* ---------- Gather CSS ---------- */
function walk(dir) {
    return readdirSync(dir).flatMap((e) => {
        const full = join(dir, e);
        return statSync(full).isDirectory() ? walk(full) : [full];
    });
}
const cssFiles = walk('src').filter((f) => extname(f) === '.css');
// Strip comments so filenames inside them aren't mistaken for selectors.
const cssSource = cssFiles
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');

const cssClasses = new Set();
for (const m of cssSource.matchAll(/\.([a-zA-Z][\w-]*)/g)) cssClasses.add(m[1]);

/* ---------- Classes actually rendered ---------- */
const renderedClasses = new Set();
for (const m of html.matchAll(/\bclass="([^"]*)"/g)) {
    m[1].split(/\s+/).filter(Boolean).forEach((c) => renderedClasses.add(c));
}

/* ---------- Classes added at runtime ---------- */
const jsSource = walk('src')
    .filter((f) => extname(f) === '.js')
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n');
const runtimeClasses = new Set();
for (const m of jsSource.matchAll(/classList\.(?:add|remove|toggle)\(\s*'([\w-]+)'/g)) runtimeClasses.add(m[1]);
for (const m of jsSource.matchAll(/className = '([\w-]+)'/g)) runtimeClasses.add(m[1]);
for (const m of jsSource.matchAll(/terminal-line--\$\{[^}]+\}|terminal-line--(\w+)/g)) {
    if (m[1]) runtimeClasses.add(`terminal-line--${m[1]}`);
}
// Terminal line modifiers come from the message data.
['highlight', 'gold'].forEach((c) => runtimeClasses.add(`terminal-line--${c}`));
['terminal-load-bar', 'terminal-load-block', 'terminal-load-block--empty', 'terminal-accent',
 'phone-app-btn-copied'].forEach((c) => runtimeClasses.add(c));

const allUsed = new Set([...renderedClasses, ...runtimeClasses]);

const orphanCss = [...cssClasses].filter((c) => !allUsed.has(c));
const missingCss = [...allUsed].filter((c) => !cssClasses.has(c));

/* ---------- Duplicate id check ---------- */
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
const duplicateIds = ids.filter((id, i) => ids.indexOf(id) !== i);

/* ---------- Report ---------- */
const report = (title, items) => {
    console.log(`\n${title}: ${items.length}`);
    [...new Set(items)].sort().forEach((i) => console.log(`   - ${i}`));
};

console.log(`Rendered ${html.length.toLocaleString()} chars of HTML.`);
console.log(`Unique ids: ${new Set(ids).size}   Rendered classes: ${renderedClasses.size}   CSS classes: ${cssClasses.size}`);
report('DUPLICATE ids', duplicateIds);
report('CSS rules nothing uses', orphanCss);
report('Classes used with no CSS rule', missingCss);

if (duplicateIds.length || missingCss.length) process.exitCode = 1;
