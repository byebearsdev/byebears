/**
 * Cross-reference audit.
 *
 * Checks, against the built output and the source tree:
 *   1. Every `getElementById` / `querySelector` target actually gets rendered.
 *   2. Every class referenced in CSS is used somewhere in the markup, and
 *      every class used in markup has (or intentionally lacks) CSS.
 *
 * Run with:  node scripts/audit-refs.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const SRC = 'src';

function walk(dir) {
    return readdirSync(dir).flatMap((entry) => {
        const full = join(dir, entry);
        return statSync(full).isDirectory() ? walk(full) : [full];
    });
}

const files = walk(SRC);
const js = files.filter((f) => extname(f) === '.js');
const css = files.filter((f) => extname(f) === '.css');

const jsSource = js.map((f) => readFileSync(f, 'utf8')).join('\n');
const cssSource = css.map((f) => readFileSync(f, 'utf8')).join('\n');
const htmlSource = readFileSync('index.html', 'utf8');
const markup = jsSource + htmlSource;

const collect = (source, regex, group = 1) => {
    const out = new Set();
    let m;
    while ((m = regex.exec(source)) !== null) out.add(m[group]);
    return out;
};

/* ---------- 1. IDs ---------- */
const renderedIds = collect(markup, /\bid="([A-Za-z][\w-]*)"/g);
// Template-literal ids like id="${id}" are resolved from the data modules.
const dataIds = collect(jsSource, /\bid:\s*'([\w-]+)'/g);
const dynamicIdPrefixes = ['theme-', 'snack-'];

const lookedUpIds = new Set([
    ...collect(jsSource, /getElementById\(\s*'([\w-]+)'\s*\)/g),
    ...collect(jsSource, /querySelector\(\s*'#([\w-]+)'\s*\)/g),
    ...collect(jsSource, /root:\s*document\.getElementById\('([\w-]+)'\)/g),
]);

const known = new Set([...renderedIds, ...dataIds]);
const missingIds = [...lookedUpIds].filter(
    (id) => !known.has(id) && !dynamicIdPrefixes.some((p) => id.startsWith(p)),
);

/* ---------- 2. Classes ---------- */
const usedClasses = new Set();
for (const m of markup.matchAll(/\bclass="([^"]*)"/g)) {
    m[1]
        .replace(/\$\{[^}]*\}/g, ' ') // drop interpolations
        .split(/\s+/)
        .filter(Boolean)
        .forEach((c) => usedClasses.add(c));
}
// Classes applied at runtime rather than in a template.
for (const m of jsSource.matchAll(/classList\.(?:add|remove|toggle)\(\s*'([\w-]+)'/g)) {
    usedClasses.add(m[1]);
}
for (const m of jsSource.matchAll(/className\s*=\s*'([\w-]+)'/g)) usedClasses.add(m[1]);
// Modifier classes built by interpolation, e.g. `terminal-line--${line.cls}`.
const interpolatedPrefixes = [
    'terminal-line--',
];

const definedClasses = collect(cssSource, /\.([a-zA-Z][\w-]*)/g);

const unusedCss = [...definedClasses].filter(
    (c) => !usedClasses.has(c) && !interpolatedPrefixes.some((p) => c.startsWith(p)),
);
const undefinedInCss = [...usedClasses].filter((c) => !definedClasses.has(c));

/* ---------- Report ---------- */
const report = (title, items) => {
    console.log(`\n${title}: ${items.length}`);
    items.sort().forEach((i) => console.log(`   - ${i}`));
};

console.log(`Scanned ${js.length} JS and ${css.length} CSS files.`);
report('Looked-up IDs that are never rendered', missingIds);
report('CSS classes with no markup using them', unusedCss);
report('Markup classes with no CSS rule', undefinedInCss);

if (missingIds.length) process.exitCode = 1;
