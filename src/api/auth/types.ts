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
  /** Drives the post-login introduction video — true until POST /api/v1/user/onboarding/complete. */
  isNewUser: boolean
}

/** User as the Golang API sends it (internal/delivery/http/handler/user.go). */
export interface UserResponse {
  id: string
  email: string
  full_name: string
  role: string
  is_new_user: boolean
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
