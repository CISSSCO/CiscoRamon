import { Link } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import projects from '../data/projects.json'
import '../styles/home.css'
import { SearchIcon, ChevronDownIcon, ExternalLinkIcon, TerminalIcon } from '../ui/HeroIcons'

export default function ProjectsList() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTopic, setSelectedTopic] = useState('All')
    const [expandedId, setExpandedId] = useState<string | null>(null)

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
    }, [])

    const topics = ['All', 'HPC / Cluster', 'Linux & Shell', 'Vim / Configs', 'Web / Python']

    const filteredProjects = useMemo(() => {
        return projects.filter((p) => {
            // Search query filter
            const matchesSearch =
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                p.stack?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

            if (!matchesSearch) return false

            // Topic filter
            if (selectedTopic === 'All') return true
            if (selectedTopic === 'HPC / Cluster') {
                return p.id === 'hpccfs' || p.stack?.some((t) => ['Slurm', 'MPI', 'OpenMPI', 'Spack', 'Rocky Linux'].includes(t))
            }
            if (selectedTopic === 'Linux & Shell') {
                return p.stack?.some((t) => t.toLowerCase().includes('bash') || t.toLowerCase().includes('linux') || t.toLowerCase().includes('yaml'))
            }
            if (selectedTopic === 'Vim / Configs') {
                return p.id === 'myvimrc' || p.id === 'dotfiles' || p.stack?.some((t) => t.toLowerCase().includes('vim'))
            }
            if (selectedTopic === 'Web / Python') {
                return p.stack?.some((t) => ['Python', 'FastAPI', 'React', 'TypeScript', 'HTML', 'CSS', 'JavaScript'].includes(t))
            }

            return true
        })
    }, [searchQuery, selectedTopic])

    const toggleExpand = (id: string, e: React.MouseEvent) => {
        if ((e.target as HTMLElement).tagName.toLowerCase() === 'a') {
            return
        }
        setExpandedId((prev) => (prev === id ? null : id))
    }

    return (
        <section className="section" style={{ maxWidth: '1240px', margin: '0 auto', padding: '10vh 1.5rem 15vh' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <Link
                    to="/"
                    className="cyber-action-btn secondary"
                    style={{ textDecoration: 'none', display: 'inline-flex', padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}
                >
                    ← BACK TO HOME
                </Link>
            </div>

            <div style={{ marginBottom: '3rem' }}>
                <div className="section-tag-hpc">
                    <span className="section-tag-dot" />
                    <span>CATALOG &amp; REGISTRY</span>
                </div>
                <h1 style={{ fontSize: '3.2rem', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 0.8rem' }}>
                    All Projects &amp; Systems
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '680px', lineHeight: 1.65 }}>
                    Search through open source tools, HPC cluster architectures, CLI utilities, and developer configurations.
                </p>
            </div>

            {/* Interactive Search and Topic Filters */}
            <div className="cyber-filter-bar">
                <div className="cyber-search-wrapper">
                    <span className="cyber-search-icon">
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        placeholder="Search by project name, description, or stack (e.g. Slurm, Python, Vim)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="cyber-search-input"
                    />
                </div>

                <div className="cyber-filter-pills">
                    {topics.map((t) => (
                        <button
                            key={t}
                            className={`cyber-filter-pill ${selectedTopic === t ? 'active' : ''}`}
                            onClick={() => setSelectedTopic(t)}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Count Indicator */}
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: '#64748b', marginBottom: '1.8rem' }}>
                SHOWING {filteredProjects.length} OF {projects.length} PROJECTS
            </div>

            {filteredProjects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 1rem', background: 'rgba(13, 18, 30, 0.5)', borderRadius: '14px', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                    <div style={{ fontSize: '1.3rem', color: '#94a3b8', marginBottom: '0.8rem' }}>
                        No projects matched your search criteria
                    </div>
                    <button
                        onClick={() => {
                            setSearchQuery('')
                            setSelectedTopic('All')
                        }}
                        className="cyber-action-btn secondary"
                    >
                        CLEAR FILTERS
                    </button>
                </div>
            ) : (
                <div className="projects-grid">
                    {filteredProjects.map((p) => {
                        const isExpanded = expandedId === p.id
                        return (
                            <div
                                key={p.id}
                                className={`cyber-card ${isExpanded ? 'expanded' : ''}`}
                                onClick={(e) => toggleExpand(p.id, e)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                                        {p.title}
                                    </h3>
                                    <div style={{ color: '#00f2fe', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontFamily: 'var(--font-mono, monospace)' }}>
                                        <span>{isExpanded ? 'COLLAPSE' : 'EXPAND'}</span>
                                        <ChevronDownIcon rotated={isExpanded} />
                                    </div>
                                </div>

                                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
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

                                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.4rem' }}>
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

                                                <Link
                                                    to={`/project/${p.id}/docs`}
                                                    state={{ from: 'projects' }}
                                                    className="cyber-action-btn secondary"
                                                    style={{ padding: '0.45rem 1rem', fontSize: '0.78rem' }}
                                                >
                                                    <TerminalIcon />
                                                    <span>DOCS</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </section>
    )
}
