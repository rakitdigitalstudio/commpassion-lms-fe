import { MIDTRANS_CLIENT_KEY, MIDTRANS_IS_PRODUCTION } from '@/lib/config'

const SNAP_SRC_SANDBOX = 'https://app.sandbox.midtrans.com/snap/snap.js'
const SNAP_SRC_PRODUCTION = 'https://app.midtrans.com/snap/snap.js'

export interface MidtransSnapResult {
  order_id: string
  transaction_status: string
}

export interface MidtransSnapCallbacks {
  onSuccess?: (result: MidtransSnapResult) => void
  onPending?: (result: MidtransSnapResult) => void
  onError?: (result: MidtransSnapResult) => void
  /** Fired when the learner closes the popup without finishing payment. */
  onClose?: () => void
}

interface MidtransSnap {
  pay: (snapToken: string, callbacks: MidtransSnapCallbacks) => void
}

declare global {
  interface Window {
    snap?: MidtransSnap
  }
}

export class MidtransNotConfiguredError extends Error {}

let snapPromise: Promise<MidtransSnap> | null = null

/**
 * Loads Midtrans's Snap.js script once and resolves `window.snap` — every
 * Buy Now click reuses the same promise instead of injecting the script
 * repeatedly. Throws MidtransNotConfiguredError when there's no client
 * key yet (Ticket #68: no real sandbox/production key exists at the time
 * this shipped), so callers can show a clear message instead of a script
 * load failure.
 */
export function loadMidtransSnap(): Promise<MidtransSnap> {
  if (!MIDTRANS_CLIENT_KEY) {
    return Promise.reject(new MidtransNotConfiguredError('VITE_MIDTRANS_CLIENT_KEY is not set'))
  }

  if (window.snap) {
    return Promise.resolve(window.snap)
  }

  if (!snapPromise) {
    snapPromise = new Promise<MidtransSnap>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = MIDTRANS_IS_PRODUCTION ? SNAP_SRC_PRODUCTION : SNAP_SRC_SANDBOX
      script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY)
      script.onload = () => {
        if (window.snap) {
          resolve(window.snap)
        } else {
          reject(new Error('Snap.js loaded but window.snap is unavailable'))
        }
      }
      script.onerror = () => reject(new Error('Failed to load Snap.js'))
      document.head.appendChild(script)
    }).catch((error: unknown) => {
      // Let a failed load be retried on the next Buy Now click instead of
      // permanently rejecting every future call with the same promise.
      snapPromise = null
      throw error
    })
  }

  return snapPromise
}
