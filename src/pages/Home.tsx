import { Link, useLocation } from 'react-router-dom'
import '../styles/home.css'
import { useOrbState } from '../app/OrbStateContext'
import { useEffect, useRef } from 'react'
import { saveScroll, restoreScroll } from '../app/ScrollMemory'
import projects from '../data/projects.json'
import { useSectionIndex } from '../app/SectionIndexContext'
import * as THREE from 'three'
import { useState } from 'react'

export default function Home() {
  const { setMode, setColor } = useOrbState()
  const location = useLocation()
  const cardsRef = useRef<HTMLAnchorElement[]>([])
  const { setIndex } = useSectionIndex()
  const [sent, setSent] = useState(false)

  /* ===============================
     SECTION OBSERVER
  =============================== */
  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = Number(
              (entry.target as HTMLElement).dataset.section
            )
            setIndex(i)
          }
        })
      },
      { threshold: 0.6 }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [setIndex])

  /* ===============================
     SCROLL RESTORE
  =============================== */
  useEffect(() => {
    if (
      location.state?.from === 'project' ||
      location.state?.from === 'projects'
    ) {
      restoreScroll()
    }
  }, [location.state])

  /* ===============================
     CARD REVEAL
  =============================== */
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

  /* ===============================
     PROJECT COLORS
  =============================== */
  const projectColors: Record<string, THREE.Color> = {
    cerrfix: new THREE.Color('#4f6bff'),
    gitpush: new THREE.Color('#6b8bff'),
    dotfiles: new THREE.Color('#7f8cff'),
    myvimrc: new THREE.Color('#5a6cff')
  }

  const selectedProjects = projects.slice(0, 3)

  return (
    <>
      {/* HERO */}
      <section className="section hero" data-section="0">
        <h1>Hi,</h1>
        <h1>I’m Abhishek Raj.</h1>

        <h2 className="hero-subtitle">
          Also known as <strong>Cisco Ramon</strong> —
          <a
            href="https://github.com/CISSSCO"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </h2>

        <p>
          Scientific Programmer · Creative Developer · Linux Enthusiast
        </p>
      </section>

      {/* PROJECTS */}
      <section className="section" data-section="1">
        <h2 className="section-title">Projects</h2>

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
              onMouseEnter={() => {
                setMode('project')
                setColor(projectColors[p.id] ?? null)
              }}
              onMouseLeave={() => {
                setMode('idle')
                setColor(null)
              }}
            >
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
              <span className="cta">View Project →</span>
            </Link>
          ))}
        </div>

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
      <section className="section" data-section="2">
        <h2 className="section-title">Experience</h2>
        <p>Frontend · Creative Dev · Three.js · Systems</p>
      </section>

        {/* CONTACT */}
        <section className="section contact" data-section="3">
          <h2 className="section-title">Contact</h2>

          <p className="contact-intro">
            Let’s build something useful.
          </p>

<form
  className="contact-form"
  onSubmit={async (e) => {
    e.preventDefault()

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch(
        'https://formspree.io/f/xeegawka', // 👈 FIX THIS
        {
          method: 'POST',
          body: data,
          headers: {
            Accept: 'application/json'
          }
        }
      )

      const json = await res.json()

      if (!res.ok) {
        console.error('Formspree error:', json)
        alert('Something went wrong. Please try again.')
        return
      }

      form.reset()
      setSent(true)

      setTimeout(() => setSent(false), 4000)
    } catch (err) {
      console.error(err)
      alert('Network error. Please try again later.')
    }
  }}
>
  {/* 👇 Optional but recommended */}
  <input type="hidden" name="_subject" value="New message from portfolio" />

  <input
    type="text"
    name="name"
    placeholder="Your name"
    required
  />

  <input
    type="email"
    name="email"
    placeholder="Your email"
    required
  />

  <textarea
    name="message"
    rows={5}
    placeholder="What do you want to talk about?"
    required
  />

  <button type="submit">
    Send message →
  </button>

  {sent && (
    <p className="contact-success">
      Message sent. I’ll get back to you ✨
    </p>
  )}
</form>
        </section>
    </>
  )
}
