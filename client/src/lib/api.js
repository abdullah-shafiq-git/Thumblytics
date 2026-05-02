import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:5000'

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
})

// Request interceptor - attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('thumblytics_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Response interceptor - handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('thumblytics_token')
            localStorage.removeItem('thumblytics_user')
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api

export const getAssetUrl = (assetPath) => {
    if (!assetPath) return ''
    if (/^https?:\/\//i.test(assetPath)) return assetPath
    const normalizedPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`
    return `${API_ORIGIN}${normalizedPath}`
}
