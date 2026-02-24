import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useEffect } from 'react'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'

import 'highlight.js/styles/github-dark.css'
import '../styles/github.css'

import githubReadme from '../data/docs/github.md?raw'

import { useOrbState } from '../app/OrbStateContext'
import * as THREE from 'three'

export default function GitHubPage() {

const { setMode, setColor } = useOrbState()

useEffect(() => {
  setMode('idle')
  setColor(new THREE.Color('#0f0fdf'))

  return () => {
    // reset orb when leaving page
    setColor(null)
    setMode('idle')
  }
}, [setMode, setColor])
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  return (
    <article className="project-page github-page">
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3.5rem',
        gap: '1rem',
      }}
    >
      {/* Back to Home */}
      <Link
        to="/"
        className="project-back-btn"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 1.3rem',
          fontSize: '0.95rem',
          fontWeight: 500,
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '999px',
          background:
            'linear-gradient(135deg, rgba(79,107,255,0.35), rgba(79,107,255,0.15))',
          border: '1px solid rgba(255,255,255,0.14)',
          backdropFilter: 'blur(12px)'
        }}
      >
        ← Back to Home
      </Link>

      {/* Visit GitHub */}
      <div className="project-back-btn">
      <a
        href="https://github.com/CISSSCO"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 1.3rem',
          fontSize: '0.95rem',
          fontWeight: 500,
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '999px',
          background:
            'linear-gradient(135deg, rgba(79,107,255,0.35), rgba(79,107,255,0.15))',
          border: '1px solid rgba(255,255,255,0.14)',
          backdropFilter: 'blur(12px)'
        }}
      >
        Visit GitHub →
      </a>
      </div>
    </div>

      {/* MARKDOWN */}
      <div className="markdown">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
        >
          {githubReadme}
        </ReactMarkdown>
      </div>
    </article>
  )
}
