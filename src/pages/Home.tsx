import { Link, useLocation } from 'react-router-dom'
import '../styles/home.css'
import { useOrbState } from '../app/OrbStateContext'
import { useEffect, useRef } from 'react'
import { saveScroll, restoreScroll } from '../app/ScrollMemory'
import projects from '../data/projects.json'

export default function Home() {
  const { setMode } = useOrbState()
  const location = useLocation()
  const cardsRef = useRef<HTMLAnchorElement[]>([])

  /**
   * ✅ Restore scroll ONLY when returning from project or project list
   */
  useEffect(() => {
    if (
      location.state?.from === 'project' ||
      location.state?.from === 'projects'
    ) {
      restoreScroll()
    }
  }, [location.state])

  /**
   * ✅ Reveal cards on scroll
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.2 }
    )

    cardsRef.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const selectedProjects = projects.slice(0, 3)

  return (
    <>
      {/* HERO */}
      <section className="section hero">
        <h1>Hi, I’m Abhi.</h1>
        <p>Creative developer focused on 3D & systems.</p>
      </section>

      {/* SELECTED PROJECTS */}
      <section className="section">
        <h2 className="section-title">Selected Projects</h2>

        <div className="projects-grid">
          {selectedProjects.map((p, i) => (
            <Link
              key={p.id}
              ref={(el) => {
                if (el) cardsRef.current[i] = el
              }}
              to={`/project/${p.id}`}
              state={{ from: 'home' }}
              className="project-card"
              onClick={() => {
                saveScroll()
                window.scrollTo(0, 0)
              }}
              onMouseEnter={() => setMode('project')}
              onMouseLeave={() => setMode('idle')}
            >
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
              <span className="cta">View Project →</span>
            </Link>
          ))}
        </div>

        {/* SHOW ALL */}
        <div className="show-all">
          <Link
            to="/projects"
            state={{ from: 'home' }}
            className="show-all-btn"
            onClick={() => {
              saveScroll()
              window.scrollTo(0, 0)
            }}
          >
            Show all projects →
          </Link>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="section">
        <h2 className="section-title">Experience</h2>
        <p>Frontend · Creative Dev · Three.js · Systems</p>
      </section>

      {/* CONTACT */}
      <section className="section">
        <h2 className="section-title">Contact</h2>
        <p>abhi@email.com</p>
      </section>
    </>
  )
}
