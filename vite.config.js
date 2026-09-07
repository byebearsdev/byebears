import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [],

    /*
     * Relative base so the built site works from any path (root domain, a
     * sub-folder, or opened straight from disk). This is what lets every asset
     * reference in the source stay written as `images/foo.png` instead of
     * `/images/foo.png` — exactly as it was before the refactor.
     */
    base: './',

    /*
     * `public/` is copied verbatim into `dist/`. Since index.html also lands at
     * the dist root, the relative `images/...` paths resolve identically in dev,
     * in the production build, and from the file system.
     */
    publicDir: 'public',

    server: {
        open: true,
    },

    build: {
        outDir: 'dist',
        // The audio/video files are already compressed; don't inline any of them.
        assetsInlineLimit: 0,
    },
});
