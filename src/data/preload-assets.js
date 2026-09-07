/**
 * Assets the loading screen waits on before revealing the page.
 *
 * The progress bar advances one notch per asset, so the *count* here directly
 * controls how the bar fills. Keep both lists in sync with what the first two
 * screens actually need.
 */
export const PRELOAD_IMAGES = [
    'images/bearsection/bearbg01.png',
    'images/Intro_Girl01.png',
    'images/bearsection/section01bully.png',
    'images/Intro_Girl02.png',
    'images/chad.png',
    'images/section03_item01.gif',
    'images/section03_item02.gif',
    'images/section03_item03.gif',
    'images/section03_item04.gif',
    'images/photo_2026-04-09_20-54-06.jpg',
    'images/photo_2026-04-10_23-09-28.jpg',
];

export const PRELOAD_VIDEOS = [
    'images/sandcastle_bg.mp4',
    'images/section03.mp4',
];

/** Hard ceiling — the page reveals after this long even if assets stall. */
export const LOADING_TIMEOUT_MS = 5000;
