/**
 * Copy text to the clipboard.
 *
 * Replaces three separate near-identical implementations that existed before
 * the refactor. Falls back to the legacy `execCommand` path because the async
 * Clipboard API is unavailable on insecure origins and on `file://`.
 *
 * @returns {Promise<void>} resolves on success, rejects on failure
 */
export function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }

    return new Promise((resolve, reject) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        let ok = false;
        try {
            ok = document.execCommand('copy');
        } catch {
            ok = false;
        }
        document.body.removeChild(textarea);
        ok ? resolve() : reject(new Error('Clipboard copy failed'));
    });
}
