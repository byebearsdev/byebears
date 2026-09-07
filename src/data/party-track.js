/**
 * Loop data for the "boat party" music — swapped in by `core/bgm.js` while
 * the tub-scene boat is zoomed in (see `sections/TubScene.js`), replacing
 * the main lounge loop for as long as it's zoomed.
 *
 * Faster and denser than the main loop (124 BPM four-on-the-floor vs. 96 BPM
 * one-drop) so it reads as a clear mood shift, not just the same song sped
 * up: different key (G–Em–C–D instead of C–G–Am–F), busier eighth-note
 * melody, kick on every beat.
 *
 * Same shape as `bgm-track.js`: four 16-step bars (one per chord) repeated
 * twice = 128 sixteenth-notes. `_` is a rest.
 */

const _ = 0;

export const BPM = 124;

/** Lead line — bouncy eighth-note riff, one shape per chord. */
const MELODY_BAR_G  = [587, _, 494, _, 392, _, 494, _,  587, _, 494, _, 392, _, 494, _];
const MELODY_BAR_EM = [494, _, 392, _, 330, _, 392, _,  494, _, 392, _, 330, _, 392, _];
const MELODY_BAR_C  = [523, _, 659, _, 784, _, 659, _,  523, _, 659, _, 784, _, 659, _];
const MELODY_BAR_D  = [587, _, 740, _, 880, _, 740, _,  587, _, 740, _, 880, _, 740, _];

export const MELODY = [
    ...MELODY_BAR_G, ...MELODY_BAR_EM, ...MELODY_BAR_C, ...MELODY_BAR_D,
    ...MELODY_BAR_G, ...MELODY_BAR_EM, ...MELODY_BAR_C, ...MELODY_BAR_D,
];

/** Off-beat stabs — the chord's fifth, busier than the main loop's. */
const HARMONY_BAR_G  = [_, _, 587, _, _, _, 587, _,  _, _, 587, _, _, _, 587, _];
const HARMONY_BAR_EM = [_, _, 494, _, _, _, 494, _,  _, _, 494, _, _, _, 494, _];
const HARMONY_BAR_C  = [_, _, 784, _, _, _, 784, _,  _, _, 784, _, _, _, 784, _];
const HARMONY_BAR_D  = [_, _, 880, _, _, _, 880, _,  _, _, 880, _, _, _, 880, _];

export const HARMONY = [
    ...HARMONY_BAR_G, ...HARMONY_BAR_EM, ...HARMONY_BAR_C, ...HARMONY_BAR_D,
    ...HARMONY_BAR_G, ...HARMONY_BAR_EM, ...HARMONY_BAR_C, ...HARMONY_BAR_D,
];

/** Root notes on every beat — four-on-the-floor pulse. */
const BASS_BAR_G  = [98,  _, _, _, 98,  _, _, _,  98,  _, _, _, 98,  _, _, _];
const BASS_BAR_EM = [82,  _, _, _, 82,  _, _, _,  82,  _, _, _, 82,  _, _, _];
const BASS_BAR_C  = [131, _, _, _, 131, _, _, _,  131, _, _, _, 131, _, _, _];
const BASS_BAR_D  = [147, _, _, _, 147, _, _, _,  147, _, _, _, 147, _, _, _];

export const BASS = [
    ...BASS_BAR_G, ...BASS_BAR_EM, ...BASS_BAR_C, ...BASS_BAR_D,
    ...BASS_BAR_G, ...BASS_BAR_EM, ...BASS_BAR_C, ...BASS_BAR_D,
];

/**
 * Percussion grid — kick on every beat, backbeat snare, shaker on the offs.
 *   K = kick, s = snare/rim, h = shaker tick, c = soft crash, _ = rest.
 */
const DRUMS_BAR = ['K', '_', 'h', '_',  's', '_', 'h', '_',  'K', '_', 'h', '_',  's', '_', 'h', '_'];
const DRUMS_BAR_FINAL = ['K', '_', 'h', '_',  's', '_', 'h', '_',  'K', '_', 'h', '_',  's', '_', 'h', 'c'];

export const DRUMS = [
    ...DRUMS_BAR, ...DRUMS_BAR, ...DRUMS_BAR, ...DRUMS_BAR,
    ...DRUMS_BAR, ...DRUMS_BAR, ...DRUMS_BAR, ...DRUMS_BAR_FINAL,
];
