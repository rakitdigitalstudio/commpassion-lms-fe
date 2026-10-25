/**
 * Frontend shape of the authenticated user. The service layer
 * (service/auth.ts) maps the Golang API's snake_case `UserResponse` into
 * this, so components never see wire field names (#30).
 */
export interface User {
  id: string
  email: string
  fullName: string
  role: string
  /**
   * STUBBED (see STUBBED_DATA.md) — the Golang API has no such field yet,
   * so it's false for every real account. Distinguishes the Dashboard's
   * "New User"/"Existing User" Figma states. Only the MSW mock sends it
   * (`is_new_user: true` for freshly registered accounts).
   */
  isNewUser: boolean
}

/** User as the Golang API sends it (internal/delivery/http/handler/user.go). */
export interface UserResponse {
  id: string
  email: string
  full_name: string
  role: string
  /** Mock-only, see User.isNewUser. */
  is_new_user?: boolean
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
