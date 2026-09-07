/**
 * Single source of truth for the token's identity and every outbound link.
 *
 * Before the refactor the contract address was hardcoded in four places (twice
 * in JS, twice in `href` attributes) and the social URLs were duplicated between
 * the hamburger menu and the controller buttons. Everything now derives from here.
 */

export const CONTRACT_ADDRESS = 'CcLd8HTAKLWtQHatqPwBQjtuCA72FNB9E1ckRTEzpump';

const DEX_PAIR = '89xnvggvkvtx5trrltkrpz6g2td2trsgphxewqps5in9';

export const LINKS = {
    xProfile:    'https://x.com/ALTSZN_Solana',
    youtube:     'https://www.youtube.com/@ALTSZNsol',
    community:   'https://www.youtube.com/@ALTSZNsol/community',
    dexscreener: `https://dexscreener.com/solana/${DEX_PAIR}`,
    pumpfun:     `https://pump.fun/coin/${CONTRACT_ADDRESS}`,
};

/**
 * Background videos, keyed by the section that owns them.
 *
 * `heroSunset` isn't here: that section's background is a static image now
 * (see HeroSunset.js), not a video.
 */
export const SECTION_VIDEOS = {
    arcadeHall: { id: 'videoArcadeHall', src: 'images/sandcastle_bg.mp4' },
    fireStage:  { id: 'videoFireStage',  src: 'images/section03.mp4' },
    snackTable: { id: 'videoSnackTable', src: 'images/bearsection/tsunami.mp4' },
    tubScene:   { id: 'videoTubScene',   src: 'images/bearsection/section05.mp4' },
    phoneMenu:  { id: 'videoPhoneMenu',  src: 'images/section06.mp4' },
    disclaimerPanel: { id: 'videoDisclaimerPanel', src: 'images/footer.mp4' },
};

/** Every background-video element id — used by the mute/unmute helpers. */
export const SECTION_VIDEO_IDS = Object.values(SECTION_VIDEOS).map((v) => v.id);

/**
 * Plays once, immediately after the loading screen clears.
 *
 * `startAt` trims a bit of silence baked into the start of the file itself
 * (measured by decoding the clip and finding the first non-silent sample —
 * see the other entries below for why this matters more on some clips).
 */
export const ANNOUNCE_AUDIO = {
    id:  'altsummerAnnounce',
    src: 'images/altsummer.mp3',
    startAt: 0.05,
};

/**
 * Played back-to-back right after the announcement, before the music starts.
 * `firstcheer.mp3` has a noticeably longer silent lead-in (~160ms) than the
 * others (~60-70ms) baked into the file, which is why it was the one that
 * felt like it had a delay.
 */
export const CHEER_AUDIO = [
    { id: 'firstCheer',  src: 'images/firstcheer.mp3',  startAt: 0.13 },
    { id: 'secondCheer', src: 'images/secondcheer.mp3', startAt: 0.04 },
];

/**
 * Starts the moment the cheers above do (the girls' scream), not after them —
 * see `playIntroClipsThenMusic()` in LoadingScreen.js.
 */
export const VICTORY_AUDIO = {
    id:  'victoryStinger',
    src: 'images/victory.mp3',
    startAt: 0,
};
