import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useEffect, useState, Children, isValidElement, type ReactNode } from 'react'
import '../styles/project.css'
import '../styles/home.css'

import cerrfixDoc from '../data/docs/cerrfix.md?raw'
import hpccfsDoc from '../data/docs/hpccfs.md?raw'
import playlistoDoc from '../data/docs/playlisto.md?raw'
import gitpushDoc from '../data/docs/gitpush.md?raw'
import dotfilesDoc from '../data/docs/dotfiles.md?raw'
import myvimrcDoc from '../data/docs/myvimrc.md?raw'
import popularwebsitethemesDoc from '../data/docs/popularwebsitethemes.md?raw'
import cissscoDoc from '../data/docs/cisssco.md?raw'

import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

const docsMap: Record<string, string> = {
    cerrfix: cerrfixDoc,
    hpccfs: hpccfsDoc,
    playlisto: playlistoDoc,
    gitpush: gitpushDoc,
    dotfiles: dotfilesDoc,
    myvimrc: myvimrcDoc,
    popularwebsitethemes: popularwebsitethemesDoc,
    cisssco: cissscoDoc,
}

const langDisplayMap: Record<string, string> = {
    bash: 'BASH / TERMINAL',
    sh: 'SHELL',
    shell: 'SHELL',
    zsh: 'ZSH',
    python: 'PYTHON',
    py: 'PYTHON',
    c: 'C / C++',
    cpp: 'C++',
    'c++': 'C++',
    powershell: 'POWERSHELL',
    ps1: 'POWERSHELL',
    vim: 'VIMSCRIPT',
    vimscript: 'VIMSCRIPT',
    text: 'COMMAND OUTPUT',
    txt: 'TEXT',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    markdown: 'MARKDOWN',
    md: 'MARKDOWN',
    dockerfile: 'DOCKERFILE',
    make: 'MAKEFILE',
    makefile: 'MAKEFILE',
}

function extractRawText(node: any): string {
    if (!node) return ''
    if (typeof node === 'string') return node
    if (typeof node === 'number') return String(node)
    if (Array.isArray(node)) return node.map(extractRawText).join('')
    if (isValidElement(node) && node.props && (node.props as any).children) {
        return extractRawText((node.props as any).children)
    }
    return ''
}

function CodeBlock({ children, ...props }: { children?: ReactNode }) {
    const [copied, setCopied] = useState(false)

    // Inspect the inner code element if present
    const firstChild = Children.toArray(children)[0]
    let className = ''
    if (isValidElement(firstChild) && firstChild.props && typeof (firstChild.props as any).className === 'string') {
        className = (firstChild.props as any).className
    }

    const langMatch = className.match(/language-([a-zA-Z0-9_\-#+]+)/)
    const rawLang = langMatch ? langMatch[1].toLowerCase() : ''
    const displayLang = rawLang ? (langDisplayMap[rawLang] || rawLang.toUpperCase()) : 'SOURCE CODE'

    const handleCopy = async () => {
        const text = extractRawText(children).trim()
        if (!text) return
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy code: ', err)
        }
    }

    return (
        <div className="cyber-code-block-wrapper">
            <div className="cyber-code-header">
                <div className="cyber-code-meta">
                    <span className="cyber-code-dots">
                        <span className="dot dot-red" />
                        <span className="dot dot-yellow" />
                        <span className="dot dot-cyan" />
                    </span>
                    <span className="cyber-code-lang">{displayLang}</span>
                </div>
                <button
                    type="button"
                    onClick={handleCopy}
                    className={`cyber-code-copy-btn ${copied ? 'copied' : ''}`}
                    aria-label="Copy code to clipboard"
                    title="Copy code to clipboard"
                >
                    {copied ? (
                        <>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>COPIED!</span>
                        </>
                    ) : (
                        <>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            <span>COPY</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="cyber-code-pre" {...props}>
                {children}
            </pre>
        </div>
    )
}

function MarkdownLink({ href, children, ...props }: any) {
    const isExternal = href?.startsWith('http://') || href?.startsWith('https://')
    return (
        <a
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="markdown-link"
            {...props}
        >
            {children}
            {isExternal && (
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px', opacity: 0.75 }}
                >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
            )}
        </a>
    )
}

export default function ProjectDocsPage() {
    const { id } = useParams()
    const content = id ? docsMap[id] : null

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
    }, [])

    if (!content) {
        return (
            <div className="section" style={{ textAlign: 'center', padding: '15vh 1rem' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>Documentation Not Found</h2>
                <Link to="/projects" className="cyber-action-btn secondary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                    ← BACK TO PROJECTS
                </Link>
            </div>
        )
    }

    return (
        <article className="project-page" style={{ maxWidth: '1000px', margin: '0 auto', padding: '10vh 1.5rem 15vh' }}>
            {/* BACK BUTTON */}
            <div style={{ marginBottom: '3rem' }}>
                <Link
                    to={`/project/${id}`}
                    className="cyber-action-btn secondary"
                >
                    ← BACK TO PROJECT
                </Link>
            </div>

            {/* MARKDOWN CONTENT */}
            <div className="markdown">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }]]}
                    components={{
                        pre: CodeBlock,
                        a: MarkdownLink,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </article>
    )
}
