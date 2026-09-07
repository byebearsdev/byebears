import { closeVideoModal } from '../overlays/VideoModal.js';
import { closeGameModal } from '../overlays/GameModal.js';
import { closeTerminalPopup } from '../overlays/TerminalPopup.js';

/* ==========================================================================
   FEATURE — ESCAPE KEY

   One listener closes whatever is open. Each `close*` function no-ops unless
   its own overlay is actually open, so pressing Escape can safely ask all of
   them. (The arcade menu handles Escape itself, alongside its arrow-key
   navigation.)
   ========================================================================== */

export function initEscapeKey() {
    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        closeVideoModal();
        closeGameModal();
        closeTerminalPopup();
    });
}
