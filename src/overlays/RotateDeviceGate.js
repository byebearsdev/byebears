/* ==========================================================================
   OVERLAY — ROTATE DEVICE GATE
   Purely presentational: CSS decides when it appears (small screen + portrait),
   so there is no behaviour to initialise.

   Styled like the rest of the site's gate-panel signage (departures board,
   loading screen, hamburger menu) rather than the old 8-bit CRT look.

   It must stay a direct child of <body>, because
   `responsive/mobile-portrait.css` hides its siblings with
   `body > *:not(.rotate-device-overlay)`.
   ========================================================================== */

export function RotateDeviceGate() {
    return `
    <!-- ==================== OVERLAY: ROTATE DEVICE GATE — START ==================== -->
    <div class="rotate-device-overlay" id="rotateDeviceOverlay" role="dialog" aria-label="Rotate your device">
        <div class="rotate-device-panel">
            <div class="rotate-device-title">ROTATE TO CONTINUE</div>

            <div class="rotate-device-icon" aria-hidden="true">
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" stroke="#ffd700" stroke-width="3" stroke-linejoin="round">
                        <rect x="18" y="6"  width="28" height="52" rx="4" fill="#1a1a2e"/>
                        <rect x="22" y="12" width="20" height="36" fill="#ffb347" opacity="0.22"/>
                        <circle cx="32" cy="53" r="2.2" fill="#ffd700" stroke="none"/>
                        <rect x="28" y="8" width="8" height="2" fill="#ffd700" stroke="none"/>
                    </g>
                    <!-- Curved rotate arrow -->
                    <path d="M 6 32 A 18 18 0 0 1 32 14" fill="none" stroke="#ffb347" stroke-width="3"/>
                    <polygon points="30,8 38,14 30,20" fill="#ffb347"/>
                </svg>
            </div>

            <div class="rotate-device-text">TURN YOUR PHONE SIDEWAYS FOR<br>THE FULL BYEBEARS EXPERIENCE</div>
            <div class="rotate-device-hint">LANDSCAPE MODE REQUIRED</div>
        </div>
    </div>
    <!-- ==================== OVERLAY: ROTATE DEVICE GATE — END ==================== -->`;
}
