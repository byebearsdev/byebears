import { TERMINAL_MESSAGES } from '../data/terminal-messages.js';
import { SNACK_ITEMS, THEME_VOLUME } from '../data/snack-items.js';
import { SECTION_VIDEO_IDS } from '../config/site.js';
import { SnackThemeAudio } from '../components/SnackItem.js';
import { renderList, escapeHtml } from '../core/dom.js';
import { SFX } from '../core/sfx.js';

/* ==========================================================================
   OVERLAY — TERMINAL POPUP
   Green-phosphor readout for a snack-table prop, with its own theme music.
   ========================================================================== */

/** Stagger between consecutive lines arriving. */
const LINE_STAGGER_S = 0.13;

/** Whichever theme is currently playing, so it can be stopped on close. */
let activeTheme = null;

export function TerminalPopup() {
    return `
    <!-- ==================== OVERLAY: TERMINAL POPUP — START ==================== -->
    <div class="terminal-popup-overlay" id="terminalPopupOverlay">
        <div class="terminal-popup" role="dialog" aria-modal="true" aria-label="Terminal">
            <button type="button" class="terminal-popup-close" id="terminalPopupClose" aria-label="Close">✕</button>
            <div class="terminal-popup-lines" id="terminalPopupLines"></div>
        </div>
    </div>

    <!-- Per-prop theme songs, for props that have one -->
    ${renderList(SNACK_ITEMS, SnackThemeAudio)}
    <!-- ==================== OVERLAY: TERMINAL POPUP — END ==================== -->`;
}

/** Blocky inline progress bar appended to a line. */
function buildLoadBar(filled, empty) {
    const blocks = [
        ...Array(filled).fill('<span class="terminal-load-block"></span>'),
        ...Array(empty).fill('<span class="terminal-load-block terminal-load-block--empty"></span>'),
    ].join('');
    return `<span class="terminal-load-bar">${blocks}</span>`;
}

function renderLines(lines) {
    return lines.map((line, i) => {
        const modifier = line.cls ? ` terminal-line--${line.cls}` : '';
        let content = line.html ? line.text : escapeHtml(line.text);
        if (line.bar) content += buildLoadBar(line.bar[0], line.bar[1]);

        return `<div class="terminal-line${modifier}" style="--line-delay:${(i * LINE_STAGGER_S).toFixed(2)}s">${content}</div>`;
    }).join('');
}

/** Silence the background videos so the theme is heard cleanly. */
function muteSectionVideos() {
    SECTION_VIDEO_IDS.forEach((id) => {
        const video = document.getElementById(id);
        if (video && !video.muted && video.volume > 0) {
            video.dataset.volumeBeforePopup = String(video.volume);
            video.volume = 0;
            video.muted = true;
        }
    });
}

function restoreSectionVideos() {
    SECTION_VIDEO_IDS.forEach((id) => {
        const video = document.getElementById(id);
        const previous = video?.dataset.volumeBeforePopup;
        if (video && previous) {
            video.muted = false;
            video.volume = Number(previous);
            delete video.dataset.volumeBeforePopup;
        }
    });
}

function playTheme(key) {
    const item = SNACK_ITEMS.find((entry) => entry.key === key);
    if (!item?.theme) {
        // No theme for this prop — just stop whatever was already playing.
        stopTheme();
        return;
    }

    const audio = document.getElementById(`theme-${key}`);
    if (!audio) return;

    if (activeTheme && activeTheme !== audio) {
        activeTheme.pause();
        activeTheme.currentTime = 0;
    }

    audio.volume = Math.min(1, THEME_VOLUME * (item.volumeScale ?? 1));
    audio.currentTime = 0;
    audio.play().catch(() => {});
    activeTheme = audio;
}

function stopTheme() {
    if (!activeTheme) return;
    activeTheme.pause();
    activeTheme.currentTime = 0;
    activeTheme = null;
}

export function openTerminalPopup(key) {
    const lines = TERMINAL_MESSAGES[key];
    if (!lines) return;

    SFX.select();
    document.getElementById('terminalPopupLines').innerHTML = renderLines(lines);
    document.getElementById('terminalPopupOverlay').classList.add('is-open');

    muteSectionVideos();
    playTheme(key);
}

export function closeTerminalPopup() {
    const overlay = document.getElementById('terminalPopupOverlay');
    if (!overlay || !overlay.classList.contains('is-open')) return;

    SFX.back();
    overlay.classList.remove('is-open');
    stopTheme();
    restoreSectionVideos();
}

export function initTerminalPopup() {
    const overlay = document.getElementById('terminalPopupOverlay');
    if (!overlay) return;

    document.getElementById('terminalPopupClose').addEventListener('click', closeTerminalPopup);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) closeTerminalPopup();
    });
}
