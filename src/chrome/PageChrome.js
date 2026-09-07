/* ==========================================================================
   PAGE CHROME
   Persistent furniture that sits outside the scrolling content: the fixed
   backdrop, the heat-haze rise, the sun-glow rays, the marquee ticker, and
   the header.
   ========================================================================== */

const MARQUEE_MESSAGE = "THE BEARS ARE GONE, IT'S TIME TO PRINT THAT MONEY 🐂 &nbsp;&nbsp; DIAMOND HANDS ONLY, NO BEARS ALLOWED 💎 &nbsp;&nbsp; GREEN CANDLES AS FAR AS THE EYE CAN SEE 📈";

/** Repeats per copy — tuned so the text fills a wide viewport. */
const REPEATS_PER_COPY = 4;

/** Fixed gradient backdrop behind everything. */
export function ArcadeBackdrop() {
    return `
    <!-- ==================== CHROME: ARCADE BACKDROP ==================== -->
    <div class="arcade-backdrop" aria-hidden="true"></div>`;
}

/**
 * Full-viewport heat-shimmer distortion.
 *
 * Two previous passes painted a texture (light rays, then rising bands) on
 * top of the page — both looked like an overlay because that's exactly what
 * they were. Real heat haze doesn't add anything on top; it warps the air
 * itself. `backdrop-filter: url(#heatDistort)` does the same thing here: the
 * SVG filter below (feTurbulence → feDisplacementMap) actually displaces the
 * pixels behind this layer by a few px, and the turbulence's frequency
 * drifts slowly so the warp flows rather than scrolling in one direction.
 *
 * The `<svg>` only defines the filter — it has zero size and paints nothing
 * itself. The div below carries a faint orange tint (see page-chrome.css)
 * so the wobble reads as heat rather than an unexplained glitch; if a
 * browser doesn't support an SVG-referenced backdrop-filter, that tint is
 * all that's left — a graceful, barely-there fallback rather than a broken
 * or jarring one.
 */
export function GlobalHeatHaze() {
    return `
    <!-- ==================== CHROME: GLOBAL HEAT HAZE ==================== -->
    <svg aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0">
        <filter id="heatDistort" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" numOctaves="2" seed="7" result="heatNoise">
                <animate attributeName="baseFrequency"
                         values="0.006 0.015; 0.009 0.02; 0.006 0.015"
                         dur="16s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="heatNoise" scale="6"
                                xChannelSelector="R" yChannelSelector="G" />
        </filter>
    </svg>
    <div class="global-heat-haze" id="globalHeatHaze" aria-hidden="true"></div>`;
}

/** Full-viewport warm sun-glow wash, drifting slowly over everything. */
export function GlobalSunGlow() {
    return `
    <!-- ==================== CHROME: GLOBAL SUN GLOW ==================== -->
    <div class="global-sun-glow" id="globalSunGlow" aria-hidden="true"></div>`;
}

/**
 * Scrolling ticker.
 *
 * The track holds two identical copies and translates exactly -50%, so the
 * loop is seamless. Decorative, hence `aria-hidden`.
 */
export function MarqueeBar() {
    const copy = Array(REPEATS_PER_COPY).fill(MARQUEE_MESSAGE).join(' &nbsp;&nbsp; ');
    const track = `<span class="marquee-text">${copy}</span>`;
    return `
    <!-- ==================== CHROME: MARQUEE BAR ==================== -->
    <aside class="marquee-bar" id="marqueeBar" aria-hidden="true">
        <div class="marquee-content">${track}${track}</div>
    </aside>`;
}

/** Fixed wordmark under the marquee. */
export function SiteHeader() {
    return `
    <!-- ==================== CHROME: SITE HEADER ==================== -->
    <header class="site-header" id="siteHeader">
        <h1 class="site-header-title">$BYEBEARS</h1>
    </header>`;
}
