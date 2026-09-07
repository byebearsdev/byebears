/**
 * Shared Web Audio plumbing.
 *
 * Before the refactor the page created four independent AudioContexts (sound
 * effects, background music, scroll whoosh, GIF callout) and repeated the same
 * "register a warm-up callback" boilerplate at each one. Everything except the
 * music engine now shares a single effects context; the music engine keeps its
 * own because it owns a persistent master-gain node for the mute toggle.
 */

const AudioContextCtor = window.AudioContext || window.webkitAudioContext;

/** Callbacks that (re)create and resume an AudioContext. */
const warmups = new Set();

let effectsContext = null;
let silentPrimer = null;

/**
 * The shared context for one-shot sound effects.
 * Recreated automatically if it was closed by `closeEffectsContext()`.
 */
export function getEffectsContext() {
    if (!effectsContext || effectsContext.state === 'closed') {
        effectsContext = new AudioContextCtor();
    }
    if (effectsContext.state === 'suspended') effectsContext.resume();
    return effectsContext;
}

/**
 * Tear down the effects context so any notes already scheduled on it are
 * discarded. Used between the intro animation and the loading screen.
 */
export function closeEffectsContext() {
    if (!effectsContext) return;
    try {
        effectsContext.close();
    } catch {
        /* already closed */
    }
    effectsContext = null;
}

/** Register a callback that pre-creates/resumes an audio context. */
export function registerWarmup(fn) {
    warmups.add(fn);
}

/** Run every registered warm-up. Safe to call as often as you like. */
export function runWarmups() {
    warmups.forEach((fn) => {
        try {
            fn();
        } catch {
            /* a dead context must not block the others */
        }
    });
    try {
        if (silentPrimer && silentPrimer.paused) silentPrimer.play().catch(() => {});
    } catch {
        /* ignore */
    }
}

/**
 * iOS silent-switch / low-power workaround.
 *
 * Playing a looping zero-volume (but *unmuted*) clip engages the media session,
 * which stops Safari from blocking later <audio> playback when the hardware
 * mute switch is on. Must be called from inside a user gesture.
 */
export function primeSilentAudio() {
    if (silentPrimer) return;
    try {
        // 44-byte silent WAV.
        const audio = new Audio(
            'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
        );
        audio.loop = true;
        audio.volume = 0;
        audio.muted = false; // Must NOT be muted, or the media session won't engage.
        audio.setAttribute('playsinline', '');
        audio.setAttribute('webkit-playsinline', '');
        audio.play().catch(() => {});
        silentPrimer = audio;
    } catch {
        /* no-op */
    }
}

/**
 * Keep audio alive on mobile.
 *
 * Mobile and in-app browsers (iOS Safari, Chrome Android, Instagram/X/Telegram
 * webviews) suspend AudioContexts after ~30s idle, when the tab loses focus,
 * and sometimes immediately on creation. Re-running every warm-up on any user
 * interaction and on visibility changes is the single biggest reliability win
 * for "sound doesn't work on my phone".
 */
export function initAudioResumer() {
    ['touchstart', 'touchend', 'click', 'keydown', 'pointerdown'].forEach((event) => {
        document.addEventListener(event, runWarmups, { capture: true, passive: true });
    });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) runWarmups();
    });
    window.addEventListener('pageshow', runWarmups);
    window.addEventListener('focus', runWarmups);
}

// The effects context itself is always warm-able.
registerWarmup(getEffectsContext);
