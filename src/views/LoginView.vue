<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'

import { authApi } from '@/api/auth'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import { useI18n } from '@/composables/useI18n'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()
const email = ref()
const password = ref()
const loading = ref(false)
const error = ref('')

const submit = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data } = await authApi.login({ email: email.value, password: password.value })
    auth.login(data.data.token, data.data.user)
    await router.push('/dashboard')
  } catch (err: any) {
    error.value = err.response?.data?.message ?? t('auth.loginFailed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-shell">
    <div class="auth-topbar">
      <RouterLink class="auth-brand" to="/">
        <span class="brand-mark"></span>
        <span>DevEnglish<span>.AI</span></span>
      </RouterLink>
      <LanguageSwitcher compact />
    </div>

    <section class="auth-panel">
      <div class="auth-copy">
        <p class="auth-eyebrow">{{ t('auth.welcomeBack') }}</p>
        <h1>{{ t('auth.loginHeadline') }}</h1>
        <p>{{ t('auth.loginDescription') }}</p>
        <div class="auth-points">
          <span>{{ t('auth.pointTechnical') }}</span>
          <span>{{ t('auth.pointInterview') }}</span>
          <span>{{ t('auth.pointWorkplace') }}</span>
        </div>
      </div>

      <form class="auth-card" @submit.prevent="submit">
        <h2>{{ t('auth.loginTitle') }}</h2>
        <p>{{ t('auth.loginSubtitle') }}</p>
        <label>
          <span>{{ t('auth.email') }}</span>
          <input v-model="email" autocomplete="email" />
        </label>
        <label>
          <span>{{ t('auth.password') }}</span>
          <input v-model="password" type="password" autocomplete="current-password" />
        </label>
        <button class="auth-submit" :disabled="loading" type="submit">
          {{ loading ? t('auth.loginSubmitting') : t('auth.loginSubmit') }}
        </button>
        <p v-if="error" class="form-error">{{ error }}</p>
        <RouterLink class="text-link" to="/register">{{ t('auth.noAccount') }}</RouterLink>
      </form>
    </section>
  </main>
</template>
