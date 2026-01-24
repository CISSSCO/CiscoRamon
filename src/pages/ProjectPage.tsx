import { useParams, Link } from 'react-router-dom'
import { projects } from '../data/projects'
import '../styles/project.css'

export default function ProjectPage() {
  const { id } = useParams()
  const project = projects.find((p) => p.id === id)

  if (!project) return <p>Project not found</p>

  return (
    <article className="project-page">
      {/* 👇 tell Home that we’re returning */}
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
          This section scrolls independently while the
          Three.js environment remains alive in the background.
        </p>

        <p>
          Add images, videos, explanations, or demos here.
        </p>

        <p style={{ height: '120vh' }}>
          (Intentional scroll space)
        </p>
      </div>
    </article>
  )
}
