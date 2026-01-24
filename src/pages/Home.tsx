import { Link } from 'react-router-dom'
import '../styles/home.css'
import { useOrbState } from '../app/OrbStateContext'
import { useEffect, useRef } from 'react'
import { saveScroll, restoreScroll } from '../app/ScrollMemory'

const projects = [
  {
    id: 'one',
    title: 'Project One',
    description: 'Experimental systems exploring visuals and interaction.'
  },
  {
    id: 'two',
    title: 'Project Two',
    description: 'Procedural form, spatial composition, and shaders.'
  },
  {
    id: 'three',
    title: 'Project Three',
    description: 'Creative tooling and developer experience.'
  }
]

export default function Home() {
  const { setMode } = useOrbState()
  const cardsRef = useRef<HTMLAnchorElement[]>([])

  // ✅ Restore scroll when coming back from project page
  useEffect(() => {
    restoreScroll()
  }, [])

  // ✅ Reveal cards on scroll
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
          {projects.map((p, i) => (
            <Link
              key={p.id}
              ref={(el) => {
                if (el) cardsRef.current[i] = el
              }}
              to={`/project/${p.id}`}
              className="project-card"
              onClick={saveScroll}          // ✅ SAVE SCROLL
              onMouseEnter={() => setMode('project')}
              onMouseLeave={() => setMode('idle')}
            >
              <h3>{p.title}</h3>
              <p>{p.description}</p>
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
