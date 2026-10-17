# Stubbed Data

Ticket #13 (My Dashboard, My Purchases, Explore Courses) builds real page
content ahead of any backend for courses/purchases/stats — that's blocked
on SDS §6 (see `TODO.md`, Tickets #3/#4). Every number, string, and
media asset on these three pages that would eventually come from an API
is listed here, with what will replace it once that API exists.

## New-user vs. existing-user detection

**Not a URL parameter.** `Dashboard.tsx` reads `user.isNewUser` off the
authenticated user object (`useUserAuthenticationContext()` →
`useUserAuthentication` → `getMe()`/`login()`).

- `src/lib/api/auth.types.ts` — `User.isNewUser: boolean` is a **stubbed
  field**, not part of any confirmed SDS §6 shape. Real detection logic
  (e.g. "has the user ever purchased/enrolled in a course") is the
  backend's call once it exists.
- `src/mocks/handlers.ts` — the mock backend now keeps a small in-memory
  `accounts` map (email → user + password) instead of one hardcoded user:
  - The seeded mock login (`marco.herbert@example.com` / `password123`)
    is `isNewUser: false` — an "existing" user with purchase history.
  - `POST /api/v1/auth/register` creates a new account with
    `isNewUser: true`.
  - **To preview the New User dashboard**: register a new account
    through the app's own `/register` form, then sign in with it.

## `src/lib/stub-data/dashboard.ts`

Stands in for `queryKeys.userStats()` / `queryKeys.userCourses()` /
`queryKeys.userActivities()` (branches already reserved, no client
function behind them yet).

| Stubbed value                      | Current placeholder                                                        | Replaces                      |
| ---------------------------------- | -------------------------------------------------------------------------- | ----------------------------- |
| `existingUserStats` (4 stat cards) | My Learning List 8, Skills Unlocked 6, Hours Learned 40, My Certificates 5 | `getUserStats()`              |
| `learningProgress` (3 rows)        | Fondasi Komunikasi 60%, The Art of MC 80%, Tips & Trik 0%                  | `getUserCourses()`            |
| `recentActivity` (3 rows)          | 3 hardcoded activity lines + relative timestamps                           | `getUserActivities()`         |
| `newUserStatLabels`                | Same 4 labels, rendered with value `0` and muted styling for a new user    | same as above, empty response |

## `src/lib/stub-data/purchases.ts`

Stands in for `queryKeys.userCourses()`.

| Stubbed value                  | Current placeholder                                                                                   | Replaces                                                                                                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `purchasedCourses` (3 courses) | Fondasi Komunikasi (in-progress, 60%), The Art of MC (completed, 100%), Tips & Trik (not-started, 0%) | `getUserCourses()`                                                                                                                                                |
| `emptyPurchasedCourses`        | `[]`                                                                                                  | same, empty response — **to preview the empty My Purchases state**, temporarily swap the `purchasedCourses` import in `Purchases.tsx` for `emptyPurchasedCourses` |

Note: the "not-started" course's progress was normalized to `0` —
Figma's own mockup shows a `60%` label next to a visually empty bar for
that card, which reads as a mockup content mistake rather than an
intentional design, so the label and bar are made to agree here.

## `src/lib/stub-data/site-config.ts`

Stands in for the future Strapi `getSiteConfig()` client (already flagged
unbuilt in `TODO.md`).

| Stubbed value                     | Current placeholder                                                                                        | Replaces          |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------- |
| `siteConfig.introVideo.videoSrc`  | A public MDN sample clip (`cc0-videos/flower.mp4`), not the real CommPassion intro video                   | `getSiteConfig()` |
| `siteConfig.introVideo.posterSrc` | `src/assets/intro-video-poster.png`, downloaded from the Figma file (node 656:1480's "KENALAN YUK!" frame) | same              |

## Downloaded Figma assets (`src/assets/`)

Figma's asset URLs expire ~7 days, so these were downloaded and committed
rather than linked live:

- `course-cover-fondasi-komunikasi.png`, `course-cover-art-of-mc.png`,
  `course-cover-tips-trik.png` — course cover photos, used by both My
  Purchases and Explore's stub data.
- `intro-video-poster.png` — the Introduction Video card's poster frame.

## `src/lib/stub-data/lessons.ts` + `src/lib/api/lessons.ts` (Tickets #23/#24)

Stands in for `getLesson()` (see `TODO.md`'s Ticket #3 entry) and the not-yet-existing
`enrollments` concept (see `TODO.md`'s Ticket #23/#24 entry).

| Stubbed value                             | Current placeholder                                                                             | Replaces                                     |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `lessonsByCourseId['fondasi-komunikasi']` | 6 lessons, first 4 `completed: true` — matches `purchasedCourses`' 4/6, 60% for the same course | `getLesson()`/course lesson-list endpoint    |
| Every lesson's `youtubeVideoId`           | Same public test video ID for all 6 lessons, not real per-lesson course footage                 | real per-lesson video asset                  |
| `getCourseDetail()`'s `enrolled` flag     | Checked against `purchasedCourses` in-process rather than a real authorization decision         | a real 200/403 (or similar) from the backend |

"Mark as Done" (`markLessonComplete`) mutates the in-memory
`lessonsByCourseId` store directly (same "exercises the real interaction,
not a real backend") — resets on page
reload, same as the MSW auth handlers.

## i18n scope note

Static page chrome (headings, subtitles, empty-state copy, button/filter
labels) is wired through `react-i18next` (`dashboard`/`purchases`/`explore`/
`courseDetail` keys in `src/messages/{en,id}.json`), per the repo's
existing convention.
Stub **content** — course titles, instructor names, stat labels, activity
descriptions — is left as plain stub data, not i18n keys, since it stands
in for future CMS/API content rather than app copy.

## Settings (Ticket #26 — shell only)

`src/pages/Settings.tsx` is the tab-nav shell (Profile/Security, route-based
at `/settings/profile` and `/settings/security`, no full reload). Tab
_content_ (`SettingsProfile.tsx`/`SettingsSecurity.tsx`) was built
against the Figma file too (nodes 676-6826/6938) since it was already
fully specced visually, but it's **not wired to anything real** — no
`getProfile()`/`updateProfile()`/`changePassword()` API exists (blocked
on SDS §6, same as everywhere else):

- Profile tab's inputs are local/uncontrolled except Full Name and Email,
  which prefill from the real authenticated `user` (the only real data
  available). "Upload New Photo"/"Remove Photo" and "Save Changes" are
  inert — no upload pipeline or update endpoint exists.
- Security tab's password-rule checklist is fully live (reuses
  `passwordRules` from `src/lib/password-rules.ts`, same as
  Register/ResetPassword), but "Save Changes" doesn't call anything —
  there's no `changePassword()` client function yet.
- The profile photo avatar reuses Topbar's initials-circle treatment
  rather than a stock photo, matching the app's existing avoidance of a
  hardcoded fake user photo.
