import { BGM } from '../core/bgm.js';
import { SFX } from '../core/sfx.js';

/* ==========================================================================
   OVERLAY — GAME MODAL
   Fullscreen iframe for the embedded arcade game.
   ========================================================================== */

export function GameModal() {
    return `
    <!-- ==================== OVERLAY: GAME MODAL — START ==================== -->
    <div class="game-modal" id="gameModal" role="dialog" aria-modal="true" aria-label="Game player">
        <span class="game-modal-title" id="gameModalTitle"></span>
        <button type="button" class="modal-close-btn" id="gameModalClose">EXIT</button>
        <iframe id="gameModalFrame" title="Arcade game" allowfullscreen></iframe>
    </div>
    <!-- ==================== OVERLAY: GAME MODAL — END ==================== -->`;
}

export function openGameModal(src, title) {
    const modal = document.getElementById('gameModal');
    if (!modal) return;

    BGM.pause();

    document.getElementById('gameModalFrame').src = src;
    document.getElementById('gameModalTitle').textContent = title ?? '';
    modal.classList.add('is-open');
}

export function closeGameModal() {
    const modal = document.getElementById('gameModal');
    if (!modal || !modal.classList.contains('is-open')) return;

    SFX.back();
    BGM.resume();

    // Clearing src unloads the game so it stops running in the background.
    document.getElementById('gameModalFrame').src = '';
    modal.classList.remove('is-open');

    // The embedded game may have requested fullscreen on its own.
    if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

export function initGameModal() {
    document.getElementById('gameModalClose')?.addEventListener('click', closeGameModal);
}
