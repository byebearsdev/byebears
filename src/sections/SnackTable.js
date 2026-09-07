import { SNACK_ITEMS } from '../data/snack-items.js';
import { SECTION_VIDEOS } from '../config/site.js';
import { SnackItem } from '../components/SnackItem.js';
import { renderList, $$ } from '../core/dom.js';
import { openTerminalPopup } from '../overlays/TerminalPopup.js';

/* ==========================================================================
   SECTION — SNACK TABLE
   Looping beach-table footage with clickable props on top. Each prop opens a
   terminal popup; some also play their own theme song (see snack-items.js).
   ========================================================================== */

/** Animation (1100ms) plus a short gap, so pulses never overlap. */
const PULSE_INTERVAL_MS = 1400;

export function SnackTable() {
    const { id, src } = SECTION_VIDEOS.snackTable;
    return `
    <!-- ==================== SECTION: SNACK TABLE — START ==================== -->
    <section class="snack-table" id="snackTable" aria-label="The table">
        <video id="${id}" autoplay muted loop playsinline>
            <source src="${src}" type="video/mp4">
        </video>

        ${renderList(SNACK_ITEMS, SnackItem)}
    </section>
    <!-- ==================== SECTION: SNACK TABLE — END ==================== -->`;
}

/**
 * Walk a glow along the props, one at a time, while the section is on screen.
 * Stops when it scrolls away so it isn't animating off-screen.
 */
function initPulseHint(section, items) {
    let index = 0;
    let timer = null;

    function pulseNext() {
        const el = items[index];
        el.classList.remove('is-pulsing');
        // Force a reflow so re-adding the class restarts the animation.
        void el.offsetWidth;
        el.classList.add('is-pulsing');
        el.addEventListener('animationend', () => el.classList.remove('is-pulsing'), { once: true });
        index = (index + 1) % items.length;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (!timer) timer = setInterval(pulseNext, PULSE_INTERVAL_MS);
            } else {
                clearInterval(timer);
                timer = null;
            }
        });
    }, { root: document.getElementById('scrollContainer'), threshold: 0.2 });

    observer.observe(section);
}

export function initSnackTable() {
    const section = document.getElementById('snackTable');
    if (!section) return;

    const items = $$('.snack-item');
    if (!items.length) return;

    initPulseHint(section, items);

    items.forEach((item) => {
        item.addEventListener('click', () => {
            // The cooler (and any future two-state prop) swaps its image on
            // first click and stays that way — see `openImage` in snack-items.js.
            const openImage = item.dataset.openImage;
            if (openImage) item.querySelector('img').src = openImage;

            openTerminalPopup(item.dataset.snack);
        });
    });
}
