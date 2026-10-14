import { Link } from 'react-router-dom'
import { ARLogo, GitHubIcon, LinkedInIcon, MailIcon } from '../ui/HeroIcons'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(0, 242, 254, 0.12)',
        background: 'rgba(5, 7, 13, 0.9)',
        padding: '2rem 1.5rem',
        marginTop: '5rem',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.2rem',
        }}
      >
        {/* Left: AR Logo + Copyright */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <ARLogo size={28} />
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            &copy; {new Date().getFullYear()} <strong style={{ color: '#fff' }}>Abhishek Raj</strong>. All rights reserved.
          </div>
        </div>

        {/* Center: Essential Navigation Links */}
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
          <Link to="/projects" style={{ color: '#94a3b8', textDecoration: 'none' }} className="footer-link">
            Projects
          </Link>
          <Link to="/skills" style={{ color: '#94a3b8', textDecoration: 'none' }} className="footer-link">
            Skills
          </Link>
          <Link to="/about" style={{ color: '#94a3b8', textDecoration: 'none' }} className="footer-link">
            About
          </Link>
          <Link to="/github" style={{ color: '#94a3b8', textDecoration: 'none' }} className="footer-link">
            GitHub
          </Link>
        </div>

        {/* Right: Social & Contact Logos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href="https://github.com/CISSSCO"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="cyber-icon-btn"
            style={{ width: '34px', height: '34px', padding: 0, justifyContent: 'center' }}
          >
            <GitHubIcon />
          </a>
          <a
            href="https://www.linkedin.com/in/abhi581b"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="cyber-icon-btn"
            style={{ width: '34px', height: '34px', padding: 0, justifyContent: 'center' }}
          >
            <LinkedInIcon />
          </a>
          <a
            href="mailto:abhi581b@gmail.com"
            aria-label="Email"
            className="cyber-icon-btn"
            style={{ width: '34px', height: '34px', padding: 0, justifyContent: 'center' }}
          >
            <MailIcon />
          </a>
        </div>
      </div>
    </footer>
  )
}
