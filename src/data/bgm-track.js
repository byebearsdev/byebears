/**
 * Loop data for the background music engine — a slow, sparse tropical-lounge
 * groove (C–G–Am–F, the classic "warm pop" progression) rather than the
 * original chiptune boss-battle track.
 *
 * Every voice is 128 sixteenth-notes long (32 beats ≈ 20s at 96 BPM), written
 * as four 16-step bars (one per chord) repeated twice. `_` is a rest. Lots of
 * rests on purpose — the whole point is space, not density.
 */

const _ = 0;

export const BPM = 96;

/** Lead line — triangle, steel-drum-ish. One relaxed 4-note figure per chord. */
const MELODY_BAR_C  = [784, _, _, 659,  _, _, 523, _,   _, 659, _, 784,  _, _, _, _];
const MELODY_BAR_G  = [587, _, _, 494,  _, _, 392, _,   _, 494, _, 587,  _, _, _, _];
const MELODY_BAR_AM = [659, _, _, 523,  _, _, 440, _,   _, 523, _, 659,  _, _, _, _];
const MELODY_BAR_F  = [523, _, _, 440,  _, _, 349, _,   _, 440, _, 523,  _, _, _, _];

export const MELODY = [
    ...MELODY_BAR_C, ...MELODY_BAR_G, ...MELODY_BAR_AM, ...MELODY_BAR_F,
    ...MELODY_BAR_C, ...MELODY_BAR_G, ...MELODY_BAR_AM, ...MELODY_BAR_F,
];

/** Off-beat "skank" chord stabs — triangle, the chord's third each bar. */
const HARMONY_BAR_C  = [_, _, 330, _,  _, _, 330, _,   _, _, 330, _,  _, _, 330, _];
const HARMONY_BAR_G  = [_, _, 247, _,  _, _, 247, _,   _, _, 247, _,  _, _, 247, _];
const HARMONY_BAR_AM = [_, _, 262, _,  _, _, 262, _,   _, _, 262, _,  _, _, 262, _];
const HARMONY_BAR_F  = [_, _, 220, _,  _, _, 220, _,   _, _, 220, _,  _, _, 220, _];

export const HARMONY = [
    ...HARMONY_BAR_C, ...HARMONY_BAR_G, ...HARMONY_BAR_AM, ...HARMONY_BAR_F,
    ...HARMONY_BAR_C, ...HARMONY_BAR_G, ...HARMONY_BAR_AM, ...HARMONY_BAR_F,
];

/** Root notes only, on beats 1 and 3 — sine, deep and out of the way. */
const BASS_BAR_C  = [131, _, _, _,  _, _, _, _,  131, _, _, _,  _, _, _, _];
const BASS_BAR_G  = [98,  _, _, _,  _, _, _, _,  98,  _, _, _,  _, _, _, _];
const BASS_BAR_AM = [110, _, _, _,  _, _, _, _,  110, _, _, _,  _, _, _, _];
const BASS_BAR_F  = [88,  _, _, _,  _, _, _, _,  88,  _, _, _,  _, _, _, _];

export const BASS = [
    ...BASS_BAR_C, ...BASS_BAR_G, ...BASS_BAR_AM, ...BASS_BAR_F,
    ...BASS_BAR_C, ...BASS_BAR_G, ...BASS_BAR_AM, ...BASS_BAR_F,
];

/**
 * Percussion grid — a laid-back one-drop-ish groove instead of a wall of
 * 16th notes.
 *   K = kick, s = soft snare/rim, h = shaker tick, c = soft crash, _ = rest.
 */
const DRUMS_BAR = ['K', '_', '_', '_',  's', '_', 'h', '_',  'K', '_', '_', '_',  's', '_', 'h', '_'];
const DRUMS_BAR_FINAL = ['K', '_', '_', '_',  's', '_', 'h', '_',  'K', '_', '_', '_',  's', '_', 'h', 'c'];

export const DRUMS = [
    ...DRUMS_BAR, ...DRUMS_BAR, ...DRUMS_BAR, ...DRUMS_BAR,
    ...DRUMS_BAR, ...DRUMS_BAR, ...DRUMS_BAR, ...DRUMS_BAR_FINAL,
];
