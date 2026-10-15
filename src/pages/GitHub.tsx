import { Link, useLocation } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useEffect } from 'react'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'

import 'highlight.js/styles/github-dark.css'
import '../styles/github.css'
import '../styles/home.css'
import '../styles/social-pages.css'

import githubReadme from '../data/docs/github.md?raw'
import projects from '../data/projects.json'
import { ARLogo, GitHubIcon, LinkedInIcon, ExternalLinkIcon } from '../ui/HeroIcons'
import { TechIcon } from '../ui/TechIcons'
import OpenSourceContributions from '../components/OpenSourceContributions'

export default function GitHubPage() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#contributions') {
      const timer = setTimeout(() => {
        const el = document.getElementById('contributions')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 120)
      return () => clearTimeout(timer)
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.hash])

  return (
    <article className="social-page">
      {/* Top Navigation Bar */}
      <div className="social-nav-bar">
        <Link
          to="/"
          className="cyber-action-btn secondary"
        >
          ← BACK TO HOME
        </Link>

        <div className="social-nav-actions">
          <Link
            to="/linkedin"
            className="cyber-action-btn secondary"
          >
            <LinkedInIcon />
            <span>VIEW LINKEDIN</span>
          </Link>

          <a
            href="https://github.com/CISSSCO"
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-action-btn primary"
          >
            <GitHubIcon />
            <span>VISIT GITHUB PROFILE ↗</span>
          </a>
        </div>
      </div>

      {/* GitHub Profile Banner & Identity Card */}
      <div className="social-profile-card">
        <div className="social-banner-cyber">
          <div className="social-banner-badge">
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <span>ACTIVE OPEN SOURCE CONTRIBUTOR</span>
          </div>
        </div>

        <div className="social-profile-body">
          <div className="social-avatar-container">
            <div className="social-avatar-wrapper">
              <ARLogo size={64} />
            </div>

            <div className="social-header-actions">
              <a
                href="https://github.com/CISSSCO?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-action-btn secondary"
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.95rem' }}
              >
                <span>ALL REPOSITORIES ↗</span>
              </a>
              <a
                href="https://github.com/CISSSCO"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-action-btn primary"
                style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
              >
                <GitHubIcon />
                <span>FOLLOW @CISSSCO</span>
              </a>
            </div>
          </div>

          <h1 className="social-name-title">
            Abhishek Raj
            <span className="social-handle-badge">@CISSSCO</span>
          </h1>

          <p className="social-headline">
            🐧 Linux-focused HPC &amp; Systems Engineer · Project Engineer @ C-DAC (R&amp;D) &amp; ex-(HPC Application Engineer @ IIT (BHU)). Building scalable tools for high-performance computing, distributed scheduling, and reproducible Linux systems.
          </p>

          <div className="social-meta-info">
            <div className="social-meta-item">
              <span style={{ color: 'var(--cyber-cyan)' }}>📍</span>
              <span>Pune / Varanasi, India</span>
            </div>
            <div className="social-meta-item">
              <span style={{ color: 'var(--cyber-cyan)' }}>🏢</span>
              <span>Centre for Development of Advanced Computing (C-DAC)</span>
            </div>
            <div className="social-meta-item">
              <span style={{ color: 'var(--cyber-cyan)' }}>🌐</span>
              <a href="https://github.com/CISSSCO" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyber-cyan)', textDecoration: 'none' }}>
                github.com/CISSSCO
              </a>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="social-stats-row">
            <div className="social-stat-item">
              <div className="social-stat-number">{projects.length}+</div>
              <div className="social-stat-title">Public Repositories</div>
            </div>
            <div className="social-stat-item">
              <div className="social-stat-number">2.5+ Yrs</div>
              <div className="social-stat-title">HPC &amp; Systems R&amp;D</div>
            </div>
            <div className="social-stat-item">
              <div className="social-stat-number">100+</div>
              <div className="social-stat-title">Scientific Stacks</div>
            </div>
            <div className="social-stat-item">
              <div className="social-stat-number">500+</div>
              <div className="social-stat-title">Engineers Mentored</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned & Featured Repositories */}
      <section className="social-section-card">
        <div className="social-section-title-row">
          <h2 className="social-section-title">
            <span>📦</span>
            <span>Featured Open-Source Repositories</span>
          </h2>
          <a
            href="https://github.com/CISSSCO?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--cyber-cyan)', fontSize: '0.82rem', fontFamily: 'var(--font-mono, monospace)', textDecoration: 'none' }}
          >
            VIEW ALL REPOS →
          </a>
        </div>

        <div className="github-repos-grid">
          {projects.map((repo) => (
            <a
              key={repo.id}
              href={repo.repo || `https://github.com/CISSSCO/${repo.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="github-repo-card"
            >
              <div>
                <div className="github-repo-name">
                  <span>{repo.title}</span>
                  <ExternalLinkIcon />
                </div>
                <p className="github-repo-desc">{repo.excerpt}</p>
              </div>

              <div className="github-repo-footer">
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center', flex: 1, minWidth: 0 }}>
                  {repo.stack?.slice(0, 3).map((st) => (
                    <span key={st} className="tech-badge-cyber" style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}>
                      <TechIcon name={st} size={12} />
                      <span>{st}</span>
                    </span>
                  ))}
                  {repo.stack && repo.stack.length > 3 && (
                    <span className="tech-badge-cyber" style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', opacity: 0.8 }}>
                      +{repo.stack.length - 3}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--cyber-cyan)', flexShrink: 0, marginLeft: '0.6rem' }} title="Open Repository">
                  <GitHubIcon />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Upstream Open Source Contributions */}
      <OpenSourceContributions />

      {/* GitHub Profile README & Activity */}
      <section className="social-section-card">
        <div className="social-section-title-row">
          <h2 className="social-section-title">
            <span>📄</span>
            <span>CISSSCO / README.md &amp; Activity</span>
          </h2>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            PROFILE SPECIFICATION
          </span>
        </div>

        <div className="markdown" style={{ maxWidth: '100%' }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              a: ({ node, children, href, className, ...props }: any) => {
                const hasImg =
                  (node?.children || []).some(
                    (child: any) =>
                      child.tagName === 'img' ||
                      (child.children && child.children.some((c: any) => c.tagName === 'img'))
                  )
                const isInternal = href && (href.startsWith('#') || href.startsWith('/'))
                return (
                  <a
                    href={href}
                    {...props}
                    className={hasImg ? 'markdown-badge-link' : (className || 'markdown-link')}
                    target={isInternal ? undefined : '_blank'}
                    rel={isInternal ? undefined : 'noopener noreferrer'}
                  >
                    {children}
                  </a>
                )
              },
            }}
          >
            {githubReadme}
          </ReactMarkdown>
        </div>
      </section>

      {/* Bottom Action Footer Bar */}
      <div className="social-bottom-bar">
        <Link to="/" className="cyber-action-btn secondary">
          ← BACK TO HOME
        </Link>

        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <Link to="/linkedin" className="cyber-action-btn secondary">
            <LinkedInIcon />
            <span>GO TO LINKEDIN PAGE →</span>
          </Link>
          <a
            href="https://github.com/CISSSCO"
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-action-btn primary"
          >
            <GitHubIcon />
            <span>OPEN GITHUB IN NEW TAB ↗</span>
          </a>
        </div>
      </div>
    </article>
  )
}
