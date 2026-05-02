import { createContext, useContext, useState } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('thumblytics_user')
            const token = localStorage.getItem('thumblytics_token')
            return storedUser && token ? JSON.parse(storedUser) : null
        } catch {
            return null
        }
    })
    const [loading] = useState(false)

    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password })
        localStorage.setItem('thumblytics_token', res.data.token)
        localStorage.setItem('thumblytics_user', JSON.stringify(res.data.user))
        setUser(res.data.user)
        toast.success(`Welcome to Thumblytics, ${res.data.user.name}! 🎉`)
        return res.data
    }

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password })
        localStorage.setItem('thumblytics_token', res.data.token)
        localStorage.setItem('thumblytics_user', JSON.stringify(res.data.user))
        setUser(res.data.user)
        toast.success(`Welcome back, ${res.data.user.name}!`)
        return res.data
    }

    const logout = async () => {
        try {
            await api.post('/auth/logout')
        } catch {
            // Ignore logout network errors and clear local session anyway.
        }
        localStorage.removeItem('thumblytics_token')
        localStorage.removeItem('thumblytics_user')
        setUser(null)
        toast.success('Logged out successfully')
    }

    const updateUser = (updatedUser) => {
        setUser(updatedUser)
        localStorage.setItem('thumblytics_user', JSON.stringify(updatedUser))
    }

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}
