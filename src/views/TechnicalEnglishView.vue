<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  Bell,
  Briefcase,
  ChatDotRound,
  Check,
  CircleCheck,
  DataAnalysis,
  Headset,
  HomeFilled,
  Notebook,
  Star,
} from '@element-plus/icons-vue'
import { RouterLink, useRoute } from 'vue-router'
import { apiOrigin } from '@/api/client'
import { learningItemsApi, type LearningItem } from '@/api/learningItems'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import { useI18n } from '@/composables/useI18n'
import { useAuthStore } from '@/stores/auth'
import { http } from '@/api/client'

const auth = useAuthStore()
const route = useRoute()
const { t } = useI18n()
const keyword = ref('')
const apiCourses = ref<LearningItem[]>([])
const isLoading = ref(false)
const selectedCourse = ref<CourseCard | null>(null)
const activeDetailTab = ref('real')
const activeWorkplaceCategory = ref(0)
const activeWorkplaceMenu = ref(0)
const activeWorkplaceTab = ref('expressions')
const workplaceShowMore = ref(false)
const workplaceMoreScenesOpen = ref(false)
const selectedWorkplaceExtraScene = ref('')
const copiedExpression = ref('')
const aiInterviewRole = ref('后端工程师')
const aiInterviewDifficulty = ref('中级')
const aiInterviewLanguage = ref('英文')
const aiInterviewAnswer = ref('')
const aiInterviewStarted = ref(false)
const activeDetailCategory = ref(0)
const activeTechnicalScene = ref(0)
const activeInterviewTab = ref('answer')
const interviewTranslationVisible = ref(false)
const interviewExampleTranslationVisible = ref(false)
const interviewSimpleTranslationVisible = ref(false)
const interviewFavorite = ref(false)
const interviewPracticeStarted = ref(false)
const interviewOwnAnswer = ref('')
const aiInterviewMessages = ref([
  { role: 'ai', text: '你好，我是今天的 AI 面试官。准备好后，我们将从项目经验开始。' },
])


function playEdgeTtsStream(text:any) {
  const url =
      `/api/learning-items/stream?text=${encodeURIComponent(text)}`

  const audio = new Audio(url)
  audio.play()
}


const aiInterviewProgress = computed(() =>
  Math.min(aiInterviewMessages.value.filter((message) => message.role === 'user').length + (aiInterviewStarted.value ? 1 : 0), 8),
)
const displayName = computed(() => auth.user?.nickname || '管理员')
const avatarText = computed(() => displayName.value.slice(0, 1))

interface CourseCard {
  title: string
  subtitle: string
  image: string
  tone: string
  chineseText: string
  explanation: string
  example: string
  difficulty: string
}

const navItems = computed(() => [
  { label: t('nav.dashboard'), path: '/dashboard', icon: HomeFilled },
  { label: t('nav.technicalEnglish'), path: '/technical-english', icon: Notebook },
  { label: t('nav.interviewEnglish'), path: '/interview-english', icon: ChatDotRound },
  { label: t('nav.aiInterview'), path: '/ai-interview', icon: Headset },
  { label: t('nav.workplaceEnglish'), path: '/workplace-english', icon: Briefcase },
  { label: t('nav.dailyGrowth'), path: '/daily-growth', icon: CircleCheck },
  { label: t('nav.studyRecords'), path: '/study-records', icon: DataAnalysis },
])

const sidebarStreakDays = ['一', '二', '三', '四', '五', '日']
const courseGroups = {
  'technical-english': {
    type: 'TechnicalVocabulary',
    search: '搜索技术英语课程',
    empty: '换一个技术词汇试试。',
    courses: [
      ['“依赖注入”用英文怎么说', 'Dependency Injection', 'https://illustrations.popsy.co/blue/product-launch.svg', 'soft'],
      ['“异步通信”用英文怎么说', 'Asynchronous Communication', 'https://illustrations.popsy.co/purple/work-party.svg', 'purple'],
      ['“代码评审”用英文怎么说', 'Code Review', 'https://illustrations.popsy.co/green/success.svg', 'mint'],
      ['“系统扩容”用英文怎么说', 'System Scaling', 'https://illustrations.popsy.co/blue/remote-work.svg', 'blue'],
      ['“技术沟通”用英文怎么说', 'Technical Communication', 'https://illustrations.popsy.co/amber/designer.svg', 'warm'],
      ['“问题已解决”用英文怎么说', 'Issue Resolved', 'https://illustrations.popsy.co/blue/success.svg', 'sky'],
    ],
  },
  'interview-english': {
    type: 'InterviewEnglish',
    search: '搜索面试英语课程',
    empty: '换一个面试主题试试。',
    courses: [
      ['“请介绍一下你自己”用英文怎么说', 'Tell me about yourself', 'https://illustrations.popsy.co/amber/designer.svg', 'soft'],
      ['“项目经验”用英文怎么说', 'Project Experience', 'https://illustrations.popsy.co/purple/work-party.svg', 'purple'],
      ['“技术难点”用英文怎么说', 'Technical Challenge', 'https://illustrations.popsy.co/green/success.svg', 'mint'],
      ['“优缺点”用英文怎么说', 'Strengths and Weaknesses', 'https://illustrations.popsy.co/blue/remote-work.svg', 'blue'],
      ['“薪资期望”用英文怎么说', 'Salary Expectation', 'https://illustrations.popsy.co/amber/designer.svg', 'warm'],
      ['“反问面试官”用英文怎么说', 'Questions for Interviewer', 'https://illustrations.popsy.co/blue/success.svg', 'sky'],
    ],
  },
  'ai-interview': {
    type: 'AiInterview',
    search: '搜索 AI 面试场景',
    empty: '换一个模拟面试场景试试。',
    courses: [
      ['前端工程师 AI 模拟面试', 'Frontend Interview Simulation', 'https://illustrations.popsy.co/blue/product-launch.svg', 'soft'],
      ['后端工程师 AI 模拟面试', 'Backend Interview Simulation', 'https://illustrations.popsy.co/purple/work-party.svg', 'purple'],
      ['系统设计 AI 模拟面试', 'System Design Simulation', 'https://illustrations.popsy.co/green/success.svg', 'mint'],
      ['英语口语 AI 追问练习', 'Follow-up Question Practice', 'https://illustrations.popsy.co/blue/remote-work.svg', 'blue'],
      ['行为面试 STAR 练习', 'Behavioral Interview STAR', 'https://illustrations.popsy.co/amber/designer.svg', 'warm'],
      ['面试复盘与改进建议', 'Interview Feedback Review', 'https://illustrations.popsy.co/blue/success.svg', 'sky'],
    ],
  },
  'workplace-english': {
    type: 'WorkplaceExpression',
    search: '搜索职场英语课程',
    empty: '换一个职场场景试试。',
    courses: [
      ['“同步一下进度”用英文怎么说', 'Status Update', 'https://illustrations.popsy.co/blue/product-launch.svg', 'soft'],
      ['“安排会议”用英文怎么说', 'Schedule a Meeting', 'https://illustrations.popsy.co/purple/work-party.svg', 'purple'],
      ['“邮件催办”用英文怎么说', 'Follow-up Email', 'https://illustrations.popsy.co/green/success.svg', 'mint'],
      ['“需求确认”用英文怎么说', 'Requirement Clarification', 'https://illustrations.popsy.co/blue/remote-work.svg', 'blue'],
      ['“汇报风险”用英文怎么说', 'Report a Risk', 'https://illustrations.popsy.co/amber/designer.svg', 'warm'],
      ['“确认收到”用英文怎么说', 'Acknowledge Receipt', 'https://illustrations.popsy.co/blue/success.svg', 'sky'],
    ],
  },
  'daily-growth': {
    type: 'DailyGrowth',
    search: '搜索每日成长内容',
    empty: '换一个成长关键词试试。',
    courses: [
      ['今日一句：Keep going.', '每日一句', 'https://illustrations.popsy.co/amber/designer.svg', 'soft'],
      ['今日词汇：Resilience', '每日词汇', 'https://illustrations.popsy.co/purple/work-party.svg', 'purple'],
      ['今日表达：Make progress', '高频表达', 'https://illustrations.popsy.co/green/success.svg', 'mint'],
      ['轻练习：选择正确表达', 'Mini Quiz', 'https://illustrations.popsy.co/blue/remote-work.svg', 'blue'],
      ['复盘：今天学到了什么', 'Daily Review', 'https://illustrations.popsy.co/amber/designer.svg', 'warm'],
      ['成长挑战：连续学习 7 天', 'Learning Challenge', 'https://illustrations.popsy.co/blue/success.svg', 'sky'],
    ],
  },
} as const

const currentGroup = computed(() => {
  const name = String(route.name ?? 'technical-english') as keyof typeof courseGroups
  return courseGroups[name] ?? courseGroups['technical-english']
})
const resolveImageUrl = (url: string) => {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  return `${apiOrigin}${url.startsWith('/') ? url : `/${url}`}`
}
const courses = computed(() =>
  apiCourses.value.length
    ? apiCourses.value.map((item, index) => ({
        title: item.title,
        subtitle: item.englishText || item.chineseText || item.difficulty,
        image: resolveImageUrl(item.imageUrl),
        tone: currentGroup.value.courses[index % currentGroup.value.courses.length][3],
        chineseText: item.chineseText,
        explanation: item.explanation,
        example: item.example,
        difficulty: item.difficulty,
      }))
    : currentGroup.value.courses.map(([title, subtitle, image, tone]) => ({
        title,
        subtitle,
        image,
        tone,
        chineseText: title.replace(/[“”]/g, '').replace('用英文怎么说', ''),
        explanation: `${subtitle} is a practical expression developers can use in technical communication.`,
        example: `We use ${subtitle.toLowerCase()} in real project communication.`,
        difficulty: 'Beginner',
      })),
)

const filteredCourses = computed(() => {
  const value = keyword.value.trim().toLowerCase()
  if (!value) return courses.value
  return courses.value.filter((course) => `${course.title} ${course.subtitle}`.toLowerCase().includes(value))
})
const isInterviewPage = computed(() => route.name === 'interview-english')
const isTechnicalPage = computed(() => route.name === 'technical-english')
const isAiInterviewPage = computed(() => route.name === 'ai-interview')
const isWorkplacePage = computed(() => route.name === 'workplace-english')

const loadCourses = async () => {
  isLoading.value = true
  selectedCourse.value = null
  apiCourses.value = []
  try {
    const { data } = await learningItemsApi.list(currentGroup.value.type)
    apiCourses.value = (data.data ?? []).filter((item) => Boolean(item.imageUrl))
  } catch {
    apiCourses.value = []
  } finally {
    isLoading.value = false
    activeDetailCategory.value = 0
    activeTechnicalScene.value = 0
    activeDetailTab.value = 'real'
    activeInterviewTab.value = 'answer'
    interviewTranslationVisible.value = false
    interviewExampleTranslationVisible.value = false
    interviewSimpleTranslationVisible.value = false
    interviewPracticeStarted.value = false
    if (isTechnicalPage.value) {
      selectedCourse.value = createTechnicalTopicCourse(0)
    } else if (isInterviewPage.value || isAiInterviewPage.value || isWorkplacePage.value) {
      selectedCourse.value = courses.value[0] ?? null
    }
  }
}

onMounted(loadCourses)
watch(() => route.name, loadCourses)

const detailTabs = [
  { key: 'real',  },
  { key: 'sentence', },
  { key: 'interview',  },
  { key: 'project',  },
  { key: 'ai',  },
  { key: 'voice',  },
]
const technicalTopicConfigs = [
  {
    label: '.NET', short: '.N', total: 125, concept: 'Dependency Injection', chinese: '依赖注入',
    description: 'A core .NET design approach for building loosely coupled and testable applications.',
    sceneCounts: [30, 38, 32, 25],
    words: [
      [['Definition', '定义'], ['Dependency', '依赖项'], ['Injection', '注入'], ['Lifetime', '生命周期'], ['Decoupling', '解耦']],
      [['Container', '容器'], ['Service Registration', '服务注册'], ['Scoped', '作用域'], ['Transient', '瞬时生命周期'], ['Singleton', '单例']],
      [['Request', '请求'], ['Middleware', '中间件'], ['Configuration', '配置'], ['Logging', '日志记录'], ['Testing', '测试']],
      [['Interface', '接口'], ['Abstraction', '抽象'], ['Composition Root', '组合根'], ['Inversion of Control', '控制反转'], ['Maintainability', '可维护性']],
    ],
  },
  {
    label: 'RabbitMQ', short: 'MQ', total: 68, concept: 'Asynchronous Communication', chinese: '异步通信',
    description: 'RabbitMQ enables reliable asynchronous communication between distributed services.',
    sceneCounts: [12, 18, 15, 23],
    words: [
      [['Message Queue', '消息队列'], ['Producer', '生产者'], ['Consumer', '消费者'], ['Acknowledgement', '消息确认'], ['Reliability', '可靠性']],
      [['Exchange', '交换机'], ['Queue', '队列'], ['Routing Key', '路由键'], ['Binding', '绑定'], ['Dead Letter Queue', '死信队列']],
      [['Publish', '发布消息'], ['Subscribe', '订阅'], ['Retry', '重试'], ['Delivery', '投递'], ['Monitoring', '监控']],
      [['Broker', '消息代理'], ['AMQP', '高级消息队列协议'], ['Outbox Pattern', '发件箱模式'], ['Idempotency', '幂等性'], ['Event-driven', '事件驱动']],
    ],
  },
  {
    label: 'Redis', short: 'R', total: 42, concept: 'Distributed Cache', chinese: '分布式缓存',
    description: 'Redis improves application responsiveness with fast in-memory data access.',
    sceneCounts: [10, 12, 11, 9],
    words: [
      [['Cache', '缓存'], ['Key', '键'], ['Value', '值'], ['Expiration', '过期时间'], ['Eviction', '淘汰策略']],
      [['Cache Hit', '缓存命中'], ['Cache Miss', '缓存未命中'], ['Invalidation', '缓存失效'], ['Persistence', '持久化'], ['Replication', '复制']],
      [['Session', '会话'], ['Rate Limit', '限流'], ['Counter', '计数器'], ['Distributed Lock', '分布式锁'], ['Pub/Sub', '发布订阅']],
      [['Cluster', '集群'], ['Sentinel', '哨兵'], ['Sharding', '分片'], ['Failover', '故障转移'], ['Consistency', '一致性']],
    ],
  },
  {
    label: 'SQL', short: 'SQL', total: 95, concept: 'Query Optimization', chinese: '查询优化',
    description: 'SQL query optimization improves database performance and resource efficiency.',
    sceneCounts: [22, 28, 25, 20],
    words: [
      [['Query', '查询'], ['Table', '数据表'], ['Column', '列'], ['Constraint', '约束'], ['Primary Key', '主键']],
      [['Join', '连接查询'], ['Index', '索引'], ['Transaction', '事务'], ['Pagination', '分页'], ['Stored Procedure', '存储过程']],
      [['Insert', '插入'], ['Update', '更新'], ['Delete', '删除'], ['Filter', '筛选'], ['Aggregate', '聚合']],
      [['Execution Plan', '执行计划'], ['Normalization', '规范化'], ['Isolation Level', '隔离级别'], ['Deadlock', '死锁'], ['Partitioning', '分区']],
    ],
  },
  {
    label: '微服务', short: '微', total: 56, concept: 'Service Decomposition', chinese: '服务拆分',
    description: 'Microservice design divides business capabilities into independently deployable services.',
    sceneCounts: [12, 16, 15, 13],
    words: [
      [['Microservice', '微服务'], ['Domain', '领域'], ['Boundary', '边界'], ['Capability', '业务能力'], ['Ownership', '职责归属']],
      [['API Gateway', 'API 网关'], ['Service Discovery', '服务发现'], ['Configuration', '配置中心'], ['Tracing', '链路追踪'], ['Observability', '可观测性']],
      [['Service Call', '服务调用'], ['Timeout', '超时'], ['Retry', '重试'], ['Fallback', '降级'], ['Circuit Breaker', '熔断器']],
      [['Bounded Context', '限界上下文'], ['Eventual Consistency', '最终一致性'], ['Saga', '分布式事务模式'], ['Contract', '服务契约'], ['Orchestration', '编排']],
    ],
  },
  {
    label: 'DevOps', short: 'DO', total: 31, concept: 'CI/CD Pipeline', chinese: '持续集成与交付',
    description: 'A CI/CD pipeline automates software build, test, release, and deployment workflows.',
    sceneCounts: [7, 9, 8, 7],
    words: [
      [['Continuous Integration', '持续集成'], ['Continuous Delivery', '持续交付'], ['Pipeline', '流水线'], ['Build', '构建'], ['Artifact', '制品']],
      [['Repository', '代码仓库'], ['Unit Test', '单元测试'], ['Code Quality', '代码质量'], ['Release', '发布'], ['Environment', '环境']],
      [['Deployment', '部署'], ['Rollback', '回滚'], ['Approval', '审批'], ['Monitoring', '监控'], ['Incident', '事故']],
      [['Infrastructure as Code', '基础设施即代码'], ['Automation', '自动化'], ['Container', '容器'], ['Runner', '执行器'], ['Secret', '密钥']],
    ],
  },
  {
    label: 'Cloud', short: '云', total: 24, concept: 'Cloud-native Deployment', chinese: '云原生部署',
    description: 'Cloud-native deployment uses elastic infrastructure and managed services for resilient delivery.',
    sceneCounts: [6, 7, 6, 5],
    words: [
      [['Cloud', '云平台'], ['Instance', '实例'], ['Region', '区域'], ['Availability Zone', '可用区'], ['Managed Service', '托管服务']],
      [['Storage', '存储'], ['Network', '网络'], ['Load Balancer', '负载均衡器'], ['Database', '数据库'], ['Identity', '身份']],
      [['Auto Scaling', '自动扩缩容'], ['Serverless', '无服务器架构'], ['Function', '云函数'], ['Metric', '指标'], ['Billing', '计费']],
      [['Resilience', '韧性'], ['High Availability', '高可用'], ['Disaster Recovery', '灾难恢复'], ['Multi-region', '多区域'], ['Security Group', '安全组']],
    ],
  },
] as const
const currentTechnicalTopic = computed(() => technicalTopicConfigs[activeDetailCategory.value] ?? technicalTopicConfigs[0])
const sceneLabels = ['面试场景', '项目场景', '日常工作场景', '架构设计场景']
const technicalSceneDetail = computed(() => {
  const topic = currentTechnicalTopic.value
  const sceneDetails = [
    {
      title: `${topic.concept} Interview`,
      chinese: `${topic.chinese}面试表达`,
      description: `Learn how to explain ${topic.concept} clearly in technical interviews, including definitions, trade-offs, and measurable results.`,
    },
    {
      title: `${topic.concept} Implementation`,
      chinese: `${topic.chinese}项目实践`,
      description: `Apply ${topic.concept} in real projects and describe the implementation process, technical decisions, and business impact.`,
    },
    {
      title: `${topic.concept} in Daily Work`,
      chinese: `${topic.chinese}日常应用`,
      description: `Use ${topic.concept} naturally in daily development, troubleshooting, team discussions, and technical documentation.`,
    },
    {
      title: `${topic.concept} Architecture`,
      chinese: `${topic.chinese}架构设计`,
      description: `Explore the architecture, scalability, reliability, and design trade-offs behind ${topic.concept}.`,
    },
  ]
  return sceneDetails[activeTechnicalScene.value] ?? sceneDetails[0]
})
const sceneCategories = computed(() =>
  sceneLabels.map((label, index) => [label, currentTechnicalTopic.value.sceneCounts[index]] as const),
)
const relatedWords = computed<[string, string][]>(() =>
  [...currentTechnicalTopic.value.words[activeTechnicalScene.value]] as [string, string][],
)
const technicalTabContent = computed(() => {
  const term = selectedCourse.value?.subtitle ?? 'Technical concept'
  const chinese = selectedCourse.value?.chineseText || selectedCourse.value?.title || '技术概念'
  const content = {
    real: [
      ['工作中如何表达', `We use ${term} to keep the implementation clear and maintainable.`, `${chinese}用于让实现过程更清晰、更容易维护。`, 'blue'],
      ['团队沟通中如何表达', `Let's review the ${term} approach before implementation.`, `让我们在实现前评审一下${chinese}方案。`, 'green'],
      ['问题处理中如何表达', `The issue was resolved by improving our ${term} design.`, `我们通过改进${chinese}设计解决了这个问题。`, 'purple'],
    ],
    sentence: [
      ['基础例句', `${term} is commonly used in modern software projects.`, `${chinese}常用于现代软件项目。`, 'blue'],
      ['进阶例句', `A well-designed ${term} strategy reduces coupling between modules.`, `设计良好的${chinese}策略可以降低模块耦合。`, 'green'],
      ['讨论例句', `We should document the trade-offs of this ${term} approach.`, `我们应该记录该${chinese}方案的取舍。`, 'purple'],
    ],
    interview: [
      ['面试开场', `I have used ${term} in several production projects.`, `我在多个生产项目中使用过${chinese}。`, 'blue'],
      ['说明价值', `It improved maintainability and made the system easier to test.`, `它提升了可维护性，也让系统更容易测试。`, 'green'],
      ['说明结果', `As a result, our delivery time was reduced by about 20%.`, `最终，我们的交付时间缩短了约 20%。`, 'purple'],
    ],
    project: [
      ['项目背景', `Our team introduced ${term} while modernizing a legacy service.`, `团队在改造旧服务时引入了${chinese}。`, 'blue'],
      ['实施过程', `I designed the solution, aligned the team, and completed the rollout.`, `我负责方案设计、团队对齐和上线实施。`, 'green'],
      ['项目收益', `The change reduced incidents and simplified future development.`, `该改动减少了故障，并简化了后续开发。`, 'purple'],
    ],
    ai: [
      ['AI 内容总结', `${term} focuses on clear responsibility, maintainable design, and effective collaboration.`, `${chinese}强调职责清晰、设计可维护以及高效协作。`, 'blue'],
      ['学习建议', `Explain the concept with one definition, one example, and one measurable result.`, `建议使用一个定义、一个案例和一个可量化结果进行说明。`, 'green'],
      ['练习提示', `Try describing how you used ${term} in your latest project.`, `尝试描述你最近一次在项目中如何使用${chinese}。`, 'purple'],
    ],
    voice: [
      ['发音拆解', `${term}`, `先慢速拆分单词，再用正常语速完整朗读。`, 'blue'],
      ['跟读句子', `We use ${term} in our production environment.`, `跟读完整句子，注意重音和停顿。`, 'green'],
      ['口语练习', `Let me explain how ${term} works in our project.`, `连续朗读三遍，让表达更加自然。`, 'purple'],
    ],
  } as const
  return content[activeDetailTab.value as keyof typeof content] ?? content.real
})
const technicalCategories = technicalTopicConfigs.map((topic) => ({
  label: topic.label,
  count: `${topic.sceneCounts.reduce((sum, count) => sum + count, 0)} 个词汇`,
  short: topic.short,
}))
const createTechnicalTopicCourse = (index: number): CourseCard => {
  const topic = technicalTopicConfigs[index] ?? technicalTopicConfigs[0]
  const fallback = courseGroups['technical-english'].courses[index % courseGroups['technical-english'].courses.length]
  return {
    title: `${topic.label} · ${topic.chinese}`,
    subtitle: topic.concept,
    image: fallback[2],
    tone: fallback[3],
    chineseText: topic.chinese,
    explanation: topic.description,
    example: `We use ${topic.concept} in ${topic.label} projects to improve reliability and maintainability.`,
    difficulty: index < 2 ? 'Beginner' : index < 5 ? 'Intermediate' : 'Advanced',
  }
}
const currentSceneWordCount = computed(() => currentTechnicalTopic.value.sceneCounts[activeTechnicalScene.value])
const interviewCategories = [
  { label: '基础问答', count: '24 个题目', short: '基' },
  { label: '项目经验', count: '32 个题目', short: '项' },
  { label: '技术深挖', count: '28 个题目', short: '技' },
  { label: '系统设计', count: '18 个题目', short: '系' },
  { label: '行为面试', count: '20 个题目', short: '行' },
  { label: '沟通表达', count: '16 个题目', short: '沟' },
  { label: '反问环节', count: '12 个题目', short: '问' },
]
const interviewTabs = [
  { key: 'answer' },
  { key: 'expressions' },
  { key: 'followups' },
  { key: 'tips' },
  { key: 'optimized' },
  { key: 'mine'},
]
const interviewTopicConfigs = [
  {
    question: 'Tell me about yourself.',
    topic: 'Self Introduction',
    chinese: '请介绍一下你自己。',
    answer: 'I am a software engineer with experience building reliable web applications. I enjoy solving complex problems, collaborating with teams, and continuously improving system quality.',
    translation: '我是一名拥有可靠 Web 应用开发经验的软件工程师。我喜欢解决复杂问题、与团队协作，并持续提升系统质量。',
    related: ['Self-introduction', 'Experience', 'Strengths', 'Career goal', 'Background'],
  },
  {
    question: 'Can you describe a challenging project you worked on?',
    topic: 'Project Experience',
    chinese: '请介绍一个具有挑战性的项目。',
    answer: 'I led the backend development of a high-traffic platform. I clarified the core bottleneck, designed a scalable solution, coordinated the rollout, and reduced response time by 35%.',
    translation: '我负责一个高流量平台的后端开发。我明确了核心瓶颈，设计可扩展方案并协调上线，最终将响应时间缩短了 35%。',
    related: ['Project scope', 'Responsibility', 'Challenge', 'Solution', 'Result'],
  },
  {
    question: 'How do you ensure message reliability in RabbitMQ?',
    topic: 'Technical Deep Dive',
    chinese: '你如何保证 RabbitMQ 消息可靠性？',
    answer: 'I use publisher confirms, durable queues, acknowledgements, retry policies, dead-letter queues, and idempotent consumers. I also monitor delivery failures and queue depth.',
    translation: '我会使用发布确认、持久化队列、消息确认、重试策略、死信队列以及幂等消费者，并监控投递失败和队列深度。',
    related: ['Publisher Confirm', 'Acknowledgement', 'Dead Letter Queue', 'Retry', 'Idempotency'],
  },
  {
    question: 'How would you design a scalable notification system?',
    topic: 'System Design',
    chinese: '你会如何设计可扩展的通知系统？',
    answer: 'I would separate message creation, delivery, and status tracking. A queue absorbs traffic spikes, workers scale independently, and delivery status is stored for retries and auditing.',
    translation: '我会拆分消息创建、投递和状态追踪。队列用于吸收流量峰值，工作节点独立扩展，并保存投递状态以支持重试和审计。',
    related: ['Scalability', 'Queue', 'Worker', 'Rate Limit', 'Observability'],
  },
  {
    question: 'Tell me about a time you resolved a team conflict.',
    topic: 'Behavioral Interview',
    chinese: '请介绍一次你解决团队冲突的经历。',
    answer: 'I first listened to both perspectives, clarified the shared objective, and used data to compare the options. We agreed on a small experiment and made the final decision together.',
    translation: '我先倾听双方观点，明确共同目标，再通过数据比较方案。我们同意先做一个小实验，并共同作出最终决定。',
    related: ['Conflict', 'Alignment', 'Communication', 'Evidence', 'Decision'],
  },
  {
    question: 'How do you explain technical risks to non-technical stakeholders?',
    topic: 'Communication',
    chinese: '你如何向非技术相关方解释技术风险？',
    answer: 'I avoid unnecessary jargon, explain the business impact, compare realistic options, and recommend a clear next step with cost and timeline.',
    translation: '我会避免不必要的术语，解释业务影响，比较可行选项，并给出包含成本和时间线的明确建议。',
    related: ['Stakeholder', 'Business impact', 'Risk', 'Option', 'Recommendation'],
  },
  {
    question: 'What questions would you like to ask us?',
    topic: 'Questions for Interviewer',
    chinese: '你有什么问题想问我们？',
    answer: 'I would like to understand the team’s current priorities, how success is measured for this role, and the main technical challenges I would help solve.',
    translation: '我想了解团队当前的重点、该岗位衡量成功的方式，以及我将参与解决的主要技术挑战。',
    related: ['Priority', 'Success metric', 'Team culture', 'Challenge', 'Growth'],
  },
]
const currentInterviewTopic = computed(() => interviewTopicConfigs[activeDetailCategory.value] ?? interviewTopicConfigs[0])
const interviewExampleAnswer = computed(() =>
  `${currentInterviewTopic.value.answer} In my previous role, I applied this approach in a real project and communicated the measurable outcome clearly.`,
)
const interviewSimpleAnswer = computed(() =>
  `${currentInterviewTopic.value.topic} is important in my work. I can explain the situation, what I did, and the result.`,
)
const interviewExampleTranslation = computed(() =>
  `${currentInterviewTopic.value.translation} 在之前的岗位中，我将这种方式应用于真实项目，并清晰说明了可量化的成果。`,
)
const interviewSimpleTranslation = computed(() =>
  `${currentInterviewTopic.value.topic} 对我的工作很重要。我可以说明当时的情况、我采取的行动以及最终结果。`,
)
const detailCategories = computed(() => (isInterviewPage.value ? interviewCategories : technicalCategories))
const detailOverview = computed(() =>
  isInterviewPage.value
    ? { title: '面试英语', subtitle: '掌握高频面试表达，让你的技术能力被清晰看见', search: '搜索面试题目' }
    : { title: '技术英语', subtitle: '系统学习技术词汇与表达，提升你的技术英语能力', search: '搜索技术词汇' },
)
const workplaceCategories = [
  { label: '会议沟通', count: '28 个场景', tone: 'blue', menus: ['会议开始', '表达观点', '提问与澄清', '讨论与反馈', '总结与行动项', '会议结束'], more: ['远程会议', '会议延期', '会议冲突', '邀请参会', '记录会议纪要'] },
  { label: '项目沟通', count: '32 个场景', tone: 'purple', menus: ['项目启动', '同步进度', '需求确认', '风险沟通', '延期说明', '项目复盘'], more: ['范围变更', '资源申请', '里程碑确认', '依赖协调', '交付确认'] },
  { label: '邮件沟通', count: '24 个场景', tone: 'green', menus: ['邮件开场', '请求协助', '确认信息', '礼貌催办', '发送附件', '邮件结尾'], more: ['抄送说明', '自动回复', '会议邀请', '问题升级', '感谢邮件'] },
  { label: '代码评审', count: '18 个场景', tone: 'sky', menus: ['发起评审', '提出建议', '解释实现', '讨论方案', '确认修改', '通过评审'], more: ['请求补充测试', '说明风险', '建议重构', '拒绝方案', '合并确认'] },
  { label: '跨团队协作', count: '26 个场景', tone: 'indigo', menus: ['建立联系', '说明背景', '协调资源', '确认职责', '处理依赖', '同步结果'], more: ['安排对接人', '升级问题', '同步时间线', '确认接口', '交接事项'] },
  { label: '问题反馈', count: '22 个场景', tone: 'orange', menus: ['描述问题', '说明影响', '提供日志', '请求排查', '同步修复', '确认恢复'], more: ['反馈复现步骤', '请求临时方案', '说明根因', '验证修复', '关闭问题'] },
  { label: '日常交流', count: '30 个场景', tone: 'cyan', menus: ['日常问候', '安排时间', '请求帮助', '表达感谢', '请假说明', '结束交流'], more: ['午餐交流', '祝贺同事', '欢迎新人', '表达歉意', '周末问候'] },
]
const workplaceTabs = [
  { key: 'description', label: '场景描述' },
  { key: 'expressions', label: '常用表达' },
  { key: 'dialogue', label: '对话示例' },
  { key: 'recommended', label: '推荐表达' },
]
const workplaceBaseExpressions = [
  ["Let's get started.", '我们开始吧。'],
  ['Thank you all for joining.', '感谢大家参加。'],
  ["Let's begin today's discussion.", '我们开始今天的讨论。'],
  ['The purpose of this conversation is to...', '本次沟通的目的是...'],
  ['Let me quickly go over the key points.', '让我快速过一下重点。'],
  ['Does anyone have anything to add?', '大家还有什么需要补充的吗？'],
  ["I'll share the follow-up items after this.", '我会在之后同步后续事项。'],
]
const currentWorkplaceCategory = computed(() => workplaceCategories[activeWorkplaceCategory.value])
const currentWorkplaceMenu = computed(() =>
  selectedWorkplaceExtraScene.value || currentWorkplaceCategory.value.menus[activeWorkplaceMenu.value],
)
const workplaceCategoryWords: Record<string, [string, string][]> = {
  会议沟通: [['Agenda', '议程'], ['Participant', '参与者'], ['Discussion', '讨论'], ['Action item', '行动项'], ['Follow-up', '跟进']],
  项目沟通: [['Milestone', '里程碑'], ['Deadline', '截止时间'], ['Scope', '范围'], ['Dependency', '依赖项'], ['Deliverable', '交付物']],
  邮件沟通: [['Subject', '主题'], ['Attachment', '附件'], ['Recipient', '收件人'], ['CC', '抄送'], ['Regards', '致意']],
  代码评审: [['Pull request', '合并请求'], ['Comment', '评审意见'], ['Refactor', '重构'], ['Approval', '批准'], ['Merge', '合并']],
  跨团队协作: [['Stakeholder', '相关方'], ['Ownership', '职责归属'], ['Alignment', '达成一致'], ['Handover', '交接'], ['Dependency', '依赖项']],
  问题反馈: [['Issue', '问题'], ['Impact', '影响'], ['Root cause', '根因'], ['Workaround', '临时方案'], ['Resolution', '解决方案']],
  日常交流: [['Availability', '可用时间'], ['Appreciation', '感谢'], ['Request', '请求'], ['Schedule', '安排'], ['Confirmation', '确认']],
}
const workplaceSceneWords: Record<string, [string, string][]> = {
  会议开始: [['Kick-off', '开始'], ['Agenda', '议程'], ['Participant', '参与者'], ['Objective', '目标'], ['Opening remark', '开场白']],
  表达观点: [['Perspective', '观点'], ['Suggestion', '建议'], ['Concern', '顾虑'], ['Agree', '赞同'], ['Disagree', '不同意']],
  提问与澄清: [['Clarification', '澄清'], ['Question', '问题'], ['Confirm', '确认'], ['Elaborate', '详细说明'], ['Misunderstanding', '误解']],
  讨论与反馈: [['Discussion', '讨论'], ['Feedback', '反馈'], ['Comment', '意见'], ['Alternative', '替代方案'], ['Consensus', '共识']],
  总结与行动项: [['Summary', '总结'], ['Action item', '行动项'], ['Owner', '负责人'], ['Deadline', '截止时间'], ['Follow-up', '跟进']],
  会议结束: [['Wrap-up', '结束总结'], ['Next step', '下一步'], ['Minutes', '会议纪要'], ['Reminder', '提醒'], ['Adjourn', '散会']],
  项目启动: [['Kickoff', '启动'], ['Scope', '范围'], ['Milestone', '里程碑'], ['Stakeholder', '相关方'], ['Timeline', '时间线']],
  同步进度: [['Progress', '进度'], ['Status', '状态'], ['Blocker', '阻塞项'], ['Update', '更新'], ['ETA', '预计完成时间']],
  需求确认: [['Requirement', '需求'], ['Acceptance criteria', '验收标准'], ['Priority', '优先级'], ['Scope', '范围'], ['Confirmation', '确认']],
  风险沟通: [['Risk', '风险'], ['Impact', '影响'], ['Mitigation', '缓解措施'], ['Probability', '可能性'], ['Escalation', '升级处理']],
  延期说明: [['Delay', '延期'], ['Reason', '原因'], ['Revised date', '调整日期'], ['Impact', '影响'], ['Recovery plan', '恢复计划']],
  项目复盘: [['Retrospective', '复盘'], ['Outcome', '结果'], ['Lesson learned', '经验总结'], ['Improvement', '改进'], ['Next step', '下一步']],
  邮件开场: [['Greeting', '问候语'], ['Subject', '主题'], ['Recipient', '收件人'], ['Introduction', '开场介绍'], ['Context', '背景']],
  请求协助: [['Assistance', '协助'], ['Request', '请求'], ['Availability', '可用时间'], ['Support', '支持'], ['Appreciate', '感谢']],
  礼貌催办: [['Reminder', '提醒'], ['Follow-up', '跟进'], ['Pending', '待处理'], ['Deadline', '截止时间'], ['Appreciate', '感谢']],
  发起评审: [['Pull request', '合并请求'], ['Reviewer', '评审人'], ['Review', '评审'], ['Change', '修改'], ['Context', '背景']],
  提出建议: [['Suggestion', '建议'], ['Consider', '考虑'], ['Alternative', '替代方案'], ['Improve', '改进'], ['Recommend', '推荐']],
  描述问题: [['Issue', '问题'], ['Symptom', '现象'], ['Reproduce', '复现'], ['Environment', '环境'], ['Impact', '影响']],
  说明影响: [['Impact', '影响'], ['Severity', '严重程度'], ['Affected user', '受影响用户'], ['Downtime', '停机时间'], ['Priority', '优先级']],
  日常问候: [['Greeting', '问候'], ['How are you', '近况如何'], ['Morning', '早上好'], ['Welcome', '欢迎'], ['Catch up', '叙旧']],
  请求帮助: [['Help', '帮助'], ['Could you', '你可以吗'], ['Available', '有空'], ['Support', '支持'], ['Thanks', '感谢']],
}
const sceneSpecificWords = computed<[string, string][]>(() => {
  const exact = workplaceSceneWords[currentWorkplaceMenu.value]
  if (exact) return exact

  const categoryWords = workplaceCategoryWords[currentWorkplaceCategory.value.label] ?? workplaceCategoryWords.会议沟通
  return [
    [currentWorkplaceMenu.value, '当前场景'],
    ...categoryWords.slice(0, 4),
  ]
})
const workplaceContext = computed(() => ({
  title: currentWorkplaceMenu.value,
  subtitle: `用于${currentWorkplaceCategory.value.label}中的${currentWorkplaceMenu.value}场景`,
  description: `在${currentWorkplaceCategory.value.label}的“${currentWorkplaceMenu.value}”环节中，用于清晰说明背景、确认信息并推动沟通顺利进行。`,
  expressions: workplaceBaseExpressions.map(([en, cn], index) => [
    index === 0 ? `Let's start with ${currentWorkplaceMenu.value}.` : en,
    index === 0 ? `我们先从“${currentWorkplaceMenu.value}”开始。` : cn,
  ]),
  words: sceneSpecificWords.value,
}))
const visibleWorkplaceExpressions = computed(() =>
  workplaceShowMore.value ? workplaceContext.value.expressions : workplaceContext.value.expressions.slice(0, 5),
)
const selectWorkplaceCategory = (index: number) => {
  activeWorkplaceCategory.value = index
  activeWorkplaceMenu.value = 0
  activeWorkplaceTab.value = 'expressions'
  workplaceShowMore.value = false
  workplaceMoreScenesOpen.value = false
  selectedWorkplaceExtraScene.value = ''
}
const selectWorkplaceMenu = (index: number) => {
  activeWorkplaceMenu.value = index
  selectedWorkplaceExtraScene.value = ''
  workplaceShowMore.value = false
  workplaceMoreScenesOpen.value = false
}
const toggleMoreWorkplaceScenes = () => {
  workplaceMoreScenesOpen.value = !workplaceMoreScenesOpen.value
}
const selectMoreWorkplaceScene = (scene: string) => {
  selectedWorkplaceExtraScene.value = scene
  activeWorkplaceTab.value = 'expressions'
  workplaceShowMore.value = false
}
const copyExpression = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Clipboard access may be unavailable in local preview contexts.
  }
  copiedExpression.value = text
  window.setTimeout(() => {
    if (copiedExpression.value === text) copiedExpression.value = ''
  }, 1200)
}
const selectCourse = (course: CourseCard) => {
  selectedCourse.value = course
  activeDetailTab.value = 'real'
}
const selectDetailCategory = (index: number) => {
  activeDetailCategory.value = index
  if (isTechnicalPage.value) {
    selectedCourse.value = createTechnicalTopicCourse(index)
  } else if (isInterviewPage.value) {
    const topic = interviewTopicConfigs[index] ?? interviewTopicConfigs[0]
    selectedCourse.value = {
      title: topic.question,
      subtitle: topic.topic,
      image: '',
      tone: 'blue',
      chineseText: topic.chinese,
      explanation: topic.translation,
      example: topic.answer,
      difficulty: index < 2 ? 'Beginner' : index < 5 ? 'Intermediate' : 'Advanced',
    }
    activeInterviewTab.value = 'answer'
    interviewTranslationVisible.value = false
    interviewExampleTranslationVisible.value = false
    interviewSimpleTranslationVisible.value = false
    interviewPracticeStarted.value = false
  } else {
    selectedCourse.value = courses.value[index % courses.value.length] ?? selectedCourse.value
  }
  activeDetailTab.value = 'real'
  activeTechnicalScene.value = 0
}
const selectAdjacentTechnicalCourse = (offset: number) => {
  const nextIndex = (activeDetailCategory.value + offset + technicalTopicConfigs.length) % technicalTopicConfigs.length
  activeDetailCategory.value = nextIndex
  activeTechnicalScene.value = 0
  selectedCourse.value = createTechnicalTopicCourse(nextIndex)
  activeDetailTab.value = 'real'
}
const selectRandomTechnicalCourse = () => {
  const nextIndex = (activeDetailCategory.value + 3) % technicalTopicConfigs.length
  activeDetailCategory.value = nextIndex
  activeTechnicalScene.value = 0
  selectedCourse.value = createTechnicalTopicCourse(nextIndex)
  activeDetailTab.value = 'real'
}
const startAiInterview = () => {
  aiInterviewStarted.value = true
  if (aiInterviewMessages.value.length === 1) {
    aiInterviewMessages.value.push({
      role: 'ai',
      text: `请介绍一个你作为${aiInterviewRole.value}参与的项目，并说明你解决的核心技术问题。`,
    })
    playEdgeTtsStream('Hello, nice to meet you. Can you introduce yourself?')
  }
}
const sendAiInterviewAnswer = () => {
  const answer = aiInterviewAnswer.value.trim()
  if (!answer) return
  aiInterviewMessages.value.push({ role: 'user', text: answer })
  aiInterviewMessages.value.push({
    role: 'ai',
    text: '回答结构很清晰。你能进一步说明为什么选择这个方案，以及最终获得了哪些可量化结果吗？',
  })
  playEdgeTtsStream('回答结构很清晰。你能进一步说明为什么选择这个方案，以及最终获得了哪些可量化结果吗？')
  aiInterviewAnswer.value = ''
}
const speak =  (text  : string , lang = 'en-US') => {
  
  speechSynthesis.cancel();

   const utterance =  new SpeechSynthesisUtterance(text);

  utterance.lang = lang;
  //utterance.lang = 'zh-CN';
  utterance.rate = 1;
  utterance.pitch = 1;

   speechSynthesis.speak(utterance);
};

let recognition: any = null

const isListening = ref(false)

const startSpeechRecognition = (
    setText: (text: string) => void,
    lang = 'en-US'
) => {
  const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

  if (!SpeechRecognition) {
    alert('当前浏览器不支持语音识别')
    return
  }

  recognition = new SpeechRecognition()

  recognition.lang = lang
  recognition.continuous = true
  recognition.interimResults = true

  let finalText = ''

  recognition.onstart = () => {
    isListening.value = true
  }

  recognition.onresult = (event: any) => {
    let interimText = ''

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const text = event.results[i][0].transcript

      if (event.results[i].isFinal) {
        finalText += text + ' '
      } else {
        interimText += text
      }
    }

    setText(finalText + interimText)
  }

  recognition.onend = () => {
    isListening.value = false
  }

  recognition.onerror = (event: any) => {
    console.error('语音识别错误:', event)
    isListening.value = false
  }

  recognition.start()
}
const stopSpeechRecognition = () => {
  if (recognition) {
    recognition.stop()
    recognition = null
  }

  isListening.value = false
}
const toggleSpeechRecognition = () => {
  if (isListening.value) {
    stopSpeechRecognition()
  } else {
    startSpeechRecognition(
        text => aiInterviewAnswer.value = text,
        getSpeechLang()
    )
  }
}
const getSpeechLang = () => {
  return aiInterviewLanguage.value === '中文'
      ? 'zh-CN'
      : 'en-US';
};
</script>

<template>
  <div class="dashboard-shell">
    <aside class="dashboard-sidebar">
      <RouterLink class="dashboard-brand" to="/dashboard">
        <span class="brand-mark"></span>
        <span>DevEnglish<span>.AI</span></span>
      </RouterLink>

      <nav class="side-nav" :aria-label="t('nav.learningNav')">
        <RouterLink v-for="item in navItems" :key="item.path" :class="{ active: route.path === item.path }" :to="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <section class="upgrade-card learning-streak-card">
        <span>{{ t('dashboard.streak') }}</span>
        <strong>7 <small>{{ t('dashboard.days') }}</small> 🔥</strong>
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
          </div>
        </div>
      </header>

      <main class="technical-course-page">
        <section v-if="isLoading" class="technical-course-empty">
          <h2>{{ t('loadingTitle') }}</h2>
          <p>{{ t('loadingText') }}</p>
        </section>

        <section v-else-if="selectedCourse && isInterviewPage" class="learning-detail-page">
          <header class="learning-detail-overview">
            <div>
              <h1>{{ detailOverview.title }}</h1>
              <p>{{ detailOverview.subtitle }}</p>
            </div>
          </header>

          <nav class="learning-category-strip" aria-label="面试英语分类">
            <button
              v-for="(category, index) in detailCategories"
              :key="category.label"
              :class="{ active: activeDetailCategory === index }"
              @click="selectDetailCategory(index)"
            >
              <b>{{ category.short }}</b>
              <span>{{ category.label }}</span>
              <small>{{ category.count }}</small>
            </button>
          </nav>

          <div class="interview-detail-layout">
            <div class="interview-detail-main">
            <article class="interview-question-head">
              <h1>{{ currentInterviewTopic.question }}</h1>
              <span>高频题</span>
              <p>{{ detailCategories[activeDetailCategory].label }} ＞ {{ currentInterviewTopic.topic }}</p>
              <div>
                <b>面试频率：高</b>
                <b>难度：{{ activeDetailCategory < 2 ? '初级' : activeDetailCategory < 5 ? '中级' : '高级' }}</b>
              </div>
            </article>

            <nav class="interview-tabs">
              <button
                v-for="tab in interviewTabs"
                :key="tab.key"
                :class="{ active: activeInterviewTab === tab.key }"
                @click="activeInterviewTab = tab.key"
              >
                {{ t(`technicalEnglish.tabs.${tab.key}`) }}

              </button>
            </nav>

            <article v-if="activeInterviewTab === 'answer'" class="interview-answer-card">
              <div class="interview-card-head">
                <h2>{{ t('technicalEnglish.interview.answer') }}</h2>
                <div>
                  <button @click="copyExpression(currentInterviewTopic.answer)">{{ copiedExpression === currentInterviewTopic.answer ? t('technicalEnglish.interview.copied') : t('technicalEnglish.interview.copy')  }}</button>
                  <button :class="{ active: interviewFavorite }" @click="interviewFavorite = !interviewFavorite">{{ interviewFavorite ? t('technicalEnglish.interview.favorited') : t('technicalEnglish.interview.favorite')  }}</button>
                  <button @click="speak(currentInterviewTopic.answer)">{{ t('technicalEnglish.interview.speak') }}</button>
                </div>
              </div>
              <p class="answer-en">{{ currentInterviewTopic.answer }}</p>
              <p v-if="interviewTranslationVisible" class="answer-cn">{{ currentInterviewTopic.translation }}</p>
              <button class="collapse-translation" @click="interviewTranslationVisible = !interviewTranslationVisible">
                {{ interviewTranslationVisible ? t('technicalEnglish.interview.hideTranslation') : t('technicalEnglish.interview.showTranslation')  }}
              </button>
            </article>

            <article v-if="activeInterviewTab === 'answer' || activeInterviewTab === 'tips'" class="interview-tip-card blue">
              <h2>{{ t('technicalEnglish.interview.thinking') }}</h2>
              <p>先说明背景或定义 → 描述你的行动和判断 → 最后补充清晰、可量化的结果。</p>
            </article>

            <article v-if="activeInterviewTab === 'answer' || activeInterviewTab === 'optimized'" class="interview-tip-card purple">
              <div class="interview-card-head">
                <h2>{{ activeInterviewTab === 'optimized' ? t('technicalEnglish.interview.optimizedAnswer') : t('technicalEnglish.interview.naturalAnswer') }}</h2>
                <div>
                <button @click="copyExpression(interviewExampleAnswer)">{{ copiedExpression === interviewExampleAnswer ? t('technicalEnglish.interview.copied') : t('technicalEnglish.interview.copy')  }}</button>
                <button @click="speak(interviewExampleAnswer)">{{ t('technicalEnglish.interview.speak') }}</button>
                </div>
              </div>
              <p>{{ interviewExampleAnswer }}</p>
              <p v-if="interviewExampleTranslationVisible" class="answer-cn">{{ interviewExampleTranslation }}</p>
              <button class="collapse-translation" @click="interviewExampleTranslationVisible = !interviewExampleTranslationVisible">
                {{ interviewExampleTranslationVisible ? t('technicalEnglish.interview.hideTranslation') : t('technicalEnglish.interview.showTranslation')  }}
              </button>
            </article>

            <article v-if="activeInterviewTab === 'answer'" class="interview-tip-card green">
              <div class="interview-card-head">
                <h2>{{ t('technicalEnglish.interview.simpleAnswer') }}</h2>
              <div>
                <button @click="copyExpression(interviewSimpleAnswer)">{{ copiedExpression === interviewSimpleAnswer ? t('technicalEnglish.interview.copied') : t('technicalEnglish.interview.copy')  }}</button>
                <button @click="speak(interviewSimpleAnswer)">{{ t('technicalEnglish.interview.speak') }}</button>
              </div>
              </div>
              <p>{{ interviewSimpleAnswer }}</p>
              <p v-if="interviewSimpleTranslationVisible" class="answer-cn">{{ interviewSimpleTranslation }}</p>
              <button class="collapse-translation" @click="interviewSimpleTranslationVisible = !interviewSimpleTranslationVisible">
                {{ interviewSimpleTranslationVisible ? t('technicalEnglish.interview.hideTranslation') : t('technicalEnglish.interview.showTranslation') }}
              </button>
            </article>

            <article v-if="activeInterviewTab === 'expressions'" class="interview-answer-card">
              <h2>{{ t('technicalEnglish.interview.keyExpressions') }}</h2>
              <div class="interview-expression-list">
                <button v-for="tag in currentInterviewTopic.related" :key="tag" @click="copyExpression(tag)">
                  <b>{{ tag }}</b><span>{{ copiedExpression === tag ?  t('technicalEnglish.interview.copied') : t('technicalEnglish.interview.copy')  }}</span>
                </button>
              </div>
            </article>

            <article v-if="activeInterviewTab === 'followups'" class="interview-answer-card">
              <h2>{{ t('technicalEnglish.interview.followups') }}</h2>
              <ul class="interview-followup-list">
                <li>Can you give a specific example?</li>
                <li>What was the most difficult part?</li>
                <li>What would you do differently next time?</li>
                <li>How did you measure the final result?</li>
              </ul>
            </article>

            <article v-if="activeInterviewTab === 'mine'" class="interview-answer-card">
              <h2>{{ t('technicalEnglish.interview.myAnswer') }}</h2>
              <textarea v-model="interviewOwnAnswer" class="interview-own-answer" :placeholder="t('technicalEnglish.interview.inputPlaceholder')"></textarea>
              <p class="answer-cn">当前已输入 {{ interviewOwnAnswer.length }} 个字符。内容仅保存在当前页面。</p>
            </article>
            </div>

            <aside class="interview-detail-side">
            <article>
              <h2>{{ t('technicalEnglish.interview.relatedKnowledge') }}</h2>
              <div class="knowledge-tags">
                <span v-for="tag in currentInterviewTopic.related" :key="tag">{{ tag }}</span>
              </div>
            </article>

            <article class="interview-practice-card">
              <h2>模拟面试练习</h2>
              <p>围绕当前问题进行追问练习，训练更自然、完整的英文回答。</p>
              <button class="ai-practice-button" @click="interviewPracticeStarted = !interviewPracticeStarted">
                {{ interviewPracticeStarted ? '练习准备完成' : '开始模拟面试' }}
              </button>
            </article>
            </aside>
          </div>
        </section>

        <section v-else-if="selectedCourse && isAiInterviewPage" class="ai-interview-workbench">
          <div class="ai-interview-head">
            <div>
              <h1>AI 模拟面试</h1>
              <p>选择目标岗位和难度，开始一场真实的技术面试练习</p>
            </div>
            <span :class="{ active: aiInterviewStarted }">{{ aiInterviewStarted ? '面试进行中' : '等待开始' }}</span>
          </div>

          <div class="ai-interview-grid">
            <aside class="ai-interview-config">
              <h2>面试设置</h2>
              <label>
                目标岗位
                <select v-model="aiInterviewRole">
                  <option>后端工程师</option>
                  <option>前端工程师</option>
                  <option>全栈工程师</option>
                  <option>架构师</option>
                </select>
              </label>
              <label>
                面试难度
                <select v-model="aiInterviewDifficulty">
                  <option>初级</option>
                  <option>中级</option>
                  <option>高级</option>
                </select>
              </label>
              <label>
                英文/中文
                <select v-model="aiInterviewLanguage">
                  <option>英文</option>
                  <option>中文</option>
                </select>
              </label>
              <div class="ai-interview-meta">
                <span><b>8</b>预计问题</span>
                <span><b>25 分钟</b>预计时长</span>
              </div>
              <button class="ai-practice-button" @click="startAiInterview">
                {{ aiInterviewStarted ? '继续面试' : '开始模拟面试' }}
              </button>
            </aside>

            <article class="ai-interview-chat">
              <div class="ai-interviewer-card">
                <span>AI</span>
                <div>
                  <h2>技术面试官</h2>
                  <p>{{ aiInterviewRole }} · {{ aiInterviewDifficulty }}</p>
                </div>
                <b></b>
              </div>

              <div class="ai-chat-messages">
                <div v-for="(message, index) in aiInterviewMessages" :key="index" :class="message.role">
                  <span>{{ message.role === 'ai' ? 'AI' : avatarText }}</span>
                  <p>{{ message.text }}</p>
                </div>
              </div>

              <div class="ai-answer-box">
                <textarea v-model="aiInterviewAnswer" :disabled="!aiInterviewStarted" placeholder="输入你的回答..."></textarea>
                <button :disabled="!aiInterviewStarted || !aiInterviewAnswer.trim()" @click="sendAiInterviewAnswer">发送回答</button>
                <button class="speech-btn" @click="toggleSpeechRecognition">{{ isListening ? '🔴 录音中（点击停止）' : '🎤 点击开始回答' }}</button>
               
                

              </div>
            </article>

            <aside class="ai-interview-side">
              <article>
                <h2>面试进度</h2>
                <strong>{{ aiInterviewProgress }} <small>/ 8</small></strong>
                <div><i :style="{ width: `${aiInterviewProgress * 12.5}%` }"></i></div>
              </article>
              <article>
                <h2>实时反馈</h2>
                <ul>
                  <li>表达结构清晰</li>
                  <li>建议补充量化结果</li>
                  <li>注意突出个人贡献</li>
                </ul>
              </article>
              <article>
                <h2>本场能力维度</h2>
                <p>技术深度</p><p>沟通表达</p><p>问题分析</p><p>项目经验</p>
              </article>
            </aside>
          </div>
        </section>

        <section v-else-if="selectedCourse && isWorkplacePage" class="workplace-detail-page">
          <div class="workplace-page-head">
            <div>
              <h1>职场英语</h1>
              <p>掌握职场沟通表达，让你的工作沟通更高效</p>
            </div>
          </div>

          <div class="workplace-category-strip">
            <button
              v-for="(category, index) in workplaceCategories"
              :key="category.label"
              :class="[{ active: index === activeWorkplaceCategory }, `tone-${category.tone}`]"
              @click="selectWorkplaceCategory(index)"
            >
              <b>{{ category.label.slice(0, 1) }}</b>
              <span>{{ category.label }}</span>
              <small>{{ category.count }}</small>
            </button>
          </div>

          <div class="workplace-content-grid">
            <aside class="workplace-menu-panel">
              <h2>{{ currentWorkplaceCategory.label }}</h2>
              <button
                v-for="(item, index) in currentWorkplaceCategory.menus"
                :key="item"
                :class="{ active: !selectedWorkplaceExtraScene && index === activeWorkplaceMenu }"
                @click="selectWorkplaceMenu(index)"
              >
                {{ item }}
              </button>
              <button
                v-for="scene in workplaceMoreScenesOpen ? currentWorkplaceCategory.more : []"
                :key="scene"
                class="extra-scene"
                :class="{ active: currentWorkplaceMenu === scene }"
                @click="selectMoreWorkplaceScene(scene)"
              >
                {{ scene }}
              </button>
              <button
                class="more-scenes"
                :aria-expanded="workplaceMoreScenesOpen"
                @click="toggleMoreWorkplaceScenes"
              >
                {{ workplaceMoreScenesOpen ? t('technicalEnglish.workplace.collapseScenes') : t('technicalEnglish.workplace.moreScenes') }}
               <!-- <span :class="{ open: workplaceMoreScenesOpen }"></span> -->
              </button>
            </aside>

            <article class="workplace-main-panel">
              <div class="workplace-main-head">
                <div>
                  <h2>{{ workplaceContext.title }}</h2>
                  <p>{{ workplaceContext.subtitle }}</p>
                </div>
                <button><el-icon><Star /></el-icon>收藏</button>
              </div>

              <nav class="workplace-tabs">
                <button
                  v-for="tab in workplaceTabs"
                  :key="tab.key"
                  :class="{ active: activeWorkplaceTab === tab.key }"
                  @click="activeWorkplaceTab = tab.key"
                >
                  {{ tab.label }}
                </button>
              </nav>

              <section class="workplace-description-box">
                <h3>场景描述</h3>
                <p>{{ workplaceContext.description }}</p>
              </section>

              <section v-if="activeWorkplaceTab === 'expressions' || activeWorkplaceTab === 'description'" class="workplace-expression-list">
                <h3>常用表达</h3>
                <div v-for="[en, cn] in visibleWorkplaceExpressions" :key="en">
                  <p>{{ en }}</p>
                  <span>{{ cn }}</span>
                  <button @click="copyExpression(en)">{{ copiedExpression === en ? t('technicalEnglish.interview.copied') : t('technicalEnglish.interview.copy')  }}</button>
                </div>
              </section>

              <section v-else-if="activeWorkplaceTab === 'dialogue'" class="workplace-dialogue-box">
                <h3>对话示例</h3>
                <p><b>You:</b> Let's start with {{ currentWorkplaceMenu }}.</p>
                <p><b>Colleague:</b> Sure. I have prepared the key points.</p>
                <p><b>You:</b> Great, please walk us through them.</p>
              </section>

              <section v-else class="workplace-dialogue-box">
                <h3>推荐表达</h3>
                <p>Could we align on the key points before moving forward?</p>
                <p>Let's confirm the owner and deadline for each action item.</p>
                <p>I'll send a short summary after this discussion.</p>
              </section>

              <button
                v-if="activeWorkplaceTab === 'expressions' || activeWorkplaceTab === 'description'"
                class="expand-expression-button"
                @click="workplaceShowMore = !workplaceShowMore"
              >
                {{ workplaceShowMore ? '收起表达' : '展开更多表达' }}
              </button>
            </article>

            <aside class="workplace-side-panel">
              <article>
                <div class="panel-head">
                  <h2>相关词汇</h2>
                </div>
                <ul class="workplace-word-list">
                  <li v-for="[en, cn] in workplaceContext.words" :key="en">
                    <span>{{ en }}</span>
                    <small>{{ cn }}</small>
                  </li>
                </ul>
              </article>

              <article class="workplace-ai-card">
                <div class="panel-head">
                  <h2>AI 场景练习</h2>
                  <span class="coming-soon-pill">暂未开放</span>
                </div>
                <p>AI 场景练习功能正在准备中。</p>
                <button class="ai-practice-button" disabled>开始练习</button>
              </article>
            </aside>
          </div>
        </section>

        <section v-else-if="selectedCourse" :class="{ 'learning-detail-page': isTechnicalPage }">
          <template v-if="isTechnicalPage">
            <header class="learning-detail-overview">
              <div>
                <h1>{{ detailOverview.title }}</h1>
                <p>{{ detailOverview.subtitle }}</p>
              </div>
            </header>

            <nav class="learning-category-strip" aria-label="技术英语分类">
              <button
                v-for="(category, index) in detailCategories"
                :key="category.label"
                :class="{ active: activeDetailCategory === index }"
                @click="selectDetailCategory(index)"
              >
                <b>{{ category.short }}</b>
                <span>{{ category.label }}</span>
                <small>{{ category.count }}</small>
              </button>
            </nav>
          </template>

          <div class="technical-detail-layout">
            <div class="technical-detail-main">
            <article class="technical-detail-hero">
              <div class="detail-copy">
                <span class="level-pill">{{ selectedCourse.difficulty || 'Beginner' }}</span>
                <h1>{{ technicalSceneDetail.title }}</h1>
                <strong>{{ technicalSceneDetail.chinese }}</strong>
                <p>{{ technicalSceneDetail.description }}</p>
                <div class="detail-tags">
                  <span>{{ currentTechnicalTopic.label }}</span>
                  <span>{{ sceneLabels[activeTechnicalScene] }}</span>
                  <span>{{ currentSceneWordCount }} 个场景词汇</span>
                  <span>{{ currentTechnicalTopic.total }} 个总词汇</span>
                </div>
              </div>
              <img :src="selectedCourse.image" :alt="selectedCourse.title" />
            </article>

            <nav class="technical-detail-tabs">
              <button
                v-for="tab in detailTabs"
                :key="tab.key"
                :class="{ active: activeDetailTab === tab.key }"
                @click="activeDetailTab = tab.key"
              >
                {{ t(`technicalEnglish.tabs.${tab.key}`) }} 
               
              </button>
            </nav>

            <article class="technical-expression-panel">
              <section v-for="[title, english, chinese, tone] in technicalTabContent" :key="title">
                <h2>{{ title }}</h2>
                <div class="expression-box" :class="tone">
                  <p>{{ english }}</p>
                  <span>{{ chinese }}</span>
                  <!-- 复制按钮 <button @click="copyExpression(english)">{{ copiedExpression === english ? '已复制' : '复制' }}</button>-->
                  <button @click="speak(english)">{{ t('technicalEnglish.interview.speak') }}</button>
                </div>
              </section>

              <footer class="detail-pager">
                <button @click="selectAdjacentTechnicalCourse(-1)">{{ t(`technicalEnglish.common.previous`) }} </button>
                <button @click="selectRandomTechnicalCourse"> {{ t(`technicalEnglish.common.random`) }} </button>
                <button @click="selectAdjacentTechnicalCourse(1)">{{ t(`technicalEnglish.common.next`) }} </button>
              </footer>
            </article>
            </div>

            <aside class="technical-detail-side">
            <article>
              <h2>场景分类</h2>
              <ul class="scene-list">
                <li
                  v-for="([label, count], index) in sceneCategories"
                  :key="label"
                  :class="{ active: activeTechnicalScene === index }"
                  @click="activeTechnicalScene = index"
                >
                  <span>{{ label }}</span>
                  <b>{{ count }}</b>
                </li>
              </ul>
            </article>

            <article>
              <h2>相关词汇</h2>
              <p class="related-word-summary">
                {{ currentTechnicalTopic.label }} · {{ sceneLabels[activeTechnicalScene] }}，共 {{ currentSceneWordCount }} 个词汇
              </p>
              <ul class="related-list">
                <li v-for="[word, meaning] in relatedWords" :key="word">
                  <span>{{ word }}</span>
                  <small>{{ meaning }}</small>
                </li>
              </ul>
            </article>

            <article>
              <div class="panel-head">
                <h2>AI 场景练习</h2>
                <span class="coming-soon-pill">暂未开放</span>
              </div>
              <p>AI 场景练习功能正在准备中。</p>
              <button class="ai-practice-button" disabled>开始练习</button>
            </article>
            </aside>
          </div>
        </section>

        <section v-else-if="filteredCourses.length" class="technical-course-grid">
          <button
            v-for="course in filteredCourses"
            :key="course.title"
            class="technical-course-card"
            :class="`tone-${course.tone}`"
            @click="selectCourse(course)"
          >
            <div class="technical-course-cover">
              <img :src="course.image" :alt="course.title" />
            </div>
            <div class="technical-course-copy">
              <h2>{{ course.title }}</h2>
              <p>{{ course.subtitle }}</p>
            </div>
          </button>
        </section>

        <section v-else class="technical-course-empty">
          <h2>没有找到相关课程</h2>
          <p>{{ currentGroup.empty }}</p>
        </section>
      </main>
    </section>
  </div>
</template>
