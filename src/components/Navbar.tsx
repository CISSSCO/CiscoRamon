import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import resume from '../assets/AbhishekRaj.pdf'
import { ARLogo, GitHubIcon, DownloadIcon, SunIcon, MoonIcon } from '../ui/HeroIcons'
import { useTheme } from '../app/ThemeContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    if (location.pathname !== '/') {
      return
    }
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        background: 'var(--bg-nav)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-cyber)',
        boxShadow: scrolled ? 'var(--card-shadow)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0.85rem 1.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand with clean AR Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.9rem',
            textDecoration: 'none',
            color: 'var(--text-main)',
          }}
        >
          <ARLogo size={36} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              Abhishek Raj
            </div>
            <div
              style={{
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                  display: 'inline-block',
                }}
              />
              HPC &amp; Systems Engineer
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.8rem',
          }}
        >
          <Link
            to="/#projects"
            onClick={() => scrollToSection('projects')}
            className="cyber-nav-link"
          >
            <span className="nav-bracket">[</span> Projects <span className="nav-bracket">]</span>
          </Link>
          <Link
            to="/#experience"
            onClick={() => scrollToSection('experience')}
            className="cyber-nav-link"
          >
            <span className="nav-bracket">[</span> Experience <span className="nav-bracket">]</span>
          </Link>
          <Link to="/skills" className="cyber-nav-link">
            <span className="nav-bracket">[</span> Skills <span className="nav-bracket">]</span>
          </Link>
          <Link to="/about" className="cyber-nav-link">
            <span className="nav-bracket">[</span> About <span className="nav-bracket">]</span>
          </Link>
          <Link
            to="/#contact"
            onClick={() => scrollToSection('contact')}
            className="cyber-nav-link"
          >
            <span className="nav-bracket">[</span> Contact <span className="nav-bracket">]</span>
          </Link>
        </nav>

        {/* Futuristic Action Buttons */}
        <div
          className="desktop-actions"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.9rem',
          }}
        >
          {/* Cyberpunk Theme Mode Switcher */}
          <button
            onClick={toggleTheme}
            className="cyber-theme-toggle-btn"
            aria-label={`Toggle theme (currently ${theme})`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Cyber Dark'} Mode`}
          >
            {theme === 'dark' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
            <span>{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
          </button>

          <a
            href="https://github.com/CISSSCO"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="cyber-icon-btn"
          >
            <GitHubIcon />
          </a>

          <a
            href={resume}
            download="AbhishekRaj.pdf"
            className="cyber-action-btn primary"
          >
            <DownloadIcon />
            <span>RESUME</span>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <div
            style={{
              width: '22px',
              height: '2px',
              backgroundColor: '#00f2fe',
              boxShadow: '0 0 6px #00f2fe',
              transition: 'all 0.25s',
              transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
            }}
          />
          <div
            style={{
              width: '22px',
              height: '2px',
              backgroundColor: '#fff',
              margin: '5px 0',
              opacity: mobileMenuOpen ? 0 : 1,
              transition: 'opacity 0.2s',
            }}
          />
          <div
            style={{
              width: '22px',
              height: '2px',
              backgroundColor: '#818cf8',
              boxShadow: '0 0 6px #818cf8',
              transition: 'all 0.25s',
              transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--bg-nav)',
            backdropFilter: 'blur(24px)',
            borderBottom: '1px solid var(--border-cyber)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <button
            onClick={toggleTheme}
            className="cyber-theme-toggle-btn"
            style={{ width: '100%', justifyContent: 'center', marginBottom: '0.5rem' }}
          >
            {theme === 'dark' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
            <span>SWITCH TO {theme === 'dark' ? 'LIGHT' : 'CYBER DARK'} MODE</span>
          </button>

          <Link
            to="/#projects"
            onClick={() => scrollToSection('projects')}
            className="mobile-nav-link"
          >
            &gt; Projects
          </Link>
          <Link
            to="/#experience"
            onClick={() => scrollToSection('experience')}
            className="mobile-nav-link"
          >
            &gt; Experience
          </Link>
          <Link to="/skills" className="mobile-nav-link">
            &gt; Skills
          </Link>
          <Link to="/about" className="mobile-nav-link">
            &gt; About
          </Link>
          <Link
            to="/#contact"
            onClick={() => scrollToSection('contact')}
            className="mobile-nav-link"
          >
            &gt; Contact
          </Link>
          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.8rem' }}>
            <a
              href="https://github.com/CISSSCO"
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-icon-btn"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <GitHubIcon /> GitHub
            </a>
            <a
              href={resume}
              download="AbhishekRaj.pdf"
              className="cyber-action-btn primary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <DownloadIcon /> Resume
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
