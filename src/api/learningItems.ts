import { http } from './client'

export interface LearningItem {
    id: string
    type: string
    title: string
    englishText: string
    chineseText: string
    explanation: string
    example: string
    imageUrl: string
    difficulty: string
    status: string
    isPublished: boolean
}

export const learningItemsApi = {
    list: (type: string) => http.get<{ data: LearningItem[] }>('/learning-items', { params: { type, status: 'Published' } }),
}
