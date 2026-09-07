import { SECTION_VIDEOS } from '../config/site.js';
import { BGM } from '../core/bgm.js';

/* ==========================================================================
   SECTION — TUB SCENE
   Full-bleed looping video: Chad relaxing in a hot tub with a toy yacht
   floating on the water. A second gif (the yacht, full of partying meme
   animals) floats on top of the water as a real overlay — not baked into
   the footage — so it can be repositioned without regenerating the video.
   Clicking the boat zooms the whole scene in on it (camera-style, via a
   scaled `transform-origin` centred on the boat) and swaps the background
   music for the "boat party" loop (`data/party-track.js`); clicking again
   zooms back out and returns to the main loop. Its audio fades in as it
   reaches the middle of the viewport; see `features/section-video-audio.js`.

   Formerly a living-room/gaming scene (ALTSZN-era); replaced for ALTSUMR.
   ========================================================================== */

export function TubScene() {
    const { id, src } = SECTION_VIDEOS.tubScene;
    return `
    <!-- ==================== SECTION: TUB SCENE — START ==================== -->
    <section class="tub-scene" aria-label="Chad's tub">
        <div class="tub-scene-stage" id="tubSceneStage">
            <div class="tub-scene-video">
                <video id="${id}" autoplay muted loop playsinline>
                    <source src="${src}" type="video/mp4">
                </video>
            </div>

            <button type="button" class="btn-reset tub-scene-boat" id="tubSceneBoat" aria-label="Zoom in on the toy yacht">
                <img src="images/section05_boat.gif" alt="">
            </button>
        </div>
    </section>
    <!-- ==================== SECTION: TUB SCENE — END ==================== -->`;
}

export function initTubScene() {
    const stage = document.getElementById('tubSceneStage');
    const boat = document.getElementById('tubSceneBoat');
    if (!stage || !boat) return;

    boat.addEventListener('click', () => {
        const isZoomed = stage.classList.toggle('is-zoomed');
        if (isZoomed) {
            BGM.startParty();
        } else {
            BGM.stopParty();
        }
    });
}
