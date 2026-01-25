import { useParams, Link } from 'react-router-dom'
import projects from '../data/projects.json'
import '../styles/project.css'

export default function ProjectPage() {
  const { id } = useParams()
  const project = projects.find((p) => p.id === id)

  if (!project) {
    return (
      <article className="project-page">
        <Link to="/" className="back-link">← Back</Link>
        <h1>Project not found</h1>
      </article>
    )
  }

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
          This page is fully data-driven. Add content, images, videos,
          or demos here.
        </p>

        <p style={{ height: '120vh' }}>
          (Intentional scroll space)
        </p>
      </div>
    </article>
  )
}
