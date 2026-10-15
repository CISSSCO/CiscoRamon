import { Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import '../styles/home.css'

import projects from '../data/projects.json'
import experience from '../data/experience.json'
import skills from '../data/skills.json'
import resume from '../assets/AbhishekRaj.pdf'

import {
    DownloadIcon,
    GitHubIcon,
    LinkedInIcon,
    MailIcon,
    ChevronDownIcon,
    ExternalLinkIcon,
    TerminalIcon,
    SkillGlyph,
} from '../ui/HeroIcons'
import { TechIcon } from '../ui/TechIcons'

function WritingText({
    text,
    startDelay = 0,
    charDelay = 0.035,
}: {
    text: string
    startDelay?: number
    charDelay?: number
}) {
    return (
        <span className="hero-writing-text">
            {text.split('').map((char, index) => (
                <span
                    key={index}
                    className="hero-writing-character"
                    style={{ animationDelay: `${startDelay + index * charDelay}s` }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </span>
    )
}

export default function Home() {
    const [sent, setSent] = useState(false)
    const [sending, setSending] = useState(false)
    
    // Expandable cards state for projects
    const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null)
    
    // Expandable cards state for experience
    const [expandedExpId, setExpandedExpId] = useState<string | null>(null)

    // Interactive category filter for skills preview
    const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('All')

    const featuredProjects = useMemo(
        () => projects.filter((p) => Boolean(p.featured)),
        []
    )

    // Only include featured skills and extract categories that actually exist
    const featuredSkills = useMemo(() => skills.filter((s) => s.featured), [])

    const skillCategories = useMemo(() => {
        const cats = Array.from(new Set(featuredSkills.map((s) => s.category)))
        return ['All', ...cats]
    }, [featuredSkills])

    const filteredSkills = useMemo(() => {
        return featuredSkills.filter((s) => {
            if (selectedSkillCategory === 'All') return true
            return s.category === selectedSkillCategory
        })
    }, [featuredSkills, selectedSkillCategory])

    const toggleProjectExpand = (id: string, e: React.MouseEvent) => {
        // Prevent expanding/collapsing if clicking any link or button inside the card
        if ((e.target as HTMLElement).closest('a, button')) {
            return
        }
        setExpandedProjectId((prev) => (prev === id ? null : id))
    }

    const toggleExpExpand = (id: string, e: React.MouseEvent) => {
        // Prevent expanding/collapsing if clicking any link or button inside the card
        if ((e.target as HTMLElement).closest('a, button')) {
            return
        }
        setExpandedExpId((prev) => (prev === id ? null : id))
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSending(true)
        const form = e.currentTarget
        const data = new FormData(form)

        try {
            const res = await fetch('https://formspree.io/f/xeegawka', {
                method: 'POST',
                body: data,
                headers: {
                    Accept: 'application/json',
                },
            })

            if (!res.ok) {
                alert('Something went wrong. Please try again.')
                setSending(false)
                return
            }

            form.reset()
            setSent(true)
            setSending(false)
            setTimeout(() => setSent(false), 5000)
        } catch (err) {
            console.error(err)
            alert('Network error. Please try again later.')
            setSending(false)
        }
    }

    return (
        <div style={{ position: 'relative' }}>
            {/* FUTURISTIC HERO SECTION */}
            <section className="section hero">
                <div className="hero-callsign">
                    <span>[ SYS.INIT ]</span>
                    <span className="callsign-sep">::</span>
                    <span>CISCO_RAMON</span>
                    <span className="callsign-sep">::</span>
                    <span className="callsign-ready">ONLINE</span>
                </div>

                <div className="hero-salutation">
                    <span style={{ color: '#00f2fe' }}>&gt;</span>
                    <WritingText text="Hi, I'm" startDelay={0.05} charDelay={0.03} />
                    <span className="cyber-cursor" />
                </div>

                <h1 className="hero-name-futuristic">
                    <WritingText text="Abhishek" startDelay={0.12} charDelay={0.03} />{' '}
                    <span className="hero-name-accent">
                        <WritingText text="Raj" startDelay={0.38} charDelay={0.03} />
                    </span>
                </h1>

                <div className="hero-tagline-futuristic">
                    <span>
                        <WritingText text="Scientific Programmer" startDelay={0.55} charDelay={0.02} />
                    </span>
                    <span style={{ color: '#00f2fe' }}>·</span>
                    <span className="hero-tagline-accent">
                        <WritingText text="HPC Engineer" startDelay={0.78} charDelay={0.02} />
                    </span>
                    <span style={{ color: '#00f2fe' }}>·</span>
                    <span>
                        <WritingText text="Linux Developer" startDelay={0.98} charDelay={0.02} />
                    </span>
                </div>

                <p className="hero-bio-futuristic">
                    Project Engineer @ C-DAC (R&amp;D) and ex-(HPC Application Engineer @ IIT (BHU)). Designing and maintaining high-performance parallel computing environments, Linux systems architectures, and open-source tooling.
                </p>

                <div className="hero-actions-futuristic">
                    <a href="#projects" className="cyber-action-btn primary hero-action-btn">
                        <TerminalIcon />
                        <span>EXPLORE PROJECTS</span>
                    </a>

                    <a
                        href={resume}
                        download="AbhishekRaj.pdf"
                        className="cyber-action-btn secondary hero-action-btn"
                    >
                        <DownloadIcon />
                        <span>DOWNLOAD RESUME</span>
                    </a>

                    <div className="hero-social-icons">
                        <Link
                            to="/github"
                            className="cyber-icon-btn hero-social-btn"
                            aria-label="GitHub Profile & Repositories"
                            title="View GitHub Profile & Details"
                        >
                            <GitHubIcon />
                        </Link>

                        <Link
                            to="/linkedin"
                            className="cyber-icon-btn hero-social-btn"
                            aria-label="LinkedIn Profile & Experience"
                            title="View LinkedIn Profile & Details"
                        >
                            <LinkedInIcon />
                        </Link>

                        <a
                            href="mailto:cisco581b@gmail.com"
                            className="cyber-icon-btn hero-social-btn"
                            aria-label="Email Me"
                            title="Email Me"
                        >
                            <MailIcon />
                        </a>
                    </div>
                </div>

                {/* CYBERPUNK SEPARATE STAT CARDS WITH DROP ANIMATION & HOVER */}
                <div className="hero-stat-cards-container">
                    <div className="hero-stat-card drop-anim-1">
                        <div className="stat-card-badge">
                            <span className="stat-card-dot" />
                            <span>01 // EXPERIENCE</span>
                        </div>
                        <div className="stat-card-value">2.5+ Yrs</div>
                        <div className="stat-card-label">Centre for Development of Advanced Computing, Pune (R&amp;D)</div>
                    </div>

                    <div className="hero-stat-card drop-anim-2">
                        <div className="stat-card-badge">
                            <span className="stat-card-dot" />
                            <span>02 // REPOSITORIES &amp; UPSTREAM</span>
                        </div>
                        <div className="stat-card-value">9+ Projects · 7+ PRs</div>
                        <div className="stat-card-label">9+ Standalone Systems &amp; 7+ Merged Upstream Contributions (Spack, C-DAC)</div>
                    </div>

                    <div className="hero-stat-card drop-anim-3">
                        <div className="stat-card-badge">
                            <span className="stat-card-dot" />
                            <span>03 // TOOLCHAINS</span>
                        </div>
                        <div className="stat-card-value">C · OpenMP · MPI · CUDA</div>
                        <div className="stat-card-label">Parallel Distributed Computing &amp; Linux Architectures</div>
                    </div>
                </div>
            </section>

            {/* PROJECTS SECTION */}
            <section id="projects" className="section">
                <div className="section-header">
                    <div className="section-tag-hpc">
                        <span className="section-tag-dot" />
                        <span>FEATURED SYSTEMS &amp; SOFTWARE</span>
                    </div>
                    <h2 className="section-title">Projects</h2>
                    <p className="section-subtitle">
                        Click any card to view full technical details, stack specifications, and direct repository links.
                    </p>
                </div>

                <div className="projects-grid">
                    {featuredProjects.map((p) => {
                        const isExpanded = expandedProjectId === p.id
                        return (
                            <div
                                key={p.id}
                                className={`cyber-card ${isExpanded ? 'expanded' : ''}`}
                                onClick={(e) => toggleProjectExpand(p.id, e)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem', gap: '0.6rem' }}>
                                    <h3 style={{ fontSize: 'clamp(1.15rem, 3.2vw, 1.45rem)', fontWeight: 700, color: 'var(--text-main)', margin: 0, wordBreak: 'break-word', overflowWrap: 'break-word', minWidth: 0, lineHeight: 1.28 }}>
                                        {p.title}
                                    </h3>
                                    <div style={{ color: 'var(--cyber-cyan)', display: 'flex', alignItems: 'center', flexShrink: 0, marginTop: '3px' }}>
                                        <ChevronDownIcon rotated={isExpanded} />
                                    </div>
                                </div>

                                <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                                    {p.excerpt}
                                </p>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.5rem' }}>
                                    {p.stack?.slice(0, 4).map((tech) => (
                                        <span key={tech} className="tech-badge-cyber">
                                            <TechIcon name={tech} size={14} />
                                            <span>{tech}</span>
                                        </span>
                                    ))}
                                    {p.stack && p.stack.length > 4 && (
                                        <span className="tech-badge-cyber" style={{ color: 'var(--cyber-blue)' }}>
                                            +{p.stack.length - 4} more
                                        </span>
                                    )}
                                </div>

                                {/* Animated Expandable Body */}
                                <div className={`card-expand-body ${isExpanded ? 'open' : ''}`}>
                                    <div className="expanded-horizontal-content">
                                        <div>
                                            <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono, monospace)', color: 'var(--cyber-cyan)', marginBottom: '0.6rem' }}>
                                                TECHNICAL SPECIFICATION &amp; ARCHITECTURE:
                                            </div>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                                                {p.description || p.excerpt}
                                            </p>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono, monospace)', color: 'var(--cyber-cyan)', marginBottom: '0.6rem' }}>
                                                FULL TECHNOLOGY STACK:
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.4rem' }}>
                                                {p.stack?.map((tech) => (
                                                    <span key={tech} className="tech-badge-cyber">
                                                        <TechIcon name={tech} size={14} />
                                                        <span>{tech}</span>
                                                    </span>
                                                ))}
                                            </div>

                                            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', paddingTop: '0.4rem' }}>
                                                <Link
                                                    to={`/project/${p.id}`}
                                                    className="cyber-action-btn primary"
                                                    style={{ padding: '0.45rem 1rem', fontSize: '0.78rem' }}
                                                >
                                                    <span>FULL VIEW</span>
                                                </Link>

                                                {p.repo && (
                                                    <a
                                                        href={p.repo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="cyber-action-btn secondary"
                                                        style={{ padding: '0.45rem 1rem', fontSize: '0.78rem' }}
                                                    >
                                                        <span>GITHUB</span>
                                                        <ExternalLinkIcon />
                                                    </a>
                                                )}

                                                {p.url && (
                                                    <a
                                                        href={p.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="cyber-action-btn secondary"
                                                        style={{ padding: '0.45rem 1rem', fontSize: '0.78rem' }}
                                                    >
                                                        <span>WEBSITE</span>
                                                        <ExternalLinkIcon />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
                    <Link to="/projects" className="cyber-action-btn secondary">
                        <TerminalIcon />
                        <span>SEARCH &amp; VIEW ALL PROJECTS ({projects.length}) →</span>
                    </Link>
                </div>
            </section>

            {/* EXPERIENCE SECTION */}
            <section id="experience" className="section">
                <div className="section-header">
                    <div className="section-tag-hpc">
                        <span className="section-tag-dot" />
                        <span>CAREER &amp; CONTRIBUTIONS</span>
                    </div>
                    <h2 className="section-title">Work Experience</h2>
                    <p className="section-subtitle">
                        Click any role to view key accomplishments and technical responsibilities.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {experience.map((exp) => {
                        const isExpanded = expandedExpId === exp.id
                        return (
                            <div
                                key={exp.id}
                                className={`cyber-card ${isExpanded ? 'expanded' : ''}`}
                                onClick={(e) => toggleExpExpand(exp.id, e)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                                            {exp.role}
                                        </h3>
                                        <div style={{ fontSize: '1.05rem', color: 'var(--cyber-cyan)', marginTop: '0.3rem', fontWeight: 500 }}>
                                            {exp.org}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', padding: '0.35rem 0.8rem', borderRadius: '4px' }}>
                                            {exp.period} · ({exp.duration})
                                        </span>
                                        <ChevronDownIcon rotated={isExpanded} />
                                    </div>
                                </div>

                                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.65, margin: 0 }}>
                                    {exp.summary}
                                </p>

                                {/* Expanded highlights and tools */}
                                <div className={`card-expand-body ${isExpanded ? 'open' : ''}`}>
                                    <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono, monospace)', color: 'var(--cyber-cyan)', marginBottom: '0.9rem' }}>
                                        KEY ACHIEVEMENTS &amp; WORKFLOWS:
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                        {exp.highlights.map((point: string, idx: number) => (
                                             <div key={idx} style={{ display: 'flex', gap: '0.8rem', fontSize: '0.94rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                                <span style={{ color: 'var(--cyber-cyan)', fontWeight: 700 }}>•</span>
                                                <span>{point}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ marginBottom: '1.4rem' }}>
                                        <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono, monospace)', color: 'var(--cyber-cyan)', marginBottom: '0.6rem' }}>
                                            STACK &amp; ENVIRONMENT:
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                                            {exp.stack?.map((tech: string) => (
                                                <span key={tech} className="tech-badge-cyber">
                                                    <TechIcon name={tech} size={14} />
                                                    <span>{tech}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <Link
                                        to={`/experience/${exp.id}`}
                                        className="cyber-action-btn primary"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ padding: '0.5rem 1.1rem', fontSize: '0.82rem', display: 'inline-flex' }}
                                    >
                                        <span>VIEW DETAILS →</span>
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* SKILLS SECTION (INTERACTIVE) */}
            <section id="skills" className="section">
                <div className="section-header">
                    <div className="section-tag-hpc">
                        <span className="section-tag-dot" />
                        <span>COMPETENCY MATRIX</span>
                    </div>
                    <h2 className="section-title">Core Skills</h2>
                    <p className="section-subtitle">
                        Filter by category to explore technical proficiencies, frameworks, and tools.
                    </p>
                </div>

                {/* Interactive Category Filter Pills */}
                <div className="cyber-filter-pills" style={{ marginBottom: '2.5rem' }}>
                    {skillCategories.map((cat) => (
                        <button
                            key={cat}
                            className={`cyber-filter-pill ${selectedSkillCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedSkillCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="skills-card-grid" style={{ marginBottom: '3.5rem' }}>
                    {filteredSkills.map((skill) => (
                        <div key={skill.id} className="skill-playing-card">
                            <div>
                                <div className="skill-card-top">
                                    <div className="skill-glyph-wrapper">
                                        <SkillGlyph id={skill.id} />
                                    </div>
                                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 800, color: 'var(--cyber-cyan)', fontSize: '1.2rem' }}>
                                        {skill.level}%
                                    </span>
                                </div>

                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
                                    {skill.name}
                                </h3>
                                <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono, monospace)', color: 'var(--cyber-blue)', marginBottom: '0.9rem' }}>
                                    [{skill.category.toUpperCase()}]
                                </div>

                                <div style={{ height: '6px', background: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden', marginBottom: '1rem' }}>
                                    <div
                                        style={{
                                            height: '100%',
                                            width: `${skill.level}%`,
                                            background: 'linear-gradient(90deg, var(--cyber-cyan), var(--cyber-purple))',
                                            borderRadius: '999px',
                                            boxShadow: '0 0 8px rgba(0, 242, 254, 0.4)',
                                        }}
                                    />
                                </div>

                                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                                    {skill.context}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center' }}>
                    <Link to="/skills" className="cyber-action-btn secondary">
                        <TerminalIcon />
                        <span>SEARCH ALL SKILLS &amp; CATEGORIES ({skills.length}) →</span>
                    </Link>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section id="contact" className="section">
                <div className="section-header">
                    <div className="section-tag-hpc">
                        <span className="section-tag-dot" />
                        <span>TRANSMISSION INTERFACE</span>
                    </div>
                    <h2 className="section-title">Get In Touch</h2>
                    <p className="section-subtitle">
                        Open for discussions regarding High-Performance Computing, systems tooling, and research engineering.
                    </p>
                </div>

                <div className="contact-container">
                    {/* Left: Info Card */}
                    <div className="contact-card-info">
                        <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.2rem', letterSpacing: '-0.01em' }}>
                            Direct Channels
                        </h3>

                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1rem', marginBottom: '2.5rem' }}>
                            Whether you have an inquiry, open engineering position, or software project collaboration, feel free to send a message.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'rgba(0, 242, 254, 0.1)', border: '1px solid var(--border-cyber)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyber-cyan)' }}>
                                    <MailIcon />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-dim)' }}>EMAIL</div>
                                    <a href="mailto:cisco581b@gmail.com" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600, fontSize: '1.02rem' }}>
                                        cisco581b@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'rgba(129, 140, 248, 0.1)', border: '1px solid var(--border-cyber)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyber-purple)' }}>
                                    <LinkedInIcon />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-dim)' }}>LINKEDIN</div>
                                    <a href="https://www.linkedin.com/in/abhi581b" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600, fontSize: '1.02rem' }}>
                                        linkedin.com/in/abhi581b
                                    </a>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}>
                                    <GitHubIcon />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-dim)' }}>GITHUB</div>
                                    <a href="https://github.com/CISSSCO" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600, fontSize: '1.02rem' }}>
                                        github.com/CISSSCO
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Functional Form */}
                    <form className="contact-form" onSubmit={handleFormSubmit}>
                        <input type="hidden" name="_subject" value="New message from portfolio" />

                        {/* Top Protocol Status Bar */}
                        <div className="cyber-form-telemetry-bar">
                            <span className="cyber-form-status-dot" />
                            <span>SECURE TRANSMISSION PROTOCOL · TLS ENCRYPTION READY</span>
                        </div>

                        <div className="form-group">
                            <label className="cyber-form-label" htmlFor="contact-name">
                                <span className="cyber-form-label-prefix">// 01</span>
                                <span>OPERATOR NAME</span>
                                <span className="cyber-form-req">*</span>
                            </label>
                            <div className="cyber-input-shell">
                                <span className="cyber-input-icon">👤</span>
                                <input
                                    id="contact-name"
                                    type="text"
                                    name="name"
                                    className="cyber-form-input"
                                    placeholder="e.g. Alex Mercer"
                                    required
                                    autoComplete="name"
                                />
                                <div className="cyber-input-corner-accent" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="cyber-form-label" htmlFor="contact-email">
                                <span className="cyber-form-label-prefix">// 02</span>
                                <span>COMM CHANNEL / EMAIL</span>
                                <span className="cyber-form-req">*</span>
                            </label>
                            <div className="cyber-input-shell">
                                <span className="cyber-input-icon">✉️</span>
                                <input
                                    id="contact-email"
                                    type="email"
                                    name="email"
                                    className="cyber-form-input"
                                    placeholder="name@domain.com"
                                    required
                                    autoComplete="email"
                                />
                                <div className="cyber-input-corner-accent" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="cyber-form-label" htmlFor="contact-message">
                                <span className="cyber-form-label-prefix">// 03</span>
                                <span>TELEMETRY PAYLOAD / MESSAGE</span>
                                <span className="cyber-form-req">*</span>
                            </label>
                            <div className="cyber-input-shell textarea-shell">
                                <span className="cyber-input-icon textarea-icon">⚡</span>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    rows={5}
                                    className="cyber-form-input cyber-form-textarea"
                                    placeholder="State your objective, technical inquiry, or HPC collaboration..."
                                    required
                                />
                                <div className="cyber-input-corner-accent" />
                            </div>
                        </div>

                        <button type="submit" className="cyber-action-btn primary" disabled={sending} style={{ alignSelf: 'flex-start' }}>
                            <span>{sending ? 'TRANSMITTING...' : 'TRANSMIT MESSAGE →'}</span>
                        </button>

                        {sent && (
                            <p style={{ color: '#10b981', fontSize: '0.92rem', marginTop: '0.5rem', fontFamily: 'var(--font-mono, monospace)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                                ✓ Transmission successful. Telemetry received!
                            </p>
                        )}
                    </form>
                </div>
            </section>
        </div>
    )
}
