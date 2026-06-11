import {defineStore} from 'pinia'

export const useLearningStore = defineStore('learning', {
    state: () => ({
        technicalEnglish: [],
        interviewEnglish: [],
        dailyGrowth: [],
        workplaceEnglish: [],
        bookmarks: [],
    }),
})
