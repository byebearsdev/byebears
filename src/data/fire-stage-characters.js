/**
 * Looping characters overlaid on the fire-stage's beach-bar footage.
 *
 * `src` can point at either a video or an animated gif — CharacterVideo.js
 * picks the right markup automatically from the file extension. All four are
 * gifs right now, but nothing here assumes that.
 *
 * `callout` is the speech-bubble text shown on hover (see
 * `initFireMemeStage()` in FireMemeStage.js).
 *
 * Each position is tuned against the current background footage — see the
 * matching `.character-video--{variant}` rule in character-video.css.
 */
export const FIRE_STAGE_CHARACTERS = [
    {
        variant: 'umbrella',
        src: 'images/section03_item01.gif',
        label: 'Setting up the beach umbrella',
        callout: 'NO BEARS ALLOWED!',
    },
    {
        variant: 'lounging-pepe',
        src: 'images/section03_item02.gif',
        label: 'Pepe relaxing in a beach chair',
        callout: 'GET YO CRYPTO UP!',
    },
    {
        variant: 'floating-penguin',
        src: 'images/section03_item03.gif',
        label: 'Penguin floating on an inner tube',
        callout: 'WAGMI!',
    },
    {
        variant: 'volleyball',
        src: 'images/section03_item04.gif',
        label: 'Beach volleyball game',
        callout: 'WE DIAMOND HANDED!',
    },
];
