import {http} from './client'

export const interviewEnglishApi = {
    list: () => http.get('/interview-questions'),
    detail: (id: string) => http.get(`/interview-questions/${id}`),
}
