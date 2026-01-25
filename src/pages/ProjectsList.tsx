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
        <Link
          to="/"
          className="back-btn list-back"
          state={{ from: 'projects' }}
        >
          ← Back to Selected Projects
        </Link>

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
