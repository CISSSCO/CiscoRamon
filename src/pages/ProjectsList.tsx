import { Link } from 'react-router-dom'
import projects from '../data/projects.json'
import '../styles/home.css'

export default function ProjectsList() {
  return (
    <section className="section">
      <div className="list-header">
        <Link to="/" state={{ from: 'project-list' }} className="back-btn">
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
