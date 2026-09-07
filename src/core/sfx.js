import { getEffectsContext, closeEffectsContext } from './audio-context.js';
import { playTone, ENVELOPE } from './audio-nodes.js';

/**
 * User-interface sound effects.
 *
 * Built from `triangle`/`sine` tones rather than the harsher `square`/
 * `sawtooth` waveforms — softer, warmer "chime" character to match the site's
 * summer/lounge vibe instead of an 8-bit arcade one.
 *
 * Pitches/intervals/timing are deliberately original — not transcriptions of
 * any specific game's jingles — while keeping the same short, punchy feel:
 * rising = positive, falling = dismiss, quick multi-note = celebration.
 *
 * Every method is fire-and-forget and swallows its own errors: a blocked or
 * suspended AudioContext must never break an interaction.
 */

/** Schedule a note `delay` seconds from now on the shared effects context. */
function blip(ctx, freq, delay, duration, type = 'triangle', volume = 0.14) {
    playTone(ctx, ctx.destination, {
        freq,
        startTime: ctx.currentTime + delay,
        duration,
        type,
        volume,
        envelope: ENVELOPE.BLIP,
    });
}

/** Run `fn` with the effects context, ignoring audio failures. */
function withAudio(fn) {
    try {
        fn(getEffectsContext());
    } catch {
        /* audio unavailable — silence is an acceptable degradation */
    }
}

/** Play a sequence of `[freq, delaySeconds]` pairs with shared settings. */
function sequence(ctx, notes, duration, volume, type = 'triangle') {
    notes.forEach(([freq, delay]) => blip(ctx, freq, delay, duration, type, volume));
}

export const SFX = {
    /** Short chime as the season reel steps; pitch tracks the row index. */
    scroll(index = 0) {
        withAudio((ctx) => {
            const scale = [294, 330, 370, 392, 440, 494, 554, 587]; // D major run
            blip(ctx, scale[index % scale.length], 0, 0.1, 'triangle', 0.12);
        });
    },

    /** Rising chime — a selection was confirmed. */
    select() {
        withAudio((ctx) => {
            sequence(ctx, [[587, 0], [740, 0.09], [880, 0.18], [988, 0.30]], 0.16, 0.13);
            blip(ctx, 147, 0, 0.5, 'sine', 0.05);
        });
    },

    /** Tiny soft tick — one preload asset finished. */
    tick() {
        withAudio((ctx) => blip(ctx, 1400, 0, 0.035, 'sine', 0.035));
    },

    /** Warm ascending run — loading complete. */
    complete() {
        withAudio((ctx) => {
            sequence(
                ctx,
                [[440, 0.00], [554, 0.12], [659, 0.24], [880, 0.36], [1109, 0.50], [1319, 0.66]],
                0.18,
                0.13,
            );
            blip(ctx, 220, 0, 0.9, 'sine', 0.05);
        });
    },

    /** Three-note chime — the first click, which also unlocks browser audio. */
    coin() {
        withAudio((ctx) => {
            blip(ctx, 880, 0, 0.07, 'triangle', 0.15);
            blip(ctx, 1109, 0.07, 0.07, 'triangle', 0.15);
            blip(ctx, 1319, 0.14, 0.16, 'triangle', 0.15);
        });
    },

    /** Soft chime — generic hover. */
    hover() {
        withAudio((ctx) => blip(ctx, 740, 0, 0.045, 'sine', 0.04));
    },

    /** Two-note confirm — generic press. */
    press() {
        withAudio((ctx) => {
            blip(ctx, 494, 0, 0.06, 'triangle', 0.09);
            blip(ctx, 659, 0.06, 0.08, 'triangle', 0.09);
        });
    },

    /** Descending two-note — close / dismiss. */
    back() {
        withAudio((ctx) => {
            blip(ctx, 554, 0, 0.08, 'triangle', 0.07);
            blip(ctx, 330, 0.08, 0.10, 'triangle', 0.06);
        });
    },

    /**
     * Discard the effects context so notes scheduled during the intro don't
     * fire once the user starts interacting. The context is lazily rebuilt.
     */
    reset() {
        closeEffectsContext();
    },
};
