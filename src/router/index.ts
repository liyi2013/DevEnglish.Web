import {createRouter, createWebHistory} from 'vue-router'

import DashboardView from '@/views/DashboardView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import PlaceholderView from '@/views/PlaceholderView.vue'
import RegisterView from '@/views/RegisterView.vue'
import TechnicalEnglishView from '@/views/TechnicalEnglishView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', name: 'home', component: HomeView},
        {path: '/dashboard', name: 'dashboard', component: DashboardView},
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: {titleKey: 'route.login.title', subtitleKey: 'route.login.subtitle'},
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView,
            meta: {titleKey: 'route.register.title', subtitleKey: 'route.register.subtitle'},
        },
        {
            path: '/technical-english',
            name: 'technical-english',
            component: TechnicalEnglishView,
            meta: {titleKey: 'route.technicalEnglish.title', subtitleKey: 'route.technicalEnglish.subtitle'},
        },
        {
            path: '/interview-english',
            name: 'interview-english',
            component: TechnicalEnglishView,
            meta: {titleKey: 'route.interviewEnglish.title', subtitleKey: 'route.interviewEnglish.subtitle'},
        },
        {
            path: '/ai-interview',
            name: 'ai-interview',
            component: TechnicalEnglishView,
            meta: {titleKey: 'route.aiInterview.title', subtitleKey: 'route.aiInterview.subtitle'},
        },
        {
            path: '/workplace-english',
            name: 'workplace-english',
            component: TechnicalEnglishView,
            meta: {titleKey: 'route.workplaceEnglish.title', subtitleKey: 'route.workplaceEnglish.subtitle'},
        },
        {
            path: '/daily-growth',
            name: 'daily-growth',
            component: TechnicalEnglishView,
            meta: {titleKey: 'route.dailyGrowth.title', subtitleKey: 'route.dailyGrowth.subtitle'},
        },
        {
            path: '/study-records',
            name: 'study-records',
            component: PlaceholderView,
            meta: {titleKey: 'route.studyRecords.title', subtitleKey: 'route.studyRecords.subtitle'},
        },
        {
            path: '/profile',
            name: 'profile',
            component: PlaceholderView,
            meta: {titleKey: 'route.profile.title', subtitleKey: 'route.profile.subtitle'},
        },
    ],
    scrollBehavior() {
        return {top: 0}
    },
})

export default router
