import { useState } from 'react'

/**
 * Show/hide toggle for a password input — shared by every form with a
 * password field (login, register, reset-password) instead of each
 * reimplementing its own boolean + toggler.
 */
export function usePasswordVisibility(initialVisible = false) {
  const [isVisible, setIsVisible] = useState(initialVisible)

  return {
    isVisible,
    inputType: isVisible ? 'text' : 'password',
    toggle: () => setIsVisible((value) => !value),
  } as const
}
