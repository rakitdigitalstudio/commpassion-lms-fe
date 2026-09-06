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
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
}
