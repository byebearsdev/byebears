import { CONTRACT_ADDRESS, LINKS } from '../config/site.js';

/**
 * Entries of the 8-bit hamburger ("arcade") menu.
 *
 * `action` is what the click handler switches on:
 *   - 'copy-ca' copies the contract address and keeps the menu open.
 *   - anything else opens `url` in a new tab and closes the menu.
 */
export const MENU_ITEMS = [
    { action: 'community',   icon: '🐦', label: 'COMMUNITY',   url: LINKS.community },
    { action: 'x-profile',   icon: '👤', label: 'X PROFILE',   url: LINKS.xProfile },
    { action: 'dexscreener', icon: '📈', label: 'DEXSCREENER', url: LINKS.dexscreener },
    { action: 'pumpfun',     icon: '🚀', label: 'PUMP.FUN',    url: LINKS.pumpfun },
    { action: 'copy-ca',     icon: '📋', label: 'COPY CA',     url: CONTRACT_ADDRESS },
    { action: 'youtube',     icon: '▶️', label: 'YOUTUBE',     url: LINKS.youtube },
];
