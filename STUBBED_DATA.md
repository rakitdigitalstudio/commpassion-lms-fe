# Stubbed Data

**No hardcoded stub data remains.** Every course, stat, activity and lesson
on screen comes from the real backends:

| Screen                                    | Data                                                      | Source                                                                                                                                      |
| ----------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard stats                           | My Learning List, My Certificates, Certificates In Review | `GET /api/v1/user/stats`                                                                                                                    |
| Dashboard New User state                  | shown when `courses_enrolled === 0`                       | `GET /api/v1/user/stats`                                                                                                                    |
| Dashboard Learning Progress, My Purchases | enrolled courses                                          | `GET /api/v1/user/courses`, decorated with Strapi (cover, instructor) and `GET /api/v1/user/courses/:id/progress` (lessons done, %, status) |
| Dashboard Recent Activity                 | enrolled / purchased events                               | `GET /api/v1/user/activities`                                                                                                               |
| Explore                                   | catalog                                                   | Strapi `/api/courses`                                                                                                                       |
| Course Detail                             | course, enrollment                                        | Strapi course + `GET /api/v1/user/courses`                                                                                                  |
| Course Detail lessons                     | titles, subtitles, order, duration                        | Strapi course `lessons`                                                                                                                     |
| Course Detail completion / "Mark as Done" | per-lesson progress                                       | `GET` / `POST /api/v1/user/courses/:id/...`                                                                                                 |
| Course Detail video                       | `video_url` (enrolled only)                               | `GET /api/v1/courses/:id/lessons/:index`                                                                                                    |

Values with no backend source were removed rather than faked (#59): course
rating and reviews, course video minutes, Hours Learned, Skills Unlocked,
"+1 this month" deltas, module-completed activities, and the Dashboard intro
video. The intro video can come back once Strapi Site Config gets a field
for it.

## Mocks (MSW)

With `VITE_USE_MOCKS=true`, `src/mocks/handlers.ts` answers in the Golang
API's real wire format. Mock accounts are never enrolled, so `/user/*`
returns zeros and empty lists and every mock login sees the New User
dashboard. Enrolled states need the real API (README "Mocking (MSW)").

## UI with no backend yet

These render but don't persist anything, because the Golang API has no
endpoint for them:

- **Settings → Profile** (`SettingsProfile.tsx`): only Full Name and Email
  prefill (from `/me`). Photo upload/remove, Job Title, Company and "Save
  Changes" are inert; there's no profile endpoint.
- **Settings → Security** (`SettingsSecurity.tsx`): the password-rule
  checklist is live, but "Save Changes" does nothing. Only forgot/reset
  password exists, not change-password.
- **Topbar search**: the input does nothing yet.

Whether to hide these or keep them is tracked in #59 ("Decide").
