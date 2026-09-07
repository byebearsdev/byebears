import { BGM } from '../core/bgm.js';
import { SFX } from '../core/sfx.js';

/* ==========================================================================
   CHROME BUTTONS
   The two fixed controls in the top-right corner. Both start hidden:
   the menu button is revealed once loading completes, and the music toggle
   only once the soundtrack actually starts.
   ========================================================================== */

/** Mute / unmute the chiptune soundtrack. */
export function BgmToggle() {
    return `
    <!-- ==================== CHROME: MUSIC TOGGLE ==================== -->
    <button type="button" class="btn-reset chrome-button bgm-toggle" id="bgmToggle" title="Toggle Music" aria-label="Toggle music">
        <span class="bgm-note-icon" aria-hidden="true">♫</span>
    </button>`;
}

/** Opens the arcade menu; the menu itself owns the click handler. */
export function MenuButton() {
    return `
    <!-- ==================== CHROME: MENU BUTTON ==================== -->
    <button type="button" class="btn-reset chrome-button menu-button" id="menuButton" aria-label="Open menu">
        <span class="menu-button-line"></span>
        <span class="menu-button-line"></span>
        <span class="menu-button-line"></span>
    </button>`;
}

export function initChromeButtons() {
    const toggle = document.getElementById('bgmToggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        SFX.press();
        BGM.toggleMute();
    });

    // The toggle is pointless until there is music to mute, so it stays hidden
    // until the engine reports that it has started.
    BGM.onChange(({ started, muted }) => {
        toggle.style.display = started ? 'flex' : 'none';
        toggle.classList.toggle('is-muted', muted);
        toggle.title = muted ? 'Unmute Music' : 'Mute Music';
    });
}
