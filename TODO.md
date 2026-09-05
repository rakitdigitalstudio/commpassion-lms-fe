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
