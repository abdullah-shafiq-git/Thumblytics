import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api, { getAssetUrl } from '../lib/api'
import { Image, TrendingUp, Zap, ArrowRight, Clock, Trophy } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const mockChartData = [
    { name: 'Week 1', ctr: 45 }, { name: 'Week 2', ctr: 52 },
    { name: 'Week 3', ctr: 48 }, { name: 'Week 4', ctr: 67 },
    { name: 'Week 5', ctr: 71 }, { name: 'Week 6', ctr: 79 },
    { name: 'Week 7', ctr: 85 },
]

export default function DashboardPage() {
    const { user } = useAuth()
    const [stats, setStats] = useState(null)
    const [thumbnails, setThumbnails] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, thumbRes] = await Promise.all([
                    api.get('/thumbnails/stats'),
                    api.get('/thumbnails?limit=5'),
                ])
                setStats(statsRes.data.data)
                setThumbnails(thumbRes.data.data || [])
            } catch {
                // use empty state
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const usagePercent = stats
        ? Math.min(100, (stats.usage?.analysisCount / 5) * 100)
        : 0

    if (loading) return <DashboardSkeleton />

    return (
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
            {/* Header */}
            <motion.div variants={fadeInUp} style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Space Grotesk', marginBottom: 6 }}>
                    Good evening, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>Here's how your thumbnails are performing</p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={fadeInUp} className="grid grid-4" style={{ gap: 16, marginBottom: 32 }}>
                {[
                    { icon: Image, label: 'Thumbnails Analyzed', value: stats?.totalAnalyzed || 0, color: '#6366f1', suffix: '' },
                    { icon: TrendingUp, label: 'Average CTR Score', value: stats?.avgCTR || 0, color: '#10b981', suffix: '/100' },
                    { icon: Trophy, label: 'Best CTR Score', value: stats?.topThumbnail?.analysis?.ctrScore || 0, color: '#f59e0b', suffix: '/100' },
                    { icon: Zap, label: 'Plan', value: user?.plan === 'pro' ? 'Pro' : 'Free', color: '#8b5cf6', suffix: '' },
                ].map((s, i) => (
                    <motion.div key={i} className="stat-card" whileHover={{ y: -4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <s.icon size={18} color={s.color} />
                            </div>
                        </div>
                        <div className="stat-value gradient-text">{s.value}{s.suffix}</div>
                        <div className="stat-label">{s.label}</div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Usage + Chart Row */}
            <motion.div variants={fadeInUp} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 24 }}>
                {/* Usage Card */}
                <div className="glass" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>This Month's Usage</h3>
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Analyses Used</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {stats?.usage?.analysisCount || 0} / {stats?.usage?.analysisLimit || 5}
                            </span>
                        </div>
                        <div className="progress-bar">
                            <motion.div
                                className="progress-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${user?.plan === 'pro' ? 20 : usagePercent}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Generations Used</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                {stats?.usage?.generationCount || 0} / {stats?.usage?.generationLimit || 3}
                            </span>
                        </div>
                        <div className="progress-bar">
                            <motion.div
                                className="progress-fill"
                                style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, ((stats?.usage?.generationCount || 0) / 3) * 100)}%` }}
                                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                            />
                        </div>
                    </div>

                    {user?.plan !== 'pro' && (
                        <Link to="/pricing" className="btn btn-accent" style={{ width: '100%', fontSize: '0.875rem', justifyContent: 'center' }}>
                            ⚡ Upgrade for Unlimited
                        </Link>
                    )}
                </div>

                {/* CTR Chart */}
                <div className="glass" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>CTR Score Trend</h3>
                        <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 999 }}>↑ Improving</span>
                    </div>
                    <ResponsiveContainer width="100%" height={160}>
                        <AreaChart data={mockChartData}>
                            <defs>
                                <linearGradient id="ctrGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" tick={{ fill: 'rgba(240,240,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 100]} tick={{ fill: 'rgba(240,240,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ background: '#111122', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#f0f0ff', fontSize: '0.85rem' }}
                            />
                            <Area type="monotone" dataKey="ctr" stroke="#6366f1" strokeWidth={2} fill="url(#ctrGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Recent Thumbnails */}
            <motion.div variants={fadeInUp} className="glass" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Analyses</h3>
                    <Link to="/analyzer" style={{ fontSize: '0.85rem', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 4 }}>
                        Analyze New <ArrowRight size={14} />
                    </Link>
                </div>

                {thumbnails.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {thumbnails.map((t, i) => (
                            <ThumbnailRow key={i} t={t} />
                        ))}
                    </div>
                )}
            </motion.div>
        </motion.div>
    )
}

function ThumbnailRow({ t }) {
    const score = t.analysis?.ctrScore || 0
    const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px',
            borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
            transition: 'all 0.2s'
        }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.border = '1px solid rgba(99,102,241,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.border = '1px solid var(--border)' }}
        >
            <div style={{ width: 80, height: 45, borderRadius: 8, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {t.imageUrl ? (
                    <img src={getAssetUrl(t.imageUrl)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} onError={e => e.target.style.display = 'none'} />
                ) : (
                    <Image size={20} color="#6366f1" />
                )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={11} /> {new Date(t.createdAt).toLocaleDateString()}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.niche || 'general'}</span>
                </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.1rem', color }}>{score}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CTR Score</div>
            </div>
        </div>
    )
}

function EmptyState() {
    return (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Image size={28} color="#6366f1" />
            </div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No thumbnails yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>Upload your first thumbnail to get an AI-powered CTR analysis</p>
            <Link to="/analyzer" className="btn btn-primary">Analyze First Thumbnail</Link>
        </div>
    )
}

function DashboardSkeleton() {
    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div className="skeleton" style={{ height: 36, width: 280, marginBottom: 8, borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 20, width: 200, marginBottom: 32, borderRadius: 6 }} />
            <div className="grid grid-4" style={{ gap: 16, marginBottom: 24 }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: 100, borderRadius: 16 }} />
                ))}
            </div>
            <div className="skeleton" style={{ height: 220, borderRadius: 16 }} />
        </div>
    )
}
