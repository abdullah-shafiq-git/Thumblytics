import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X, Zap, Crown, ArrowRight, Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import CheckoutModal from '../components/CheckoutModal'

const fadeInUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

const plans = [
    {
        id: 'free',
        name: 'Free',
        price: { monthly: 0, annual: 0 },
        description: 'Perfect for getting started',
        badge: null,
        color: '#6366f1',
        features: [
            { text: '5 thumbnail analyses / month', included: true },
            { text: '3 title generations / month', included: true },
            { text: 'CTR Score & breakdown', included: true },
            { text: 'Basic improvement suggestions', included: true },
            { text: 'Dashboard & history', included: true },
            { text: 'Unlimited analyses', included: false },
            { text: 'Priority AI processing', included: false },
            { text: 'Advanced heatmap attention', included: false },
            { text: 'A/B testing comparison', included: false },
            { text: 'API access', included: false },
        ],
        cta: 'Get Started Free',
        variant: 'secondary',
        isPaid: false,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: { monthly: 19, annual: 15 },
        description: 'For serious content creators',
        badge: '🔥 Most Popular',
        color: '#f59e0b',
        features: [
            { text: 'Unlimited thumbnail analyses', included: true },
            { text: 'Unlimited title generations', included: true },
            { text: 'CTR Score & full breakdown', included: true },
            { text: 'Advanced AI suggestions', included: true },
            { text: 'Full dashboard & history', included: true },
            { text: 'Priority AI processing', included: true },
            { text: 'Advanced heatmap attention', included: true },
            { text: 'A/B testing comparison', included: true },
            { text: 'API access', included: true },
            { text: 'Priority email support', included: true },
        ],
        cta: 'Buy Pro Plan',
        variant: 'accent',
        isPaid: true,
    },
]

const faqs = [
    { q: 'How does the CTR Score work?', a: 'Our algorithm analyzes 7 key factors: brightness, contrast, color balance, text readability, face detection, curiosity gap, and emotional impact — each weighted based on their real-world impact on YouTube CTR data.' },
    { q: 'Can I cancel anytime?', a: "Yes! Cancel your Pro subscription anytime from your account settings. You'll keep Pro features until the end of your billing period." },
    { q: 'Is my data private?', a: 'Absolutely. Your uploaded thumbnails are processed securely and never shared. Files are automatically deleted after 30 days.' },
    { q: 'Do you offer refunds?', a: "We offer a full refund within 7 days if you're not satisfied. No questions asked." },
]

export default function PricingPage() {
    const [billing, setBilling] = useState('monthly')
    const [checkoutPlan, setCheckoutPlan] = useState(null)
    const { user } = useAuth()
    const navigate = useNavigate()

    function handlePlanClick(plan) {
        if (!plan.isPaid) {
            // Free plan → go to register
            navigate('/register')
            return
        }
        if (!user) {
            // Must be logged in to buy
            navigate('/login?redirect=pricing')
            return
        }
        if (user.plan === 'pro') return // already pro
        setCheckoutPlan(plan)
    }

    return (
        <div style={{ minHeight: '100vh', paddingTop: 90 }}>
            {/* Background */}
            <div style={{ position: 'fixed', inset: 0, zIndex: -1, background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(99,102,241,0.15), transparent)', pointerEvents: 'none' }} />

            <div className="container">
                {/* Header */}
                <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} style={{ textAlign: 'center', padding: '60px 0 64px' }}>
                    <motion.div variants={fadeInUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 999, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: 20, fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 500 }}>
                        Simple, Transparent Pricing
                    </motion.div>
                    <motion.h1 variants={fadeInUp} style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>
                        Invest in Your <span className="gradient-text">Creator Growth</span>
                    </motion.h1>
                    <motion.p variants={fadeInUp} style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto 32px' }}>
                        One thumbnail analyzed = one potential viral video. Start free, scale when you're ready.
                    </motion.p>

                    {/* Billing toggle */}
                    <motion.div variants={fadeInUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 0, background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 12, padding: 4 }}>
                        {['monthly', 'annual'].map(b => (
                            <button
                                key={b}
                                onClick={() => setBilling(b)}
                                style={{
                                    padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                    fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
                                    background: billing === b ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                                    color: billing === b ? '#fff' : 'var(--text-secondary)',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {b.charAt(0).toUpperCase() + b.slice(1)}
                                {b === 'annual' && <span style={{ marginLeft: 6, fontSize: '0.7rem', background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '1px 5px', borderRadius: 4 }}>-20%</span>}
                            </button>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Plans */}
                <motion.div
                    initial="hidden" animate="show"
                    variants={{ show: { transition: { staggerChildren: 0.15 } } }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 860, margin: '0 auto 80px' }}
                >
                    {plans.map((plan) => {
                        const isCurrentPlan = user?.plan === plan.id
                        const price = plan.price[billing]

                        return (
                            <motion.div
                                key={plan.id}
                                variants={fadeInUp}
                                style={{
                                    position: 'relative', padding: 32,
                                    borderRadius: 24,
                                    background: plan.id === 'pro'
                                        ? 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(99,102,241,0.05))'
                                        : 'var(--bg-glass)',
                                    border: `1px solid ${plan.id === 'pro' ? 'rgba(245,158,11,0.25)' : 'var(--border)'}`,
                                    boxShadow: plan.id === 'pro' ? '0 0 60px rgba(245,158,11,0.1)' : 'none',
                                }}
                            >
                                {plan.badge && (
                                    <div style={{
                                        position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                                        padding: '4px 16px', borderRadius: 999, background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                                        fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap', color: '#fff'
                                    }}>{plan.badge}</div>
                                )}

                                <div style={{ marginBottom: 24 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${plan.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {plan.id === 'pro' ? <Crown size={16} color={plan.color} /> : <Zap size={16} color={plan.color} />}
                                        </div>
                                        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem' }}>{plan.name}</span>
                                        {isCurrentPlan && (
                                            <span style={{ marginLeft: 4, fontSize: '0.65rem', padding: '2px 8px', borderRadius: 999, background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 700 }}>
                                                Current Plan
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                                        <span style={{ fontFamily: 'Space Grotesk', fontSize: '2.8rem', fontWeight: 900, lineHeight: 1, color: plan.id === 'pro' ? '#fbbf24' : 'var(--text-primary)' }}>
                                            ${price}
                                        </span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/mo</span>
                                    </div>
                                    {billing === 'annual' && plan.price.annual > 0 && (
                                        <div style={{ fontSize: '0.8rem', color: '#10b981' }}>Billed annually — save ${(plan.price.monthly - plan.price.annual) * 12}/yr</div>
                                    )}
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{plan.description}</p>
                                </div>

                                {/* CTA Button */}
                                {plan.isPaid ? (
                                    <motion.button
                                        id={`buy-${plan.id}-btn`}
                                        whileHover={!isCurrentPlan ? { scale: 1.02, boxShadow: '0 8px 30px rgba(245,158,11,0.4)' } : {}}
                                        whileTap={!isCurrentPlan ? { scale: 0.98 } : {}}
                                        onClick={() => handlePlanClick(plan)}
                                        disabled={isCurrentPlan}
                                        style={{
                                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                            padding: '12px 20px', borderRadius: 12, border: 'none', cursor: isCurrentPlan ? 'default' : 'pointer',
                                            fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9rem',
                                            marginBottom: 24, transition: 'all 0.25s ease',
                                            background: isCurrentPlan
                                                ? 'rgba(255,255,255,0.06)'
                                                : 'linear-gradient(135deg, #f59e0b, #f97316)',
                                            color: isCurrentPlan ? 'var(--text-muted)' : '#fff',
                                            boxShadow: isCurrentPlan ? 'none' : '0 4px 20px rgba(245,158,11,0.3)',
                                        }}
                                    >
                                        {isCurrentPlan ? (
                                            <><Check size={16} /> Already on Pro</>
                                        ) : (
                                            <>{plan.cta} <ArrowRight size={16} /></>
                                        )}
                                    </motion.button>
                                ) : (
                                    <Link
                                        to={user ? '/dashboard' : '/register'}
                                        className="btn btn-secondary btn-lg"
                                        style={{ width: '100%', justifyContent: 'center', marginBottom: 24 }}
                                    >
                                        {user ? 'Go to Dashboard' : plan.cta} <ArrowRight size={16} />
                                    </Link>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {plan.features.map((f, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{
                                                width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                                                background: f.included ? `${plan.color}20` : 'rgba(255,255,255,0.04)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                {f.included
                                                    ? <Check size={11} color={plan.color} strokeWidth={3} />
                                                    : <X size={11} color="rgba(255,255,255,0.2)" strokeWidth={3} />
                                                }
                                            </div>
                                            <span style={{ fontSize: '0.875rem', color: f.included ? 'var(--text-primary)' : 'var(--text-muted)' }}>{f.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* Social Proof */}
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 80 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 10 }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={20} color="#f59e0b" fill="#f59e0b" />)}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 500, margin: '0 auto', fontStyle: 'italic' }}>
                        "Best investment I've made for my channel. CTR went from 4.1% to 9.3% in a month."
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 8 }}>— Jamie K., 340K subscribers</p>
                </motion.div>

                {/* FAQ */}
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }} style={{ maxWidth: 720, margin: '0 auto 80px' }}>
                    <motion.h2 variants={fadeInUp} style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: 40 }}>Frequently Asked Questions</motion.h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} faq={faq} />
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Checkout Modal */}
            {checkoutPlan && (
                <CheckoutModal
                    plan={checkoutPlan}
                    billing={billing}
                    onClose={() => setCheckoutPlan(null)}
                />
            )}
        </div>
    )
}

function FAQItem({ faq }) {
    const [open, setOpen] = useState(false)
    return (
        <div
            className="glass"
            style={{ borderRadius: 14, overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => setOpen(!open)}
        >
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{faq.q}</span>
                <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
                    <X size={16} color="var(--text-muted)" />
                </motion.div>
            </div>
            {open && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ padding: '0 20px 16px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}
                >
                    {faq.a}
                </motion.div>
            )}
        </div>
    )
}
