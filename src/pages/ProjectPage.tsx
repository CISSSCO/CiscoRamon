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
      <Link
        to={backTarget}
        state={backState}
        className="back-btn project-back"
      >
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
