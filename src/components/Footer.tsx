import { ARLogo, GitHubIcon, LinkedInIcon, MailIcon } from '../ui/HeroIcons'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        {/* Left: AR Brand Emblem + Compact Copyright */}
        <div className="site-footer-brand">
          <ARLogo size={24} />
          <div className="site-footer-copy">
            &copy; {new Date().getFullYear()} <strong style={{ color: 'var(--text-main)' }}>Abhishek Raj</strong>. All rights reserved.
          </div>
        </div>

        {/* Right: Social & Contact Cyber Buttons */}
        <div className="site-footer-socials">
          <a
            href="https://github.com/CISSSCO"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="site-footer-icon-btn"
            title="GitHub Profile"
          >
            <GitHubIcon />
          </a>
          <a
            href="https://www.linkedin.com/in/abhi581b"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="site-footer-icon-btn"
            title="LinkedIn Profile"
          >
            <LinkedInIcon />
          </a>
          <a
            href="mailto:cisco581b@gmail.com"
            aria-label="Email Abhishek"
            className="site-footer-icon-btn"
            title="Email"
          >
            <MailIcon />
          </a>
        </div>
      </div>
    </footer>
  )
}
