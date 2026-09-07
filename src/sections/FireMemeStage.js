import { FIRE_STAGE_CHARACTERS } from '../data/fire-stage-characters.js';
import { SECTION_VIDEOS } from '../config/site.js';
import { CharacterVideo } from '../components/CharacterVideo.js';
import { renderList, $$ } from '../core/dom.js';
import { getEffectsContext } from '../core/audio-context.js';
import { playTone } from '../core/audio-nodes.js';

/* ==========================================================================
   SECTION — FIRE MEME STAGE
   Looping beach-bar footage with four hoverable characters composited on top
   (a callback to this section's original name — it no longer involves fire).
   ========================================================================== */

/** Soft ascending three-note chime played when a character is hovered. */
const CALLOUT_NOTES = [[587, 0], [740, 0.09], [880, 0.18]];

export function FireMemeStage() {
    const { id, src } = SECTION_VIDEOS.fireStage;
    return `
    <!-- ==================== SECTION: FIRE MEME STAGE — START ==================== -->
    <section class="fire-meme-stage" aria-label="Community">
        <div class="fire-meme-stage-content">
            <!-- In normal flow, so the video defines the section height. -->
            <div class="fire-meme-stage-video">
                <video id="${id}" autoplay muted loop playsinline>
                    <source src="${src}" type="video/mp4">
                </video>
            </div>

            ${renderList(FIRE_STAGE_CHARACTERS, CharacterVideo)}
        </div>
    </section>
    <!-- ==================== SECTION: FIRE MEME STAGE — END ==================== -->`;
}

function playCalloutJingle() {
    try {
        const ctx = getEffectsContext();
        CALLOUT_NOTES.forEach(([freq, delay]) => {
            playTone(ctx, ctx.destination, {
                freq,
                startTime: ctx.currentTime + delay,
                duration: 0.12,
                type: 'triangle',
                volume: 0.09,
            });
        });
    } catch {
        /* audio unavailable */
    }
}

export function initFireMemeStage() {
    $$('.character-video').forEach((character) => {
        const callout = character.querySelector('.character-callout');
        if (!callout) return;

        character.addEventListener('mouseenter', () => {
            callout.classList.add('is-active');
            playCalloutJingle();
        });

        character.addEventListener('mouseleave', () => {
            callout.classList.remove('is-active');
        });
    });
}
