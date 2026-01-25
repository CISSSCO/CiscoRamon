import { useParams, Link, useLocation } from 'react-router-dom'
import projects from '../data/projects.json'
import '../styles/project.css'

export default function ProjectPage() {
  const { id } = useParams()
  const location = useLocation()
  const project = projects.find((p) => p.id === id)

  if (!project) return <p>Project not found</p>

  const backTarget =
    location.state?.from === 'projects' ? '/projects' : '/'

  return (
    <article className="project-page">
      <Link
        to={backTarget}
        state={{ from: 'project' }}
        className="back-btn"
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
        <p>Detailed explanation, media, demos go here.</p>
        <p style={{ height: '120vh' }} />
      </div>
    </article>
  )
}
