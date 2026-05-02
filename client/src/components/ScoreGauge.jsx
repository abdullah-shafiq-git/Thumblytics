import { useId } from 'react'
import { motion } from 'framer-motion'

export default function ScoreGauge({ score, size = 140, label = 'CTR Score' }) {
    const radius = (size - 20) / 2
    const circumference = 2 * Math.PI * radius
    const dashOffset = circumference - (score / 100) * circumference

    const getColor = (s) => {
        if (s >= 75) return ['#10b981', '#059669']
        if (s >= 50) return ['#f59e0b', '#d97706']
        return ['#ef4444', '#dc2626']
    }

    const getLabel = (s) => {
        if (s >= 75) return 'Excellent'
        if (s >= 50) return 'Good'
        return 'Needs Work'
    }

    const [color1, color2] = getColor(score)
    const gradientId = `gauge-gradient-${useId().replace(/:/g, '-')}`

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ position: 'relative', width: size, height: size }}>
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={color1} />
                            <stop offset="100%" stopColor={color2} />
                        </linearGradient>
                    </defs>
                    {/* Background circle */}
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={10}
                    />
                    {/* Score arc */}
                    <motion.circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none"
                        stroke={`url(#${gradientId})`}
                        strokeWidth={10}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: dashOffset }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                        style={{ filter: `drop-shadow(0 0 8px ${color1})` }}
                    />
                </svg>
                {/* Score text */}
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        style={{
                            fontFamily: 'Space Grotesk, sans-serif',
                            fontSize: size * 0.22,
                            fontWeight: 800,
                            color: color1,
                            lineHeight: 1,
                        }}
                    >
                        {score}
                    </motion.span>
                    <span style={{ fontSize: size * 0.1, color: 'var(--text-muted)', fontWeight: 500 }}>/ 100</span>
                </div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    style={{ fontSize: '0.75rem', color: color1, fontWeight: 600 }}
                >
                    {getLabel(score)}
                </motion.div>
            </div>
        </div>
    )
}
