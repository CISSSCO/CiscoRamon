import { Link } from 'react-router-dom'
import {
  ARLogo,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  SkillGraphIcon,
  ProjectGraphIcon,
  GitPullRequestIcon,
} from '../ui/HeroIcons'

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

        {/* Right: Only Icons - Graphs, Contributions, Social */}
        <div className="site-footer-socials">
          {/* Skill Graph Icon */}
          <Link
            to="/skills/visualize"
            aria-label="Skill Graph"
            className="site-footer-icon-btn"
            title="Skill Graph"
          >
            <SkillGraphIcon size={17} />
          </Link>

          {/* Project Graphs Icon */}
          <Link
            to="/projects/visualize"
            aria-label="Project Graphs"
            className="site-footer-icon-btn"
            title="Project Graphs"
          >
            <ProjectGraphIcon size={17} />
          </Link>

          {/* Open Source Contributions Icon */}
          <Link
            to="/projects#contributions"
            aria-label="Open Source Contributions"
            className="site-footer-icon-btn"
            title="Open Source Contributions"
          >
            <GitPullRequestIcon size={17} />
          </Link>

          <span className="site-footer-divider" />

          {/* GitHub Profile */}
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

          {/* LinkedIn Profile */}
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

          {/* Email */}
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
