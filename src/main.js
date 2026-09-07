import './styles/main.css';

/* ---------- Chrome ---------- */
import { ArcadeBackdrop, GlobalHeatHaze, GlobalSunGlow, MarqueeBar, SiteHeader } from './chrome/PageChrome.js';
import { BgmToggle, MenuButton, initChromeButtons } from './chrome/ChromeButtons.js';
import { ScrollIndicator, initScrollIndicator } from './chrome/ScrollIndicator.js';

/* ---------- Overlays ---------- */
import { RotateDeviceGate } from './overlays/RotateDeviceGate.js';
import { LairGate, initLairGate, revealBullWipe } from './overlays/LairGate.js';
import { LoadingScreen, initLoadingScreen } from './overlays/LoadingScreen.js';
import { ArcadeMenu, initArcadeMenu } from './overlays/ArcadeMenu.js';
import { TerminalPopup, initTerminalPopup } from './overlays/TerminalPopup.js';
import { VideoModal, initVideoModal } from './overlays/VideoModal.js';
import { GameModal, initGameModal } from './overlays/GameModal.js';
import { DesktopOnlyNotice, initDesktopOnlyNotice } from './overlays/DesktopOnlyNotice.js';

/* ---------- Sections, in scroll order ---------- */
import { HeroSunset } from './sections/HeroSunset.js';
import { ArcadeHall, initArcadeHall } from './sections/ArcadeHall.js';
import { FireMemeStage, initFireMemeStage } from './sections/FireMemeStage.js';
import { SnackTable, initSnackTable } from './sections/SnackTable.js';
import { TubScene, initTubScene } from './sections/TubScene.js';
import { PhoneMenu, initPhoneMenu } from './sections/PhoneMenu.js';
import { DisclaimerPanel, initDisclaimerPanel } from './sections/DisclaimerPanel.js';

/* ---------- Cross-cutting features ---------- */
import { initAudioResumer } from './core/audio-context.js';
import { initSectionVideoAudio } from './features/section-video-audio.js';
import { initGlobalSfx } from './features/global-sfx.js';
import { initEscapeKey } from './features/escape-key.js';
import { setChromeVisible } from './core/dom.js';

/* ==========================================================================
   APPLICATION ENTRY POINT

   Two strict phases:
     1. RENDER — every component produces markup, which is injected in one go.
     2. INIT   — behaviour is attached to a DOM that is already complete.

   Splitting them this way removes the parse-order fragility of the original
   single-file page, where scripts reached for elements that happened to be
   above them in the document.
   ========================================================================== */

/* --------------------------------------------------------------------------
   PHASE 1 — RENDER
   Components are inserted as direct children of <body> (not wrapped in a
   container) because `responsive/mobile-portrait.css` relies on
   `body > *:not(.rotate-device-overlay)` to hide the page behind the gate.
   -------------------------------------------------------------------------- */
function render() {
    return [
        // Mobile portrait gate — must come first and stay a body-level sibling.
        RotateDeviceGate(),

        // Wojak's frozen lair — the very first thing visitors see.
        LairGate(),

        // Start-up sequence: silent asset preload.
        LoadingScreen(),

        // Persistent chrome.
        ScrollIndicator(),
        GlobalHeatHaze(),
        GlobalSunGlow(),
        MarqueeBar(),
        SiteHeader(),
        BgmToggle(),
        MenuButton(),
        ArcadeBackdrop(),
        ArcadeMenu(),

        // The scrolling page itself.
        `<main class="scroll-container" id="scrollContainer">
            ${HeroSunset()}
            ${ArcadeHall()}
            ${FireMemeStage()}
            ${SnackTable()}
            ${TubScene()}
            ${PhoneMenu()}
            ${DisclaimerPanel()}
        </main>`,

        // Overlays that cover the page, plus their media elements.
        TerminalPopup(),
        VideoModal(),
        GameModal(),
        DesktopOnlyNotice(),
    ].join('\n');
}

/* --------------------------------------------------------------------------
   PHASE 2 — INIT
   -------------------------------------------------------------------------- */

/** Runs once assets are preloaded and the page becomes visible. */
function revealPage() {
    document.getElementById('scrollContainer').style.visibility = 'visible';
    setChromeVisible(true);

    // Only now start listening for sections coming into view, so the intro
    // sequence can't kick off a section's audio before the page is on screen.
    initSectionVideoAudio();

    // The page is actually on screen now — safe to uncover the green wipe
    // left over from the lair gate's death-video handoff (a no-op if that
    // wipe was never triggered, e.g. the visitor used the skip button).
    revealBullWipe();
}

function init() {
    // Always-on behaviour.
    initAudioResumer();
    initGlobalSfx();
    initEscapeKey();
    initChromeButtons();
    initScrollIndicator();

    // Sections.
    initArcadeHall();
    initFireMemeStage();
    initSnackTable();
    initTubScene();
    initPhoneMenu();
    initDisclaimerPanel();

    // Overlays.
    initArcadeMenu();
    initTerminalPopup();
    initVideoModal();
    initGameModal();
    initDesktopOnlyNotice();

    // Start-up chain: lair → silent preload → page.
    const loadingScreen = initLoadingScreen(revealPage);
    initLairGate(loadingScreen.start);
}

document.body.insertAdjacentHTML('afterbegin', render());
init();
