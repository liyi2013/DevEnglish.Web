import axios from 'axios'

//export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5110/api'
//export const apiOrigin = apiBaseUrl.replace(/\/api\/?$/, '')

export const apiOrigin =
    import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5110'

export const apiBaseUrl = `${apiOrigin.replace(/\/$/, '')}/api`
export const http = axios.create({
    baseURL: apiBaseUrl,
    timeout: 15000,
})

http.interceptors.request.use((config) => {
    const token = localStorage.getItem('devenglish_token')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('devenglish_token')
            window.location.href = '/login'
        }

        return Promise.reject(error)
    },
)
