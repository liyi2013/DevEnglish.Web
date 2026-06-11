<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  Bell,
  Briefcase,
  ChatDotRound,
  Check,
  CircleCheck,
  DataAnalysis,
  Files,
  Headset,
  Histogram,
  HomeFilled,
  Medal,
  Notebook,
  Reading,
  Refresh,
  Star,
} from '@element-plus/icons-vue'
import { RouterLink, useRoute } from 'vue-router'
import { dailyGrowthApi } from '@/api/dailyGrowth'
import { studyRecordApi } from '@/api/studyRecord'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import { useI18n } from '@/composables/useI18n'
import { useAuthStore } from '@/stores/auth'

interface LearningItem {
  id: string
  title: string
  englishText: string
  chineseText: string
  explanation: string
  type: string
}

interface StudyOverview {
  total: number
  completed: number
  streakDays: number
  lastCompletedAt?: string
}

const auth = useAuthStore()
const route = useRoute()
const { t } = useI18n()
const dailyItems = ref<LearningItem[]>([])
const studyOverview = ref<StudyOverview>({ total: 0, completed: 0, streakDays: 7 })
const displayName = computed(() => auth.user?.nickname || t('dashboard.adminFallback'))
const avatarText = computed(() => displayName.value.slice(0, 1))

const navItems = computed(() => [
  { label: t('nav.dashboard'), path: '/dashboard', icon: HomeFilled },
  { label: t('nav.technicalEnglish'), path: '/technical-english', icon: Notebook },
  { label: t('nav.interviewEnglish'), path: '/interview-english', icon: ChatDotRound },
  { label: t('nav.aiInterview'), path: '/ai-interview', icon: Headset },
  { label: t('nav.workplaceEnglish'), path: '/workplace-english', icon: Briefcase },
  { label: t('nav.dailyGrowth'), path: '/daily-growth', icon: CircleCheck },
  { label: t('nav.studyRecords'), path: '/study-records', icon: DataAnalysis },
])

const overviewCards = computed(() => [
  {
    label: t('dashboard.todayStudy'),
    value: '32',
    unit: t('dashboard.minutes'),
    hint: t('dashboard.goalMinutes'),
    icon: Reading,
    tone: 'blue',
    progress: 54,
  },
  {
    label: t('dashboard.totalStudy'),
    value: '7',
    unit: t('dashboard.days'),
    hint: t('dashboard.completedItems', { count: 0 }),
    icon: Medal,
    tone: 'green',
  },
  {
    label: t('dashboard.vocabMastered'),
    value: '10',
    unit: '',
    hint: t('dashboard.fromApi'),
    icon: Star,
    tone: 'orange',
  },
  {
    label: t('dashboard.accuracy'),
    value: '87',
    unit: '%',
    hint: t('dashboard.vsYesterday'),
    icon: Histogram,
    tone: 'purple',
  },
])

const dynamicOverviewCards = computed(() => [
  overviewCards.value[0],
  {
    ...overviewCards.value[1],
    value: String(studyOverview.value.streakDays || 7),
    hint: t('dashboard.completedItems', { count: studyOverview.value.completed }),
  },
  {
    ...overviewCards.value[2],
    value: String(dailyItems.value.length || 10),
    hint: t('dashboard.fromApi'),
  },
  overviewCards.value[3],
])

const weekDays = ['一', '二', '三', '四', '五', '六', '日']
const sidebarStreakDays = ['一', '二', '三', '四', '五', '日']
const techCategories = [
  { name: '.NET', count: '125 词汇', mark: '.NET', tone: 'purple' },
  { name: 'RabbitMQ', count: '68 词汇', mark: '!', tone: 'orange' },
  { name: 'Redis', count: '42 词汇', mark: '▰', tone: 'red' },
  { name: 'SQL', count: '95 词汇', mark: '●', tone: 'blue' },
  { name: '微服务', count: '56 词汇', mark: '✿', tone: 'green' },
  { name: 'DevOps', count: '31 词汇', mark: '∞', tone: 'purple' },
  { name: 'Cloud', count: '24 词汇', mark: '☁', tone: 'sky' },
]
const fallbackRecommendations = [
  {
    title: 'Dependency Injection',
    cn: '依赖注入',
    text: 'A design pattern used to achieve loose coupling between components.',
    level: '中级',
  },
  {
    title: 'Middleware',
    cn: '中间件',
    text: 'Middleware processes requests and responses in the application pipeline.',
    level: '初级',
  },
]
const recommendations = computed(() => {
  const items = dailyItems.value.slice(0, 2).map((item) => ({
    title: item.title || item.englishText,
    cn: item.chineseText,
    text: item.explanation || item.englishText,
    level: item.type === 'DailySentence' ? '初级' : '中级',
  }))
  return items.length ? items : fallbackRecommendations
})
const learningPath = [
  ['ASP.NET Core', '基础知识'],
  ['Dependency Injection', '依赖注入'],
  ['Middleware', '中间件'],
  ['Configuration', '配置管理'],
  ['Logging', '日志记录'],
  ['EF Core', '实体框架'],
]
const recentLearning = [
  ['RabbitMQ Exchange', '2024-06-01 15:30', 'orange'],
  ['Redis Cache', '2024-05-31 21:10', 'red'],
  ['ASP.NET Core Middleware', '2024-05-31 18:45', 'purple'],
  ['Outbox Pattern', '2024-05-30 16:20', 'sky'],
  ['Repository Pattern', '2024-05-29 14:10', 'green'],
]
const ranking = [
  ['Alice', '学习时长 18.5 小时'],
  ['Bob', '学习时长 15.2 小时'],
  ['Charlie', '学习时长 11.8 小时'],
]
const hotTerms = [
  ['Asynchronous', '异步'],
  ['Scalability', '可扩展性'],
  ['Exception Handling', '异常处理'],
  ['Concurrency', '并发'],
  ['Load Balancing', '负载均衡'],
]

onMounted(async () => {
  try {
    const [{ data: dailyResponse }] = await Promise.all([dailyGrowthApi.today()])
    dailyItems.value = dailyResponse.data
  } catch {
    dailyItems.value = []
  }

  if (auth.user?.id) {
    try {
      const { data } = await studyRecordApi.overview(auth.user.id)
      studyOverview.value = data.data
    } catch {
      studyOverview.value = { total: 0, completed: 0, streakDays: 7 }
    }
  }
})
</script>

<template>
  <div class="dashboard-shell">
    <aside class="dashboard-sidebar">
      <RouterLink class="dashboard-brand" to="/dashboard">
        <span class="brand-mark"></span>
        <span>DevEnglish<span>.AI</span></span>
      </RouterLink>

      <nav class="side-nav" :aria-label="t('nav.learningNav')">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :class="{ active: route.path === item.path }"
          :to="item.path"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <section class="upgrade-card learning-streak-card">
        <span>{{ t('dashboard.streak') }}</span>
        <strong>{{ studyOverview.streakDays || 7 }} <small>{{ t('dashboard.days') }}</small> 🔥</strong>
        <p>{{ t('dashboard.streakHint', { days: 1 }) }}</p>
        <div class="mini-week-strip" aria-hidden="true">
          <i v-for="day in sidebarStreakDays" :key="day" :class="{ hot: day === '日' }">
            <el-icon v-if="day !== '日'"><Check /></el-icon>
            <span v-else>🔥</span>
          </i>
        </div>
      </section>
    </aside>

    <section class="dashboard-main">
      <header class="dashboard-topbar">
        <p>Every day a little progress, every step closer to your goal.</p>
        <div class="topbar-actions">
          <LanguageSwitcher compact />
          <button class="icon-button" :aria-label="t('dashboard.notifications')">
            <el-icon><Bell /></el-icon>
          </button>
          <div class="user-chip">
            <span class="avatar">{{ avatarText }}</span>
            <strong>{{ displayName }}</strong>
            <em>Pro</em>
          </div>
        </div>
      </header>

      <main class="dashboard-content">
        <section class="welcome-panel">
          <div class="welcome-copy">
            <h1>{{ t('dashboard.welcome', { name: displayName }) }}</h1>
            <p>{{ t('dashboard.welcomeSubtitle') }}</p>
          </div>

          <div class="streak-panel">
            <div>
              <span>{{ t('dashboard.streak') }}</span>
              <strong>{{ studyOverview.streakDays || 7 }} <small>{{ t('dashboard.days') }}</small> 🔥</strong>
            </div>
            <div class="week-strip">
              <span v-for="day in weekDays" :key="day">{{ day }}</span>
              <i v-for="day in weekDays" :key="`${day}-done`" :class="{ hot: day === '日' }">
                <el-icon v-if="day !== '日'"><Check /></el-icon>
                <span v-else>🔥</span>
              </i>
            </div>
          </div>

          <div class="overview-grid">
            <article v-for="card in dynamicOverviewCards" :key="card.label" class="overview-card" :class="`tone-${card.tone}`">
              <span class="metric-icon"><el-icon><component :is="card.icon" /></el-icon></span>
              <div>
                <p>{{ card.label }}</p>
                <strong>{{ card.value }} <small>{{ card.unit }}</small></strong>
                <span class="metric-hint">{{ card.hint }}</span>
              </div>
              <b v-if="card.progress" :style="{ width: `${card.progress}%` }"></b>
            </article>
          </div>
        </section>

        <section class="home-category-panel">
          <div class="panel-head">
            <h2>{{ t('dashboard.techCategories') }}</h2>
            <RouterLink to="/technical-english">{{ t('dashboard.allCategories') }}</RouterLink>
          </div>
          <div class="home-category-grid">
            <RouterLink v-for="category in techCategories" :key="category.name" :class="`tone-${category.tone}`" to="/technical-english">
              <strong>{{ category.name }}</strong>
              <span>{{ category.count }}</span>
              <em>{{ category.mark }}</em>
            </RouterLink>
          </div>
        </section>

        <section class="home-dashboard-grid">
          <div class="home-dashboard-main">
            <div class="home-dashboard-work">
              <article class="content-panel home-recommend-panel">
                <div class="panel-head">
                  <h2>{{ t('dashboard.todayRecommend') }}</h2>
                  <button><el-icon><Refresh /></el-icon>{{ t('dashboard.refresh') }}</button>
                </div>
                <div v-for="item in recommendations" :key="item.title" class="home-term-card">
                  <div>
                    <h3>{{ item.title }} <span>{{ item.level }}</span></h3>
                    <strong>{{ item.cn }}</strong>
                    <p>{{ item.text }}</p>
                    <small>#.NET　#Design Pattern　#DI</small>
                  </div>
                  <span class="term-visual"><el-icon><Files /></el-icon></span>
                  <div class="term-actions">
                    <RouterLink to="/technical-english">{{ t('dashboard.startLearning') }}</RouterLink>
                    <button>{{ t('dashboard.aiExplain') }}</button>
                  </div>
                </div>
              </article>

              <article class="content-panel home-path-panel">
                <div class="panel-head"><h2>{{ t('dashboard.learningPath') }}</h2></div>
                <h3>.NET 开发路线</h3>
                <ol>
                  <li v-for="([title, desc], index) in learningPath" :key="title" :class="{ active: index === 1 }">
                    <span>{{ index + 1 }}</span>
                    <div><strong>{{ title }}</strong><small>{{ desc }}</small></div>
                  </li>
                </ol>
                <RouterLink to="/technical-english">{{ t('dashboard.viewRoadmap') }}</RouterLink>
              </article>
            </div>

            <article class="content-panel home-hot-panel">
              <div class="panel-head">
                <h2>{{ t('dashboard.hotTerms') }}</h2>
                <div><button class="active">{{ t('dashboard.thisWeek') }}</button><button>{{ t('dashboard.thisMonth') }}</button></div>
              </div>
              <div>
                <RouterLink v-for="[title, cn] in hotTerms" :key="title" to="/technical-english">
                  <strong>{{ title }}</strong><span>{{ cn }}</span><em>🔥</em>
                </RouterLink>
              </div>
            </article>
          </div>

          <aside class="home-dashboard-side">
            <article class="content-panel">
              <div class="panel-head">
                <h2>{{ t('dashboard.recentLearning') }}</h2>
                <RouterLink to="/study-records">{{ t('dashboard.allRecords') }}</RouterLink>
              </div>
              <ul class="home-recent-list">
                <li v-for="[title, time, tone] in recentLearning" :key="title">
                  <span :class="`tone-${tone}`">{{ title.slice(0, 2) }}</span>
                  <div><strong>{{ title }}</strong><small>{{ time }}</small></div>
                  <el-icon><CircleCheck /></el-icon>
                </li>
              </ul>
            </article>

            <article class="content-panel">
              <div class="panel-head">
                <h2>{{ t('dashboard.ranking') }}</h2>
                <button>本周⌄</button>
              </div>
              <ol class="home-ranking-list">
                <li v-for="([name, duration], index) in ranking" :key="name">
                  <b>{{ index + 1 }}</b>
                  <span>{{ name.slice(0, 1) }}</span>
                  <div><strong>{{ name }}</strong><small>{{ duration }}</small></div>
                </li>
              </ol>
              <RouterLink class="ranking-link" to="/study-records">{{ t('dashboard.viewRanking') }}</RouterLink>
            </article>
          </aside>
        </section>
      </main>
    </section>
  </div>
</template>
