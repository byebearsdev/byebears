import { MENU_ITEMS } from '../data/menu-items.js';
import { CONTRACT_ADDRESS } from '../config/site.js';
import { ArcadeMenuItem } from '../components/ArcadeMenuItem.js';
import { renderList, $$ } from '../core/dom.js';
import { copyToClipboard } from '../core/clipboard.js';
import { SFX } from '../core/sfx.js';

/* ==========================================================================
   OVERLAY — ARCADE MENU
   Airport directory board. Arrow keys move the cursor, Enter activates,
   Escape closes.
   ========================================================================== */

const COPY_CONFIRM_MS = 1600;

export function ArcadeMenu() {
    return `
    <!-- ==================== OVERLAY: ARCADE MENU — START ==================== -->
    <div class="arcade-menu-overlay" id="arcadeMenuOverlay">
        <nav class="arcade-menu-box" aria-label="Main menu">
            <button type="button" class="arcade-menu-close" id="arcadeMenuClose" aria-label="Close menu">✕</button>
            <div class="arcade-menu-title">🐂 <span class="arcade-menu-title-accent">BYEBEARS</span></div>
            <div class="arcade-menu-subtitle">PICK YOUR TARGET</div>

            <ul class="arcade-menu-items" id="arcadeMenuItems">
                ${renderList(MENU_ITEMS, ArcadeMenuItem)}
            </ul>

            <div class="arcade-menu-hint">
                ↑ ↓ &nbsp; NAVIGATE<br>
                ENTER / CLICK &nbsp; SELECT<br>
                ESC &nbsp; CLOSE
            </div>
        </nav>
    </div>
    <!-- ==================== OVERLAY: ARCADE MENU — END ==================== -->`;
}

export function initArcadeMenu() {
    const overlay = document.getElementById('arcadeMenuOverlay');
    const items = $$('.arcade-menu-item');
    if (!overlay || !items.length) return;

    let selectedIndex = 0;
    let isOpen = false;

    function select(index) {
        items.forEach((item, i) => item.classList.toggle('is-selected', i === index));
        selectedIndex = index;
    }

    function open() {
        isOpen = true;
        select(0);
        overlay.classList.add('is-open');
        SFX.coin();
    }

    function close() {
        isOpen = false;
        overlay.classList.remove('is-open');
    }

    /** Copy the CA and flash the label, leaving the menu open. */
    function copyContractAddress(item) {
        const label = item.querySelector('.arcade-menu-label');
        const original = label.textContent;

        item.classList.add('is-copied');
        label.textContent = 'COPIED!';
        copyToClipboard(CONTRACT_ADDRESS).catch(() => {});

        setTimeout(() => {
            label.textContent = original;
            item.classList.remove('is-copied');
        }, COPY_CONFIRM_MS);
    }

    function activate(item) {
        SFX.select();
        const { action, url } = item.dataset;

        if (action === 'copy-ca') {
            copyContractAddress(item);
            return;
        }

        if (url && url !== '#') {
            window.open(url, '_blank', 'noopener');
        }
        close();
    }

    // Hamburger toggles, close button and backdrop dismiss.
    document.getElementById('menuButton')?.addEventListener('click', () => {
        isOpen ? close() : open();
    });
    document.getElementById('arcadeMenuClose').addEventListener('click', close);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) close();
    });

    // Pointing at an item selects it, matching the keyboard cursor.
    items.forEach((item, i) => {
        item.addEventListener('mouseenter', () => {
            if (selectedIndex !== i) SFX.tick();
            select(i);
        });
        item.addEventListener('click', () => activate(item));
    });

    document.addEventListener('keydown', (event) => {
        if (!isOpen) return;

        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            const direction = event.key === 'ArrowUp' ? -1 : 1;
            select((selectedIndex + direction + items.length) % items.length);
            SFX.tick();
        } else if (event.key === 'Enter') {
            event.preventDefault();
            activate(items[selectedIndex]);
        } else if (event.key === 'Escape') {
            close();
        }
    });
}
