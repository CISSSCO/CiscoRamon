import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import '../styles/markdown.css'

export default function MarkdownPage({ content }: { content: string }) {
  return (
    <article className="markdown-page">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </article>
  )
}
