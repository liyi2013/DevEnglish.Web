import {http} from './client'

export const studyRecordApi = {
    overview: (userId: string) => http.get('/study-records/overview', {params: {userId}}),
    history: (userId: string) => http.get('/study-records', {params: {userId}}),
}
