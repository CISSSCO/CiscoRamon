import skills from '../data/skills.json'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { restoreScroll } from '../app/ScrollMemory'
import '../styles/skills.css'

export default function SkillsPage() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
    }, [])

    return (
        <section className="section skills-page">
        {/* BACK BUTTON */}
        <div style={{ marginBottom: '3rem' }}>
        <Link
        to="/"
        state={{ from: 'skills' }}
        onClick={() => restoreScroll()}
        style={{
            display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                borderRadius: '999px',
                background: 'rgba(79,107,255,0.15)',
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: 500,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-4px)'
            e.currentTarget.style.boxShadow =
                '0 12px 30px rgba(79,107,255,0.35)'
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)'
            e.currentTarget.style.boxShadow = 'none'
        }}
        >
    ← Back
    </Link>
    </div>

    <h1 className="section-title">Skills</h1>

    {Array.from(new Set(skills.map((s) => s.category))).map(
        (category) => (
            <div key={category} className="skills-group">
            <h3>{category}</h3>

            {skills
                .filter((s) => s.category === category)
                .map((skill) => (
                    <div key={skill.id} className="skill-row">
                    <div className="skill-header">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                    </div>

                    <div className="skill-bar">
                    <div
                    className="skill-fill"
                    style={{ width: `${skill.level}%` }}
                    />
                    </div>

                    <p className="skill-context">
                    {skill.context}
                    </p>
                    </div>
                ))}
            </div>
        )
    )}
        </section>
    )
}
