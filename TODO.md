# TODO / Blocked work

Tracks work that can't be finished yet because it's waiting on something
outside this repo, so it doesn't get lost between sessions.

## Ticket #3 — API client scaffolding: blocked on SDS §6

**Status:** blocked overall; auth functions provisionally unblocked for
Ticket #5 (see below).

Ticket #3 (`API client scaffolding`) requires every client function's return
type to match its corresponding **SDS §6 response shape exactly** (e.g.
`login()` -> §6.1, `getUserStats()` -> §6.3). We don't have §6 — only §4
(Database Schemas) and §5 (API Design / endpoint list) have been shared so
far, and those don't specify response body field names/casing.

**Why not just infer it from §4/§5:** §4/§5 give the DB columns and the
endpoint list, not the JSON response contract (field names, casing,
nesting, what's included vs. omitted). Guessing here risks every downstream
feature ticket (Epics 1-6) being built against types that don't match the
real backend once it exists, which is exactly what Ticket #3 exists to
prevent.

**What's needed to unblock:** SDS §6 (the response-shape reference for
auth, course list/detail, user courses/stats/activities, lessons,
certificates, checkout) from whoever owns the SDS.

**Already done ahead of the client modules themselves:** TanStack Query is
installed and wired up (`QueryProvider`, `queryClient`, `queryKeys`
factory, `useApiQuery`/`useApiMutation` wrapper hooks) — see the README
"Data fetching" section. Once §6 lands and the Strapi/Golang client
functions exist, they plug straight into these wrappers.

**What we already have, ready to use once §6 lands:**

- §4 `lms` database schema (`users`, `password_reset_tokens`, `enrollments`,
  `certificates`, `transactions`) — Golang-owned.
- §4 `strapi` database content-types (`course`, `trainer`, `article`, etc.)
  — Strapi-owned, served via its own content API.
- §5 endpoint list for the Golang backend (`/api/v1/auth/*`,
  `/api/v1/user/*`, `/api/v1/courses/{id}/lessons/{index}`,
  `/api/v1/certificates`, `/api/v1/checkout`, `/api/v1/webhook/midtrans`).

**Todos (from the ticket, unstarted):**

- [ ] Get SDS §6 from the SDS owner
- [ ] **Re-confirm `src/lib/api/auth.types.ts` and `auth.ts`** (`login`,
      `getMe`, `logout`) against real §6 — currently PROVISIONAL, built
      from usual conventions + the §4 `users` columns for Ticket #5, not
      from a spec. Field names/casing/envelope shape may all be wrong.
- [ ] Define TypeScript types for every other SDS §6 response shape
- [ ] Build Strapi client module (`getCourses`, `getCourseBySlug`,
      `getSiteConfig`, etc.)
- [ ] Build remaining Golang client functions (`register`, `getUserCourses`,
      `getUserStats`, `getUserActivities`, `getLesson`, `getCertificates`,
      `checkout`) — `login`/`getMe`/`logout` exist provisionally, see above
- [x] Add CSRF token handling + `credentials: include` to the Golang client
      wrapper — done for the auth functions in `auth.ts`; carry the same
      pattern to the rest once built
- [ ] Add `VITE_STRAPI_URL`, `VITE_STRAPI_TOKEN`, `VITE_API_URL` to
      `.env.example` (the file exists now, added in #4 for `VITE_USE_MOCKS`
      — these three still need to be added alongside it)

## Ticket #4 — MSW mock handler setup: blocked on the same SDS §6 gap

**Status:** infra done, handlers blocked.

Ticket #4 mock handlers must return payloads matching **SDS §6 exactly**
(so Epic 8 can diff mock shapes against real ones) and cover every endpoint
in **SDS §5 and §2** — we don't have §2 either. Writing approximate
handlers now would be exactly the "simplified/approximate" version the
ticket says not to build, and they'd need rewriting once §6 (and the
Ticket #3 client modules they intercept) exist anyway.

**Done:**

- MSW installed, worker generated (`public/mockServiceWorker.js`)
- `VITE_USE_MOCKS` toggle wired in `src/mocks/enable-mocks.ts` +
  `main.tsx`, documented in README "Mocking (MSW)" and `.env.example`
- Auth handlers added for Ticket #5 (`csrf`, `login`, `me`, `logout`) —
  PROVISIONAL, same caveat as the #3 auth client above: built from
  convention, not SDS §6. In-memory only, resets on page reload.

**What's needed to unblock:** SDS §6 (response shapes) — same ask as
Ticket #3 — plus SDS §2, which hasn't been shared at all yet.

**Todos (from the ticket, unstarted):**

- [ ] Get SDS §2 and §6 from the SDS owner
- [ ] Write mock handlers for Strapi calls: course list, course
      detail/lessons, site_config
- [x] Write mock handlers for Golang auth calls: csrf, login, me, logout
      (provisional, see above) — `register`, `forgot-password`,
      `reset-password` still unstarted
- [ ] Write mock handlers for Golang user data calls: user/courses,
      user/stats, user/activities, certificates
- [ ] Write mock handlers for the lessons and checkout endpoints
- [ ] Seed mock data covering every UI state in Images 2-9 (new-user/empty
      state, in-progress courses, completed course + certificate,
      in-review certificate)

## Ticket #5 — Auth context + protected route wrapper: done with provisional types

**Status:** done.

Built `AuthContext`/`AuthProvider` (`src/context/`, `src/providers/`),
`useAuth()`, and `<ProtectedRoute>`/`<GuestOnlyRoute>` (`src/routes/`),
wired into `App.tsx` and `src/routes/index.tsx`. Session resolution calls
`getMe()` once via `useApiQuery` on load; `login`/`logout` mutations
invalidate the `me` query so the context updates automatically.

This ticket's acceptance criteria don't depend on the exact §6 shape (just
that _a_ user object exists), so it's not blocked the way #3/#4 are — but
it's built on the same PROVISIONAL `auth.ts`/`auth.types.ts` from #3.
**When §6 lands:** re-check `User`'s fields and the `{ user }` response
envelope; `AuthProvider`/`ProtectedRoute` themselves shouldn't need to
change, only the types they consume.

**Assumption worth flagging:** `/explore` was left public (not wrapped in
`ProtectedRoute`) since it reads as a public catalog page and the login
page mockup has an "Explore Online Courses" CTA for guests — this isn't
stated in any ticket, just inferred from the mockups.

## Ticket #6 — Shared component library: done with inferred assumptions

**Status:** done.

Built `Button`, `StatusBadge`, `ProgressBar`, `StatCard`, `CourseCard`
(catalog/purchased via a discriminated union in `CourseCard.types.ts`),
and `EmptyState` in `src/components/`. All shown live on `/style-guide`.

**Assumptions worth flagging (not spec'd anywhere):**

- Added a `success` `Button` variant beyond the ticket's named list
  (primary/accent/outline), to match the Purchases mockup's green "View
  Certificate" CTA — using `accent` (yellow) or `primary` for it would
  have been visually wrong.
- Added `--color-highlight` (`#a855f7`, eyeballed) to `src/index.css` for
  the dashboard's 4th stat card ("My Certificates", purple) — no existing
  token fit. Same "needs Figma confirmation" caveat as the rest of Ticket
  2's palette.
- `CourseCard`'s `catalog` variant is **inferred, not pixel-matched** —
  none of the 6 provided screenshots show the public catalog card, only
  the purchased-course variant (My Purchases page). Built a plausible
  banner + price + "View Course" layout; Ticket #21 ("Course card —
  catalog variant") should replace/confirm it against the real design.
- `CourseCard` banners use plain Tailwind background colors
  (`bannerClassName` prop, e.g. `bg-indigo-600`) as a placeholder for the
  real banner artwork/images seen in the mockups — no asset pipeline
  exists yet for those.

## Ticket #7 — App shell layout: done with an inferred assumption

**Status:** done.

Built `AppShell` (`src/components/AppShell.tsx`, sidebar + topbar +
`<Outlet>`), `Sidebar`, `Topbar`, and a small hand-authored icon set
(`src/components/icons.tsx` — no icon library added). Wired as a single
parent route in `src/routes/index.tsx`: `<ProtectedRoute><AppShell /></ProtectedRoute>`
wraps `/dashboard`, `/purchases`, `/settings`, `/courses/:courseId` as
children, satisfying "single layout component wrapping all protected
routes." Topbar's user info and Sidebar's logout button both go through
`useAuth()` — no hardcoded user data.

**Assumption worth flagging:** `/explore` was kept outside `AppShell`
entirely (no sidebar/topbar), since none of the 6 provided screenshots
show an authenticated Explore page and Ticket #7 scopes the shell to
"authenticated screens." Revisit when Ticket #20 (Catalog page) is built —
an authenticated user browsing Explore probably _should_ see the shell,
which would mean moving it inside the `AppShell` children instead.

**Not built (out of scope for this ticket, not asked for):** the language
dropdown and notification bell are static placeholders — no real i18n
switching or notification list exists yet.

## Ticket #9 — Login page: done, one open question from the ticket itself

**Status:** done.

Built `src/pages/Login.tsx` per the mockup: two-column layout, email/lock
icons, password show/hide toggle, Remember Me, Forgot Password/Sign up
links (pointing at not-yet-built `/forgot-password` and `/register`
routes — Tickets #10/#11), Sign In wired through `useAuth().login()`, and
"Explore Online Courses". Also added `InvalidCredentialsError` to
`auth.ts` and made the MSW login handler actually validate credentials
(`marco.herbert@example.com` / `password123`, else 401) so the error
state and redirect-on-success are both exercisable — verified both paths
with a script against the mock handlers (no connected browser this
session to click through it).

`VITE_IS_COMING_SOON` env toggle added per your instruction: `"true"`
hides the sign-in form/sign-up link, showing a "coming soon" notice;
"Explore Online Courses" stays visible regardless.

**Open question — straight from Ticket #9's own todo list, still
unresolved:** "confirm with Irene whether \[the promo panel] is hardcoded
or should eventually come from Strapi `site_config`." Built it hardcoded
for now since there's no one to ask in this session; flagging so it
doesn't get lost.

**Other assumption:** the featured-course image is a plain color
placeholder, same reasoning as `CourseCard` banners (see Ticket #6) — no
real asset/pipeline for course imagery exists yet.

## Fixes applied on top of Ticket #9 (per your feedback)

- Copied the real logo (`src/assets/compassion-logo-blue.png`) and
  favicon (`public/favicon.ico`) from `compassion-landing-page` — no
  longer placeholders. `Sidebar` still uses the hand-authored `LogoIcon`
  icon-only mark (see README "Logo & favicon" for why).
- Extracted Login's inline form state + submit handler into
  `useLoginForm` (`src/hooks/`), composing two new shared hooks
  (`usePasswordVisibility`, `useAsyncAction`). `Login.tsx` is now
  presentational. Documented as a rule in README "Forms" —
  page components shouldn't carry form `useState`/submit logic directly.
- Wrapped `import.meta.env.VITE_*` reads behind `src/lib/config.ts`
  (`IS_COMING_SOON`, `USE_MOCKS`); nothing else should read
  `import.meta.env` directly anymore (`enable-mocks.ts` and `Login.tsx`
  updated). Documented in README "Config".
- Fixed a `FormEvent` deprecation warning (`@types/react` deprecated it —
  "doesn't actually exist") by switching to `SubmitEvent`. Documented in
  README "Forms".

## Ticket #11 — Forgot / reset password pages: done, no design existed

**Status:** done, per the ticket's own "not started until design exists"
caveat — built anyway since the acceptance criteria are concrete without
a mockup (generic success message, password rules). Flag to Irene/Marco
Herbert about the missing Figma frame is still outstanding (can't do that
from this session) — the ticket's first todo.

Built `ForgotPassword.tsx` / `ResetPassword.tsx` + `useForgotPasswordForm`
/ `useResetPasswordForm`, `forgotPassword()`/`resetPassword()` on the
provisional auth client (+ matching MSW handlers), and
`src/lib/password-rules.ts` (8+ chars, uppercase, number, special
character — sourced from the Settings > Security mockup's bullet list,
the one concrete reference we have, per the ticket's "matches Image 8's
rules"). Verified forgot-password's always-generic-success behavior and
reset-password's valid/invalid/missing-token paths with a script against
the mock handlers.

**Layout is a placeholder**, reusing the Login page's single-column form
style — there's no real design to match yet. Replace once Irene/Marco
Herbert provide one.

## Maintenance page — built, not wired anywhere

Added `src/pages/Maintenance.tsx` at `/maintenance` per your request. It's
a static page only: no ticket specifies when/how maintenance mode should
actually trigger (a global env flag redirecting every route here, a
backend 503 passed through, etc.), so that wiring doesn't exist — nothing
currently navigates to this route automatically.

## Ticket #10 — Register page: done, with explicit approvals from you

**Status:** done. Unlike #11, this ticket explicitly said "Not started
until a design frame exists **or a placeholder layout is explicitly
approved**" — you approved a placeholder (reusing Login's two-column
style) and decided the post-registration flow (redirect to `/login`,
no auto-login) directly, so neither is an inferred assumption.

Built `Register.tsx` + `useRegisterForm`, `register()` on the provisional
auth client (`EmailAlreadyRegisteredError` on 409) + matching MSW handler,
and extracted the promo panel out of `Login.tsx` into a shared
`AuthPromoPanel` component so both pages use the same one. Verified
new-email/duplicate-email paths with a script against the mock handlers.

**Still outstanding (the ticket's own first todo):** flag the missing
design to Irene/Marco Herbert — can't do that from this session, someone
needs to actually ask them. Replace the placeholder layout once a real
frame exists.

## Ticket #41 — Coming soon + reusable AuthLayout + EN/ID: done, with flagged assumptions

**Status:** done.

Built `AuthLayout` (`src/components/AuthLayout.tsx`) — the reusable
two-column shell — and `ComingSoonNotice`; refactored Login, Register,
and Forgot Password onto both. Installed `react-i18next` + `i18next` +
`i18next-browser-languagedetector`; added `src/lib/i18n.ts` and
`src/messages/en.json` / `id.json`; translated every string on those
three pages (labels, placeholders, buttons, error/success messages,
coming-soon text); wired the Topbar's language control to actually call
`i18n.changeLanguage()`. Verified: exact CSS output for the layout
proportions (`grid-template-columns:511fr 645fr`, `column-gap:8.833%`,
`padding-inline:5.972%`), all three pages serving correctly with mocks +
coming-soon both on and off, and `en.json`/`id.json` have identical key
sets (script-checked, no silently-missing translations).

**Assumptions/gaps worth flagging (all noted inline too):**

- **The `172px` leftover** (`1440 − 511 − 112 − 645`) is assumed to be
  `86px` outer margin per side — **not confirmed against the real Figma
  file** (no Figma access this session). If Figma says something else
  (e.g. the margin isn't even, or there's a missing element), the
  percentages in `AuthLayout` need recalculating.
- **`react-i18next` chosen without being asked to pick a specific
  library** — the ticket said "implement translations," not which
  library. Reasonable default for a Vite/CSR app since `next-intl`
  (documented in this README before this ticket) is Next.js-only.
- **Translation coverage is scoped to Login/Register/Forgot Password
  only**, per the ticket's literal wording ("this ticket will handle...
  1. Login... 2. same thing applies to register and forgot password").
     Everything else in the app (Dashboard, Sidebar, Topbar's own
     "Search..." placeholder and "Guest" fallback, etc.) is still hardcoded
     English. A follow-up ticket should cover the rest.
- **`ResetPassword` was left out of both `AuthLayout` and translation** —
  the ticket named exactly three pages and Reset Password wasn't one of
  them (also unreachable from a coming-soon app, since it needs an
  emailed token). It still uses its original single-column layout and
  hardcoded English `PasswordRule.label` fields. `password-rules.ts` now
  has both `label` (English, what `ResetPassword` still reads) and
  `labelKey` (i18n key, what `Register` uses) — reconcile this once
  `ResetPassword` is brought into scope.
- **Language switcher is a cycle-on-click toggle**, not a real dropdown
  menu — no dropdown component exists in the design system yet. Good
  enough to prove locale-switching works end-to-end; revisit once/if a
  proper `Dropdown` component is built.
- **Course placeholder image** (`src/assets/course-placeholder-mc.png`,
  578KB) was pulled from this conversation's image cache, not a design
  export — worth re-exporting/compressing from the real source once
  available; it's noticeably larger than the other image assets in this
  repo.
