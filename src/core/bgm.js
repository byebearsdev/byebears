import { registerWarmup } from './audio-context.js';
import { playTone, playNoise, ENVELOPE } from './audio-nodes.js';
import * as MAIN_TRACK from '../data/bgm-track.js';
import * as PARTY_TRACK from '../data/party-track.js';

/**
 * Background music engine — synthesises the tropical-lounge loop in
 * `bgm-track.js`. Triangle/sine voices throughout (no square/sawtooth) for a
 * warm, soft character instead of the original chiptune sound.
 *
 * Also plays a second loop, `data/party-track.js` — a faster, denser "boat
 * party" track swapped in via `startParty()`/`stopParty()` while the
 * tub-scene boat is zoomed in (see `sections/TubScene.js`). Both loops share
 * the same AudioContext/master gain, so muting affects either one.
 *
 * Keeps its own AudioContext (rather than sharing the effects one) because it
 * owns a persistent master-gain node that the mute toggle drives.
 *
 * Pause/resume are *stackable*: the video modal, the game modal and the two
 * full-screen video sections can each independently ask for silence, and the
 * music only comes back once every one of them has released its pause.
 */

const AudioContextCtor = window.AudioContext || window.webkitAudioContext;

const MASTER_VOLUME = 0.15;

let ctx = null;
let masterGain = null;

let playing = false;
let started = false;
let muted = false;
let pauseCount = 0;
let loopTimer = null;
let scheduled = [];
let activeTrack = MAIN_TRACK;

/** Subscribers notified whenever `started`/`muted` change. */
const listeners = new Set();

function emit() {
    listeners.forEach((fn) => fn({ started, muted }));
}

function getCtx() {
    if (!ctx) {
        ctx = new AudioContextCtor();
        masterGain = ctx.createGain();
        masterGain.gain.value = muted ? 0 : MASTER_VOLUME;
        masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
}

function note(freq, startTime, duration, type, volume) {
    const osc = playTone(getCtx(), masterGain, {
        freq, startTime, duration, type, volume, envelope: ENVELOPE.MUSIC,
    });
    if (osc) scheduled.push(osc);
}

function noise(startTime, duration, volume, highpass = 7000) {
    scheduled.push(playNoise(getCtx(), masterGain, { startTime, duration, volume, highpass }));
}

/** Sine thump — soft, round, no digital click layer. */
function kick(startTime, heavy) {
    const ac = getCtx();

    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(masterGain);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(heavy ? 130 : 110, startTime);
    osc.frequency.exponentialRampToValueAtTime(35, startTime + 0.1);
    gain.gain.setValueAtTime(heavy ? 0.16 : 0.11, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.16);
    osc.start(startTime);
    osc.stop(startTime + 0.17);
    osc.onended = () => { try { gain.disconnect(); osc.disconnect(); } catch { /* torn down */ } };
    scheduled.push(osc);
}

/** Soft brushed crash — noise plus a low triangle rumble underneath. */
function crash(startTime) {
    const ac = getCtx();
    noise(startTime, 0.5, 0.045, 3500);

    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(masterGain);
    osc.type = 'triangle';
    osc.frequency.value = 100;
    gain.gain.setValueAtTime(0.025, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
    osc.start(startTime);
    osc.stop(startTime + 0.4);
    osc.onended = () => { try { gain.disconnect(); osc.disconnect(); } catch { /* torn down */ } };
    scheduled.push(osc);
}

function playDrum(symbol, t, step) {
    switch (symbol) {
        case 'k': kick(t, false); break;
        case 'K': kick(t, true); break;
        case 's': // soft rim/snare — low-passed noise, no harsh digital snap
            noise(t, 0.1, 0.04, 3000);
            note(220, t, 0.05, 'triangle', 0.035);
            break;
        case 'r': // double hit inside one sixteenth
            noise(t, 0.05, 0.03, 4000);
            noise(t + step * 0.5, 0.05, 0.03, 4000);
            break;
        case 'h': noise(t, 0.05, 0.018, 5000); break; // shaker tick, not a hi-hat
        case 'c': crash(t); break;
        default: break; // rest
    }
}

/** Schedule one full pass of `activeTrack`, then queue the next pass. */
function scheduleLoop() {
    const ac = getCtx();
    const start = ac.currentTime + 0.05;
    const { BPM, MELODY, HARMONY, BASS, DRUMS } = activeTrack;
    const step = 60 / BPM / 4; // one sixteenth note
    const totalSteps = MELODY.length;

    // The party loop is faster and busier — punchier, shorter notes read as
    // "energetic" where the lounge loop wants long, sustained ones.
    const isParty = activeTrack === PARTY_TRACK;
    const melodyMul = isParty ? 1 : 1.6;
    const harmonyMul = isParty ? 1.2 : 2;
    const bassMul = isParty ? 1.5 : 3;
    const melodyVol = isParty ? 0.06 : 0.05;

    for (let i = 0; i < totalSteps; i++) {
        const t = start + i * step;
        const noteDuration = step * 0.9;

        if (MELODY[i])  note(MELODY[i],  t, noteDuration * melodyMul,  'triangle', melodyVol);
        if (HARMONY[i]) note(HARMONY[i], t, noteDuration * harmonyMul, 'triangle', 0.028);
        if (BASS[i])    note(BASS[i],    t, step * bassMul,            'sine',     0.062);

        playDrum(DRUMS[i], t, step);
    }

    const loopMs = totalSteps * step * 1000;
    loopTimer = setTimeout(() => {
        scheduled.forEach((node) => { try { node.disconnect(); } catch { /* gone */ } });
        scheduled = [];
        if (playing) scheduleLoop();
    }, loopMs - 100);
}

function stopPlayback() {
    playing = false;
    if (loopTimer) {
        clearTimeout(loopTimer);
        loopTimer = null;
    }
    scheduled.forEach((node) => { try { node.stop(); } catch { /* not started */ } });
    scheduled = [];
}

export const BGM = {
    /** Subscribe to state changes; fires immediately with the current state. */
    onChange(fn) {
        listeners.add(fn);
        fn({ started, muted });
    },

    start() {
        if (playing && activeTrack === MAIN_TRACK) return;
        activeTrack = MAIN_TRACK;
        started = true;
        pauseCount = 0;
        stopPlayback();
        playing = true;
        scheduleLoop();
        emit();
    },

    stop() {
        started = false;
        pauseCount = 0;
        activeTrack = MAIN_TRACK;
        stopPlayback();
        emit();
    },

    /** Stackable pause — every caller must pair it with `resume()`. */
    pause() {
        pauseCount++;
        if (pauseCount === 1 && playing) stopPlayback();
    },

    /** Stackable resume — music returns only once all pauses are released. */
    resume() {
        if (pauseCount > 0) pauseCount--;
        if (pauseCount === 0 && started && !playing) {
            playing = true;
            scheduleLoop();
        }
    },

    /** Swap to the party loop, replacing whatever's currently playing. */
    startParty() {
        activeTrack = PARTY_TRACK;
        stopPlayback();
        started = true;
        playing = true;
        scheduleLoop();
        emit();
    },

    /** Stop the party loop and return to the main loop (if it had been started). */
    stopParty() {
        if (activeTrack !== PARTY_TRACK) return;
        stopPlayback();
        activeTrack = MAIN_TRACK;
        if (started) {
            playing = true;
            scheduleLoop();
        }
        emit();
    },

    toggleMute() {
        muted = !muted;
        if (masterGain) masterGain.gain.value = muted ? 0 : MASTER_VOLUME;
        emit();
        return muted;
    },

    isPaused: () => pauseCount > 0,
    isMuted:  () => muted,

    /** Pre-create the context during a user gesture so `start()` works later. */
    warmup: getCtx,
};

registerWarmup(getCtx);
