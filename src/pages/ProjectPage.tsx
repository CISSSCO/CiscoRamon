import { useParams, Link } from 'react-router-dom'
import { projects } from '../data/projects'
import '../styles/project.css'
import { useEffect } from 'react'

export default function ProjectPage() {
  const { id } = useParams()
  const project = projects.find((p) => p.id === id)

  // ✅ Ensure project page always starts at top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  if (!project) return <p>Project not found</p>

  return (
    <article className="project-page">
      <Link to="/" state={{ fromProject: true }} className="back-link">
        ← Back
      </Link>

      <h1>{project.title}</h1>

      <p className="project-description">
        {project.description}
      </p>

      <ul className="stack">
        {project.stack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>

      <div className="project-content">
        <p>
          This page scrolls independently while the
          Three.js orb remains alive in the background.
        </p>

        <p style={{ height: '120vh' }}>
          (Intentional scroll space)
        </p>
      </div>
    </article>
  )
}
