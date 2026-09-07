/**
 * Low-level oscillator/noise builders shared by the sound-effect and music
 * engines. Both previously carried their own near-identical copies.
 */

/**
 * Envelope shapes. The two engines want subtly different decays, so rather
 * than averaging them into one "close enough" curve they stay explicit:
 *
 *   BLIP  — full volume held right up to the end, then cut. Punchy UI clicks.
 *   MUSIC — drops to 80% at 60% through the note, then fades. Softer tail so
 *           fast 16th-note runs don't turn into a solid wall of sound.
 */
export const ENVELOPE = {
    BLIP:  { attack: 0.005, holdAt: (d) => Math.max(d - 0.01, 0.005), holdLevel: 1 },
    MUSIC: { attack: 0.003, holdAt: (d) => Math.max(d * 0.6, 0.005),  holdLevel: 0.8 },
};

/**
 * Schedule a single tone with a hard 8-bit style attack.
 *
 * @param {AudioContext} ctx
 * @param {AudioNode}    destination where the note is routed
 * @param {object}       opts
 * @param {number}       opts.freq      Hz; 0 is treated as a rest
 * @param {number}       opts.startTime absolute context time
 * @param {number}       opts.duration  seconds
 * @param {OscillatorType} [opts.type='square']
 * @param {number}       [opts.volume=0.14]
 * @param {object}       [opts.envelope=ENVELOPE.BLIP]
 * @returns {OscillatorNode|null}
 */
export function playTone(ctx, destination, {
    freq,
    startTime,
    duration,
    type = 'square',
    volume = 0.14,
    envelope = ENVELOPE.BLIP,
}) {
    if (!freq) return null;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(destination);
    osc.type = type;
    osc.frequency.value = freq;

    const t = startTime;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + envelope.attack);
    gain.gain.setValueAtTime(volume * envelope.holdLevel, t + envelope.holdAt(duration));
    gain.gain.linearRampToValueAtTime(0, t + duration);

    osc.start(t);
    osc.stop(t + duration + 0.01);
    osc.onended = () => {
        try {
            gain.disconnect();
            osc.disconnect();
        } catch {
            /* already torn down */
        }
    };
    return osc;
}

/**
 * Schedule a high-passed white-noise burst — the basis of hats, snares
 * and crashes.
 *
 * @returns {AudioBufferSourceNode}
 */
export function playNoise(ctx, destination, { startTime, duration, volume, highpass = 7000 }) {
    const bufferSize = Math.max(Math.floor(ctx.sampleRate * duration), 1);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = highpass;

    const gain = ctx.createGain();
    source.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    source.start(startTime);
    source.stop(startTime + duration + 0.01);
    source.onended = () => {
        try {
            filter.disconnect();
            gain.disconnect();
            source.disconnect();
        } catch {
            /* already torn down */
        }
    };
    return source;
}
