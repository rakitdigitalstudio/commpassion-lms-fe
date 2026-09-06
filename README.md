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

`.env.local` is created automatically from `.env.example` (see
`scripts/ensure-env.mjs`, run via `postinstall` and `predev`) if it
doesn't exist yet — you don't need to copy it by hand. **Never edit
`.env.example` expecting it to take effect** — Vite only reads `.env`/
`.env.local`/`.env.[mode](.local)`, never `.env.example`; it's a template
only. Edit `.env.local` (gitignored, per-machine) instead.

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
  hooks/        shared hooks (useApiQuery/useApiMutation, etc.)
  lib/          shared utilities/helpers (query client, query-key factory)
  pages/        route-level page components
  providers/    app-level context providers (QueryProvider, etc.)
  routes/       React Router route definitions
```

## Path aliases

`@/*` resolves to `src/*` (configured in `tsconfig.app.json` and `vite.config.ts`).

## Routes

- `/login`, `/register` — guest-only (redirect to `/dashboard` if already
  authenticated); `/register` has no design yet (see "Register page")
- `/dashboard`, `/purchases`, `/settings`, `/courses/:courseId` — protected,
  wrapped in `AppShell` (see "App shell")
- `/explore` — public, outside the shell (see "App shell")
- `/forgot-password`, `/reset-password?token=...` — public, no design yet
  (see "Forgot / reset password")
- `/style-guide` — palette, type scale, and component reference (Ticket 2/6)
- `*` (catch-all, public, must stay last) — `NotFound` (404) for any
  unmatched URL

## Design tokens

Tailwind CSS v4, config lives in `src/index.css` via `@theme` — there is no
`tailwind.config.ts`. Visit `/style-guide` for a live reference.

- `--color-primary` (`#84c6da`) and `--color-accent` (`#faea05`) are pulled
  from the same Figma file as `compassion-landing-page` (see that repo's
  `globals.css`) — not eyeballed.
- Status colors (`--color-success`, `--color-info`, `--color-warning`,
  `--color-highlight`), the type scale (`--text-display`/`h2`/`h3`/`stat`),
  radius (`--radius-card`, `--radius-control`), and `--shadow-card` are
  eyeballed from the dashboard mockups (Images 1-9), **not** pulled from
  Figma yet — this repo doesn't have Figma Editor access. Flagging per
  Ticket 2: someone with Editor access needs to confirm/replace these
  against the real file.
- Font is DM Sans (`@fontsource-variable/dm-sans`), matching
  `compassion-landing-page`'s `next/font` choice.
- **Light mode only, no dark mode** — `color-scheme: light` on `:root`,
  no `prefers-color-scheme: dark` media query. Fixed regardless of the
  user's OS/browser setting.

## Component library

Shared, reusable UI components live in `src/components/`. Visit
`/style-guide` for a live reference of every component and variant.

- `Button` — `primary` / `accent` / `outline` / `success` variants.
  `success` isn't in Ticket #6's original list; added to match the
  Purchases mockup's green "View Certificate" CTA.
- `StatusBadge` — `completed` / `in-progress` / `not-started`.
- `Progress` — the universal progress bar. `value` (0-100) plus plain CSS
  color strings for `trackColor` (default `#D9D9D980`, i.e. `#D9D9D9` at
  50% opacity) and `color` (default `#84C6DA`, matching `--color-primary`)
  — colors are CSS strings, not Tailwind classes, so an exact Figma value
  (including alpha) can be passed through without inventing a token per
  usage. `ProgressBar` (below) wraps it.
- `ProgressBar` — colored by the same `Status` as `StatusBadge` (via CSS
  `var(--color-success|info|warning)` passed to `Progress`), so a
  course's badge and bar always agree. A thin wrapper, not a separate
  implementation.
- `StatCard` — plain (dashboard) or with an `icon` (purchases-page style).
- `CourseCard` — `catalog` | `purchased` variant via a discriminated union
  (`CourseCard.types.ts`). **`catalog` is inferred, not pixel-matched** —
  none of the provided mockups show it; Ticket #21 should refine it.
  `purchased` matches the My Purchases mockup.
- `EmptyState` — icon + heading + subtext + optional CTA.

## App shell

`AppShell` (`src/components/AppShell.tsx`) is the single layout —
sidebar + topbar + `<Outlet>` — wrapping every protected route via a
parent route in `src/routes/index.tsx`. `Sidebar` highlights the active
nav item and wires its logout button to `useAuth().logout()`; `Topbar`
reads the current user from `useAuth()` (no hardcoded user data). Icons
are a small hand-authored set in `src/components/icons.tsx` — no icon
library added yet.

`/explore` is intentionally outside the shell (no mockup shows an
authenticated Explore page) — see `TODO.md` for why, and revisit
alongside Ticket #20. Its content is currently a generic "still under
construction" `EmptyState` (`src/pages/Explore.tsx`) — the real catalog
page is Ticket #20's job, not built yet.

## Data fetching (TanStack Query)

All server data — Strapi and the Golang API alike, once the client modules
in Ticket #3 land (blocked, see `TODO.md`) — goes through
[TanStack Query](https://tanstack.com/query), not raw `fetch`/`useEffect`.

- **Never call `useQuery`/`useMutation` directly.** Use the wrapper hooks
  in `src/hooks/`: `useApiQuery` for reads, `useApiMutation` for writes.
  They exist so app-wide defaults (`staleTime`, `retry`, cache
  invalidation — see `src/lib/query-client.ts`) live in one place instead
  of being repeated, and drifting, at every call site.
- **Query keys come from `src/lib/query-keys.ts`.** Don't hand-write a key
  array inline — add a branch to the `queryKeys` factory instead. This is
  what keeps `useApiMutation`'s `invalidateKeys` in sync with the queries
  it's supposed to invalidate.
- **One hook per resource.** Wrap each API client function in its own
  named hook (e.g. `useCourses()`, `useUserStats()`) rather than calling
  `useApiQuery` ad hoc inside components. Put the hook next to the
  component(s) that use it, or in `src/hooks/` if it's shared.
- **Mutations declare `invalidateKeys`.** Any mutation that changes server
  state passes the query keys that should refetch afterward — don't
  manually refetch or reload the page instead.
- **No fetching in `useEffect`.** If data is needed before render, use the
  query's `isLoading`/`isPending` state (or a route loader later), not a
  manual effect + `useState`.
- **Errors are surfaced, not swallowed.** Read `error`/`isError` off the
  hook and let the component decide how to render it — don't catch and
  discard in the query/mutation function.

Example, once a real API function exists:

```ts
// src/hooks/useCourses.ts
import { getCourses } from '@/lib/api/strapi'
import { useApiQuery } from '@/hooks/useApiQuery'
import { queryKeys } from '@/lib/query-keys'

export function useCourses() {
  return useApiQuery(queryKeys.courses(), getCourses)
}
```

## Mocking (MSW)

[Mock Service Worker](https://mswjs.io) intercepts client-module fetch calls
at the network level so features can be built before either backend
(Strapi, Golang) is running.

- Toggle: `VITE_USE_MOCKS` in `.env.local` (auto-created from
  `.env.example` — see "Getting started"). `"true"` starts the MSW
  worker before the app renders (see
  `src/mocks/enable-mocks.ts`); anything else is a no-op, so flipping it to
  `"false"` (or unsetting it) turns mocking off without removing the
  handlers.
- Handlers live in `src/mocks/handlers.ts`. **Auth handlers only so far**
  (`csrf`, `login`, `me`, `logout`, `register`, `forgot-password`,
  `reset-password`) — see `TODO.md`: the rest need SDS §6 (exact response
  shapes) and §2, both still blocked. The auth ones are provisional too
  (see below), in-memory, and reset on page reload.
- `public/mockServiceWorker.js` is generated by `msw init` — don't hand-edit
  it; regenerate with `pnpm exec msw init public/ --save` if it's ever out
  of date with the installed `msw` version.
- **Mock login credentials:** `marco.herbert@example.com` /
  `password123` (see `src/mocks/handlers.ts`). Any other combination
  returns a 401, so the Login page's error state is exercisable.
- **Mock reset token:** any value except `"invalid"` or empty succeeds at
  `/reset-password?token=...`.

## Auth

`src/context/auth-context.ts` + `src/providers/AuthProvider.tsx` resolve
the current user via `getMe()` on app load (`useAuth()` to read it
anywhere without prop-drilling). Route guards in `src/routes/`:

- `<ProtectedRoute>` — redirects to `/login` if there's no user
- `<GuestOnlyRoute>` — redirects to `/dashboard` if there already is one
  (wraps `/login`)

**`src/lib/api/auth.ts` / `auth.types.ts` are PROVISIONAL** — built from
usual login/getMe/logout conventions and the SDS §4 `users` columns, not
from SDS §6 (which we don't have — see `TODO.md`). The `User` shape and
`{ user }` response envelope may not match the real backend; re-confirm
once §6 lands. CSRF header injection + `credentials: 'include'` follow
Ticket #3's requirement for the Golang client wrapper.

## Config

`src/lib/config.ts` is the **only** place that reads `import.meta.env`.
Everywhere else imports the exported constant (`IS_COMING_SOON`,
`USE_MOCKS`, `MAINTENANCE_MODE`) instead of reading
`import.meta.env.VITE_*` inline — one place for flag names and parsing
(`=== 'true'`), so it can't drift between call sites. Add new env-derived
flags here, not inline in a component.

## Logo & favicon

`src/assets/compassion-logo-blue.png` (the `Logo` component,
`src/components/Logo.tsx`) and `public/favicon.ico` are copied from
`compassion-landing-page` (`src/assets/compassion-logo-blue.png` and
`src/app/favicon.ico`) — the real brand wordmark/icon, not a placeholder.
`Sidebar` still uses the small hand-authored `LogoIcon` (from
`src/components/icons.tsx`) instead, since the sidebar mockup shows a
plain icon + separate "CommPassion" text, not the full wordmark.

## Forms

Extract a form's state + submit logic into a dedicated `use<Name>Form`
hook in `src/hooks/`; keep the page component itself presentational — JSX
plus wiring the hook's returned values to inputs/handlers. This is a rule,
not a suggestion: a page component should not carry `useState` calls for
form fields or a hand-rolled try/catch submit handler directly.

- Reusable bits get their own small hook that page-specific hooks compose,
  rather than being reimplemented per form:
  - `usePasswordVisibility` — show/hide toggle for a password input
  - `useAsyncAction` — isSubmitting/error tracking around one async call,
    with a `getErrorMessage` mapper for turning a thrown error into
    display text
- See `useLoginForm.ts`, `useForgotPasswordForm.ts`, and
  `useResetPasswordForm.ts` for the pattern. `useForgotPasswordForm`
  intentionally does _not_ use `useAsyncAction` — it always ends in the
  same "submitted" state regardless of the call's outcome (see "Forgot /
  reset password" below), so there's no error to surface.
- Use `SubmitEvent<HTMLFormElement>` (from `'react'`) for a form's
  `onSubmit` handler, not `FormEvent` — the latter is deprecated in
  `@types/react` ("doesn't actually exist").

## Auth layout & coming soon

`AuthLayout` (`src/components/AuthLayout.tsx`) is the reusable two-column
shell for Login, Register, and Forgot Password — left box (page content)

- right box (`AuthPromoPanel`). Proportions are translated manually from
  Figma (no Figma access this session — verify against the real file):

* Design width `1440px`, left box `511px`, gap `112px`, right box
  `645px`. `511 + 112 + 645 = 1268px`; the remaining `172px` is assumed
  to be `86px` outer margin per side, **not confirmed against Figma**.
* Expressed as percentages/`fr` units, not fixed px, so the ratio holds
  at any viewport width: `grid-template-columns: 511fr 645fr`,
  column gap `8.833%` (`112/1268`), outer padding `5.972%` (`86/1440`).
* Stacks to a single column below the `lg` breakpoint — there's no
  mockup for a narrow two-column layout, and the forms need full width
  there anyway.
* `AuthPromoPanel`'s box: `bg-promo` (a `linear-gradient(152.69deg,
#84c6da 2.32%, #c2e3ed 89.01%, #e0f1f6 95.53%)`, via
  `--background-image-promo` in `src/index.css`) and `shadow-promo`
  (`0px 4px 16px 0px #00000040`, a dedicated token — distinct from
  `shadow-card`). The inner course-info sub-card stays solid
  `bg-primary` (`#84c6da`).

`ComingSoonNotice` (`src/components/ComingSoonNotice.tsx`) renders
**inside the form**, in place of the error message, on all three pages
when `IS_COMING_SOON` is true (see "Config") — the form itself, its
fields, and cross-links (Sign up, Forgot Password?) stay visible; only
the submit button is disabled (`disabled={isSubmitting || IS_COMING_SOON}`).
It's a message-plus-disabled-action, not a replacement for the whole
form. **Separately**, secondary navigation _outside_ the form is hidden —
Login's "Explore Online Courses" and Forgot Password's "Back to Sign
In" — for a full lockdown rather than leaving one working link on an
otherwise disabled page (Ticket #43; reverses Ticket #9's original
"stays visible either way").

## Login page

`src/pages/Login.tsx` — built on `AuthLayout` (form left, `AuthPromoPanel`
right), matching the mockup. Form state/submit logic lives in
`useLoginForm` (see "Forms"); the page itself is presentational. Submits
through `useAuth().login()`; a 401 (`InvalidCredentialsError`) shows a
generic "Invalid email or password" message, any other failure shows a
generic error, and success navigates to `/dashboard`.

- **`VITE_IS_COMING_SOON`** (via `src/lib/config.ts`): `"true"` hides the
  sign-in form, sign-up link, and "Explore Online Courses", showing
  `ComingSoonNotice` instead (see "Auth layout & coming soon").
- **Promo panel content is hardcoded** — Ticket #9 itself flags this as
  needing confirmation ("confirm with Irene whether this is hardcoded or
  should eventually come from Strapi `site_config`"), unresolved, see
  `TODO.md`.
- The featured-course image (`src/assets/course-placeholder-mc.png`) is a
  placeholder photo provided in Ticket #41 — not final course artwork.
- The promo panel itself is shared with Register and Forgot Password:
  `AuthPromoPanel` (`src/components/AuthPromoPanel.tsx`).
- A `justRegistered` router-state flag (set by `Register` on redirect)
  shows an "Account created! Please sign in." notice — not a URL param,
  so it only shows once and isn't bookmarkable/shareable.

## Register page

`src/pages/Register.tsx` — **no Figma frame exists for this yet** (Ticket
#10 flags this itself: "Flag missing design to Irene/Marco Herbert").
Built with an **explicitly approved placeholder layout** (your call, not
inferred), on the shared `AuthLayout`.

- Full name, email, password (with the same live rules checklist as
  Reset Password — `src/lib/password-rules.ts`), confirm password.
- **Does not auto-login** — per your decision, a successful `register()`
  redirects to `/login` with a success notice; the user signs in
  separately. `register()` intentionally returns `void`, not
  `AuthResponse`.
- A 409 (`EmailAlreadyRegisteredError`) shows "An account with this email
  already exists"; any other failure a generic error.
- Mock: re-registering `marco.herbert@example.com` (the mock login user)
  or any email already registered this session returns 409 — verified
  with a script against the mock handlers.
- `VITE_IS_COMING_SOON=true` hides the form, showing `ComingSoonNotice`.

## Forgot / reset password

`src/pages/ForgotPassword.tsx` and `ResetPassword.tsx` — **no Figma frame
exists for these yet** (Ticket #11 flags this itself: "Flag missing
design to Irene/Marco Herbert"). Built anyway since the acceptance
criteria are concrete even without a mockup.

- **Forgot password never reveals whether an email exists** —
  `useForgotPasswordForm` always shows the same generic success message
  regardless of the mock call's outcome, per the ticket's explicit
  acceptance criterion. Don't add a branch here that shows a different
  message for "email not found."
- **Reset password enforces password rules client-side**
  (`src/lib/password-rules.ts`: 8+ characters, one uppercase, one number,
  one special character) — the one concrete source for these is the
  Settings > Security mockup's bullet list (Image 5), reused here since
  Ticket #11 says "matches Image 8's rules." Rendered as a live
  checklist next to the New Password field.
- Reset token comes from the `token` query param (`/reset-password?token=...`);
  missing/invalid/expired all show a generic error, never which one.
- Mock reset token: any value except `"invalid"` or empty succeeds (see
  `src/mocks/handlers.ts`).
- **`ForgotPassword` uses `AuthLayout` + `ComingSoonNotice`** (Ticket
  #41); **`ResetPassword` doesn't** — it's not one of the three pages
  named in that ticket (there's no `token` link to reach it from a
  coming-soon app anyway) and still uses its original single-column
  layout. It's also **not translated** — still hardcoded English, along
  with its password-rule labels (`PasswordRule.label`, not `.labelKey`).
  See `TODO.md`.

## Maintenance page

`src/pages/Maintenance.tsx` — shown for the **entire app**, any route,
when `VITE_MAINTENANCE_MODE=true` (`MAINTENANCE_MODE` in
`src/lib/config.ts`). Checked in `App.tsx` before `QueryProvider`,
`AuthProvider`, or the router even mount.

**It has no route of its own** (no `/maintenance` in
`src/routes/index.tsx`) — deliberately: it's a global mode that overrides
every page, not a page you navigate to. Don't add a `/maintenance` route;
if the flag is off, that path should 404 like any other unmatched URL.

## 404 / Not Found

`src/pages/NotFound.tsx` — the catch-all (`path: '*'`, must stay last in
`src/routes/index.tsx`) for any unmatched URL. Public, not gated by
`ProtectedRoute`/`GuestOnlyRoute` — an unknown URL isn't "protected
content," so redirecting to `/login` first would be the wrong behavior.
"Back to Home" links to `/dashboard`; `ProtectedRoute` sends an
unauthenticated visitor on to `/login` from there as normal.

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

**Static UI copy** → [react-i18next](https://react.i18next.com/),
`src/messages/en.json` + `src/messages/id.json`. **Not `next-intl`** —
this repo previously documented `next-intl` here (copied from
`compassion-landing-page`), but that library is Next.js-only and doesn't
work in a Vite/CSR app. Corrected in Ticket #41.

- Nav labels, button labels, form labels, error/empty states, pagination
  text
- Anything structural to the UI, not editable by the client
- Setup: `src/lib/i18n.ts` (imported once in `main.tsx`), detects from
  `localStorage` then the browser, falls back to English. Use `const { t } = useTranslation()`
  and `t('namespace.key')` — don't hardcode user-facing strings.
- **Coverage so far: Login, Register, Forgot Password only** (Ticket
  #41). Every other page still has hardcoded English strings — see
  `TODO.md`.
- Locale switcher: the Topbar's `EN`/`ID` control (`i18n.changeLanguage()`)
  cycles between the two — a toggle, not a real dropdown menu (no
  dropdown component exists yet, see `TODO.md`).
- Keep `en.json`/`id.json` in sync — same keys in both files. A key
  present in one and missing in the other silently falls back to English
  for that string (via `fallbackLng`) rather than erroring.

**Dynamic CMS content** → Strapi i18n plugin, fetched via `?locale=en` /
`?locale=id`

- Hero/Manifesto/landing section copy, Article title/excerpt/body, footer
  tagline, SEO defaults, category names
- Anything the client should be able to edit themselves

**Not translated** (same value both locales)

- Phone, email, address, social links, WhatsApp number (Site Config,
  Ticket 8)

Locale codes: use `en` / `id` consistently everywhere — no `en-US` vs
`en` mismatches.
