import {http} from './client'

export const workplaceEnglishApi = {
    list: () => http.get('/learning-items', {params: {type: 'WorkplaceExpression'}}),
    detail: (id: string) => http.get(`/learning-items/${id}`),
}
