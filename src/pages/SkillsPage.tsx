import skills from '../data/skills.json'
import { Link, useLocation } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { restoreScroll } from '../app/ScrollMemory'
import '../styles/home.css'
import { SearchIcon, SkillGlyph } from '../ui/HeroIcons'

export default function SkillsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const location = useLocation()

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
        const state = location.state as { filterCategory?: string } | null
        if (state?.filterCategory) {
            setSelectedCategory(state.filterCategory)
            setSearchQuery('')
        }
    }, [location.state])

    const categories = useMemo(() => {
        return ['All', ...Array.from(new Set(skills.map((s) => s.category)))]
    }, [])

    const filteredSkills = useMemo(() => {
        return skills.filter((s) => {
            const matchesSearch =
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.context.toLowerCase().includes(searchQuery.toLowerCase())

            if (!matchesSearch) return false
            if (selectedCategory === 'All') return true
            return s.category === selectedCategory
        })
    }, [searchQuery, selectedCategory])

    return (
        <section className="section" style={{ maxWidth: '1240px', margin: '0 auto', padding: '10vh 1.5rem 15vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <Link
                    to="/"
                    state={{ from: 'skills' }}
                    onClick={() => restoreScroll()}
                    className="cyber-action-btn secondary"
                    style={{ textDecoration: 'none', display: 'inline-flex', padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}
                >
                    ← BACK TO HOME
                </Link>

                <Link
                    to="/skills/visualize"
                    className="cyber-action-btn primary"
                    style={{ textDecoration: 'none', display: 'inline-flex', padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}
                >
                    <span>📊 VISUALIZE EXPERTISE &amp; 3D GRAPHS →</span>
                </Link>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
                <div className="section-tag-hpc">
                    <span className="section-tag-dot" />
                    <span>TECHNICAL COMPETENCIES</span>
                </div>
                <h1 style={{ fontSize: '3.2rem', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 0.8rem' }}>
                    Skills &amp; Technologies
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '680px', lineHeight: 1.65 }}>
                    Search and filter technical proficiencies across parallel architectures, HPC tools, system administration, and programming languages.
                </p>
            </div>

            {/* DEDICATED VISUALIZER CALLOUT BANNER */}
            <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-cyber)',
                borderRadius: '14px',
                padding: '1.4rem 1.8rem',
                marginBottom: '2.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.2rem',
                boxShadow: 'var(--card-shadow)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ maxWidth: '680px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>🎮</span>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                            Interactive 3D &amp; Multi-Plot Competency Visualizer
                        </strong>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.55, margin: 0 }}>
                        Switch to dedicated visualization engine featuring 3D competency terrain pillars, 14-domain spider radar matrices, matplotlib stem &amp; whisker plots, and frequency histograms.
                    </p>
                </div>
                <Link
                    to="/skills/visualize"
                    className="cyber-action-btn primary"
                    style={{ textDecoration: 'none', display: 'inline-flex', padding: '0.6rem 1.3rem', fontSize: '0.85rem' }}
                >
                    <span>OPEN VISUALIZER PAGE ↗</span>
                </Link>
            </div>

            {/* Interactive Search and Category Filters */}
            <div id="skills-matrix" className="cyber-filter-bar">
                <div className="cyber-search-wrapper">
                    <span className="cyber-search-icon">
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        placeholder="Search skills by name, framework, or context (e.g. MPI, CUDA, Spack, Linux)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="cyber-search-input"
                    />
                </div>

                <div className="cyber-filter-pills">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`cyber-filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Counter */}
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: '#64748b', marginBottom: '2rem' }}>
                DISPLAYING {filteredSkills.length} OF {skills.length} SKILLS
            </div>

            {filteredSkills.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 1rem', background: 'rgba(13, 18, 30, 0.5)', borderRadius: '14px', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                    <div style={{ fontSize: '1.3rem', color: '#94a3b8', marginBottom: '0.8rem' }}>
                        No skills matched your search query
                    </div>
                    <button
                        onClick={() => {
                            setSearchQuery('')
                            setSelectedCategory('All')
                        }}
                        className="cyber-action-btn secondary"
                    >
                        RESET FILTERS
                    </button>
                </div>
            ) : (
                <div className="skills-card-grid">
                    {filteredSkills.map((skill) => (
                        <div
                            key={skill.id}
                            className="skill-playing-card"
                            style={{ cursor: 'default' }}
                        >
                            <div>
                                <div className="skill-card-top">
                                    <div className="skill-glyph-wrapper">
                                        <SkillGlyph id={skill.id} />
                                    </div>
                                    <span style={{ color: 'var(--cyber-cyan)', fontFamily: 'var(--font-mono, monospace)', fontWeight: 800, fontSize: '1.2rem' }}>
                                        {skill.level}%
                                    </span>
                                </div>

                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
                                    {skill.name}
                                </h3>
                                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono, monospace)', color: 'var(--cyber-blue)', marginBottom: '0.8rem' }}>
                                    [{skill.category.toUpperCase()}]
                                </div>

                                <div style={{ height: '6px', background: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden', margin: '0.9rem 0' }}>
                                    <div
                                        style={{
                                            height: '100%',
                                            width: `${skill.level}%`,
                                            background: 'linear-gradient(90deg, var(--cyber-cyan), var(--cyber-purple))',
                                            borderRadius: '999px',
                                            boxShadow: '0 0 10px rgba(0, 242, 254, 0.4)',
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
            )}
        </section>
    )
}
