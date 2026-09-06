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
