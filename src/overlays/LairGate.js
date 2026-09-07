import { SECTION_VIDEO_IDS, ANNOUNCE_AUDIO, LINKS, CONTRACT_ADDRESS } from '../config/site.js';
import { SNACK_ITEMS } from '../data/snack-items.js';
import { SFX } from '../core/sfx.js';
import { BGM } from '../core/bgm.js';
import { runWarmups, primeSilentAudio } from '../core/audio-context.js';
import { copyToClipboard } from '../core/clipboard.js';

/* ==========================================================================
   OVERLAY — LAIR GATE
   The very first thing shown: Wojak's frozen lair, played as a looping
   background video (section01.mp4), with an arrow pointing at the BYE BEARS
   button (which swaps to its pressed state instantly on click).

   Clicking it plays a one-shot ice-melt video, which freezes on its last
   frame and pops up three ways to finish the bears off (the bull /
   liquidation / bear spray) — each a short death clip. Once that clip ends,
   a full-screen green "bull candle" wipe covers everything, the real page
   underneath is revealed while hidden behind it (see revealBullWipe, called
   from main.js once that page is actually visible), and the same wipe then
   plays in reverse to uncover it.

   A skip button is visible from the very start and short-circuits straight
   to the handoff from any phase, for anyone who doesn't want to sit through
   the sequence. Three quick-link buttons (X / buy / copy CA) sit top-right
   from the moment the lair appears, same as the persistent header controls
   on the rest of the site.

   This is also the site's audio-unlock gesture (browsers only allow audio to
   start from a real user gesture), since it's now the first thing a visitor
   can click — see activate() below.
   ========================================================================== */

const MELT_VIDEO_SRC = 'images/bearsection/icemelt.mp4';
const DEATH_VIDEOS = {
    bull:  'images/bearsection/deaths/bull.mp4',
    laser: 'images/bearsection/deaths/laser.mp4',
    spray: 'images/bearsection/deaths/spray.mp4',
};
const BEAR_BTN_NORMAL_SRC = 'images/bearsection/byebears-button.png';
const BEAR_BTN_PRESSED_SRC = 'images/bearsection/byebears-button-pressed.png';

/** Wait for the fade-out before handing off, so it doesn't cut off mid-transition. */
const HANDOFF_DELAY_MS = 500;
/** How long the "COPIED!" state lingers on the CA quick-link. */
const COPY_CONFIRM_MS = 1600;
/** Hard ceiling on the readiness gate below, in case an asset never fires. */
const READY_TIMEOUT_MS = 3000;

export function LairGate() {
    return `
    <!-- ==================== OVERLAY: LAIR GATE — START ==================== -->
    <div class="lair-gate" id="lairGate">
        <!-- Fixed to section01.mp4's own 16:9 frame and scaled to cover the
             viewport (same trick as .hero-sunset's aspect-ratio box), so
             everything positioned inside by percentage tracks the same
             point in the video at every screen size instead of drifting
             with the crop. -->
        <div class="lair-frame">
            <div class="lair-frame-inner" id="lairFrameInner">
                <div class="lair-video">
                    <video id="videoLairGate" autoplay muted loop playsinline>
                        <source src="images/bearsection/section01.mp4" type="video/mp4">
                    </video>
                </div>

                <!-- Reused for both the ice-melt clip and whichever death clip gets picked. -->
                <video id="lairEventVideo" class="lair-event-video" muted playsinline hidden></video>

                <!-- Villain atmosphere, playing only on this initial screen — stopped the
                     instant the visitor clicks either button (see activate()/skipIntro() in
                     initLairGate). horrorVoice layers quieter under lairMusic, not louder. -->
                <audio id="lairMusic" src="images/lairmusic.mp3" loop></audio>
                <audio id="horrorVoice" src="images/horrorvoice.mp3" loop></audio>

                <div class="lair-pointer" id="lairPointer">
                    <div class="lair-pointer-text">OH NO — THE BEARS TOOK CONTROL OF THE MARKET!</div>
                    <div class="lair-pointer-sub">CLICK TO GET RID OF THEM</div>
                    <div class="lair-pointer-arrow" aria-hidden="true">&#9660;</div>
                </div>

                <button type="button" class="lair-bear-btn" id="lairBtn" aria-label="Bye Bears">
                    <span class="lair-bear-btn-img lair-bear-btn-img--pressed"></span>
                    <span class="lair-bear-btn-img lair-bear-btn-img--normal"></span>
                </button>

                <div class="lair-choice" id="lairChoice" hidden>
                    <div class="lair-choice-title">HOW DO YOU WANT TO GET RID OF THE BEARS?</div>
                    <div class="lair-choice-options">
                        <button type="button" class="lair-choice-btn" data-death="bull">
                            <span class="lair-choice-num">1</span>
                            <span class="lair-choice-label">THE BULL</span>
                        </button>
                        <button type="button" class="lair-choice-btn" data-death="laser">
                            <span class="lair-choice-num">2</span>
                            <span class="lair-choice-label">LIQUIDATION</span>
                        </button>
                        <button type="button" class="lair-choice-btn" data-death="spray">
                            <span class="lair-choice-num">3</span>
                            <span class="lair-choice-label">BEAR SPRAY</span>
                        </button>
                    </div>
                </div>

                <!-- Chrome anchored to the frame itself (not the raw viewport) so
                     it sits on the video, not floating in the letterbox bars
                     around it now that the frame is capped at native resolution. -->
                <div class="lair-quicklinks">
                    <a class="lair-quicklink" href="${LINKS.xProfile}" target="_blank" rel="noopener" title="X (Twitter)" aria-label="X profile">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a class="lair-quicklink" href="${LINKS.pumpfun}" target="_blank" rel="noopener" title="Buy on Pump.fun" aria-label="Buy on Pump.fun">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                    </a>
                    <button type="button" class="lair-quicklink" id="lairCopyCa" title="Copy Contract Address" aria-label="Copy contract address">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                    </button>
                </div>

                <button type="button" class="lair-skip" id="lairSkip">SKIP &raquo;</button>
            </div>
        </div>
    </div>

    <!-- Full-screen green "bull candle" wipe, sibling to the gate so its own
         transform is unaffected by the gate's fade-out. -->
    <div class="bull-wipe" id="bullWipe" aria-hidden="true"></div>
    <!-- ==================== OVERLAY: LAIR GATE — END ==================== -->`;
}

/** Load (but don't play) every audio element so playback is instant later. */
function preloadAudioElements() {
    const ids = [ANNOUNCE_AUDIO.id, ...SNACK_ITEMS.map((item) => `theme-${item.key}`)];
    ids.forEach((id) => document.getElementById(id)?.load());
}

/**
 * Unlock the background videos.
 *
 * Playing each one once while unmuted (at zero volume) inside the gesture means
 * that later, when a section scrolls into view and raises the volume, the
 * browser won't pause the video for autoplaying with sound.
 */
function unlockSectionVideos() {
    SECTION_VIDEO_IDS.forEach((id) => {
        const video = document.getElementById(id);
        if (!video) return;
        video.muted = false;
        video.volume = 0;
        video.play().catch(() => {});
        video.muted = true; // stay silent until the section is actually in view
    });
}

/** Warm the browser's HTTP cache for a clip before it's actually needed. */
function preloadVideo(src) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = src;
    document.head.appendChild(link);
}

/**
 * Reverse the green wipe, uncovering whatever is now on screen.
 *
 * Exported so `main.js` can call it from `revealPage()` — the moment the
 * real page underneath actually becomes visible, which may be a good deal
 * later than the wipe finished covering (it's holding through the loading
 * screen's asset preload in the meantime). A no-op if the wipe was never
 * triggered (e.g. the skip button was used instead).
 */
export function revealBullWipe() {
    document.getElementById('bullWipe')?.classList.remove('is-covering');
}

/** Resolves once `src` has loaded (or failed) — either way it's decided. */
function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = src;
    });
}

/** Resolves once `video` has at least its first frame decoded. */
function whenVideoReady(video) {
    return new Promise((resolve) => {
        if (video.readyState >= 2) {
            resolve();
            return;
        }
        video.addEventListener('loadeddata', resolve, { once: true });
    });
}

/**
 * @param {() => void} [onComplete] runs once the gate has handed off
 */
export function initLairGate(onComplete = () => {}) {
    const gate = document.getElementById('lairGate');
    const introVideo = document.getElementById('videoLairGate');
    const eventVideo = document.getElementById('lairEventVideo');
    const lairMusic = document.getElementById('lairMusic');
    const horrorVoice = document.getElementById('horrorVoice');
    const pointer = document.getElementById('lairPointer');
    const bearBtn = document.getElementById('lairBtn');
    const choice = document.getElementById('lairChoice');
    const choiceButtons = choice ? Array.from(choice.querySelectorAll('.lair-choice-btn')) : [];
    const skip = document.getElementById('lairSkip');
    const wipe = document.getElementById('bullWipe');
    const copyCa = document.getElementById('lairCopyCa');
    if (!gate || !bearBtn || !skip) return;

    // Give the melt/death clips the whole time the visitor spends looking at
    // the intro screen (and picking an option) to land in the HTTP cache.
    [MELT_VIDEO_SRC, ...Object.values(DEATH_VIDEOS)].forEach(preloadVideo);

    // Nothing appears until the video's first frame and both button states
    // are actually ready, so the scene doesn't pop in piecemeal (the button
    // arriving before the video, say). The timeout is a safety net in case
    // an asset stalls — better a slightly early reveal than a stuck blank
    // screen.
    Promise.race([
        Promise.all([
            whenVideoReady(introVideo),
            loadImage(BEAR_BTN_NORMAL_SRC),
            loadImage(BEAR_BTN_PRESSED_SRC),
        ]),
        new Promise((resolve) => setTimeout(resolve, READY_TIMEOUT_MS)),
    ]).then(() => gate.classList.add('is-ready'));

    let done = false;

    function finish() {
        if (done) return;
        done = true;
        gate.classList.add('is-hidden');
        setTimeout(onComplete, HANDOFF_DELAY_MS);
    }

    /** Silence the lair atmosphere the instant any button is clicked. */
    function stopLairMusic() {
        [lairMusic, horrorVoice].forEach((el) => {
            if (!el) return;
            el.pause();
            el.currentTime = 0;
        });
    }

    // Quieter than the default 1.0 — lairMusic is the main layer, horrorVoice
    // sits underneath it, softer still.
    if (lairMusic) lairMusic.volume = 0.5;
    if (horrorVoice) horrorVoice.volume = 0.3;

    // Best-effort autoplay right away — browsers that allow it (e.g. this
    // site already has some engagement) will start it immediately; browsers
    // that block unmuted autoplay before any gesture will just reject this
    // silently, and the visitor simply won't hear it until the loop attempts
    // to play. Either way, nothing here waits on it.
    lairMusic?.play().catch(() => {});
    horrorVoice?.play().catch(() => {});

    /** Bail out of whatever is playing and jump straight to the handoff. */
    function skipIntro() {
        SFX.back();
        stopLairMusic();
        eventVideo.pause();
        wipe.classList.add('is-instant');
        wipe.classList.remove('is-covering');
        finish();
    }

    /** Play one clip on the shared event video, front and centre. */
    function playEventVideo(src, onEnded) {
        eventVideo.hidden = false;
        eventVideo.muted = false;
        eventVideo.src = src;
        eventVideo.currentTime = 0;
        eventVideo.onended = onEnded;
        eventVideo.play().catch(() => {});
    }

    function showChoices() {
        choice.hidden = false;
    }

    /** Cover the screen in green, hand off invisibly behind it, then uncover. */
    function runWipeThenFinish() {
        wipe.classList.remove('is-instant');
        wipe.classList.add('is-covering');
        wipe.addEventListener('transitionend', () => finish(), { once: true });
    }

    function playDeath(key) {
        choice.hidden = true;
        playEventVideo(DEATH_VIDEOS[key], runWipeThenFinish);
    }

    function activate() {
        // 1. Unlock audio on this trusted gesture.
        SFX.coin();

        // 2. Warm every context so later hover/scroll effects need no extra click.
        runWarmups();
        BGM.warmup();
        stopLairMusic();

        // 3. iOS silent-switch workaround.
        primeSilentAudio();

        // 4. Prime media elements.
        preloadAudioElements();
        unlockSectionVideos();

        pointer.hidden = true;
        bearBtn.hidden = true;
        introVideo.hidden = true;
        playEventVideo(MELT_VIDEO_SRC, showChoices);
    }

    bearBtn.addEventListener('click', activate, { once: true });
    skip.addEventListener('click', skipIntro);

    choiceButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            SFX.select();
            playDeath(btn.dataset.death);
        });
    });

    copyCa?.addEventListener('click', () => {
        SFX.press();
        copyToClipboard(CONTRACT_ADDRESS).catch(() => {});
        const originalTitle = copyCa.title;
        copyCa.classList.add('is-copied');
        copyCa.title = 'Copied!';
        setTimeout(() => {
            copyCa.classList.remove('is-copied');
            copyCa.title = originalTitle;
        }, COPY_CONFIRM_MS);
    });
}
