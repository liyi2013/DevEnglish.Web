<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterView } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import { useLocaleStore } from '@/stores/locale'

const { locale } = storeToRefs(useLocaleStore())
const elementLocale = computed(() => (locale.value === 'en' ? en : zhCn))
</script>

<template>
  <ElConfigProvider :locale="elementLocale">
    <RouterView />
  </ElConfigProvider>
</template>
