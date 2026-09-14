/**
 * PROVISIONAL — not confirmed against SDS §6 (which we don't have yet, see
 * TODO.md). `User` is derived from the SDS §4 `users` table columns
 * (camelCased, per usual Golang JSON convention); the response envelope
 * (`{ user: User }`) and error shape are guessed from common
 * login/getMe/logout conventions, not from a spec. Replace/confirm once
 * SDS §6 is available.
 */
export interface User {
  id: string
  email: string
  fullName: string
  role: string
  emailVerifiedAt: string | null
  /**
   * STUBBED (see STUBBED_DATA.md) — not part of any confirmed SDS §6
   * shape. Distinguishes the Dashboard's "New User"/"Existing User" Figma
   * states (empty stats + autoplaying intro video vs. populated stats).
   * The mock backend sets this true for freshly registered accounts and
   * false for the seeded demo account — real detection logic is the
   * backend's call once it exists.
   */
  isNewUser: boolean
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
}

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
}
