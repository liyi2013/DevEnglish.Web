import {http} from './client'

export const dailyGrowthApi = {
    today: () => http.get('/daily-growth/today'),
    complete: (id: string) => http.post(`/daily-growth/${id}/complete`),
}
