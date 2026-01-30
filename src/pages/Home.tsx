import { Link, useLocation } from 'react-router-dom'
import '../styles/home.css'
import { useOrbState } from '../app/OrbStateContext'
import { useEffect, useRef } from 'react'
import { saveScroll, restoreScroll } from '../app/ScrollMemory'
import projects from '../data/projects.json'
import { useSectionIndex } from '../app/SectionIndexContext'
import * as THREE from 'three'
import { useState } from 'react'
import experience from '../data/experience.json'
import skills from '../data/skills.json'
import { GitHubIcon, LinkedInIcon, MailIcon } from '../ui/HeroIcons'

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
            location.state?.from === 'projects' ||
            location.state?.from === 'experience' ||
            location.state?.from === 'skills' 
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
        <h1 className="hero-name">Hi,</h1>
        <h1 className="hero-name">
        I’m{' '}
        <span className="hero-name-first">Abhishek</span>{' '}
        <span className="hero-name-last">Raj</span>.
        </h1>

        {/*
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
          */}

        <p className="hero-tagline">
        Scientific Programmer · Creative Developer · Linux Enthusiast
        </p>

        <div className="hero-links">
        <a
        href="https://github.com/CISSSCO"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
    >
        <GitHubIcon />
        GitHub
        </a>

        <a
        href="https://www.linkedin.com/in/abhi581b"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
    >
        <LinkedInIcon />
        LinkedIn
        </a>

        <a
        href="mailto:cisco581b@email.com"
        aria-label="Email"
    >
        <MailIcon />
        Email
        </a>
        </div>
        <p style={{ marginTop: '1.8rem' }}>
        <Link
        to="/about"
        state={{ from: 'home' }}
        onClick={() => saveScroll()}
        className="about-cta"
    >
        Want to know more about me →
        </Link>
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

    <div className="experience-list">
    {experience.map((exp) => (
        <Link
        to={`/experience/${exp.id}`}
        state={{ from: 'experience' }}
        onClick={() => {
            saveScroll()
            window.scrollTo(0, 0)
        }}
        className="experience-card"
    >
        <h3>{exp.role}</h3>
        <p className="experience-org">{exp.org}</p>
        <p className="experience-duration">{exp.duration}</p>
        <p className="experience-summary">{exp.summary}</p>

        <span className="cta">View details →</span>
        </Link>
    ))}
        </div>
        </section>

        {/* SKILLS PREVIEW */}
        <section className="section skills-preview" data-section="3">
        <h2 className="section-title skills-section">Top Skills</h2>

        {skills
            .filter((s) => s.featured)
            .slice(0, 6)
            .map((skill) => (
                <div key={skill.id} className="skill-row">
                <div className="skill-header">
                <span>{skill.name}</span>
                <span>{skill.level}%</span>
                </div>

                <div className="skill-bar">
                <div
                className="skill-fill"
                style={{ '--level': skill.level / 100 } as React.CSSProperties}
                />
                </div>

                <p className="skill-context">{skill.context}</p>
                </div>
            ))}

        <div className="show-all-wrapper">
        <Link
        to="/skills"
        state={{ from: 'skills' }}
        className="show-all-btn"
        onClick={saveScroll}
    >
        View all skills →
        </Link>
        </div>
        </section>
        {/* CONTACT */}

        <section className="section contact" data-section="4">
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
