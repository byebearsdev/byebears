import { BGM } from '../core/bgm.js';
import { SFX } from '../core/sfx.js';
import { setChromeVisible } from '../core/dom.js';

/* ==========================================================================
   OVERLAY — VIDEO MODAL
   Fullscreen player for the cabinet demo videos.
   ========================================================================== */

export function VideoModal() {
    return `
    <!-- ==================== OVERLAY: VIDEO MODAL — START ==================== -->
    <div class="video-modal" id="videoModal" role="dialog" aria-modal="true" aria-label="Video player">
        <div class="video-modal-ui">
            <span class="video-modal-title" id="videoModalTitle"></span>
            <button type="button" class="modal-close-btn" id="videoModalClose">EXIT</button>
        </div>
        <video id="videoModalPlayer" playsinline></video>
    </div>
    <!-- ==================== OVERLAY: VIDEO MODAL — END ==================== -->`;
}

export function openVideoModal(src, title) {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoModalPlayer');
    if (!modal || !player) return;

    BGM.pause();

    player.src = src;
    document.getElementById('videoModalTitle').textContent = title ?? '';

    // Hide the page chrome before the modal fades in, so nothing shows through.
    setChromeVisible(false);

    modal.classList.add('is-open');
    player.play().catch(() => {});
}

export function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoModalPlayer');
    if (!modal || !modal.classList.contains('is-open')) return;

    SFX.back();
    BGM.resume();

    player.pause();
    player.src = '';
    modal.classList.remove('is-open');
    setChromeVisible(true);

    // Belt and braces — the modal never requests fullscreen, but exit anyway.
    if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
    }
}

export function initVideoModal() {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoModalPlayer');
    if (!modal || !player) return;

    document.getElementById('videoModalClose').addEventListener('click', closeVideoModal);
    player.addEventListener('ended', closeVideoModal);

    // Click the black area around the video to dismiss.
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeVideoModal();
    });
}
