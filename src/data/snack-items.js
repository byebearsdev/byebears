/**
 * Clickable props on the snack table (the beach-themed summer table section).
 *
 * `position` values are percentages of the section box. These are DEFAULT
 * placeholder values only — spread out just enough that every prop is
 * visible and clickable without overlapping. Final placement is meant to be
 * hand-tuned against the `section04.mp4` footage; see `position` in each
 * entry and the matching `.snack-item` rules in `snack-table.css`.
 *
 * `theme` is optional — most of these props don't have a matching theme
 * song, so `TerminalPopup.js` simply skips music for any item without one.
 *
 * `openImage` is optional and only used by the cooler: when set, clicking
 * the prop swaps its `<img>` to this src (in addition to opening the
 * terminal popup), so the cooler visibly pops open and stays that way.
 */
export const SNACK_ITEMS = [
    {
        key:      'cooler',
        label:    'Cold Storage Cooler',
        image:    'images/beachitems/Cooler/cooler-closed.png',
        openImage: 'images/beachitems/Cooler/cooler-opened.png',
        position: { zIndex: 5, left: '10%', top: '75%', width: '14%' },
    },
    {
        key:      'bullJuice',
        label:    'Bull Juice',
        image:    'images/beachitems/alt_juice.png',
        position: { zIndex: 5, left: '23%', top: '55%', width: '8%' },
    },
    {
        key:      'bullFloatie',
        label:    'Bull Floatie',
        image:    'images/beachitems/bull-floatie.png',
        position: { zIndex: 4, left: '66%', top: '48%', width: '16%' },
    },
    {
        key:      'map',
        label:    'Treasure Map',
        image:    'images/beachitems/map.png',
        position: { zIndex: 4, left: '55%', top: '80%', width: '12%' },
    },
    {
        key:      'metalDetector',
        label:    'Metal Detector',
        image:    'images/beachitems/metal_detector.png',
        position: { zIndex: 5, left: '70%', top: '75%', width: '14%' },
    },
    {
        key:      'radio',
        label:    'Beach Radio',
        image:    'images/beachitems/radio.gif',
        position: { zIndex: 4, left: '5%', top: '35%', width: '10%' },
    },
    {
        key:      'solanaGlasses',
        label:    'Solana Glasses',
        image:    'images/beachitems/solana_glasses.png',
        position: { zIndex: 5, left: '50%', top: '45%', width: '7%' },
    },
    {
        key:      'sunscreen',
        label:    'Bear Block Sunscreen',
        image:    'images/beachitems/sunscreen.png',
        position: { zIndex: 5, left: '55%', top: '60%', width: '6%' },
    },
    {
        key:      'tikiSign',
        label:    'Alt Forecast Sign',
        image:    'images/beachitems/tiki_sign.png',
        position: { zIndex: 3, left: '2%', top: '12%', width: '16%' },
    },
];

/** Base playback volume for every theme; a prop may scale it via `volumeScale`. */
export const THEME_VOLUME = 0.5;
