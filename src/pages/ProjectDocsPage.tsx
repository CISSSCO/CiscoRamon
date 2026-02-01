import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { restoreScroll } from '../app/ScrollMemory'
import '../styles/project.css'
import { useEffect } from 'react'
import cerrfixDoc from '../data/docs/cerrfix.md?raw'
import gitpushDoc from '../data/docs/gitpush.md?raw'
import dotfilesDoc from '../data/docs/dotfiles.md?raw'
import myvimrcDoc from '../data/docs/myvimrc.md?raw'
import popularwebsitethemesDoc from '../data/docs/popularwebsitethemes.md?raw'
import cissscoDoc from '../data/docs/cisssco.md?raw'

import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
// later you can map dynamically

const docsMap: Record<string, string> = {
    cerrfix: cerrfixDoc,
    gitpush: gitpushDoc,
    dotfiles: dotfilesDoc,
    myvimrc: myvimrcDoc,
    popularwebsitethemes: popularwebsitethemesDoc,
    cisssco: cissscoDoc
}

export default function ProjectDocsPage() {
    const { id } = useParams()
    const content = id ? docsMap[id] : null
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }, [])

    if (!content) {
        return <p style={{ padding: '20vh 10vw' }}>Docs not found</p>
    }

    return (
        <article className="project-page">
        {/* BACK */}
        <Link
        to={`/project/${id}`}
        className="project-back-btn"
        style={{
            display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',

                marginBottom: '3rem',
                padding: '0.6rem 1.3rem',

                fontSize: '0.95rem',
                fontWeight: 500,
                color: '#fff',
                textDecoration: 'none',

                borderRadius: '999px',
                background:
            'linear-gradient(135deg, rgba(79,107,255,0.35), rgba(79,107,255,0.15))',

                border: '1px solid rgba(255,255,255,0.14)',
                backdropFilter: 'blur(12px)',

                opacity: 0.9,
                transition:
            'transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-6px)'
            e.currentTarget.style.opacity = '1'
            e.currentTarget.style.boxShadow =
                '0 14px 36px rgba(79,107,255,0.35)'
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)'
            e.currentTarget.style.opacity = '0.9'
            e.currentTarget.style.boxShadow = 'none'
        }}
    >
    ← Back to Project
    </Link>

    {/* MARKDOWN */}
    <div className="markdown">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
    >
      {content}
    </ReactMarkdown>
    </div>
    </article>
    )
}
