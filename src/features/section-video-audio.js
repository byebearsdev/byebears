import { SECTION_VIDEOS } from '../config/site.js';

/* ==========================================================================
   FEATURE — BACKGROUND VIDEO AUDIO ON SCROLL

   Each background video fades its audio in as its section reaches the middle
   of the viewport, and back out as it leaves.

   Two observers per video, deliberately:
     1. PLAYBACK — a wide margin that simply keeps the video *playing* whenever
        it is anywhere near the viewport. Mobile browsers suspend off-screen
        video, and without this a section can stay frozen after you scroll back.
     2. AUDIO — a narrower, centred trigger that controls volume only. Skipped
        entirely for entries with `audio: false` — those videos still play,
        just permanently muted (fire-meme-stage and phone-menu, so the
        background loop is the only audio in those sections).

   Playback is always (re)started muted and only unmuted once it is actually
   running: iOS Safari rejects `play()` outright when audio is enabled outside
   a user gesture.
   ========================================================================== */

const TARGET_VOLUME = 0.55;
const FADE_IN_MS = 700;
const FADE_OUT_MS = 500;
const FADE_STEPS = 30;

/** Per-section audio trigger geometry. */
const AUDIO_TRIGGERS = [
    { video: SECTION_VIDEOS.arcadeHall, selector: '.arcade-hall',      threshold: 0.25, rootMargin: '0px' },
    { video: SECTION_VIDEOS.fireStage,  selector: '.fire-meme-stage',  threshold: 0.25, rootMargin: '0px', audio: false },
    { video: SECTION_VIDEOS.snackTable, selector: '#snackTable',       threshold: 0,    rootMargin: '-30% 0px -30% 0px' },
    { video: SECTION_VIDEOS.tubScene,   selector: '.tub-scene',        threshold: 0,    rootMargin: '-30% 0px -30% 0px' },
    { video: SECTION_VIDEOS.phoneMenu,  selector: '.phone-menu',       threshold: 0,    rootMargin: '-30% 0px -30% 0px', audio: false },
    { video: SECTION_VIDEOS.disclaimerPanel, selector: '.disclaimer-panel', threshold: 0.25, rootMargin: '0px', audio: false },
];

const fadeTimers = new Map();

/** Ramp a video's volume, cancelling any fade already in flight for it. */
function fadeTo(video, target, durationMs) {
    const existing = fadeTimers.get(video.id);
    if (existing) {
        clearInterval(existing);
        fadeTimers.delete(video.id);
    }

    const start = video.volume;
    const delta = target - start;

    if (Math.abs(delta) < 0.01) {
        video.volume = target;
        if (target === 0) video.muted = true;
        return;
    }

    let step = 0;
    const timer = setInterval(() => {
        step++;
        video.volume = Math.min(1, Math.max(0, start + delta * (step / FADE_STEPS)));
        if (step >= FADE_STEPS) {
            clearInterval(timer);
            fadeTimers.delete(video.id);
            if (target === 0) video.muted = true;
        }
    }, durationMs / FADE_STEPS);

    fadeTimers.set(video.id, timer);
}

function observeSection({ video: videoConfig, selector, threshold, rootMargin, audio = true }, root) {
    const video = document.getElementById(videoConfig.id);
    const section = document.querySelector(selector);
    if (!video || !section) return;

    function playMuted() {
        video.muted = true;
        video.play().catch(() => {});
    }

    // If the browser paused a video that should be running, restart it.
    video.addEventListener('pause', () => {
        if (video.dataset.shouldPlay === 'true' && !video.ended) playMuted();
    });

    // 1. Playback — wide margin, keeps the video alive near the viewport.
    new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                video.dataset.shouldPlay = 'true';
                if (video.paused) playMuted();
            } else {
                video.dataset.shouldPlay = 'false';
                // Silence but don't pause — pausing forces a re-buffer on scroll-back.
                fadeTo(video, 0, 300);
            }
        });
    }, { root, threshold: 0, rootMargin: '50% 0px 50% 0px' }).observe(section);

    if (!audio) return;

    // 2. Audio — narrow, centred trigger.
    new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (video.paused) playMuted();
                video.muted = false;
                fadeTo(video, TARGET_VOLUME, FADE_IN_MS);
            } else {
                fadeTo(video, 0, FADE_OUT_MS);
            }
        });
    }, { root, threshold, rootMargin }).observe(section);
}

/**
 * Wire up the observers.
 *
 * Called only after the loading screen clears, so the intro sequence can't
 * trigger a section's audio before the visitor has seen the page.
 */
export function initSectionVideoAudio() {
    const root = document.getElementById('scrollContainer');
    AUDIO_TRIGGERS.forEach((config) => observeSection(config, root));
}
