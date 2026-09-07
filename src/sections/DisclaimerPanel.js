import { SECTION_VIDEOS } from '../config/site.js';
import { $$ } from '../core/dom.js';

/* ==========================================================================
   SECTION — DISCLAIMER PANEL  (page footer)
   The site's last stop: a tombstone for the bear market (footer.mp4, a
   literal "BEAR MARKET" headstone on the beach), closing out the hunt the
   lair opened with. Each line is wrapped word-by-word and lit in sequence,
   like a sign warming up. Loops for as long as the section stays on screen.

   `.disclaimer-scrim` sits between the video and the text — the footage is
   a bright sunset (lots of sky/sun/water), so the text needs a solid dark
   layer under it rather than relying on text-shadow alone.
   ========================================================================== */

const WORD_DELAY_MS = 80;
const LOOP_PAUSE_MS = 2000;

export function DisclaimerPanel() {
    const { id, src } = SECTION_VIDEOS.disclaimerPanel;
    return `
    <!-- ==================== SECTION: DISCLAIMER PANEL — START ==================== -->
    <footer class="disclaimer-panel">
        <div class="disclaimer-video">
            <video id="${id}" autoplay muted loop playsinline>
                <source src="${src}" type="video/mp4">
            </video>
        </div>
        <div class="disclaimer-scrim" aria-hidden="true"></div>

        <div class="disclaimer-eyebrow">💀 HERE LIES THE BEAR MARKET <span class="disclaimer-eyebrow-sep">&mdash;</span> 2025&ndash;2026</div>

        <div class="disclaimer-lines">
            <p class="disclaimer-line disclaimer-line--gold">$BYEBEARS &mdash; 2026 &mdash; NO PROMISES. NO FINANCIAL ADVICE.</p>
            <p class="disclaimer-line">CAUSE OF DEATH: DIAMOND HANDS.</p>
            <p class="disclaimer-line">NOT ONE BEAR SURVIVED THE CANDLES.</p>
            <p class="disclaimer-highscore">LONG LIVE THE BULLS &#x1F402;&#x1F680;</p>
        </div>

    </footer>
    <!-- ==================== SECTION: DISCLAIMER PANEL — END ==================== -->`;
}

/** Replace each line's text with one span per word, and collect the spans. */
function splitIntoWords(elements) {
    const words = [];

    elements.forEach((el) => {
        const text = el.textContent;
        el.textContent = '';

        // Capturing split keeps the whitespace so spacing is unchanged.
        text.split(/(\s+)/).forEach((part) => {
            if (/^\s+$/.test(part)) {
                el.appendChild(document.createTextNode(part));
            } else if (part) {
                const span = document.createElement('span');
                span.className = 'neon-word';
                span.textContent = part;
                el.appendChild(span);
                words.push(span);
            }
        });
    });

    return words;
}

export function initDisclaimerPanel() {
    const panel = document.querySelector('.disclaimer-panel');
    if (!panel) return;

    const words = splitIntoWords($$('.disclaimer-line, .disclaimer-highscore', panel));
    if (!words.length) return;

    let started = false;

    function lightUp() {
        words.forEach((word) => word.classList.remove('is-lit'));
        words.forEach((word, i) => {
            setTimeout(() => word.classList.add('is-lit'), i * WORD_DELAY_MS);
        });
        setTimeout(lightUp, words.length * WORD_DELAY_MS + LOOP_PAUSE_MS);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !started) {
                started = true;
                lightUp();
            }
        });
    }, { root: document.getElementById('scrollContainer'), threshold: 0.3 });

    observer.observe(panel);
}
