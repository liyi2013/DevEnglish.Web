import {defineStore} from 'pinia'

interface UserProfile {
    id: string
    nickname: string
    email: string
    role: string
    status: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('devenglish_token'),
        user: JSON.parse(localStorage.getItem('devenglish_user') || 'null') as UserProfile | null,
    }),
    actions: {
        login(token: string, user?: UserProfile) {
            this.token = token
            this.user = user ?? null
            localStorage.setItem('devenglish_token', token)
            if (user) {
                localStorage.setItem('devenglish_user', JSON.stringify(user))
            }
        },
        logout() {
            this.token = null
            this.user = null
            localStorage.removeItem('devenglish_token')
            localStorage.removeItem('devenglish_user')
        },
        register(token: string, user?: UserProfile) {
            this.login(token, user)
        },
        getUserInfo() {
            return this.user
        },
    },
})
