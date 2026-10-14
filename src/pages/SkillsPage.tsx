import skills from '../data/skills.json'
import { Link } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { restoreScroll } from '../app/ScrollMemory'
import '../styles/home.css'
import { SearchIcon, SkillGlyph } from '../ui/HeroIcons'

export default function SkillsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
    }, [])

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
            <div style={{ marginBottom: '2.5rem' }}>
                <Link
                    to="/"
                    state={{ from: 'skills' }}
                    onClick={() => restoreScroll()}
                    className="cyber-action-btn secondary"
                    style={{ textDecoration: 'none', display: 'inline-flex', padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}
                >
                    ← BACK TO HOME
                </Link>
            </div>

            <div style={{ marginBottom: '3rem' }}>
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

            {/* Interactive Search and Category Filters */}
            <div className="cyber-filter-bar">
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {filteredSkills.map((skill) => (
                        <div
                            key={skill.id}
                            className="cyber-card"
                            style={{ cursor: 'default', padding: '1.6rem' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <div className="skill-glyph-wrapper" style={{ width: '38px', height: '38px' }}>
                                        <SkillGlyph id={skill.id} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                                            {skill.name}
                                        </h3>
                                        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono, monospace)', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.25)', display: 'inline-block', marginTop: '0.3rem' }}>
                                            {skill.category}
                                        </span>
                                    </div>
                                </div>
                                <span style={{ color: '#00f2fe', fontFamily: 'var(--font-mono, monospace)', fontWeight: 800, fontSize: '1.2rem' }}>
                                    {skill.level}%
                                </span>
                            </div>

                            <div style={{ height: '7px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden', margin: '1rem 0' }}>
                                <div
                                    style={{
                                        height: '100%',
                                        width: `${skill.level}%`,
                                        background: 'linear-gradient(90deg, #00f2fe, #818cf8)',
                                        borderRadius: '999px',
                                        boxShadow: '0 0 10px rgba(0, 242, 254, 0.4)',
                                    }}
                                />
                            </div>

                            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                                {skill.context}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
