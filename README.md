# commpassion-lms-fe

LMS client for Compassion — the authenticated area where users watch courses, manage
purchases, and handle payment. Separate from `commpassion-landing-page` (Next.js); per
SDS §3.B this app is mostly CSR behind auth, so it's plain React via Vite instead of Next.

This ticket is scaffold-only: no API calls, auth logic, or styled components yet.

## Getting started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — start the dev server with HMR
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint
- `npm run format` — format the codebase with Prettier
- `npm run format:check` — check formatting without writing changes

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
