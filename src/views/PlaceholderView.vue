<script lang="ts" setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import { useI18n } from '@/composables/useI18n'

const route = useRoute()
const { t } = useI18n()

const title = computed(() => {
  const key = route.meta.titleKey
  return typeof key === 'string' ? t(key) : 'DevEnglish.AI'
})

const subtitle = computed(() => {
  const key = route.meta.subtitleKey
  return typeof key === 'string' ? t(key) : t('common.underConstruction')
})
</script>

<template>
  <main class="placeholder-page">
    <div class="placeholder-topbar">
      <RouterLink class="placeholder-logo" to="/">
        <span class="logo-mark"></span>
        <span>DevEnglish<span>.AI</span></span>
      </RouterLink>
      <LanguageSwitcher compact />
    </div>
    <section class="placeholder-panel">
      <p class="eyebrow">{{ t('common.frontendPreview') }}</p>
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
      <RouterLink class="primary-link" to="/">{{ t('common.backHome') }}</RouterLink>
    </section>
  </main>
</template>
