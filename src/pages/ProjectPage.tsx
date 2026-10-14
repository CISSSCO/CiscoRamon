import { useParams, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import projects from '../data/projects.json'
import '../styles/home.css'
import { restoreScroll } from '../app/ScrollMemory'
import { ExternalLinkIcon, TerminalIcon } from '../ui/HeroIcons'

export default function ProjectPage() {
    const { id } = useParams()
    const location = useLocation()
    const project = projects.find((p) => p.id === id)

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
    }, [])

    if (!project) {
        return (
            <div className="section" style={{ textAlign: 'center', padding: '15vh 1rem' }}>
                <h2 style={{ fontSize: '2rem', color: '#fff' }}>Project Not Found</h2>
                <Link to="/projects" className="cyber-action-btn secondary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                    ← BACK TO PROJECTS
                </Link>
            </div>
        )
    }

    const backTarget = location.state?.from === 'projects' ? '/projects' : '/'

    return (
        <article className="section" style={{ maxWidth: '1000px', margin: '0 auto', padding: '10vh 1.5rem 15vh' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <Link
                    to={backTarget}
                    className="cyber-action-btn secondary"
                    onClick={() => restoreScroll()}
                    style={{ textDecoration: 'none', display: 'inline-flex', padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}
                >
                    ← {location.state?.from === 'projects' ? 'BACK TO PROJECTS' : 'BACK TO HOME'}
                </Link>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
                <div className="section-tag-hpc">
                    <span className="section-tag-dot" />
                    <span>PROJECT REPOSITORY // {project.id.toUpperCase()}</span>
                </div>

                <h1 style={{ fontSize: '3.4rem', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 1rem', color: '#fff' }}>
                    {project.title}
                </h1>

                <p style={{ fontSize: '1.18rem', lineHeight: 1.75, color: '#cbd5e1', maxWidth: '750px', margin: 0 }}>
                    {project.description || project.excerpt}
                </p>
            </div>

            {/* Stack Section */}
            <div style={{ marginBottom: '3rem', padding: '1.8rem', borderRadius: '16px', background: 'rgba(13, 18, 30, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: '#00f2fe', marginBottom: '1rem', fontWeight: 700 }}>
                    SYSTEMS &amp; TECHNOLOGIES:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                    {project.stack.map((tech) => (
                        <span key={tech} className="tech-badge-cyber" style={{ fontSize: '0.82rem', padding: '0.35rem 0.8rem' }}>
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
                {project.repo && (
                    <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cyber-action-btn primary"
                    >
                        <span>VISIT GITHUB REPOSITORY</span>
                        <ExternalLinkIcon />
                    </a>
                )}

                {project.url && (
                    <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cyber-action-btn secondary"
                    >
                        <span>VISIT PROJECT WEBSITE</span>
                        <ExternalLinkIcon />
                    </a>
                )}

                <Link
                    to={`/project/${project.id}/docs`}
                    state={{ from: 'project' }}
                    className="cyber-action-btn secondary"
                >
                    <TerminalIcon />
                    <span>READ DOCUMENTATION</span>
                </Link>
            </div>
        </article>
    )
}
