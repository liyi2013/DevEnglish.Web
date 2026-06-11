import {http} from './client'

export const technicalEnglishApi = {
    list: () => http.get('/learning-items', {params: {type: 'TechnicalVocabulary'}}),
    detail: (id: string) => http.get(`/learning-items/${id}`),
}
