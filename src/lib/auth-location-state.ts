/**
 * Shared `location.state` shape passed between /explore, /register, and
 * /login (Ticket #53) so a guest who clicks "Buy Now" lands back on that
 * course after signing up/in, instead of the generic dashboard.
 */
export interface AuthLocationState {
  justRegistered?: boolean
  /** Path to send the user to after a successful login, e.g. `/courses/:slug`. */
  returnTo?: string
}
