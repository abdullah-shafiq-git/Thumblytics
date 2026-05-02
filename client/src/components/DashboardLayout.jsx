import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
    LayoutDashboard, Image, Wand2, CreditCard, LogOut, Zap,
    ChevronRight, Crown, Menu
} from 'lucide-react'

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Image, label: 'Analyzer', path: '/analyzer' },
    { icon: Wand2, label: 'Generator', path: '/generator' },
    { icon: CreditCard, label: 'Pricing', path: '/pricing' },
]

export default function DashboardLayout({ children }) {
    const { user, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
            {/* Sidebar */}
            <motion.aside
                initial={{ x: 0 }}
                animate={{ width: sidebarOpen ? 240 : 72 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{
                    position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100,
                    background: 'var(--bg-surface)',
                    borderRight: '1px solid var(--border)',
                    display: 'flex', flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {/* Logo */}
                <div style={{
                    height: 72, display: 'flex', alignItems: 'center',
                    padding: '0 16px', borderBottom: '1px solid var(--border)',
                    flexShrink: 0, gap: 12
                }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(99,102,241,0.4)'
                    }}>
                        <Zap size={18} color="#fff" fill="#fff" />
                    </div>
                    {sidebarOpen && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1rem', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}
                        >
                            Thumblytics AI
                        </motion.span>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            marginLeft: 'auto', background: 'none', border: 'none',
                            color: 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0,
                            width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: 6, transition: 'all 0.2s'
                        }}
                    >
                        {sidebarOpen ? <ChevronRight size={16} /> : <Menu size={16} />}
                    </button>
                </div>

                {/* Nav Links */}
                <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {navItems.map(({ icon: Icon, label, path }) => {
                        const active = location.pathname === path
                        return (
                            <Link
                                key={path}
                                to={path}
                                title={!sidebarOpen ? label : ''}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '10px 12px', borderRadius: 10,
                                    textDecoration: 'none', transition: 'all 0.2s',
                                    background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                                    color: active ? '#a5b4fc' : 'var(--text-secondary)',
                                    border: active ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
                                    whiteSpace: 'nowrap', overflow: 'hidden',
                                }}
                            >
                                <Icon size={18} style={{ flexShrink: 0 }} />
                                {sidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: '0.9rem', fontWeight: 500 }}>{label}</motion.span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* User & Logout */}
                <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {sidebarOpen && user && (
                        <div style={{
                            padding: '12px', borderRadius: 10,
                            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.8rem', fontWeight: 700, color: '#fff'
                                }}>
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        {user.plan === 'pro' ? (
                                            <span style={{ fontSize: '0.7rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Crown size={10} /> Pro
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Free Plan</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {user.plan !== 'pro' && (
                                <Link to="/pricing" className="btn btn-accent" style={{ width: '100%', fontSize: '0.75rem', padding: '6px 12px', display: 'flex', justifyContent: 'center' }}>
                                    ⚡ Upgrade to Pro
                                </Link>
                            )}
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        title={!sidebarOpen ? 'Logout' : ''}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '10px 12px', borderRadius: 10, border: 'none',
                            background: 'transparent', color: 'var(--text-muted)',
                            cursor: 'pointer', transition: 'all 0.2s', width: '100%',
                            whiteSpace: 'nowrap', overflow: 'hidden',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
                    >
                        <LogOut size={18} style={{ flexShrink: 0 }} />
                        {sidebarOpen && <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: sidebarOpen ? 240 : 72,
                transition: 'margin-left 0.3s ease',
                minHeight: '100vh',
                padding: '32px',
                overflowY: 'auto',
            }}>
                {children}
            </main>
        </div>
    )
}
