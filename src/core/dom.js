/** Tiny DOM helpers shared across the app. */

export const $  = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

/** Escape a string for safe interpolation into an HTML template. */
export function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/** Render a list of items through a component function and join the result. */
export function renderList(items, component) {
    return items.map(component).join('');
}

/** Build an inline `style` attribute from a camelCase object, skipping empties. */
export function styleAttr(styles) {
    const css = Object.entries(styles)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([prop, value]) => `${prop.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}:${value}`)
        .join('; ');
    return css ? ` style="${css}"` : '';
}

/**
 * Toggle `visibility` on the persistent page chrome.
 *
 * The video modal hides the marquee, header, heat haze, sun-glow rays and
 * scroll indicator while it's open; this keeps that list in one place
 * instead of repeating several `getElementById(...).style.visibility = ...`
 * lines at each call site.
 */
const CHROME_IDS = ['marqueeBar', 'siteHeader', 'globalHeatHaze', 'globalSunGlow', 'scrollIndicator'];

export function setChromeVisible(visible) {
    const value = visible ? 'visible' : 'hidden';
    CHROME_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.style.visibility = value;
    });
    // `flex`, not `block`: the menu button is its own flex container now
    // (it lays out the three hamburger bars), so `block` would collapse them.
    const menuButton = document.getElementById('menuButton');
    if (menuButton) menuButton.style.display = visible ? 'flex' : 'none';
}
