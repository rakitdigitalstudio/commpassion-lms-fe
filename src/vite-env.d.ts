/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Toggle MSW mock handlers on/off. See README "Mocking (MSW)". */
  readonly VITE_USE_MOCKS: string
  /** When "true", hides sign-in options on the Login page. See README "Login page". */
  readonly VITE_IS_COMING_SOON: string
  /** When "true", the whole app shows the Maintenance page instead of routing normally. See README "Maintenance page". */
  readonly VITE_MAINTENANCE_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
