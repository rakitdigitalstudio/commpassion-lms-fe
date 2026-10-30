/**
 * Single place that reads import.meta.env. Everywhere else imports the
 * exported constants from here instead of reading `import.meta.env.VITE_*`
 * directly — keeps flag names and parsing (e.g. `=== 'true'`) in one spot
 * instead of repeated inline checks across pages. See README "Config".
 */

/** MSW mock handlers on/off. See README "Mocking (MSW)". */
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

/** Hides the Login page's sign-in form/sign-up link. See README "Login page". */
export const IS_COMING_SOON = import.meta.env.VITE_IS_COMING_SOON === 'true'

/** When true, the whole app shows the Maintenance page instead of routing normally. See README "Maintenance page". */
export const MAINTENANCE_MODE = import.meta.env.VITE_MAINTENANCE_MODE === 'true'

/** Strapi base URL — public course catalog (Ticket #29). */
export const STRAPI_URL = import.meta.env.VITE_STRAPI_URL ?? 'http://localhost:1337'

/** Golang API base URL. Empty means same-origin (e.g. MSW or a dev proxy). */
export const API_URL = import.meta.env.VITE_API_URL ?? ''

/**
 * Midtrans Snap client key (Ticket #68) — public by design (Midtrans
 * documents it as safe to ship client-side), but unset until a real
 * sandbox/production key exists. Empty means Snap.js can't be loaded yet;
 * see lib/midtrans.ts.
 */
export const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY ?? ''

/** Loads Snap.js from Midtrans's production host instead of sandbox. Off (sandbox) by default. */
export const MIDTRANS_IS_PRODUCTION = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true'
