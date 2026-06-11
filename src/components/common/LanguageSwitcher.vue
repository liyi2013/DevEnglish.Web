<script setup lang="ts">
import { type Locale } from '@/i18n/messages'
import { useI18n } from '@/composables/useI18n'

defineProps<{
  compact?: boolean
}>()

const { locale, setLocale, localeLabels, t } = useI18n()

const onChange = (event: Event) => {
  setLocale((event.target as HTMLSelectElement).value as Locale)
}
</script>

<template>
  <label class="language-switcher" :class="{ compact }">
    <span v-if="!compact" class="language-switcher__label">{{ t('common.language') }}</span>
    <select
      :aria-label="t('common.language')"
      :value="locale"
      @change="onChange"
    >
      <option v-for="(label, code) in localeLabels" :key="code" :value="code">
        {{ label }}
      </option>
    </select>
  </label>
</template>
