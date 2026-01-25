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

  // Restore scroll when coming back from project page
  useEffect(() => {
    if (location.state?.fromProject) {
      restoreScroll()
    }
  }, [location.state])

  // Reveal cards on scroll
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

  return (
    <>
      {/* HERO */}
      <section className="section hero">
        <h1>Hi, I’m Abhi.</h1>
        <p>Creative developer focused on 3D & systems.</p>
      </section>

      {/* PROJECTS */}
      <section className="section">
        <h2 className="section-title">Selected Projects</h2>

        <div className="projects-grid">
          {projects.map((project, i) => (
            <Link
              key={project.id}
              ref={(el) => {
                if (el) cardsRef.current[i] = el
              }}
              to={`/project/${project.id}`}
              state={{ fromHome: true }}
              className="project-card"
              onClick={() => {
                saveScroll()
                window.scrollTo(0, 0)
              }}
              onMouseEnter={() => setMode('project')}
              onMouseLeave={() => setMode('idle')}
            >
              <h3>{project.title}</h3>
              <p>{project.excerpt}</p>
              <span className="cta">View Project →</span>
            </Link>
          ))}
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
