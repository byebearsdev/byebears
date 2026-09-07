/* ==========================================================================
   CHROME — SCROLL INDICATOR
   Bouncing hint at the bottom of the first screen; fades out once the visitor
   has scrolled a little.
   ========================================================================== */

const HIDE_AFTER_PX = 100;

export function ScrollIndicator() {
    return `
    <!-- ==================== CHROME: SCROLL INDICATOR ==================== -->
    <div class="scroll-indicator" id="scrollIndicator" aria-hidden="true">
        <div class="scroll-arrow"></div>
        <div class="scroll-text">SCROLL</div>
    </div>`;
}

export function initScrollIndicator() {
    const indicator = document.getElementById('scrollIndicator');
    const container = document.getElementById('scrollContainer');
    if (!indicator || !container) return;

    container.addEventListener('scroll', () => {
        indicator.classList.toggle('is-hidden', container.scrollTop > HIDE_AFTER_PX);
    }, { passive: true });
}
