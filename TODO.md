# TODO / Blocked work

Tracks work that can't be finished yet because it's waiting on something
outside this repo, so it doesn't get lost between sessions.

## Ticket #3 — API client scaffolding: blocked on SDS §6

**Status:** blocked, not started.

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
- [ ] Define TypeScript types for every SDS §6 response shape
- [ ] Build Strapi client module (`getCourses`, `getCourseBySlug`,
      `getSiteConfig`, etc.)
- [ ] Build Golang client module (`login`, `register`, `getMe`, `logout`,
      `getUserCourses`, `getUserStats`, `getUserActivities`, `getLesson`,
      `getCertificates`, `checkout`)
- [ ] Add CSRF token handling + `credentials: include` to the Golang client
      wrapper
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

**Done (doesn't need §6):**

- MSW installed, worker generated (`public/mockServiceWorker.js`)
- `VITE_USE_MOCKS` toggle wired in `src/mocks/enable-mocks.ts` +
  `main.tsx`, documented in README "Mocking (MSW)" and `.env.example`
- `src/mocks/handlers.ts` / `src/mocks/browser.ts` scaffolded, empty

**What's needed to unblock:** SDS §6 (response shapes) — same ask as
Ticket #3 — plus SDS §2, which hasn't been shared at all yet.

**Todos (from the ticket, unstarted):**

- [ ] Get SDS §2 and §6 from the SDS owner
- [ ] Write mock handlers for Strapi calls: course list, course
      detail/lessons, site_config
- [ ] Write mock handlers for Golang auth calls: csrf, register, login, me,
      logout, forgot-password, reset-password
- [ ] Write mock handlers for Golang user data calls: user/courses,
      user/stats, user/activities, certificates
- [ ] Write mock handlers for the lessons and checkout endpoints
- [ ] Seed mock data covering every UI state in Images 2-9 (new-user/empty
      state, in-progress courses, completed course + certificate,
      in-review certificate)
