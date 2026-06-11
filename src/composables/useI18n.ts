import { storeToRefs } from 'pinia'

import { type Locale } from '@/i18n/messages'
import { useLocaleStore } from '@/stores/locale'

export function useI18n() {
  const store = useLocaleStore()
  const { locale } = storeToRefs(store)

  function t(key: string, params?: Record<string, string | number>) {
    void locale.value
    return store.t(key, params)
  }

  return {
    locale,
    t,
    setLocale: (next: Locale) => store.setLocale(next),
    localeLabels: store.localeLabels,
  }
}
