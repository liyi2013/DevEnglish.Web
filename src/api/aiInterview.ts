import {http} from './client'

export const aiInterviewApi = {
    start: (payload: unknown) => http.post('/ai-interview/start', payload),
    evaluate: (payload: unknown) => http.post('/ai-interview/evaluate', payload),
}
