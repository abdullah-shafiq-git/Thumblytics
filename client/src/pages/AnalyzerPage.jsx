import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import api from '../lib/api'
import toast from 'react-hot-toast'
import ScoreGauge from '../components/ScoreGauge'
import { Upload, CheckCircle, XCircle, Lightbulb, Palette, Eye, Zap, BarChart3, RefreshCw, Trash2 } from 'lucide-react'

const fadeInUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function AnalyzerPage() {
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [title, setTitle] = useState('')
    const [niche, setNiche] = useState('general')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)

    const onDrop = useCallback((accepted) => {
        const f = accepted[0]
        if (!f) return
        setFile(f)
        setPreview(URL.createObjectURL(f))
        setResult(null)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
        maxSize: 10 * 1024 * 1024, multiple: false,
        onDropRejected: () => toast.error('File too large or unsupported format')
    })

    const analyze = async () => {
        if (!file) { toast.error('Please upload a thumbnail first'); return }
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('thumbnail', file)
            formData.append('title', title || file.name)
            formData.append('niche', niche)
            const res = await api.post('/thumbnails/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setResult(res.data.data)
            toast.success('Analysis complete! 🎯')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Analysis failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const reset = () => { setFile(null); setPreview(null); setResult(null); setTitle(''); setNiche('general') }

    return (
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
            {/* Header */}
            <motion.div variants={fadeInUp} className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BarChart3 size={20} color="#818cf8" />
                    </div>
                    <div>
                        <h1 className="page-title">Thumbnail Analyzer</h1>
                        <p className="page-subtitle">Get an AI-powered CTR score with detailed improvement suggestions</p>
                    </div>
                </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1.6fr' : '1fr', gap: 24 }}>
                {/* Upload Panel */}
                <motion.div variants={fadeInUp}>
                    {/* Dropzone */}
                    <div
                        {...getRootProps()}
                        style={{
                            border: `2px dashed ${isDragActive ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: 16, padding: 32, textAlign: 'center', cursor: 'pointer',
                            background: isDragActive ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                            transition: 'all 0.3s ease', marginBottom: 16,
                            boxShadow: isDragActive ? '0 0 30px rgba(99,102,241,0.2)' : 'none'
                        }}
                    >
                        <input {...getInputProps()} id="thumbnail-upload" />
                        {preview ? (
                            <div>
                                <img src={preview} alt="Preview" style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 12, marginBottom: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }} />
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{file?.name}</p>
                            </div>
                        ) : (
                            <>
                                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <Upload size={28} color="#818cf8" />
                                </div>
                                <p style={{ fontWeight: 600, marginBottom: 8 }}>{isDragActive ? 'Drop it here!' : 'Drop your thumbnail here'}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>JPG, PNG, WebP — max 10MB</p>
                                <p style={{ color: '#818cf8', fontSize: '0.85rem', marginTop: 8 }}>or click to browse</p>
                            </>
                        )}
                    </div>

                    {/* Options */}
                    <div className="glass" style={{ padding: 20, marginBottom: 16 }}>
                        <div className="form-group">
                            <label className="label">Video Title (optional)</label>
                            <input
                                type="text" className="input" placeholder="Enter your video title..."
                                value={title} onChange={e => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="label">Niche / Category</label>
                            <select
                                className="input" value={niche} onChange={e => setNiche(e.target.value)}
                                style={{ cursor: 'pointer' }}
                            >
                                {['general', 'gaming', 'tech', 'lifestyle', 'finance', 'fitness', 'education', 'cooking', 'travel', 'music'].map(n => (
                                    <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            id="analyze-btn"
                            onClick={analyze}
                            disabled={loading || !file}
                            className="btn btn-primary"
                            style={{ flex: 1, justifyContent: 'center' }}
                        >
                            {loading ? (
                                <><RefreshCw size={16} style={{ animation: 'rotate 1s linear infinite' }} /> Analyzing...</>
                            ) : (
                                <><Zap size={16} /> Analyze CTR Score</>
                            )}
                        </button>
                        {file && (
                            <button onClick={reset} className="btn btn-secondary" style={{ padding: '12px 14px' }}>
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Results Panel */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.5 }}
                        >
                            <AnalysisResults result={result} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Placeholder when no result */}
                {!result && (
                    <motion.div variants={fadeInUp} className="glass" style={{ padding: 40, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 400, display: 'none' }}>
                    </motion.div>
                )}
            </div>

            {/* Tips Section */}
            {!result && (
                <motion.div variants={fadeInUp} style={{ marginTop: 32 }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>💡 What We Analyze</h2>
                    <div className="grid grid-3" style={{ gap: 16 }}>
                        {[
                            { icon: Eye, title: 'Attention Heatmap', desc: 'Where viewers look first using visual saliency', color: '#6366f1' },
                            { icon: Palette, title: 'Color Psychology', desc: 'Dominant colors & emotional impact on viewers', color: '#8b5cf6' },
                            { icon: BarChart3, title: 'CTR Algorithm', desc: 'Contrast, brightness, face detection & text score', color: '#10b981' },
                        ].map((tip, i) => (
                            <div key={i} className="glass" style={{ padding: 20, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${tip.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <tip.icon size={18} color={tip.color} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>{tip.title}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>{tip.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            <style>{`@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </motion.div>
    )
}

function AnalysisResults({ result }) {
    const a = result.analysis
    const scores = [
        { label: 'Brightness', value: a.brightnessScore, color: '#f59e0b' },
        { label: 'Contrast', value: a.contrastScore, color: '#6366f1' },
        { label: 'Color Balance', value: a.colorBalanceScore, color: '#8b5cf6' },
        { label: 'Text Readability', value: a.textReadabilityScore, color: '#3b82f6' },
        { label: 'Face Detection', value: a.faceDetectionScore, color: '#10b981' },
        { label: 'Curiosity Gap', value: a.curiosityGapScore, color: '#ef4444' },
        { label: 'Emotion Score', value: a.emotionScore, color: '#f97316' },
    ]

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* CTR Score */}
            <div className="glass" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 24, background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))' }}>
                <ScoreGauge score={a.ctrScore} size={130} label="CTR Score" />
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.4rem', fontWeight: 800, marginBottom: 6 }}>{result.title}</h2>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                        <span className={`badge badge-${a.hasFace ? 'success' : 'warning'}`}>{a.hasFace ? '✓ Face Detected' : '⚠ No Face'}</span>
                        <span className="badge badge-free">Text: {a.textDensity}</span>
                        <span className="badge badge-free">{result.niche}</span>
                    </div>
                    {/* Color chips */}
                    {a.dominantColors?.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Dominant:</span>
                            <div style={{ display: 'flex', gap: 4 }}>
                                {a.dominantColors.map((c, i) => (
                                    <div key={i} data-tooltip={c} title={c} style={{ width: 20, height: 20, borderRadius: 4, background: c, border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sub-scores */}
            <div className="glass" style={{ padding: 20 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 14 }}>Breakdown Scores</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {scores.map((s) => (
                        <div key={s.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{s.label}</span>
                                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: s.color }}>{Math.round(s.value)}/100</span>
                            </div>
                            <div className="progress-bar" style={{ height: 5 }}>
                                <motion.div
                                    className="progress-fill"
                                    style={{ background: `linear-gradient(90deg, ${s.color}99, ${s.color})` }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${s.value}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Strengths + Issues + Suggestions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {/* Strengths */}
                {a.strengths?.length > 0 && (
                    <div className="glass" style={{ padding: 16, borderColor: 'rgba(16,185,129,0.2)' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#10b981', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle size={14} /> Strengths
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {a.strengths.map((s, i) => (
                                <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>✓ {s}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Issues */}
                {a.issues?.length > 0 && (
                    <div className="glass" style={{ padding: 16, borderColor: 'rgba(239,68,68,0.2)' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ef4444', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <XCircle size={14} /> Issues
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {a.issues.map((s, i) => (
                                <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>✗ {s}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Suggestions */}
            {a.suggestions?.length > 0 && (
                <div className="glass" style={{ padding: 16, borderColor: 'rgba(245,158,11,0.2)' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f59e0b', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Lightbulb size={14} /> AI Suggestions
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {a.suggestions.map((s, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(245,158,11,0.05)' }}>
                                <span style={{ color: '#f59e0b', fontWeight: 800, flexShrink: 0, fontSize: '0.85rem' }}>{i + 1}</span>
                                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
