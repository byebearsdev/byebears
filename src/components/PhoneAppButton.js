import { escapeHtml } from '../core/dom.js';
import { svgIcon } from '../data/icons.js';

/**
 * One row of the phone's app menu — an icon tile, a label, and a chevron,
 * like a native mobile settings list.
 *
 * Renders as an <a> when it links out, or a <button> when it performs an
 * in-page action (only copy-contract-address, today).
 *
 * @param {{id: string, icon: string, label: string, url?: string, action?: string}} button
 */
export function PhoneAppButton(button) {
    const { id, icon, label, url, action } = button;
    const iconMarkup = svgIcon(icon, 'phone-app-btn-icon');
    const inner = `
        <span class="phone-app-btn-tile">${iconMarkup}</span>
        <span class="phone-app-btn-label">${escapeHtml(label)}</span>
        <span class="phone-app-btn-chevron" aria-hidden="true">›</span>`;

    if (action) {
        return `
            <button type="button" class="btn-reset phone-app-btn" id="${id}" data-action="${escapeHtml(action)}">${inner}</button>`;
    }

    return `
        <a class="phone-app-btn" id="${id}" href="${escapeHtml(url)}" target="_blank" rel="noopener" title="${escapeHtml(label)}">${inner}</a>`;
}
