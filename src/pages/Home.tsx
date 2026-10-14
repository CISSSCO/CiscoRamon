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
        () => projects.filter((p) => p.featured || ['hpccfs', 'cerrfix', 'dotfiles', 'playlisto'].includes(p.id)),
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
        // Prevent expanding if clicking an explicit anchor tag
        if ((e.target as HTMLElement).tagName.toLowerCase() === 'a') {
            return
        }
        setExpandedProjectId((prev) => (prev === id ? null : id))
    }

    const toggleExpExpand = (id: string, e: React.MouseEvent) => {
        if ((e.target as HTMLElement).tagName.toLowerCase() === 'a') {
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
                    <span>::</span>
                    <span>CALLSIGN: CISCO_RAMON</span>
                    <span>::</span>
                    <span>READY</span>
                </div>

                <div className="hero-salutation">
                    <span style={{ color: '#00f2fe' }}>&gt;</span>
                    <WritingText text="Hi, I'm" startDelay={0.1} />
                    <span className="cyber-cursor" />
                </div>

                <h1 className="hero-name-futuristic">
                    <WritingText text="Abhishek Raj" startDelay={0.4} charDelay={0.045} />
                </h1>

                <div className="hero-tagline-futuristic">
                    <span>
                        <WritingText text="Scientific Programmer" startDelay={1.0} charDelay={0.03} />
                    </span>
                    <span style={{ color: '#00f2fe' }}>·</span>
                    <span className="hero-tagline-accent">
                        <WritingText text="HPC Engineer" startDelay={1.65} charDelay={0.03} />
                    </span>
                    <span style={{ color: '#00f2fe' }}>·</span>
                    <span>
                        <WritingText text="Systems Developer" startDelay={2.1} charDelay={0.03} />
                    </span>
                </div>

                <p className="hero-bio-futuristic">
                    HPC Application Engineer @ IIT (BHU), Varanasi &amp; Project Engineer @ C-DAC (R&amp;D). Designing and maintaining high-performance parallel computing environments, Linux systems architectures, and open-source tooling.
                </p>

                <div className="hero-actions-futuristic">
                    <a href="#projects" className="cyber-action-btn primary">
                        <TerminalIcon />
                        <span>EXPLORE PROJECTS</span>
                    </a>

                    <a
                        href={resume}
                        download="AbhishekRaj.pdf"
                        className="cyber-action-btn secondary"
                    >
                        <DownloadIcon />
                        <span>DOWNLOAD RESUME</span>
                    </a>

                    <a
                        href="https://github.com/CISSSCO"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cyber-icon-btn"
                        aria-label="GitHub Profile"
                    >
                        <GitHubIcon />
                    </a>

                    <a
                        href="https://www.linkedin.com/in/abhi581b"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cyber-icon-btn"
                        aria-label="LinkedIn Profile"
                    >
                        <LinkedInIcon />
                    </a>

                    <a
                        href="mailto:abhi581b@gmail.com"
                        className="cyber-icon-btn"
                        aria-label="Email Me"
                    >
                        <MailIcon />
                    </a>
                </div>

                {/* FUTURISTIC STATS HUD */}
                <div className="hero-hud-grid">
                    <div className="hud-item">
                        <span className="hud-index">01 // EXPERIENCE</span>
                        <span className="hud-val">2.5+ Yrs</span>
                        <span className="hud-lbl">C-DAC &amp; IIT (BHU) Systems</span>
                    </div>
                    <div className="hud-item">
                        <span className="hud-index">02 // REPOSITORIES</span>
                        <span className="hud-val">8+ Projects</span>
                        <span className="hud-lbl">Open Source Infrastructure</span>
                    </div>
                    <div className="hud-item">
                        <span className="hud-index">03 // TOOLCHAINS</span>
                        <span className="hud-val">C · MPI · CUDA</span>
                        <span className="hud-lbl">Parallel Computing &amp; Linux</span>
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
                        Click any card to expand full technical details, stack specifications, and direct repository links.
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
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                                    <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                                        {p.title}
                                    </h3>
                                    <div style={{ color: '#00f2fe', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontFamily: 'var(--font-mono, monospace)' }}>
                                        <span>{isExpanded ? 'COLLAPSE' : 'EXPAND'}</span>
                                        <ChevronDownIcon rotated={isExpanded} />
                                    </div>
                                </div>

                                <p style={{ color: '#94a3b8', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                                    {p.excerpt}
                                </p>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.5rem' }}>
                                    {p.stack?.slice(0, 4).map((tech) => (
                                        <span key={tech} className="tech-badge-cyber">
                                            {tech}
                                        </span>
                                    ))}
                                    {p.stack && p.stack.length > 4 && (
                                        <span className="tech-badge-cyber" style={{ color: '#38bdf8' }}>
                                            +{p.stack.length - 4} more
                                        </span>
                                    )}
                                </div>

                                {/* Animated Expandable Body */}
                                <div className={`card-expand-body ${isExpanded ? 'open' : ''}`}>
                                    <div className="expanded-horizontal-content">
                                        <div>
                                            <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono, monospace)', color: '#00f2fe', marginBottom: '0.6rem' }}>
                                                TECHNICAL SPECIFICATION &amp; ARCHITECTURE:
                                            </div>
                                            <p style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                                                {p.description || p.excerpt}
                                            </p>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono, monospace)', color: '#00f2fe', marginBottom: '0.6rem' }}>
                                                FULL TECHNOLOGY STACK:
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.4rem' }}>
                                                {p.stack?.map((tech) => (
                                                    <span key={tech} className="tech-badge-cyber">
                                                        {tech}
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
                        Click any role to expand key accomplishments and technical responsibilities.
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
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                                            {exp.role}
                                        </h3>
                                        <div style={{ fontSize: '1.05rem', color: '#00f2fe', marginTop: '0.3rem', fontWeight: 500 }}>
                                            {exp.org}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.85rem', color: '#94a3b8', background: 'rgba(255, 255, 255, 0.06)', padding: '0.35rem 0.8rem', borderRadius: '4px' }}>
                                            {exp.period} · ({exp.duration})
                                        </span>
                                        <ChevronDownIcon rotated={isExpanded} />
                                    </div>
                                </div>

                                <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.65, margin: 0 }}>
                                    {exp.summary}
                                </p>

                                {/* Expanded highlights and tools */}
                                <div className={`card-expand-body ${isExpanded ? 'open' : ''}`}>
                                    <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono, monospace)', color: '#00f2fe', marginBottom: '0.9rem' }}>
                                        KEY ACHIEVEMENTS &amp; WORKFLOWS:
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                        {exp.highlights.map((point: string, idx: number) => (
                                            <div key={idx} style={{ display: 'flex', gap: '0.8rem', fontSize: '0.94rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                                                <span style={{ color: '#00f2fe', fontWeight: 700 }}>•</span>
                                                <span>{point}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ marginBottom: '1.4rem' }}>
                                        <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono, monospace)', color: '#00f2fe', marginBottom: '0.6rem' }}>
                                            STACK &amp; ENVIRONMENT:
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                                            {exp.stack?.map((tech: string) => (
                                                <span key={tech} className="tech-badge-cyber">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <Link
                                        to={`/experience/${exp.id}`}
                                        className="cyber-action-btn primary"
                                        style={{ padding: '0.5rem 1.1rem', fontSize: '0.82rem' }}
                                    >
                                        <span>VIEW DEDICATED SLIDING BREAKDOWN →</span>
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
                                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 800, color: '#00f2fe', fontSize: '1.2rem' }}>
                                        {skill.level}%
                                    </span>
                                </div>

                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 0.35rem' }}>
                                    {skill.name}
                                </h3>
                                <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono, monospace)', color: '#38bdf8', marginBottom: '0.9rem' }}>
                                    [{skill.category.toUpperCase()}]
                                </div>

                                <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden', marginBottom: '1rem' }}>
                                    <div
                                        style={{
                                            height: '100%',
                                            width: `${skill.level}%`,
                                            background: 'linear-gradient(90deg, #00f2fe, #818cf8)',
                                            borderRadius: '999px',
                                            boxShadow: '0 0 8px rgba(0, 242, 254, 0.5)',
                                        }}
                                    />
                                </div>

                                <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
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
                        <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', marginBottom: '1.2rem', letterSpacing: '-0.01em' }}>
                            Direct Channels
                        </h3>

                        <p style={{ color: '#cbd5e1', lineHeight: 1.7, fontSize: '1rem', marginBottom: '2.5rem' }}>
                            Whether you have an inquiry, open engineering position, or software project collaboration, feel free to send a message.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f2fe' }}>
                                    <MailIcon />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono, monospace)', color: '#64748b' }}>EMAIL</div>
                                    <a href="mailto:abhi581b@gmail.com" style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: 600, fontSize: '1.02rem' }}>
                                        abhi581b@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'rgba(129, 140, 248, 0.1)', border: '1px solid rgba(129, 140, 248, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                                    <LinkedInIcon />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono, monospace)', color: '#64748b' }}>LINKEDIN</div>
                                    <a href="https://www.linkedin.com/in/abhi581b" target="_blank" rel="noopener noreferrer" style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: 600, fontSize: '1.02rem' }}>
                                        linkedin.com/in/abhi581b
                                    </a>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                    <GitHubIcon />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono, monospace)', color: '#64748b' }}>GITHUB</div>
                                    <a href="https://github.com/CISSSCO" target="_blank" rel="noopener noreferrer" style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: 600, fontSize: '1.02rem' }}>
                                        github.com/CISSSCO
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Functional Form */}
                    <form className="contact-form" onSubmit={handleFormSubmit}>
                        <input type="hidden" name="_subject" value="New message from portfolio" />

                        <div className="form-group">
                            <label className="form-label">YOUR NAME</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                placeholder="e.g. Alex Mercer"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">EMAIL ADDRESS</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="name@domain.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">MESSAGE</label>
                            <textarea
                                name="message"
                                rows={5}
                                className="form-textarea"
                                placeholder="Write your message here..."
                                required
                            />
                        </div>

                        <button type="submit" className="cyber-action-btn primary" disabled={sending} style={{ alignSelf: 'flex-start' }}>
                            <span>{sending ? 'TRANSMITTING...' : 'TRANSMIT MESSAGE →'}</span>
                        </button>

                        {sent && (
                            <p style={{ color: '#34d399', fontSize: '0.95rem', marginTop: '0.5rem', fontFamily: 'var(--font-mono, monospace)' }}>
                                ✓ Transmission successful. Telemetry received!
                            </p>
                        )}
                    </form>
                </div>
            </section>
        </div>
    )
}
