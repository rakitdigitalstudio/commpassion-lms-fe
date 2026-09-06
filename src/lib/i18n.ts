import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import en from '@/messages/en.json'
import id from '@/messages/id.json'

/**
 * EN/ID only, scoped to Login/Register/Forgot Password so far (Ticket
 * #41) — other pages still have hardcoded English strings, see TODO.md.
 * Detects from localStorage first, falls back to the browser language,
 * then to English; persists the choice back to localStorage so it's
 * consistent across reloads.
 */
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      id: { translation: id },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'id'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
