import {defineStore} from 'pinia'

export const useStudyStore = defineStore('study', {
    state: () => ({
        studyRecords: [],
        statistics: {
            streakDays: 7,
            weeklyProgress: 75,
            completedLessons: 12,
            weeklyGoal: 16,
        },
        progress: {},
    }),
})
