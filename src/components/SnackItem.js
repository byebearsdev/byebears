import { escapeHtml, styleAttr } from '../core/dom.js';

/**
 * A clickable prop on the snack table.
 *
 * Rendered as a <button> (previously a <div>) so it is keyboard-reachable;
 * `.btn-reset` keeps it looking identical.
 *
 * `openImage`, if present, is stashed in `data-open-image` — SnackTable.js's
 * click handler swaps the `<img>` to it (used by the cooler, which pops open
 * on click and stays that way).
 *
 * @param {import('../data/snack-items.js').SNACK_ITEMS[number]} item
 */
export function SnackItem(item) {
    const { key, label, image, openImage, position } = item;
    const openImageAttr = openImage ? ` data-open-image="${escapeHtml(openImage)}"` : '';
    return `
        <button type="button"
                class="btn-reset snack-item"
                id="snack-${key}"
                data-snack="${key}"
                aria-label="${escapeHtml(label)}"
                ${styleAttr(position).trim()}${openImageAttr}>
            <img src="${escapeHtml(image)}" alt="" draggable="false">
        </button>`;
}

/**
 * The <audio> element carrying a prop's theme song. Preloaded so playback
 * starts instantly when the popup opens. Most props don't have a theme —
 * this renders nothing for those (see `playTheme()` in TerminalPopup.js).
 */
export function SnackThemeAudio(item) {
    if (!item.theme) return '';
    return `<audio id="theme-${item.key}" src="${encodeURI(item.theme)}" preload="auto" loop></audio>`;
}
