import { escapeHtml } from '../core/dom.js';

/** Extensions rendered as an `<img>` — anything else is treated as video. */
const IMAGE_EXTENSIONS = /\.(gif|png|jpe?g|webp|avif)$/i;

/**
 * A small looping sprite overlaid on a section's background footage — a
 * "character" that plays continuously, either as a tiny looping video or an
 * animated gif. Which one is picked automatically from `character.src`'s
 * file extension, so swapping an entry between a `.mp4` and a `.gif` in the
 * data just works without touching this component.
 *
 * Carries a speech-bubble callout that pops on hover — see
 * `initFireMemeStage()` in FireMemeStage.js for the listener that toggles it.
 *
 * @param {{variant: string, src: string, label: string, callout: string}} character
 */
export function CharacterVideo(character) {
    const media = IMAGE_EXTENSIONS.test(character.src)
        ? `<img src="${escapeHtml(character.src)}" alt="">`
        : `<video autoplay muted loop playsinline>
               <source src="${escapeHtml(character.src)}" type="video/mp4">
           </video>`;

    return `
        <div class="character-video character-video--${character.variant}"
             role="img" aria-label="${escapeHtml(character.label)}">
            <div class="character-callout">${escapeHtml(character.callout)}</div>
            ${media}
        </div>`;
}
