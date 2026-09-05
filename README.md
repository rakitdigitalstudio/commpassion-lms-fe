# commpassion-lms-fe

LMS client for Compassion — the authenticated area where users watch courses, manage
purchases, and handle payment. Separate from `commpassion-landing-page` (Next.js); per
SDS §3.B this app is mostly CSR behind auth, so it's plain React via Vite instead of Next.

Ticket 1 was scaffold-only (no API calls, auth logic, or styled components). Ticket 2
added Tailwind CSS and the design token layer described below.

## Getting started

This project uses **pnpm** (not npm/yarn) — see [Package manager](#package-manager).

```bash
pnpm install
pnpm dev
```

## Scripts

- `pnpm dev` — start the dev server with HMR
- `pnpm build` — type-check and build for production
- `pnpm preview` — preview the production build locally
- `pnpm lint` — run ESLint
- `pnpm format` — format the codebase with Prettier
- `pnpm format:check` — check formatting without writing changes

## Package manager

pnpm only. Don't commit `package-lock.json` or `yarn.lock` — `pnpm-lock.yaml`
is the single lockfile for this repo.

## Project structure

```
src/
  components/   shared UI components
  lib/          shared utilities/helpers
  pages/        route-level page components
  routes/       React Router route definitions
```

## Path aliases

`@/*` resolves to `src/*` (configured in `tsconfig.app.json` and `vite.config.ts`).

## Routes

Placeholder routes only, no auth guards yet:

- `/login`
- `/dashboard`
- `/purchases`
- `/explore`
- `/settings`
- `/courses/:courseId`
- `/style-guide` — palette and type scale reference (Ticket 2)

## Design tokens

Tailwind CSS v4, config lives in `src/index.css` via `@theme` — there is no
`tailwind.config.ts`. Visit `/style-guide` for a live reference.

- `--color-primary` (`#84c6da`) and `--color-accent` (`#faea05`) are pulled
  from the same Figma file as `compassion-landing-page` (see that repo's
  `globals.css`) — not eyeballed.
- Status colors (`--color-success`, `--color-info`, `--color-warning`), the
  type scale (`--text-display`/`h2`/`h3`/`stat`), radius (`--radius-card`,
  `--radius-control`), and `--shadow-card` are eyeballed from the dashboard
  mockups (Images 1-9), **not** pulled from Figma yet — this repo doesn't
  have Figma Editor access. Flagging per Ticket 2: someone with Editor
  access needs to confirm/replace these against the real file.
- Font is DM Sans (`@fontsource-variable/dm-sans`), matching
  `compassion-landing-page`'s `next/font` choice.

## Git Workflow

- **One branch per ticket** — branch off `master` as `feat/<issue-number>`
  for features/chores or `fix/<issue-number>` for bug fixes (e.g. `feat/1`,
  `fix/14`). Never commit straight to `master`.
- **Atomic commits** — each commit is one coherent, buildable change; split
  unrelated changes into separate commits rather than bundling them.
- **Squash and merge** — PRs land on `master` via squash merge, so the
  branch's commit history can stay working-but-messy; the squashed commit
  message is what matters and should summarize the ticket.

## Coding Conventions

- **Prefer component composition, especially on pages** — build pages by
  composing small, named components rather than one long JSX tree, so the
  page's structure is legible at a glance.
- **Always use utilities/helpers** — don't duplicate logic inline; extract
  shared logic into `src/lib/` (or the nearest appropriate utils file)
  instead of copy-pasting.
- **No hardcoded user-facing text** — all copy goes through next-intl
  messages or Strapi content; see [Internationalization](#internationalization-enid)
  for which one.
- **Type safety, no `any`** — define explicit types/interfaces for CMS
  (Strapi) response shapes and component props.
- **Interfaces live in `<name>.types.ts`** — for a module with non-trivial
  types (CMS content modules, API clients), put its interfaces/types in a
  sibling `<name>.types.ts` file rather than inline in the implementation
  file; e.g. `src/lib/cms/articles.ts` + `src/lib/cms/articles.types.ts`.
  Simple component prop types can stay inline.
- **Small, single-responsibility components** — split a component or page
  when it mixes concerns or grows too large; this is what makes composition
  (above) actually work.
- **Env vars via `.env.example`** — never hardcode secrets or API URLs; any
  new env var used in code must be added to `.env.example`.
- **Accessibility basics** — semantic HTML, `alt` text on images, labeled
  form controls on every new component.

## Styling

Tailwind CSS utility classes. Design tokens (`@theme` values — colors,
spacing, type scale) are Ticket 2's scope; until that lands, only Tailwind
defaults are available.

## Internationalization (EN/ID)

Two systems handle translation — know which one a given piece of copy
belongs to:

**Static UI copy** → next-intl, `messages/en.json` + `messages/id.json`

- Nav labels, button labels, form labels, error/empty states, pagination
  text
- Anything structural to the UI, not editable by the client

**Dynamic CMS content** → Strapi i18n plugin, fetched via `?locale=en` /
`?locale=id`

- Hero/Manifesto/landing section copy, Article title/excerpt/body, footer
  tagline, SEO defaults, category names
- Anything the client should be able to edit themselves

**Not translated** (same value both locales)

- Phone, email, address, social links, WhatsApp number (Site Config,
  Ticket 8)

Locale codes: use `en` / `id` consistently across both Next.js routing and
Strapi locale settings — no `en-US` vs `en` mismatches.
