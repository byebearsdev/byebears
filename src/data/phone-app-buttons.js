import { LINKS, CONTRACT_ADDRESS } from '../config/site.js';

/**
 * Rows in the phone's app menu (PhoneMenu.js) — the site's link/action list,
 * carried over unchanged from the old gamepad controller, just as a mobile
 * nav list instead of face buttons.
 *
 * The copy-CA row is the only one that isn't a link, so it renders as a
 * <button> and gets its behaviour wired up in `PhoneMenu.js`.
 */
export const PHONE_APP_BUTTONS = [
    { id: 'phoneChart',     icon: 'chart',     label: 'Chart',     url: LINKS.dexscreener },
    { id: 'phoneBuy',       icon: 'buy',       label: 'Buy Now',   url: LINKS.pumpfun },
    { id: 'phoneX',         icon: 'x',         label: 'X',         url: LINKS.xProfile },
    { id: 'phoneYoutube',   icon: 'youtube',   label: 'YouTube',   url: LINKS.youtube },
    { id: 'phoneCommunity', icon: 'community', label: 'Community', url: LINKS.community },
    { id: 'phoneCopyCa',    icon: 'copy',      label: 'Copy CA',   action: 'copy-ca', value: CONTRACT_ADDRESS },
];
