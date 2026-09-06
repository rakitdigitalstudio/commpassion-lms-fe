// Copies .env.example to .env.local on install if .env.local doesn't
// exist yet. Vite only reads .env/.env.local/.env.[mode](.local) — never
// .env.example, which is a template only — so without this, a fresh
// `pnpm install && pnpm dev` silently gets every VITE_* flag as
// `undefined` (mocks off, coming-soon off, etc.) with no indication why.
// See TODO.md / Ticket #43.
import { copyFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const example = `${root}/.env.example`
const local = `${root}/.env.local`

if (!existsSync(local)) {
  copyFileSync(example, local)
  console.log('Created .env.local from .env.example (first install).')
}
