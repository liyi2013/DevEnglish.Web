<script setup lang="ts">
import { computed } from 'vue'
import {
  ArrowRight,
  Briefcase,
  ChatDotRound,
  Check,
  CircleCheck,
  Collection,
  Cpu,
  DataAnalysis,
  Headset,
  Lightning,
  Opportunity,
  Reading,
  VideoPlay,
} from '@element-plus/icons-vue'
import { RouterLink } from 'vue-router'

import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

const navItems = computed(() => [
  [t('nav.home'), '/'],
  [t('nav.technicalEnglish'), '/technical-english'],
  [t('nav.interviewEnglish'), '/interview-english'],
  [t('nav.aiInterview'), '/ai-interview'],
  [t('nav.workplaceEnglish'), '/workplace-english'],
  [t('nav.dailyGrowth'), '/daily-growth'],
  [t('nav.studyRecords'), '/study-records'],
])

const heroTags = computed(() => [
  { label: t('home.tagAiCorrection'), icon: Opportunity },
  { label: t('home.tagPersonalPath'), icon: CircleCheck },
  { label: t('home.tagAnywhere'), icon: Collection },
  { label: t('home.tagForDevs'), icon: Lightning },
])

const featureCards = computed(() => [
  { icon: Cpu, title: t('feature.techCoverage.title'), text: t('feature.techCoverage.text'), tone: 'blue' },
  { icon: ChatDotRound, title: t('feature.interviewTraining.title'), text: t('feature.interviewTraining.text'), tone: 'purple' },
  { icon: Briefcase, title: t('feature.workplaceComm.title'), text: t('feature.workplaceComm.text'), tone: 'indigo' },
  { icon: Lightning, title: t('feature.aiCompanion.title'), text: t('feature.aiCompanion.text'), tone: 'orange' },
])

const learningCards = computed(() => [
  { icon: Cpu, title: t('learning.technical.title'), text: t('learning.technical.text'), meta: t('learning.technical.meta'), tone: 'blue', cta: t('home.startLearning') },
  { icon: ChatDotRound, title: t('learning.interview.title'), text: t('learning.interview.text'), meta: t('learning.interview.meta'), tone: 'cyan', cta: t('home.startLearning') },
  { icon: Headset, title: t('learning.aiInterview.title'), text: t('learning.aiInterview.text'), meta: t('learning.aiInterview.meta'), tone: 'purple', cta: t('home.startExperience') },
  { icon: Briefcase, title: t('learning.workplace.title'), text: t('learning.workplace.text'), meta: t('learning.workplace.meta'), tone: 'orange', cta: t('home.startLearning') },
  { icon: Reading, title: t('learning.daily.title'), text: t('learning.daily.text'), meta: t('learning.daily.meta'), tone: 'amber', cta: t('home.startLearning') },
])

const stats = computed(() => [
  ['10,000+', t('home.statLearners')],
  ['50,000+', t('home.statHours')],
  ['95%', t('home.statSatisfaction')],
  ['1000+', t('home.statContent')],
])

const heroTitleLines = computed(() => t('home.heroTitle').split('\n'))
</script>

<template>
  <div class="public-home">
    <header class="public-header">
      <RouterLink class="public-brand" to="/">
        <span class="brand-mark"></span>
        <span>DevEnglish<span>.AI</span></span>
      </RouterLink>

      <nav class="public-nav" :aria-label="t('nav.mainNav')">
        <RouterLink v-for="[label, path] in navItems" :key="path" :to="path">{{ label }}</RouterLink>
      </nav>

      <div class="public-actions">
        <LanguageSwitcher compact />
        <RouterLink class="public-login" to="/login">{{ t('auth.login') }}</RouterLink>
        <RouterLink class="public-register" to="/register">{{ t('auth.register') }}</RouterLink>
      </div>
    </header>

    <main>
      <section class="public-hero">
        <div class="public-hero-copy">
          <h1>{{ heroTitleLines[0] }}<br /><span>{{ heroTitleLines[1] }}</span></h1>
          <p class="public-kicker">{{ t('home.heroKicker') }}</p>
          <p class="public-description">{{ t('home.heroDescription') }}</p>
          <div class="public-hero-actions">
            <RouterLink class="primary-cta" to="/register">{{ t('home.startFree') }} <el-icon><ArrowRight /></el-icon></RouterLink>
            <RouterLink class="secondary-cta" to="/ai-interview"><el-icon><VideoPlay /></el-icon> {{ t('home.tryAiInterview') }}</RouterLink>
          </div>
          <div class="public-tags">
            <span v-for="tag in heroTags" :key="tag.label">
              <el-icon><component :is="tag.icon" /></el-icon>{{ tag.label }}
            </span>
          </div>
        </div>

        <div class="hero-preview-board">
          <div class="study-plan-card">
            <h2>{{ t('home.todayPlan') }}</h2>
            <div class="plan-line">
              <span class="line-icon cyan"><el-icon><Check /></el-icon></span>
              <strong>{{ t('home.techVocab') }}</strong>
              <em>20/20</em>
              <el-icon class="ok"><CircleCheck /></el-icon>
            </div>
            <div class="plan-line active">
              <span class="line-icon blue"><el-icon><ChatDotRound /></el-icon></span>
              <strong>{{ t('home.interviewPractice') }}</strong>
              <em>5/10</em>
              <i></i>
            </div>
            <div class="plan-line">
              <span class="line-icon purple"><el-icon><Headset /></el-icon></span>
              <strong>{{ t('home.aiMock') }}</strong>
              <em>{{ t('home.inProgress') }}</em>
              <el-icon><ArrowRight /></el-icon>
            </div>
            <div class="plan-line">
              <span class="line-icon cyan"><el-icon><Reading /></el-icon></span>
              <strong>{{ t('home.dailySentence') }}</strong>
              <em class="success">{{ t('home.completed') }}</em>
              <el-icon class="success"><Check /></el-icon>
            </div>
          </div>

          <div class="hero-mini-card streak">
            <p>{{ t('home.streakDays') }}</p>
            <strong>7 <span>Days</span></strong>
            <small>{{ t('home.keepGoing') }}</small>
          </div>

          <div class="hero-mini-card progress">
            <p>{{ t('home.progress') }}</p>
            <div class="ring">75%</div>
            <small>{{ t('home.weekGoal') }}</small>
          </div>

          <div class="robot-bubble">
            <span></span>
          </div>
        </div>
      </section>

      <section class="public-section">
        <div class="public-section-head">
          <h2>{{ t('home.whyTitle') }}</h2>
          <p>{{ t('home.whySubtitle') }}</p>
        </div>
        <div class="public-feature-grid">
          <article v-for="card in featureCards" :key="card.title" class="public-feature-card" :class="`tone-${card.tone}`">
            <span><el-icon><component :is="card.icon" /></el-icon></span>
            <h3>{{ card.title }}</h3>
            <p>{{ card.text }}</p>
            <RouterLink to="/register">{{ t('home.learnMore') }} <el-icon><ArrowRight /></el-icon></RouterLink>
          </article>
        </div>
      </section>

      <section class="public-ai-band">
        <div class="ai-band-copy">
          <h2>{{ t('home.aiBandTitle') }}</h2>
          <p>{{ t('home.aiBandSubtitle') }}</p>
          <div class="ai-checks">
            <span><el-icon><CircleCheck /></el-icon>{{ t('home.aiCheck1') }}</span>
            <span><el-icon><CircleCheck /></el-icon>{{ t('home.aiCheck2') }}</span>
            <span><el-icon><CircleCheck /></el-icon>{{ t('home.aiCheck3') }}</span>
            <span><el-icon><CircleCheck /></el-icon>{{ t('home.aiCheck4') }}</span>
          </div>
          <RouterLink class="primary-cta" to="/ai-interview">{{ t('home.tryAiNow') }} <el-icon><ArrowRight /></el-icon></RouterLink>
        </div>
        <div class="ai-chat">
          <div><span>AI Interviewer</span><p>Can you explain the difference between synchronous and asynchronous communication?</p></div>
          <div><span>Your answer</span><p>Synchronous communication is when two parties communicate in real-time...</p></div>
          <div><span>AI Feedback</span><p>Great answer! Consider adding a concrete async example from a production project.</p></div>
        </div>
        <div class="radar-preview">
          <div class="radar-shape"></div>
          <span>Fluency</span><span>Accuracy</span><span>Practicality</span><span>Logic</span><span>Vocabulary</span>
        </div>
      </section>

      <section class="public-section public-learning">
        <div class="learning-title-row">
          <span></span>
          <h2>{{ t('home.learningPreview') }}</h2>
          <RouterLink to="/register">{{ t('home.viewAll') }} <el-icon><ArrowRight /></el-icon></RouterLink>
        </div>
        <div class="public-learning-grid">
          <article v-for="card in learningCards" :key="card.title" :class="`tone-${card.tone}`">
            <span><el-icon><component :is="card.icon" /></el-icon></span>
            <h3>{{ card.title }}</h3>
            <p>{{ card.text }}</p>
            <strong>{{ card.meta }}</strong>
            <RouterLink to="/register">{{ card.cta }} <el-icon><ArrowRight /></el-icon></RouterLink>
          </article>
        </div>
      </section>
    </main>

    <footer class="public-stats">
      <div v-for="[value, label] in stats" :key="label">
        <strong>{{ value }}</strong>
        <span>{{ label }}</span>
      </div>
    </footer>
  </div>
</template>
