import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import experiences from '../data/experience.json'
import '../styles/project.css'
import { restoreScroll } from '../app/ScrollMemory'
import { useSectionIndex } from '../app/SectionIndexContext'

export default function ExperiencePage() {
  const { id } = useParams()
  const { setIndex } = useSectionIndex()

  const experience = experiences.find((e) => e.id === id)

  // ✅ Always start detail page at top + sync orb
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    setIndex(2) // EXPERIENCE section
  }, [setIndex])

  if (!experience) {
    return (
      <p style={{ padding: '20vh 10vw' }}>
        Experience not found
      </p>
    )
  }

  return (
    <article className="project-page">
      {/* ✅ INLINE BACK BUTTON (WORKING VERSION) */}
      <div style={{ marginBottom: '4rem' }}>
        <Link
          to="/"
          state={{ from: 'experience' }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.2rem',
            borderRadius: '999px',
            background: 'rgba(79,107,255,0.15)',
            color: '#fff',
            fontSize: '0.95rem',
            fontWeight: 500,
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease'
          }}
          onClick={() => {
            restoreScroll()
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-4px)'
            e.currentTarget.style.boxShadow =
              '0 12px 30px rgba(79,107,255,0.35)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          ← Back
        </Link>
      </div>

      {/* ROLE */}
      <h1>{experience.role}</h1>

      {/* ORG + PERIOD */}
      <p className="project-description">
        {experience.org} · {experience.period}
      </p>

      {/* SUMMARY */}
      {experience.summary && (
        <p
          style={{
            maxWidth: '640px',
            marginBottom: '3rem',
            lineHeight: 1.6,
            opacity: 0.9
          }}
        >
          {experience.summary}
        </p>
      )}

      {/* HIGHLIGHTS */}
      <div
        style={{
          maxWidth: '640px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '4rem'
        }}
      >
        {experience.highlights.map((point: string) => (
          <div
            key={point}
            style={{
              padding: '1rem 1.2rem',
              borderRadius: '14px',
              background: 'rgba(20, 20, 20, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              fontSize: '0.95rem',
              lineHeight: 1.6
            }}
          >
            {point}
          </div>
        ))}
      </div>

      {/* STACK */}
      {experience.stack && (
        <ul className="stack">
          {experience.stack.map((tech: string) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      )}
    </article>
  )
}
