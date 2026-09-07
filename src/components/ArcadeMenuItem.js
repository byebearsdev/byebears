import { escapeHtml } from '../core/dom.js';

/**
 * One entry in the arcade menu.
 *
 * Renders a real <button> so the entry is focusable and operable by keyboard;
 * `.btn-reset` strips the UA styling so it looks exactly as it did when this
 * was a bare <li>.
 *
 * @param {{action: string, icon: string, label: string, url: string}} item
 * @param {number} index
 */
export function ArcadeMenuItem(item, index) {
    return `
        <li>
            <button type="button"
                    class="btn-reset arcade-menu-item${index === 0 ? ' is-selected' : ''}"
                    data-action="${escapeHtml(item.action)}"
                    data-url="${escapeHtml(item.url)}">
                <span class="arcade-menu-cursor" aria-hidden="true">▶</span>
                <span class="arcade-menu-icon" aria-hidden="true">${item.icon}</span>
                <span class="arcade-menu-label">${escapeHtml(item.label)}</span>
            </button>
        </li>`;
}
