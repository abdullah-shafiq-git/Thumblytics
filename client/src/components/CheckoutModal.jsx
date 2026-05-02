import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Lock, Check, Loader, ShieldCheck, Crown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import toast from 'react-hot-toast'

// ── helpers ──────────────────────────────────────────────────────────────────
function formatCardNumber(val) {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(val) {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
    return digits
}

function detectCardBrand(num) {
    const n = num.replace(/\s/g, '')
    if (/^4/.test(n)) return 'visa'
    if (/^5[1-5]/.test(n)) return 'mastercard'
    if (/^3[47]/.test(n)) return 'amex'
    return 'generic'
}

const BRAND_COLORS = {
    visa: 'linear-gradient(135deg, #1a1f71, #2563eb)',
    mastercard: 'linear-gradient(135deg, #eb001b 0%, #f79e1b 100%)',
    amex: 'linear-gradient(135deg, #007bc1, #00b2e3)',
    generic: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
}

// ── main component ────────────────────────────────────────────────────────────
export default function CheckoutModal({ plan, billing, onClose }) {
    const { user, updateUser } = useAuth()
    const price = billing === 'annual' ? plan.price.annual : plan.price.monthly
    const totalLabel = billing === 'annual' ? `$${plan.price.annual * 12}/yr` : `$${plan.price.monthly}/mo`

    const [step, setStep] = useState('form') // 'form' | 'processing' | 'success'
    const [flipped, setFlipped] = useState(false)

    const [form, setForm] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        email: user?.email || '',
    })
    const [errors, setErrors] = useState({})

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [onClose])

    const brand = detectCardBrand(form.cardNumber)

    function validate() {
        const e = {}
        if (!form.cardName.trim()) e.cardName = 'Name is required'
        const raw = form.cardNumber.replace(/\s/g, '')
        if (raw.length < 13 || raw.length > 16) e.cardNumber = 'Enter a valid 13–16 digit card number'
        if (!/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = 'Use MM/YY format'
        else {
            const [mm, yy] = form.expiry.split('/')
            const exp = new Date(2000 + +yy, +mm - 1, 1)
            if (exp < new Date()) e.expiry = 'Card is expired'
        }
        const cvvLen = brand === 'amex' ? 4 : 3
        if (form.cvv.length < cvvLen) e.cvv = `CVV must be ${cvvLen} digits`
        if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!validate()) return

        setStep('processing')

        try {
            const res = await api.post('/payments/upgrade', {
                plan: plan.id,
                billing,
                cardLast4: form.cardNumber.replace(/\s/g, '').slice(-4),
                email: form.email,
            })

            // Update user in context & localStorage
            updateUser({ ...user, plan: res.data.user.plan })
            setStep('success')
        } catch (err) {
            const msg = err.response?.data?.message || 'Payment failed. Please try again.'
            toast.error(msg)
            setStep('form')
        }
    }

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    background: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '16px',
                }}
            >
                {/* Modal */}
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 20 }}
                    transition={{ type: 'spring', damping: 26, stiffness: 340 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        width: '100%', maxWidth: 480,
                        background: 'var(--bg-card, #0f0f14)',
                        border: '1px solid rgba(99,102,241,0.25)',
                        borderRadius: 24,
                        overflow: 'hidden',
                        boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)',
                    }}
                >
                    {step === 'success' ? (
                        <SuccessView plan={plan} totalLabel={totalLabel} onClose={onClose} />
                    ) : step === 'processing' ? (
                        <ProcessingView />
                    ) : (
                        <FormView
                            plan={plan} billing={billing} totalLabel={totalLabel}
                            form={form} setForm={setForm} errors={errors}
                            brand={brand} flipped={flipped} setFlipped={setFlipped}
                            formatCardNumber={formatCardNumber} formatExpiry={formatExpiry}
                            BRAND_COLORS={BRAND_COLORS}
                            onSubmit={handleSubmit} onClose={onClose}
                        />
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// ── Form View ─────────────────────────────────────────────────────────────────
function FormView({ plan, billing, totalLabel, form, setForm, errors, brand, flipped, setFlipped, formatCardNumber, formatExpiry, BRAND_COLORS, onSubmit, onClose }) {
    const price = billing === 'annual' ? plan.price.annual : plan.price.monthly

    function update(field, value) {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div>
            {/* Header */}
            <div style={{
                padding: '20px 24px 16px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Crown size={18} color="#f59e0b" />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem' }}>
                            Upgrade to {plan.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #888)' }}>
                            {billing === 'annual' ? 'Billed annually' : 'Billed monthly'} · {totalLabel}
                        </div>
                    </div>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted, #888)', padding: 4, borderRadius: 8, display: 'flex' }}>
                    <X size={20} />
                </button>
            </div>

            {/* Card Visual */}
            <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'center' }}>
                <CardPreview form={form} brand={brand} flipped={flipped} BRAND_COLORS={BRAND_COLORS} />
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Email */}
                <Field label="Email Address" error={errors.email}>
                    <input
                        type="email"
                        placeholder="you@email.com"
                        value={form.email}
                        onChange={e => update('email', e.target.value)}
                        style={inputStyle(!!errors.email)}
                    />
                </Field>

                {/* Cardholder Name */}
                <Field label="Cardholder Name" error={errors.cardName}>
                    <input
                        type="text"
                        placeholder="John Doe"
                        value={form.cardName}
                        onChange={e => update('cardName', e.target.value)}
                        style={inputStyle(!!errors.cardName)}
                    />
                </Field>

                {/* Card Number */}
                <Field label="Card Number" error={errors.cardNumber} icon={<CreditCard size={15} color="#888" />}>
                    <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={form.cardNumber}
                        onChange={e => update('cardNumber', formatCardNumber(e.target.value))}
                        maxLength={19}
                        style={inputStyle(!!errors.cardNumber)}
                    />
                </Field>

                {/* Expiry + CVV */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Field label="Expiry Date" error={errors.expiry}>
                        <input
                            type="text"
                            placeholder="MM/YY"
                            value={form.expiry}
                            onChange={e => update('expiry', formatExpiry(e.target.value))}
                            maxLength={5}
                            style={inputStyle(!!errors.expiry)}
                        />
                    </Field>
                    <Field label="CVV" error={errors.cvv}>
                        <input
                            type="text"
                            placeholder="•••"
                            value={form.cvv}
                            onFocus={() => setFlipped(true)}
                            onBlur={() => setFlipped(false)}
                            onChange={e => update('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                            maxLength={4}
                            style={inputStyle(!!errors.cvv)}
                        />
                    </Field>
                </div>

                {/* Order Summary */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12,
                    padding: '12px 16px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    <div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary, #aaa)' }}>Thumblytics {plan.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #666)' }}>
                            {billing === 'annual' ? 'Annual plan · 7-day free trial' : 'Monthly plan · Cancel anytime'}
                        </div>
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#fbbf24' }}>
                        {totalLabel}
                    </div>
                </div>

                {/* Submit */}
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        padding: '14px',
                        background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                        border: 'none', borderRadius: 12, cursor: 'pointer',
                        color: '#fff', fontFamily: 'Inter, sans-serif',
                        fontWeight: 700, fontSize: '0.95rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        boxShadow: '0 4px 20px rgba(245,158,11,0.35)',
                        marginTop: 4,
                    }}
                >
                    <Lock size={16} />
                    Pay {totalLabel} — Activate {plan.name}
                </motion.button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--text-muted, #666)', fontSize: '0.72rem' }}>
                    <ShieldCheck size={13} />
                    256-bit SSL Encrypted · No charges without confirmation
                </div>
            </form>
        </div>
    )
}

// ── Card Preview ──────────────────────────────────────────────────────────────
function CardPreview({ form, brand, flipped, BRAND_COLORS }) {
    const displayNumber = form.cardNumber || '•••• •••• •••• ••••'
    const maskedNumber = displayNumber.replace(/\d(?=.{4,})/g, '•').padEnd(19, '•')

    return (
        <div style={{ perspective: 600, width: 280, height: 160, marginBottom: 4 }}>
            <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 180 }}
                style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
            >
                {/* Front */}
                <div style={{
                    position: 'absolute', inset: 0, borderRadius: 14,
                    background: BRAND_COLORS[brand] || BRAND_COLORS.generic,
                    padding: '18px 20px',
                    backfaceVisibility: 'hidden',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                    <div style={{ position: 'absolute', bottom: -30, left: -10, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ width: 32, height: 24, background: 'rgba(255,255,255,0.25)', borderRadius: 4 }} />
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: 1 }}>{brand.toUpperCase()}</span>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', letterSpacing: 3, color: 'rgba(255,255,255,0.9)', fontFamily: 'monospace', marginBottom: 8 }}>
                            {maskedNumber}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>CARD HOLDER</div>
                                <div style={{ fontSize: '0.72rem', color: '#fff', fontWeight: 600 }}>{form.cardName || 'YOUR NAME'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>EXPIRES</div>
                                <div style={{ fontSize: '0.72rem', color: '#fff', fontWeight: 600 }}>{form.expiry || 'MM/YY'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back */}
                <div style={{
                    position: 'absolute', inset: 0, borderRadius: 14,
                    background: BRAND_COLORS[brand] || BRAND_COLORS.generic,
                    backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                }}>
                    <div style={{ height: 36, background: 'rgba(0,0,0,0.4)', width: '100%', marginBottom: 16 }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 20, justifyContent: 'flex-end' }}>
                        <div style={{ flex: 1, height: 28, background: 'rgba(255,255,255,0.12)', borderRadius: 4 }} />
                        <div style={{ minWidth: 44, height: 28, background: 'rgba(255,255,255,0.9)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: '#1a1a2e', fontWeight: 700, letterSpacing: 2 }}>
                            {form.cvv || '•••'}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

// ── Processing View ───────────────────────────────────────────────────────────
function ProcessingView() {
    return (
        <div style={{ padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
                <Loader size={48} color="#6366f1" />
            </motion.div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: 6 }}>
                    Processing Payment…
                </div>
                <div style={{ color: 'var(--text-muted, #888)', fontSize: '0.85rem' }}>
                    Please don't close this window
                </div>
            </div>
        </div>
    )
}

// ── Success View ──────────────────────────────────────────────────────────────
function SuccessView({ plan, totalLabel, onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ padding: '56px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 14, stiffness: 260, delay: 0.1 }}
                style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 40px rgba(16,185,129,0.4)',
                }}
            >
                <Check size={36} color="#fff" strokeWidth={3} />
            </motion.div>

            <div>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.4rem', marginBottom: 6 }}>
                    Welcome to {plan.name}! 🎉
                </h2>
                <p style={{ color: 'var(--text-secondary, #aaa)', fontSize: '0.9rem', maxWidth: 300 }}>
                    Your plan has been activated. You now have full access to all {plan.name} features.
                </p>
            </div>

            <div style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 12, padding: '10px 20px',
                fontSize: '0.82rem', color: '#10b981',
            }}>
                ✓ Plan upgraded · {totalLabel} · Cancel anytime
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                style={{
                    padding: '12px 32px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none', borderRadius: 12, cursor: 'pointer',
                    color: '#fff', fontFamily: 'Inter, sans-serif',
                    fontWeight: 700, fontSize: '0.9rem', marginTop: 8,
                }}
            >
                Start Using Pro →
            </motion.button>
        </motion.div>
    )
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, error, icon, children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary, #aaa)', letterSpacing: '0.03em' }}>
                {label}
            </label>
            <div style={{ position: 'relative' }}>
                {icon && (
                    <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        {icon}
                    </div>
                )}
                {children}
            </div>
            {error && <span style={{ fontSize: '0.7rem', color: '#f87171' }}>{error}</span>}
        </div>
    )
}

function inputStyle(hasError) {
    return {
        width: '100%',
        padding: '10px 14px',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${hasError ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 10,
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.875rem',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    }
}
