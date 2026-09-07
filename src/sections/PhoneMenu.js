import { SECTION_VIDEOS, CONTRACT_ADDRESS } from '../config/site.js';
import { PHONE_APP_BUTTONS } from '../data/phone-app-buttons.js';
import { PhoneAppButton } from '../components/PhoneAppButton.js';
import { renderList } from '../core/dom.js';
import { copyToClipboard } from '../core/clipboard.js';
import { SFX } from '../core/sfx.js';

/* ==========================================================================
   SECTION — PHONE MENU
   Chad holds up a phone over the beach; a wojak-in-a-polar-bear-costume
   flails in the ocean behind him. The phone's screen is blank in the
   footage on purpose — `.phone-screen-overlay` is real HTML laid over it
   (not baked into the video), holding the site's link list as a mobile app
   menu. See `.phone-screen-overlay` in phone-menu.css for the tuned
   coordinates that keep it tracking the screen as the section resizes.

   The floating iceberg is also a clicker: rapid clicks fill a heat meter,
   and filling it melts the iceberg away with a crypto-flavoured payoff
   message before it reforms — same pure-clicker pattern as the sandcastle
   bear, just with global warming winning this round.
   ========================================================================== */

const COPY_CONFIRM_MS = 1600;

/** Clicks needed to melt the iceberg before it reforms. */
const ICEBERG_CLICKS_TO_MELT = 8;

/** How long the melted state holds before the iceberg reforms. */
const ICEBERG_MELT_HOLD_MS = 1800;

/** Cycled through (randomly) each time the iceberg fully melts. */
const ICEBERG_MESSAGES = [
    'SHORT LIQUIDATED 💧',
    'Dont FOMO',
    'BYE BEARS',
    'BEARS ARE MELTING',
    'GREEN CANDLES ONLY 📈',
];

export function PhoneMenu() {
    const { id, src } = SECTION_VIDEOS.phoneMenu;
    return `
    <!-- ==================== SECTION: PHONE MENU — START ==================== -->
    <section class="phone-menu" aria-label="Links">
        <div class="phone-menu-video">
            <video id="${id}" autoplay muted loop playsinline>
                <source src="${src}" type="video/mp4">
            </video>
        </div>

        <div class="phone-screen-overlay">
            <div class="phone-screen-header">$BYEBEARS</div>
            <div class="phone-screen-list">
                ${renderList(PHONE_APP_BUTTONS, PhoneAppButton)}
            </div>
        </div>

        <!-- Floating to the drowning wojak's left, on the water. -->
        <button type="button" class="btn-reset phone-menu-iceberg" id="phoneMenuIceberg" aria-label="Click rapidly to rebuild the melting iceberg">
            <img src="images/iceberg.png" alt="">
            <div class="iceberg-meter-track">
                <div class="iceberg-meter-fill" id="icebergMeterFill"></div>
            </div>
            <div class="iceberg-payoff" id="icebergPayoff"></div>
        </button>
    </section>
    <!-- ==================== SECTION: PHONE MENU — END ==================== -->`;
}

/** Copy-CA row: copies the contract address, flashing a confirmation in place. */
function initCopyButton() {
    const button = document.getElementById('phoneCopyCa');
    if (!button) return;

    button.addEventListener('click', () => {
        SFX.select();
        const original = button.innerHTML;

        copyToClipboard(CONTRACT_ADDRESS)
            .then(() => {
                button.innerHTML = '<span class="phone-app-btn-copied">Copied!</span>';
                setTimeout(() => { button.innerHTML = original; }, COPY_CONFIRM_MS);
            })
            .catch(() => {
                button.title = 'Copy failed';
            });
    });
}

/** Iceberg clicker: fills a meter, then melts the iceberg with a payoff message before it reforms. */
function initIcebergGame() {
    const iceberg = document.getElementById('phoneMenuIceberg');
    const fill = document.getElementById('icebergMeterFill');
    const payoff = document.getElementById('icebergPayoff');
    if (!iceberg || !fill || !payoff) return;

    let progress = 0;
    let melted = false;

    iceberg.addEventListener('click', () => {
        if (melted) return;

        SFX.press();
        progress++;
        fill.style.width = `${Math.min(100, (progress / ICEBERG_CLICKS_TO_MELT) * 100)}%`;

        // Restart the shake animation even if it's still mid-run.
        iceberg.classList.remove('is-clicked');
        void iceberg.offsetWidth;
        iceberg.classList.add('is-clicked');

        if (progress >= ICEBERG_CLICKS_TO_MELT) {
            SFX.select();
            melted = true;
            iceberg.classList.add('is-melted');

            payoff.textContent = ICEBERG_MESSAGES[Math.floor(Math.random() * ICEBERG_MESSAGES.length)];
            payoff.classList.remove('is-active');
            void payoff.offsetWidth;
            payoff.classList.add('is-active');

            setTimeout(() => {
                iceberg.classList.remove('is-melted');
                fill.style.width = '0%';
                progress = 0;
                melted = false;
            }, ICEBERG_MELT_HOLD_MS);
        }
    });
}

export function initPhoneMenu() {
    initCopyButton();
    initIcebergGame();
}
