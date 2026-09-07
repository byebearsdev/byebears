import { SFX } from '../core/sfx.js';

/* ==========================================================================
   OVERLAY — DESKTOP-ONLY NOTICE
   Shown instead of launching an iframe game on touch or small screens.
   ========================================================================== */

export function DesktopOnlyNotice() {
    return `
    <!-- ==================== OVERLAY: DESKTOP-ONLY NOTICE — START ==================== -->
    <div class="desktop-only-overlay" id="desktopOnlyOverlay">
        <div class="desktop-only-box" role="dialog" aria-modal="true" aria-label="Desktop only">
            <button type="button" class="desktop-only-close" aria-label="Close">✕</button>
            <div class="desktop-only-icon" aria-hidden="true">🖥️</div>
            <div class="desktop-only-title">DESKTOP ONLY</div>
            <div class="desktop-only-game" id="desktopOnlyGame"></div>
            <div class="desktop-only-msg">
                THIS GAME REQUIRES<br>
                A KEYBOARD + BIG SCREEN.<br><br>
                OPEN THIS SITE ON A<br>
                PC OR LAPTOP TO PLAY.
            </div>
            <button type="button" class="desktop-only-ok">▶ OK ◀</button>
        </div>
    </div>
    <!-- ==================== OVERLAY: DESKTOP-ONLY NOTICE — END ==================== -->`;
}

export function showDesktopOnlyNotice(gameName) {
    const overlay = document.getElementById('desktopOnlyOverlay');
    if (!overlay) return;

    document.getElementById('desktopOnlyGame').textContent = gameName;
    overlay.classList.add('is-open');
}

function close() {
    const overlay = document.getElementById('desktopOnlyOverlay');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    SFX.back();
}

export function initDesktopOnlyNotice() {
    const overlay = document.getElementById('desktopOnlyOverlay');
    if (!overlay) return;

    overlay.querySelector('.desktop-only-close').addEventListener('click', close);
    overlay.querySelector('.desktop-only-ok').addEventListener('click', close);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) close();
    });
}
