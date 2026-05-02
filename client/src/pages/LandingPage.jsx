import { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, Zap, Brain, TrendingUp, Star, ChevronRight, Sparkles, Target } from 'lucide-react'

const HeroCanvas = lazy(() => import('../components/HeroCanvas'))

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
}

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } }
}

const features = [
    { icon: BarChart3, title: 'CTR Score Analysis', desc: 'Get a precise 0-100 score based on brightness, contrast, face detection, and color psychology.', color: '#6366f1' },
    { icon: Brain, title: 'AI Suggestions', desc: 'Receive intelligent, actionable improvements powered by computer vision and behavioral psychology.', color: '#8b5cf6' },
    { icon: Zap, title: 'Instant Results', desc: 'Upload your thumbnail and get a full analysis with heatmap attention data in under 3 seconds.', color: '#f59e0b' },
    { icon: Target, title: 'Curiosity Gap Score', desc: 'Measure how much curiosity your thumbnail triggers — the #1 factor in high-CTR content.', color: '#10b981' },
    { icon: Sparkles, title: 'AI Title Generator', desc: 'Generate click-worthy YouTube titles with emotion triggers and curiosity gap built in.', color: '#ef4444' },
    { icon: TrendingUp, title: 'Performance Tracking', desc: 'Track all your analyzed thumbnails and see which ones hit the highest CTR scores.', color: '#3b82f6' },
]

const stats = [
    { value: '250K+', label: 'Creators Use Thumblytics' },
    { value: '42%', label: 'Average CTR Increase' },
    { value: '2.1M', label: 'Thumbnails Analyzed' },
    { value: '4.9★', label: 'Average Rating' },
]

const testimonials = [
    { name: 'Alex Rivera', handle: '@techwithalex', avatar: 'A', text: 'My CTR went from 3.2% to 7.8% in just 2 weeks using Thumblytics. The AI suggestions are insanely accurate.', score: 91 },
    { name: 'Sarah Chen', handle: '@sarahcooks', avatar: 'S', text: 'I was skeptical at first, but the CTR score algorithm is spot on. It caught issues I never noticed before.', score: 84 },
    { name: 'Marcus Thompson', handle: '@gamewithmarc', avatar: 'M', text: 'The face detection tip alone doubled my views. This tool should be every YouTuber\'s secret weapon.', score: 88 },
]

export default function LandingPage() {
    return (
        <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
            {/* Glowing background */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: -1,
                background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.25), transparent 70%), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(139,92,246,0.1), transparent)',
                pointerEvents: 'none'
            }} />

            {/* Hero */}
            <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 80 }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
                    {/* Left */}
                    <motion.div variants={stagger} initial="hidden" animate="show">
                        <motion.div variants={fadeInUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 24 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#a5b4fc' }}>AI-Powered CTR Optimization</span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
                            Increase Your YouTube{' '}
                            <span className="gradient-text">CTR with AI</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>
                            Upload your thumbnail and instantly receive an AI-powered CTR score, heatmap analysis, and actionable suggestions to make viewers click every time.
                        </motion.p>

                        <motion.div variants={fadeInUp} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Analyze Your Thumbnail Free <ArrowRight size={18} />
                            </Link>
                            <Link to="/pricing" className="btn btn-secondary btn-lg">
                                View Pricing <ChevronRight size={18} />
                            </Link>
                        </motion.div>

                        <motion.div variants={fadeInUp} style={{ marginTop: 40, display: 'flex', gap: 32 }}>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: '#a5b4fc' }}>5 Free</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Analyses/month</div>
                            </div>
                            <div style={{ width: 1, background: 'var(--border)' }} />
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: '#a5b4fc' }}>No CC</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Required</div>
                            </div>
                            <div style={{ width: 1, background: 'var(--border)' }} />
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: '#10b981' }}>2 sec</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average analysis</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right - 3D Canvas */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                        style={{ height: 500, borderRadius: 24, overflow: 'hidden', position: 'relative' }}
                    >
                        <div style={{
                            position: 'absolute', inset: 0, borderRadius: 24,
                            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.08), transparent)',
                            border: '1px solid rgba(99,102,241,0.15)',
                            zIndex: 1, pointerEvents: 'none'
                        }} />
                        <Suspense fallback={<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Loading 3D...</div>}>
                            <HeroCanvas />
                        </Suspense>
                    </motion.div>
                </div>
            </section>

            {/* Stats Bar */}
            <section style={{ padding: '60px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div className="container">
                    <motion.div
                        initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}
                    >
                        {stats.map((stat, i) => (
                            <motion.div key={i} variants={fadeInUp} style={{ textAlign: 'center' }}>
                                <div className="gradient-text" style={{ fontFamily: 'Space Grotesk', fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>{stat.value}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 6 }}>{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="section">
                <div className="container">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} style={{ textAlign: 'center', marginBottom: 64 }}>
                        <motion.div variants={fadeInUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: 16, fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 500 }}>
                            Everything You Need
                        </motion.div>
                        <motion.h2 variants={fadeInUp} style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 16 }}>
                            Powered by AI & <span className="gradient-text">Behavioral Psychology</span>
                        </motion.h2>
                        <motion.p variants={fadeInUp} style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto' }}>
                            Every analysis is backed by real computer vision algorithms and data from millions of high-performing YouTube thumbnails.
                        </motion.p>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid grid-3" style={{ gap: 24 }}>
                        {features.map((f, i) => (
                            <motion.div key={i} variants={fadeInUp} className="glass glass-hover" style={{ padding: 28, position: 'relative', overflow: 'hidden' }}>
                                <div style={{
                                    position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%',
                                    background: `radial-gradient(circle, ${f.color}20, transparent)`,
                                    pointerEvents: 'none'
                                }} />
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: `${f.color}18`, border: `1px solid ${f.color}30`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
                                }}>
                                    <f.icon size={20} color={f.color} />
                                </div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section" style={{ background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.05), transparent)' }}>
                <div className="container">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} style={{ textAlign: 'center', marginBottom: 56 }}>
                        <motion.h2 variants={fadeInUp} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, marginBottom: 16 }}>
                            Trusted by <span className="gradient-text">Top Creators</span>
                        </motion.h2>
                        <motion.p variants={fadeInUp} style={{ color: 'var(--text-secondary)' }}>Real results from real YouTubers</motion.p>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid grid-3" style={{ gap: 24 }}>
                        {testimonials.map((t, i) => (
                            <motion.div key={i} variants={fadeInUp} className="glass" style={{ padding: 28 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 700, fontSize: '1rem', color: '#fff'
                                    }}>{t.avatar}</div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t.name}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.handle}</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: 999, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>
                                        {t.score}/100
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                                    {[...Array(5)].map((_, idx) => <Star key={idx} size={14} color="#f59e0b" fill="#f59e0b" />)}
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>"{t.text}"</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="glass" style={{
                            padding: 'clamp(40px, 6vw, 80px)',
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))',
                            border: '1px solid rgba(99,102,241,0.2)',
                            borderRadius: 28,
                            position: 'relative', overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent)', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent)', pointerEvents: 'none' }} />
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: 16, position: 'relative' }}>
                            Ready to <span className="gradient-text">10x Your CTR?</span>
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
                            Join 250,000+ creators who use Thumblytics AI to make thumbnails that viewers can't resist clicking.
                        </p>
                        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Start Free — No Credit Card <ArrowRight size={18} />
                            </Link>
                            <Link to="/analyzer" className="btn btn-secondary btn-lg">
                                Try Analyzer Now
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Zap size={14} color="#fff" fill="#fff" />
                        </div>
                        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700 }}>Thumblytics AI</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>© 2026 Thumblytics AI. All rights reserved.</div>
                    <div style={{ display: 'flex', gap: 20 }}>
                        {['Privacy', 'Terms', 'Contact'].map(l => (
                            <Link key={l} to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>{l}</Link>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}
