import { SFX } from '../core/sfx.js';

/* ==========================================================================
   FEATURE — GLOBAL SFX DISPATCHER

   Gives every interactive element a hover blip and a click press sound,
   without each component wiring up its own.

   Listens in the capture phase so the sound still fires when a handler calls
   `stopPropagation()`. Anything that already plays a bespoke sound is listed
   in `CUSTOM_CLICK_SFX` and skipped here, so nothing double-triggers.
   ========================================================================== */

const INTERACTIVE = [
    'button',
    'a[href]',
    '.menu-button',
    '.bgm-toggle',
    '.snack-item',
].join(',');

/** Elements whose own handlers already play a sound on click. */
const CUSTOM_CLICK_SFX = [
    '#lairBtn',               // SFX.coin()
    '#phoneCopyCa',           // SFX.select()
    '#bgmToggle',             // SFX.press()
    '.snack-item',            // SFX.select() via the popup
    '.terminal-popup-close',  // SFX.back()
    '.arcade-menu-close',     // SFX.back()
    '#videoModalClose',       // SFX.back()
    '#gameModalClose',        // SFX.back()
    '#sandcastleBearMound',   // SFX.press()/SFX.select() in initSandcastleBear()
    '#sandcastleBearFace',    // SFX.select() in initSandcastleBear()
    '#phoneMenuIceberg',      // SFX.press()/SFX.select() in initIcebergGame()
].join(',');

/** Minimum gap between hover blips, so sweeping the cursor doesn't chatter. */
const HOVER_THROTTLE_MS = 80;

export function initGlobalSfx() {
    let lastHovered = null;
    let lastHoverAt = 0;

    document.body.addEventListener('mouseover', (event) => {
        const el = event.target.closest(INTERACTIVE);
        if (!el || el === lastHovered) return;

        // Arcade-menu entries play their own hover tick.
        if (el.closest('#arcadeMenuItems')) return;

        lastHovered = el;

        const now = Date.now();
        if (now - lastHoverAt < HOVER_THROTTLE_MS) return;
        lastHoverAt = now;

        SFX.hover();
    }, true);

    document.body.addEventListener('mouseout', (event) => {
        if (event.target.closest(INTERACTIVE) === lastHovered) lastHovered = null;
    }, true);

    document.body.addEventListener('click', (event) => {
        const el = event.target.closest(INTERACTIVE);
        if (!el) return;
        if (el.closest('#arcadeMenuItems')) return;
        if (el.matches(CUSTOM_CLICK_SFX)) return;

        SFX.press();
    }, true);
}
