import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { restoreScroll } from '../app/ScrollMemory'
import '../styles/project.css'

import cerrfixDoc from '../data/docs/cerrfix.md?raw'
import gitpushDoc from '../data/docs/gitpush.md?raw'
import dotfilesDoc from '../data/docs/dotfiles.md?raw'
// later you can map dynamically

const docsMap: Record<string, string> = {
    cerrfix: cerrfixDoc,
    gitpush: gitpushDoc,
    dotfiles: dotfilesDoc
}

export default function ProjectDocsPage() {
    const { id } = useParams()
    const content = id ? docsMap[id] : null

    if (!content) {
        return <p style={{ padding: '20vh 10vw' }}>Docs not found</p>
    }

    return (
        <article className="project-page">
        {/* BACK */}
        <Link
        to={`/project/${id}`}
        onClick={restoreScroll}
        className="project-back-btn"
    >
        ← Back to Project
        </Link>

        {/* MARKDOWN */}
        <div className="markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
        </ReactMarkdown>
        </div>
        </article>
    )
}
