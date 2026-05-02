import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Zap, ArrowRight, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
    const { register } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('')

    const validate = () => {
        const errs = {}
        if (!form.name.trim()) errs.name = 'Full name is required'
        if (!form.email.trim()) errs.email = 'Email address is required'
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address'
        if (!form.password) errs.password = 'Password is required'
        else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
        return errs
    }

    const pwStrength = () => {
        const p = form.password
        if (!p) return 0
        let score = 0
        if (p.length >= 8) score++
        if (p.length >= 12) score++
        if (/[A-Z]/.test(p)) score++
        if (/[0-9]/.test(p)) score++
        if (/[^A-Za-z0-9]/.test(p)) score++
        return score
    }

    const strength = pwStrength()
    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength]
    const strengthColor = ['', '#ef4444', '#f59e0b', '#eab308', '#10b981', '#6366f1'][strength]

    const handleSubmit = async (e) => {
        e.preventDefault()
        setServerError('')
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }
        setLoading(true)
        try {
            await register(form.name, form.email, form.password)
            navigate('/dashboard')
        } catch (err) {
            const msg = err.response?.data?.message || ''
            const status = err.response?.status

            if (status === 409 || msg.toLowerCase().includes('email already')) {
                // Email duplicate — show inline error on the email field
                setErrors(prev => ({ ...prev, email: 'This email is already registered. Try logging in.' }))
                setServerError('')
                toast.error('Account already exists with this email')
            } else if (!err.response) {
                // Network / server down
                setServerError('Cannot connect to server. Make sure the backend is running.')
                toast.error('Server is offline. Please try again.')
            } else {
                setServerError(msg || 'Registration failed. Please try again.')
                toast.error(msg || 'Registration failed. Please check your details.')
            }
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
                style={{ width: '100%', maxWidth: 460 }}
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

                {/* Card */}
                <motion.div className="glass" style={{ padding: '40px 36px' }}>
                    <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: 6 }}>
                        Create Account
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.88rem', marginBottom: 28 }}>
                        Start optimizing your thumbnails for free
                    </p>

                    {/* Server-level error banner */}
                    <AnimatePresence>
                        {serverError && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8 }}
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
                        {/* Name */}
                        <div className="form-group">
                            <label className="label">Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                <input
                                    id="register-name"
                                    type="text"
                                    className="input"
                                    style={{ paddingLeft: 40, borderColor: errors.name ? 'rgba(239,68,68,0.6)' : undefined }}
                                    placeholder="John Doe"
                                    autoComplete="name"
                                    {...field('name')}
                                />
                            </div>
                            <AnimatePresence>
                                {errors.name && (
                                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        style={{ color: '#f87171', fontSize: '0.78rem', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <AlertCircle size={12} /> {errors.name}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label className="label">Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                <input
                                    id="register-email"
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
                                        {errors.email.includes('already') && (
                                            <Link to="/login" style={{ marginLeft: 4, color: '#a5b4fc', fontWeight: 600 }}>Sign in →</Link>
                                        )}
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
                                    id="register-password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="input"
                                    style={{ paddingLeft: 40, paddingRight: 44, borderColor: errors.password ? 'rgba(239,68,68,0.6)' : undefined }}
                                    placeholder="Min 8 characters"
                                    autoComplete="new-password"
                                    {...field('password')}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            {/* Password strength bar */}
                            {form.password && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 8 }}>
                                    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} style={{
                                                flex: 1, height: 3, borderRadius: 99,
                                                background: i <= strength ? strengthColor : 'rgba(255,255,255,0.08)',
                                                transition: 'background 0.3s ease'
                                            }} />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: '0.72rem', color: strengthColor, fontWeight: 600 }}>{strengthLabel}</span>
                                </motion.div>
                            )}

                            <AnimatePresence>
                                {errors.password && (
                                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        style={{ color: '#f87171', fontSize: '0.78rem', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <AlertCircle size={12} /> {errors.password}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Submit button */}
                        <motion.button
                            id="register-submit"
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
                                transition: 'all 0.25s ease',
                                boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.3)',
                            }}
                        >
                            {loading ? (
                                <>
                                    <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'rotate 0.7s linear infinite' }} />
                                    Creating Account…
                                </>
                            ) : (
                                <><span>Create Account</span><ArrowRight size={16} /></>
                            )}
                        </motion.button>
                    </form>

                    {/* What you get */}
                    <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {['5 free thumbnail analyses/month', 'AI-powered CTR scoring', 'No credit card required'].map(item => (
                            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                <CheckCircle2 size={13} color="#10b981" />
                                {item}
                            </div>
                        ))}
                    </div>

                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 20 }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#a5b4fc', fontWeight: 600 }}>Sign in</Link>
                    </p>
                </motion.div>

                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 18 }}>
                    By signing up, you agree to our{' '}
                    <Link to="/" style={{ color: 'var(--text-secondary)' }}>Terms</Link> &{' '}
                    <Link to="/" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
                </p>
            </motion.div>
        </div>
    )
}
