import { PRELOAD_IMAGES, PRELOAD_VIDEOS, LOADING_TIMEOUT_MS } from '../data/preload-assets.js';
import { ANNOUNCE_AUDIO, CHEER_AUDIO, VICTORY_AUDIO } from '../config/site.js';
import { BGM } from '../core/bgm.js';

/* ==========================================================================
   OVERLAY — LOADING SCREEN  (silent preloader, no visible UI)

   Preloads the first screens' assets in the background — no progress bar or
   branding shown, just a plain hold on a blank page — then reveals it and
   plays the announcement, then the two cheers back to back (with the
   victory stinger overlapping the cheers, not queued after them) before
   starting the soundtrack.
   ========================================================================== */

/** Pause on a full bar before revealing, so the fanfare lands. */
const REVEAL_DELAY_MS = 900;

export function LoadingScreen() {
    const cheerTags = CHEER_AUDIO
        .map(({ id, src }) => `<audio id="${id}" src="${encodeURI(src)}" preload="auto"></audio>`)
        .join('\n    ');

    return `
    <!-- ==================== OVERLAY: LOADING SCREEN — START ==================== -->
    <!-- Announcement + cheers, played back to back once the page is revealed.
         victoryStinger starts alongside the cheers, not after them. -->
    <audio id="${ANNOUNCE_AUDIO.id}" src="${encodeURI(ANNOUNCE_AUDIO.src)}" preload="auto"></audio>
    ${cheerTags}
    <audio id="${VICTORY_AUDIO.id}" src="${encodeURI(VICTORY_AUDIO.src)}" preload="auto"></audio>
    <!-- ==================== OVERLAY: LOADING SCREEN — END ==================== -->`;
}

/**
 * Play one `<audio>` element to completion, then resolve.
 *
 * Three independent paths lead to resolving, because `ended` is not reliable
 * across browsers: the event itself, a duration-based safety timer, and an
 * immediate fallback if playback was rejected outright. `finishOnce` makes
 * them idempotent.
 */
function playClip(id, startAt = 0) {
    return new Promise((resolve) => {
        const audio = document.getElementById(id);
        if (!audio) {
            resolve();
            return;
        }

        let done = false;
        const finishOnce = () => {
            if (done) return;
            done = true;
            resolve();
        };

        // Seeking past silent leaders only sticks once metadata is loaded —
        // preload="auto" means that's almost always already true by now, but
        // fall back to waiting for it rather than silently skipping the trim.
        const seekAndPlay = () => {
            audio.currentTime = startAt;
            audio.volume = 1;
            audio.play()
                .then(() => {
                    const remainingMs = Math.max((audio.duration || 3) - startAt, 0.3) * 1000;
                    setTimeout(finishOnce, remainingMs + 1000);
                })
                .catch(finishOnce);
        };

        audio.addEventListener('ended', finishOnce, { once: true });

        if (audio.readyState >= 1) {
            seekAndPlay();
        } else {
            audio.addEventListener('loadedmetadata', seekAndPlay, { once: true });
        }
    });
}

/**
 * Play the announcement, then both cheers in order (starting the victory
 * stinger alongside the cheers — not awaited, so it overlaps them rather than
 * queuing after), then start the music.
 */
async function playIntroClipsThenMusic() {
    await playClip(ANNOUNCE_AUDIO.id, ANNOUNCE_AUDIO.startAt);

    playClip(VICTORY_AUDIO.id, VICTORY_AUDIO.startAt);

    for (const clip of CHEER_AUDIO) {
        await playClip(clip.id, clip.startAt);
    }
    BGM.start();
}

/**
 * @param {() => void} onReveal runs when the page becomes visible
 * @returns {{ start: () => void }}
 */
export function initLoadingScreen(onReveal) {
    let revealed = false;

    function reveal() {
        if (revealed) return;
        revealed = true;

        onReveal();
        playIntroClipsThenMusic();
    }

    function finish() {
        setTimeout(reveal, REVEAL_DELAY_MS);
    }

    function start() {
        const total = PRELOAD_IMAGES.length + PRELOAD_VIDEOS.length;
        let loaded = 0;

        // Errors count as progress too — a missing asset must not stall the reveal.
        function advance() {
            loaded++;
            if (loaded >= total) finish();
        }

        PRELOAD_IMAGES.forEach((src) => {
            const img = new Image();
            img.onload = advance;
            img.onerror = advance;
            img.src = src;
        });

        PRELOAD_VIDEOS.forEach((src) => {
            const video = document.createElement('video');
            video.preload = 'auto';
            video.oncanplaythrough = advance;
            video.onerror = advance;
            video.src = src;
            video.load();
        });

        // Hard ceiling in case an asset never resolves either way.
        setTimeout(finish, LOADING_TIMEOUT_MS);
    }

    return { start };
}
