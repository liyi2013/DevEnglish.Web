import {http} from './client'

export interface AuthPayload {
    email: string
    password: string
}

export interface RegisterPayload extends AuthPayload {
    nickname: string
}

export const authApi = {
    login: (payload: AuthPayload) => http.post('/auth/login', payload),
    register: (payload: RegisterPayload) => http.post('/auth/register', payload),
    getUserInfo: (userId: string) => http.get('/auth/me', {params: {userId}}),
}
