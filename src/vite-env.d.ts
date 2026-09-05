/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Toggle MSW mock handlers on/off. See README "Mocking (MSW)". */
  readonly VITE_USE_MOCKS: string
  /** When "true", hides sign-in options on the Login page. See README "Login page". */
  readonly VITE_IS_COMING_SOON: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
