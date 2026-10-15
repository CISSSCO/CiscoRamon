import { useParams, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import experiences from '../data/experience.json'
import '../styles/home.css'
import { restoreScroll } from '../app/ScrollMemory'
import { TerminalIcon } from '../ui/HeroIcons'
import { TechIcon } from '../ui/TechIcons'

function PlayingCard({
    point,
    idx,
    total,
}: {
    point: string
    idx: number
    total: number
}) {
    const [inView, setInView] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1 }
        )
        if (cardRef.current) {
            observer.observe(cardRef.current)
        }
        return () => observer.disconnect()
    }, [])

    const indexStr = String(idx + 1).padStart(2, '0')
    const suits = [
        { sym: '⬡', label: 'CLUSTER.OP' },
        { sym: '◈', label: 'PARALLEL.ENV' },
        { sym: '❖', label: 'OPTIM.SYS' },
        { sym: '♠', label: 'KERNEL.DEV' },
        { sym: '⎊', label: 'SLURM.SCHED' },
    ]
    const currentSuit = suits[idx % suits.length]
    const slideClass = idx % 2 === 0 ? 'slide-left' : 'slide-right'

    return (
        <div
            ref={cardRef}
            className={`experience-playing-card ${inView ? slideClass : ''}`}
            style={{
                animationDelay: `${(idx % 4) * 0.12}s`,
                opacity: inView ? undefined : 0,
            }}
        >
            {/* Top Rank & Suit Indicator */}
            <div className="card-suit-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '1.25rem', color: '#00f2fe', fontWeight: 900 }}>
                        {currentSuit.sym} #{indexStr}
                    </span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.25)' }}>::</span>
                    <span style={{ fontSize: '0.76rem', letterSpacing: '0.1em', color: '#38bdf8' }}>
                        [{currentSuit.label}]
                    </span>
                </div>
                <div
                    style={{
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono, monospace)',
                        color: '#94a3b8',
                        background: 'rgba(0, 242, 254, 0.08)',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(0, 242, 254, 0.25)',
                    }}
                >
                    RECORD {idx + 1} OF {total}
                </div>
            </div>

            {/* Main Content Body */}
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-main)', margin: '1rem 0' }}>
                {point}
            </p>

            {/* Bottom Inverted Rank & Suit */}
            <div className="card-suit-bottom">
                <span style={{ fontSize: '0.85rem', color: 'var(--cyber-purple)', letterSpacing: '0.1em' }}>
                    {currentSuit.sym} #{indexStr} // SYS.LOG
                </span>
            </div>
        </div>
    )
}

export default function ExperiencePage() {
    const { id } = useParams()
    const experience = experiences.find((e) => e.id === id)

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
    }, [])

    if (!experience) {
        return (
            <div className="section" style={{ textAlign: 'center', padding: '15vh 1rem' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>Experience Record Not Found</h2>
                <Link to="/" className="cyber-action-btn secondary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                    ← BACK TO HOME
                </Link>
            </div>
        )
    }

    return (
        <article className="section" style={{ maxWidth: '1000px', margin: '0 auto', padding: '10vh 1.5rem 15vh' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <Link
                    to="/"
                    state={{ from: 'experience' }}
                    className="cyber-action-btn secondary"
                    onClick={() => restoreScroll()}
                    style={{ textDecoration: 'none', display: 'inline-flex', padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}
                >
                    ← BACK TO HOME
                </Link>
            </div>

            <div style={{ marginBottom: '3rem' }}>
                <div className="section-tag-hpc">
                    <span className="section-tag-dot" />
                    <span>CAREER TELEMETRY // {experience.id.toUpperCase()}</span>
                </div>

                <h1 style={{ fontSize: '3.4rem', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 0.8rem', color: 'var(--text-main)' }}>
                    {experience.role}
                </h1>

                <div style={{ fontSize: '1.35rem', color: 'var(--cyber-cyan)', fontWeight: 600, marginBottom: '0.6rem' }}>
                    {experience.org}
                </div>

                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                    {experience.period} · ({experience.duration})
                </div>
            </div>

            {experience.summary && (
                <div
                    style={{
                        padding: '1.8rem 2rem',
                        borderRadius: '16px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-cyber)',
                        backdropFilter: 'blur(16px)',
                        fontSize: '1.08rem',
                        lineHeight: 1.75,
                        color: 'var(--text-main)',
                        marginBottom: '3.5rem',
                        boxShadow: 'var(--card-shadow)',
                    }}
                >
                    {experience.summary}
                </div>
            )}

            {/* Sliding Animated Cards for Each Highlight Point */}
            <div style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.8rem' }}>
                    <TerminalIcon />
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                        Key Responsibilities &amp; Operations
                    </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {experience.highlights.map((point: string, idx: number) => (
                        <PlayingCard
                            key={idx}
                            point={point}
                            idx={idx}
                            total={experience.highlights.length}
                        />
                    ))}
                </div>
            </div>

            {/* Tech Stack */}
            {experience.stack && (
                <div
                    style={{
                        padding: '2rem',
                        borderRadius: '16px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-cyber)',
                        backdropFilter: 'blur(14px)',
                        boxShadow: 'var(--card-shadow)',
                    }}
                >
                    <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.85rem', color: 'var(--cyber-cyan)', marginBottom: '1rem', fontWeight: 700 }}>
                        COMPUTE TOOLCHAINS &amp; SYSTEMS:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                        {experience.stack.map((tech: string) => (
                            <span key={tech} className="tech-badge-cyber" style={{ fontSize: '0.82rem', padding: '0.35rem 0.8rem' }}>
                                <TechIcon name={tech} size={15} />
                                <span>{tech}</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </article>
    )
}
