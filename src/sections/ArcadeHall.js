import { SECTION_VIDEOS } from '../config/site.js';
import { SandcastleBear, initSandcastleBear } from '../components/SandcastleBear.js';

/* ==========================================================================
   SECTION — ARCADE HALL
   Chad and the buried-bear sandcastle easter egg, over looping beach footage.

   Formerly featured two playable arcade cabinets (Street Fighter II,
   Centipede); those — and the game/video-modal launch logic that only they
   used — were removed when the section's background switched to a beach
   scene. The class/file names still say "arcade hall" though; renaming them
   was left out of scope for this pass.
   ========================================================================== */

const PIXEL_MOTE_COUNT = 50;
const MOTE_COLORS = ['#ff6b00', '#00ff88', '#ffd700', '#ff00ff', '#00ffff', '#ffffff'];

export function ArcadeHall() {
    const { id, src } = SECTION_VIDEOS.arcadeHall;
    return `
    <!-- ==================== SECTION: ARCADE HALL — START ==================== -->
    <section class="arcade-hall" aria-label="Beach">
        <!-- In normal flow, so the video defines the section height. -->
        <div class="arcade-hall-video">
            <video id="${id}" autoplay muted loop playsinline>
                <source src="${src}" type="video/mp4">
            </video>
        </div>

        <div class="arcade-hall-overlay">
            <div class="arcade-hall-tint" aria-hidden="true"></div>

            <div class="arcade-hall-stage">
                <div class="pixel-field" id="pixelField" aria-hidden="true"></div>

                <div class="arcade-scene">
                    <div class="arcade-chad">
                        <img src="images/chad.png" alt="$BYEBEARS Chad">
                    </div>

                    ${SandcastleBear()}
                </div>
            </div>
        </div>
    </section>
    <!-- ==================== SECTION: ARCADE HALL — END ==================== -->`;
}

/** Scatter drifting pixel motes across the stage. */
function createPixelMotes() {
    const field = document.getElementById('pixelField');
    if (!field) return;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < PIXEL_MOTE_COUNT; i++) {
        const mote = document.createElement('div');
        mote.className = 'pixel-mote';
        mote.style.left = `${Math.random() * 100}%`;
        mote.style.top = `${Math.random() * 100}%`;
        mote.style.backgroundColor = MOTE_COLORS[Math.floor(Math.random() * MOTE_COLORS.length)];
        mote.style.animationDelay = `${Math.random() * 8}s`;
        mote.style.animationDuration = `${5 + Math.random() * 5}s`;
        fragment.appendChild(mote);
    }
    field.appendChild(fragment);
}

export function initArcadeHall() {
    createPixelMotes();
    initSandcastleBear();
}
