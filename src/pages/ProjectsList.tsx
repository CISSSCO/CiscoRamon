import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import projects from '../data/projects.json'
import '../styles/home.css'

export default function ProjectsList() {
    // ✅ Always start list page at top
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
    }, [])

    return (
        <section className="section">
        <div className="list-header">
        <div style={{ marginBottom: '3rem' }}>
        <Link
        to="/"
        state={{ from: 'projects' }}
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
    ← Back to Projects
    </Link>
    </div>

    <h1 className="section-title">All Projects</h1>
    </div>

    <div className="projects-grid">
    {projects.map((p) => (
        <Link
        key={p.id}
        to={`/project/${p.id}`}
        state={{ from: 'projects' }}
        className="project-card visible"
    >
        <h3>{p.title}</h3>
        <p>{p.excerpt}</p>
        <span className="cta">View Project →</span>
        </Link>
    ))}
        </div>
        </section>
    )
}
