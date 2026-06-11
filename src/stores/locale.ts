import { ref } from 'vue'
import { defineStore } from 'pinia'

import { type Locale, localeLabels, resolveMessage } from '@/i18n/messages'

const STORAGE_KEY = 'devenglish-locale'

function readStoredLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'en' ? 'en' : 'zh-CN'
}

function applyDocumentLocale(locale: Locale) {
  document.documentElement.lang = locale === 'zh-CN' ? 'zh-CN' : 'en'
}

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<Locale>(readStoredLocale())
  applyDocumentLocale(locale.value)

  function t(key: string, params?: Record<string, string | number>) {
    let text = resolveMessage(locale.value, key)

    if (params) {
      for (const [name, value] of Object.entries(params)) {
        text = text.replaceAll(`{${name}}`, String(value))
      }
    }

    return text
  }

  function setLocale(next: Locale) {
    locale.value = next
    localStorage.setItem(STORAGE_KEY, next)
    applyDocumentLocale(next)
  }

  return {
    locale,
    localeLabels,
    t,
    setLocale,
  }
})
