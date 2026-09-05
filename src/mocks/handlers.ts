import type { HttpHandler } from 'msw'

/**
 * MSW request handlers.
 *
 * BLOCKED (see TODO.md): the real handlers — one per SDS §5/§2 endpoint,
 * with response payloads matching SDS §6 exactly — can't be written yet.
 * We don't have SDS §6 (response shapes) or §2, and the client modules
 * these handlers are meant to intercept (Ticket #3) aren't built either,
 * since they're typed against the same missing §6.
 *
 * This file is intentionally empty until that lands. Add handlers grouped
 * by client (Strapi vs. Golang) as they're written, e.g.:
 *
 *   http.get('https://api.example.com/courses', () =>
 *     HttpResponse.json(coursesFixture),
 *   )
 */
export const handlers: HttpHandler[] = []
