/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Toggle MSW mock handlers on/off. See README "Mocking (MSW)". */
  readonly VITE_USE_MOCKS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
