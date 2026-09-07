/**
 * Copy for the green-CRT terminal popup, keyed by snack-table prop.
 *
 * Line fields:
 *   text  — the line itself.
 *   cls   — '' | 'highlight' | 'gold' (gold is the pulsing sign-off line).
 *   html  — when true, `text` contains markup and is injected verbatim;
 *           otherwise it is HTML-escaped before rendering.
 *   bar   — [filled, empty], appends a blocky 8-bit loading bar to the line.
 */
export const TERMINAL_MESSAGES = {
    cooler: [
        { text: '// COLD STORAGE',               cls: 'highlight' },
        { text: 'FUNDS ARE SAFU.',                cls: '' },
        { text: 'ACCESSING VAULT',                cls: '', bar: [8, 2] },
        { text: 'DIAMOND HANDS DETECTED',         cls: '' },
        { text: 'NO PAPER HANDS ALLOWED',         cls: 'highlight' },
        { text: 'COLD STORAGE. WARM GAINS.',      cls: '' },
        { text: 'HODL THROUGH THE HEAT.',         cls: '' },
        { text: 'STACKING SEASON 🚀',   cls: 'gold' },
    ],
    bullJuice: [
        { text: '// REFRESHMENTS',                cls: 'highlight' },
        { text: 'ONE SIP = INSTANT BULLPOSTING.', cls: '' },
        { text: 'HYDRATING BAG HOLDERS',          cls: '', bar: [9, 1] },
        { text: 'ZERO SUGAR. ALL GAINS.',         cls: '' },
        { text: 'BEARS ARE ALLERGIC TO THIS.',    cls: 'highlight' },
        { text: 'SIDE EFFECTS: CONVICTION.',      cls: '' },
        { text: 'DRINK RESPONSIBLY. APE IRRESPONSIBLY.', cls: '' },
        { text: 'CHEERS TO BYEBEARS 🚀', cls: 'gold' },
    ],
    bullFloatie: [
        { text: '// POOL EQUIPMENT',              cls: 'highlight' },
        { text: 'STAY AFLOAT ALL SEASON.',        cls: '' },
        { text: 'INFLATING POSITION',             cls: '', bar: [7, 3] },
        { text: 'RATED FOR MAXIMUM PUMP.',        cls: '' },
        { text: 'BEARS CANNOT SWIM HERE.',        cls: 'highlight' },
        { text: '<span class="terminal-accent">$BYEBEARS</span> PRINTED ON THE SIDE.', cls: '', html: true },
        { text: 'FLOATING ABOVE THE DIP.',        cls: '' },
        { text: 'RIDE IT TO SHORE 🚀', cls: 'gold' },
    ],
    map: [
        { text: '// NAVIGATION',                  cls: 'highlight' },
        { text: 'X MARKS THE ALT SEASON.',        cls: '' },
        { text: 'PLOTTING ROUTE',                 cls: '', bar: [6, 4] },
        { text: 'CANDLES LEAD THE WAY.',          cls: '' },
        { text: 'FOLLOW THE GREEN PATH.',         cls: 'highlight' },
        { text: 'PAPER HANDS GET LOST.',          cls: '' },
        { text: 'TREASURE CONFIRMED AHEAD.',      cls: '' },
        { text: 'X MARKS THE TOP 🚀', cls: 'gold' },
    ],
    metalDetector: [
        { text: '// SIGNAL SCAN',                 cls: 'highlight' },
        { text: 'SCANNING THE SAND FOR ALPHA.',   cls: '' },
        { text: 'DETECTING GAINS',                cls: '', bar: [8, 2] },
        { text: 'BEEP. BEEP. BEEP.',              cls: '' },
        { text: 'BURIED BAG LOCATED.',            cls: 'highlight' },
        { text: 'DEPTH: DEGEN LEVEL.',            cls: '' },
        { text: 'DIG HERE.',                      cls: '' },
        { text: 'SIGNAL: STRONG BUY 🚀', cls: 'gold' },
    ],
    radio: [
        { text: '// NOW PLAYING',                 cls: 'highlight' },
        { text: 'TUNING INTO THE BULL FREQUENCY.', cls: '' },
        { text: 'BUFFERING VIBES',                cls: '', bar: [7, 3] },
        { text: 'STATIC CLEARED.',                cls: '' },
        { text: 'TOP OF THE CHARTS: <span class="terminal-accent">$BYEBEARS</span>', cls: 'highlight', html: true },
        { text: 'REQUESTS ONLY ACCEPTED IN GREEN.', cls: '' },
        { text: 'VOLUME: MAX HYPE.',              cls: '' },
        { text: 'TURN IT UP 🚀',      cls: 'gold' },
    ],
    solanaGlasses: [
        { text: '// EYEWEAR',                     cls: 'highlight' },
        { text: 'SEE THE CHARTS DIFFERENTLY.',    cls: '' },
        { text: 'POLARIZING FUD',                 cls: '', bar: [8, 2] },
        { text: 'UV PROTECTION FROM RED CANDLES.', cls: '' },
        { text: 'LENS TINT: PURPLE TO TEAL.',     cls: 'highlight' },
        { text: "CAN'T SEE THE DIP FROM HERE.",   cls: '' },
        { text: 'ONLY GREEN VISIBLE.',            cls: '' },
        { text: 'LOOKING BULLISH 🚀', cls: 'gold' },
    ],
    sunscreen: [
        { text: '// SUN PROTECTION',              cls: 'highlight' },
        { text: 'BLOCKS HARMFUL BEAR RAYS.',      cls: '' },
        { text: 'APPLYING SPF',                   cls: '', bar: [9, 1] },
        { text: 'FACTOR: SPX 69X.',               cls: '' },
        { text: 'BEARS BURN ON CONTACT.',         cls: 'highlight' },
        { text: 'REAPPLY EVERY CYCLE.',           cls: '' },
        { text: 'NO BEAR MARKET SURVIVES THIS SEASON.', cls: '' },
        { text: 'STAY PROTECTED 🚀',   cls: 'gold' },
    ],
    tikiSign: [
        { text: '// WEATHER REPORT',              cls: 'highlight' },
        { text: "TODAY'S FORECAST:",              cls: '' },
        { text: 'CALCULATING OUTLOOK',            cls: '', bar: [10, 0] },
        { text: 'SKIES: EXTREMELY GREEN.',        cls: 'highlight' },
        { text: 'CHANCE OF PUMP: 100%.',          cls: '' },
        { text: 'BEARS ADVISED TO STAY INDOORS.', cls: '' },
        { text: 'HIGH OF: ALL TIME.',             cls: '' },
        { text: 'PERFECT BYEBEARS DAY 🚀', cls: 'gold' },
    ],
};
