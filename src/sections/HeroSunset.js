/* ==========================================================================
   SECTION — HERO SUNSET
   Static background image, with a trio of characters layered on top. The
   section keeps a fixed 16:9 box (see hero-sunset.css) that the image fills
   with `object-fit: cover`.
   ========================================================================== */

export function HeroSunset() {
    return `
    <!-- ==================== SECTION: HERO SUNSET — START ==================== -->
    <section class="hero-sunset" aria-label="BYEBEARS">
        <div class="hero-sunset-bg">
            <img src="images/bearsection/bearbg01.png" alt="No bears allowed beach entrance">
        </div>

        <div class="hero-content">
            <!-- Girl-left / Chad+bear / Girl-right: the two girl cutouts were drawn
                 as a mirrored pair (each raises her inner arm toward the centre), so
                 this order reads as one group gesture rather than three separate
                 cutouts. -->
            <div class="hero-characters">
                <div class="hero-character hero-character--girl-left">
                    <img src="images/Intro_Girl01.png" alt="Beach girl waving">
                </div>
                <div class="hero-character hero-character--chad">
                    <img src="images/bearsection/section01bully.png" alt="Chad holding up the defeated bear">
                </div>
                <div class="hero-character hero-character--girl-right">
                    <img src="images/Intro_Girl02.png" alt="Beach girl waving">
                </div>
            </div>
        </div>
    </section>
    <!-- ==================== SECTION: HERO SUNSET — END ==================== -->`;
}
