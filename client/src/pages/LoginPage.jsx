import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Zap, ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const redirectTo = searchParams.get('redirect') || 'dashboard'

    const [form, setForm] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('')

    const validate = () => {
        const errs = {}
        if (!form.email.trim()) errs.email = 'Email is required'
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address'
        if (!form.password) errs.password = 'Password is required'
        return errs
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setServerError('')
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }
        setLoading(true)
        try {
            await login(form.email, form.password)
            navigate(`/${redirectTo}`)
        } catch (err) {
            const msg = err.response?.data?.message || ''
            const status = err.response?.status

            if (status === 401 || msg.toLowerCase().includes('invalid credentials')) {
                setErrors({ password: 'Incorrect email or password' })
            } else if (!err.response) {
                setServerError('Cannot connect to server. Please make sure the backend is running.')
                toast.error('Server is offline. Try again shortly.')
            } else {
                setServerError(msg || 'Login failed. Please try again.')
                toast.error(msg || 'Login failed.')
            }
        } finally {
            setLoading(false)
        }
    }

    const loginDemo = async () => {
        setLoading(true)
        setServerError('')
        try {
            await login('demo@thumblytics.ai', 'demo1234')
            navigate('/dashboard')
        } catch {
            toast.error('Demo account not available. Please register a new account.')
        } finally {
            setLoading(false)
        }
    }

    const field = (key) => ({
        value: form[key],
        onChange: (e) => {
            setForm({ ...form, [key]: e.target.value })
            setErrors({ ...errors, [key]: '' })
            setServerError('')
        }
    })

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.2), transparent)',
            padding: '24px'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', maxWidth: 440 }}
            >
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(99,102,241,0.4)' }}>
                            <Zap size={20} color="#fff" fill="#fff" />
                        </div>
                        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.2rem', color: '#f0f0ff' }}>Thumblytics AI</span>
                    </Link>
                </div>

                <motion.div className="glass" style={{ padding: '40px 36px' }}>
                    <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: 6 }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.88rem', marginBottom: 28 }}>
                        Sign in to continue optimizing
                    </p>

                    {/* Server error banner */}
                    <AnimatePresence>
                        {serverError && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    display: 'flex', alignItems: 'flex-start', gap: 10,
                                    padding: '12px 16px', borderRadius: 10, marginBottom: 20,
                                    background: 'rgba(239,68,68,0.1)',
                                    border: '1px solid rgba(239,68,68,0.3)',
                                }}
                            >
                                <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                                <span style={{ fontSize: '0.85rem', color: '#fca5a5', lineHeight: 1.5 }}>{serverError}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Email */}
                        <div className="form-group">
                            <label className="label">Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                <input
                                    id="login-email"
                                    type="email"
                                    className="input"
                                    style={{ paddingLeft: 40, borderColor: errors.email ? 'rgba(239,68,68,0.6)' : undefined }}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    {...field('email')}
                                />
                            </div>
                            <AnimatePresence>
                                {errors.email && (
                                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        style={{ color: '#f87171', fontSize: '0.78rem', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <AlertCircle size={12} /> {errors.email}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label className="label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="input"
                                    style={{ paddingLeft: 40, paddingRight: 44, borderColor: errors.password ? 'rgba(239,68,68,0.6)' : undefined }}
                                    placeholder="Your password"
                                    autoComplete="current-password"
                                    {...field('password')}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <AnimatePresence>
                                {errors.password && (
                                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        style={{ color: '#f87171', fontSize: '0.78rem', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <AlertCircle size={12} /> {errors.password}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Submit */}
                        <motion.button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            whileHover={!loading ? { scale: 1.01, boxShadow: '0 8px 30px rgba(99,102,241,0.4)' } : {}}
                            whileTap={!loading ? { scale: 0.98 } : {}}
                            style={{
                                width: '100%', marginTop: 8, padding: '13px 24px',
                                background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                border: 'none', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer',
                                color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.95rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.3)',
                                transition: 'all 0.25s ease',
                            }}
                        >
                            {loading ? (
                                <>
                                    <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'rotate 0.7s linear infinite' }} />
                                    Signing in…
                                </>
                            ) : (
                                <><span>Sign In</span><ArrowRight size={16} /></>
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>or</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    </div>

                    <motion.button
                        onClick={loginDemo}
                        disabled={loading}
                        whileHover={!loading ? { scale: 1.01 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        className="btn btn-secondary"
                        style={{ width: '100%' }}
                    >
                        🎮 Try Demo Account
                    </motion.button>

                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 24 }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#a5b4fc', fontWeight: 600 }}>Sign up free →</Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}
