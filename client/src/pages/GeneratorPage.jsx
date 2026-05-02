import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { Wand2, Sparkles, Copy, RefreshCw, TrendingUp, ChevronRight } from 'lucide-react'

const fadeInUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

const niches = ['General', 'Gaming', 'Tech', 'Lifestyle', 'Finance', 'Fitness', 'Education', 'Cooking', 'Travel', 'Music', 'Business', 'Beauty']

const emotionColors = {
    surprise: '#f59e0b', fear: '#ef4444', curiosity: '#6366f1',
    urgency: '#f97316', 'social proof': '#10b981'
}

export default function GeneratorPage() {
    const [topic, setTopic] = useState('')
    const [niche, setNiche] = useState('General')
    const [keywords, setKeywords] = useState('')
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState(null)
    const [copied, setCopied] = useState(null)

    const generate = async () => {
        if (!topic.trim()) { toast.error('Please enter a topic or video idea'); return }
        setLoading(true)
        try {
            const res = await api.post('/thumbnails/generate-titles', {
                topic, niche: niche.toLowerCase(), keywords
            })
            setResults(res.data.data)
            toast.success('AI titles generated! ✨')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Generation failed')
        } finally {
            setLoading(false)
        }
    }

    const copyTitle = (title, idx) => {
        navigator.clipboard.writeText(title)
        setCopied(idx)
        toast.success('Copied to clipboard!')
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
            {/* Header */}
            <motion.div variants={fadeInUp} className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Wand2 size={20} color="#a78bfa" />
                    </div>
                    <div>
                        <h1 className="page-title">Title & Thumbnail Generator</h1>
                        <p className="page-subtitle">AI-powered titles with emotion triggers + curiosity gap analysis</p>
                    </div>
                </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24 }}>
                {/* Input Panel */}
                <motion.div variants={fadeInUp}>
                    <div className="glass" style={{ padding: 24, marginBottom: 16 }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Generate Winning Titles</h2>

                        <div className="form-group">
                            <label className="label">Topic / Video Idea *</label>
                            <textarea
                                className="input"
                                style={{ resize: 'vertical', minHeight: 90 }}
                                placeholder="e.g. How I grew my YouTube channel to 100K subscribers..."
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="label">Niche</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {niches.map(n => (
                                    <button
                                        key={n}
                                        onClick={() => setNiche(n)}
                                        style={{
                                            padding: '5px 12px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 500,
                                            border: `1px solid ${niche === n ? '#6366f1' : 'var(--border)'}`,
                                            background: niche === n ? 'rgba(99,102,241,0.15)' : 'transparent',
                                            color: niche === n ? '#a5b4fc' : 'var(--text-secondary)',
                                            cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                    >{n}</button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label">Keywords (optional)</label>
                            <input
                                type="text" className="input"
                                placeholder="youtube growth, viral, algorithm..."
                                value={keywords} onChange={e => setKeywords(e.target.value)}
                            />
                        </div>

                        <button
                            id="generate-titles-btn"
                            onClick={generate}
                            disabled={loading || !topic.trim()}
                            className="btn btn-primary"
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            {loading ? (
                                <><RefreshCw size={16} style={{ animation: 'rotate 1s linear infinite' }} /> Generating...</>
                            ) : (
                                <><Sparkles size={16} /> Generate AI Titles</>
                            )}
                        </button>
                    </div>

                    {/* Tips */}
                    <div className="glass" style={{ padding: 16 }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>💡 Pro Tips</h3>
                        {[
                            'Be specific in your topic description',
                            'Include emotional keywords like "shocking" or "mistake"',
                            'Add numbers for higher CTR (e.g. "7 ways...")',
                            'Describe your target viewer in keywords',
                        ].map((tip, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                <ChevronRight size={14} color="#6366f1" style={{ flexShrink: 0, marginTop: 2 }} />
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tip}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Results Panel */}
                <motion.div variants={fadeInUp}>
                    <AnimatePresence mode="wait">
                        {results ? (
                            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>
                                        AI Titles for <span className="gradient-text">"{results.topic}"</span>
                                    </h2>
                                    <button onClick={generate} className="btn btn-secondary btn-sm" disabled={loading}>
                                        <RefreshCw size={14} /> Regenerate
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {results.suggestions?.map((s, i) => (
                                        <TitleCard key={i} suggestion={s} index={i} onCopy={copyTitle} copied={copied === i} />
                                    ))}
                                </div>

                                {/* Thumbnail Tips */}
                                <div className="glass" style={{ padding: 20, marginTop: 20, background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))' }}>
                                    <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Wand2 size={14} color="#818cf8" /> Thumbnail Recommendations for This Topic
                                    </h3>
                                    <div className="grid grid-2" style={{ gap: 12 }}>
                                        {[
                                            { tip: 'Use a shocked/surprised expression to match curiosity gap titles', icon: '😲' },
                                            { tip: 'Bold text overlay with 1-3 high-impact words', icon: '✍️' },
                                            { tip: 'High-contrast background (dark subject on light bg or vice versa)', icon: '🎨' },
                                            { tip: 'Include a number or arrow pointing to key element', icon: '🎯' },
                                        ].map((t, i) => (
                                            <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)' }}>
                                                <span style={{ fontSize: '1.1rem' }}>{t.icon}</span>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{t.tip}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="glass"
                                style={{ height: '100%', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40 }}
                            >
                                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                    <Sparkles size={36} color="#818cf8" />
                                </div>
                                <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem', fontWeight: 700, marginBottom: 10 }}>AI Title Generator</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 320, lineHeight: 1.6 }}>
                                    Enter your topic on the left and our AI will generate high-CTR YouTube titles with emotion triggers and curiosity gaps built in.
                                </p>
                                <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {['🧠 Curiosity Gap', '🔥 Emotion Triggers', '📈 CTR Optimized'].map(tag => (
                                        <span key={tag} style={{ padding: '4px 12px', borderRadius: 999, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '0.8rem', color: '#a5b4fc' }}>{tag}</span>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            <style>{`@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </motion.div>
    )
}

function TitleCard({ suggestion, index, onCopy, copied }) {
    const emotionColor = emotionColors[suggestion.emotionTrigger] || '#6366f1'
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass"
            style={{ padding: 16, borderRadius: 14, position: 'relative', overflow: 'hidden' }}
        >
            <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                background: `linear-gradient(180deg, ${emotionColor}, ${emotionColor}66)`
            }} />
            <div style={{ paddingLeft: 12 }}>
                <p style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.5, marginBottom: 12 }}>{suggestion.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 600, background: `${emotionColor}18`, color: emotionColor, border: `1px solid ${emotionColor}30` }}>
                        {suggestion.emotionTrigger}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <TrendingUp size={12} color="#10b981" />
                        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>{suggestion.curiosityScore}% curiosity</span>
                    </div>
                    <button
                        onClick={() => onCopy(suggestion.title, index)}
                        style={{
                            marginLeft: 'auto', padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600,
                            background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)',
                            border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.2)'}`,
                            color: copied ? '#10b981' : '#a5b4fc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                        }}
                    >
                        <Copy size={11} /> {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
