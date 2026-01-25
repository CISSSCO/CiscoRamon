import { useParams, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import projects from '../data/projects.json'
import '../styles/project.css'

export default function ProjectPage() {
  const { id } = useParams()
  const location = useLocation()
  const project = projects.find((p) => p.id === id)

  // ✅ Always start project page at top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  if (!project) return <p>Project not found</p>

  const backTarget =
    location.state?.from === 'projects' ? '/projects' : '/'

  const backState =
    location.state?.from === 'projects'
      ? { from: 'project' }
      : { from: 'project' }

  return (
    <article className="project-page">
    <div style={{ marginBottom: '4rem' }}>
      <Link
        to={backTarget}
        state={backState}
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

      <h1>{project.title}</h1>

      <p className="project-description">
        {project.description}
      </p>

      <ul className="stack">
        {project.stack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>

      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="project-link"
        >
          Visit Project Website →
        </a>
      )}

      <div className="project-content">
        <p>
          This section scrolls independently while the 3D
          environment remains alive in the background.
        </p>

        <p style={{ height: '120vh' }} />
      </div>
    </article>
  )
}
