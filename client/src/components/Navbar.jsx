import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Zap } from 'lucide-react'

export default function Navbar() {
    const { user, logout } = useAuth()
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '0 24px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(5,5,8,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
    }

    return (
        <nav style={navStyle}>
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(99,102,241,0.4)'
                }}>
                    <Zap size={18} color="#fff" fill="#fff" />
                </div>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#f0f0ff' }}>
                    Thumblytics <span style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
                </span>
            </Link>

            {/* Desktop Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
                <NavLink to="/pricing">Pricing</NavLink>
                {user ? (
                    <>
                        <NavLink to="/dashboard">Dashboard</NavLink>
                        <NavLink to="/analyzer">Analyzer</NavLink>
                        <NavLink to="/generator">Generator</NavLink>
                        <button onClick={logout} className="btn btn-secondary btn-sm" style={{ marginLeft: 8 }}>Logout</button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <Link to="/register" className="btn btn-primary btn-sm" style={{ marginLeft: 8 }}>
                            Get Started Free
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ background: 'none', border: 'none', color: '#f0f0ff', cursor: 'pointer', display: 'none' }}
                className="mobile-menu-btn"
                aria-label="Toggle menu"
            >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                            position: 'absolute', top: '72px', left: 0, right: 0,
                            background: 'rgba(5,5,8,0.98)', borderBottom: '1px solid rgba(255,255,255,0.08)',
                            padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px'
                        }}
                    >
                        <Link to="/pricing" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>Pricing</Link>
                        {user ? (
                            <>
                                <Link to="/dashboard" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>Dashboard</Link>
                                <Link to="/analyzer" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>Analyzer</Link>
                                <Link to="/generator" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>Generator</Link>
                                <button onClick={logout} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>Login</Link>
                                <Link to="/register" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>Get Started Free</Link>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
        </nav>
    )
}

function NavLink({ to, children }) {
    const location = useLocation()
    const active = location.pathname === to
    return (
        <Link to={to} style={{
            padding: '8px 14px', borderRadius: 8, fontSize: '0.9rem', fontWeight: 500,
            color: active ? '#a5b4fc' : 'rgba(240,240,255,0.7)',
            background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
            textDecoration: 'none', transition: 'all 0.2s ease',
        }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#f0f0ff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' } }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'rgba(240,240,255,0.7)'; e.currentTarget.style.background = 'transparent' } }}
        >
            {children}
        </Link>
    )
}
