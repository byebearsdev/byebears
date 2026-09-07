import { SFX } from '../core/sfx.js';

/* ==========================================================================
   COMPONENT — SANDCASTLE BEAR
   A buried-bear easter egg: click the sandcastle a few times to dig it away,
   then whack the revealed bear for a satisfying reaction each time. Every
   WHACK_MILESTONE hits pops a gold payoff message — a pure clicker, no real
   "game" to learn.

   Expects two image files: images/sandcastle.png and images/bear.png,
   stacked at the same spot (sandcastle on top). Position is a placeholder —
   retune `.sandcastle-bear`'s left/right/bottom once the section has a real
   beach background to sit on.
   ========================================================================== */

/** Clicks needed on the sandcastle before it's fully cleared. */
const DIG_CLICKS_REQUIRED = 3;

/** Whacks needed before the next payoff message pops. */
const WHACK_MILESTONE = 15;

/** Cycled through (randomly) each time a milestone is hit. */
const WHACK_MESSAGES = [
    'BEAR MARKET: DELETED 🚀',
    'PAPER HANDS: NOT FOUND',
    'DIAMOND HANDS ACTIVATED',
    'FUD LEVEL: ZERO',
    'BYEBEARS SZN CONFIRMED',
    'BEARS FEAR THIS TOKEN',
];

export function SandcastleBear() {
    return `
    <!-- ==================== COMPONENT: SANDCASTLE BEAR — START ==================== -->
    <div class="sandcastle-bear" id="sandcastleBear">
        <button type="button" class="btn-reset sandcastle-bear-face" id="sandcastleBearFace" disabled aria-label="Whack the bear">
            <img src="images/bear.png" alt="Buried bear">
            <span class="sandcastle-bear-combo" id="sandcastleBearCombo"></span>
            <div class="sandcastle-bear-payoff" id="sandcastleBearPayoff"></div>
        </button>
        <button type="button" class="btn-reset sandcastle-bear-mound" id="sandcastleBearMound">
            <img src="images/sandcastle.png" alt="Sandcastle">
        </button>
    </div>
    <!-- ==================== COMPONENT: SANDCASTLE BEAR — END ==================== -->`;
}

export function initSandcastleBear() {
    const mound = document.getElementById('sandcastleBearMound');
    const face = document.getElementById('sandcastleBearFace');
    const combo = document.getElementById('sandcastleBearCombo');
    const payoff = document.getElementById('sandcastleBearPayoff');
    if (!mound || !face) return;

    let digCount = 0;
    let whackCount = 0;

    mound.addEventListener('click', () => {
        digCount++;

        if (digCount >= DIG_CLICKS_REQUIRED) {
            SFX.select();
            mound.classList.add('is-cleared');
            mound.disabled = true;
            face.disabled = false;
        } else {
            SFX.press();
            // Drives the crumble stages in sandcastle-bear.css — see
            // `.sandcastle-bear-mound[data-dig="N"]`.
            mound.dataset.dig = String(digCount);
        }
    });

    face.addEventListener('click', () => {
        if (face.disabled) return;
        whackCount++;
        SFX.press();

        // Restart the squash animation even if it's still mid-run.
        face.classList.remove('is-whacked');
        void face.offsetWidth;
        face.classList.add('is-whacked');

        combo.textContent = `x${whackCount}`;
        combo.classList.add('is-visible');

        if (whackCount % WHACK_MILESTONE === 0) {
            SFX.select();
            payoff.textContent = WHACK_MESSAGES[Math.floor(Math.random() * WHACK_MESSAGES.length)];
            payoff.classList.remove('is-active');
            void payoff.offsetWidth;
            payoff.classList.add('is-active');
        }
    });
}
