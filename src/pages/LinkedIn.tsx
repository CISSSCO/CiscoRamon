import { Link } from 'react-router-dom'
import { useEffect } from 'react'

import '../styles/home.css'
import '../styles/social-pages.css'

import resume from '../assets/AbhishekRaj.pdf'
import experience from '../data/experience.json'
import projects from '../data/projects.json'
import {
  ARLogo,
  LinkedInIcon,
  GitHubIcon,
  DownloadIcon,
  MailIcon,
  ExternalLinkIcon,
} from '../ui/HeroIcons'
import { TechIcon } from '../ui/TechIcons'

export default function LinkedInPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

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
            to="/github"
            className="cyber-action-btn secondary"
          >
            <GitHubIcon />
            <span>VIEW GITHUB</span>
          </Link>

          <a
            href="https://www.linkedin.com/in/abhi581b"
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-action-btn primary"
          >
            <LinkedInIcon />
            <span>VISIT LINKEDIN PROFILE ↗</span>
          </a>
        </div>
      </div>

      {/* LinkedIn Profile Header Card */}
      <div className="social-profile-card">
        <div className="social-banner-cyber">
          <div className="social-banner-badge">
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00f2fe', boxShadow: '0 0 6px #00f2fe' }} />
            <span>800+ FOLLOWERS · 9+ PROJECTS · 500+ CONNECTIONS</span>
          </div>
        </div>

        <div className="social-profile-body">
          <div className="social-avatar-container">
            <div className="social-avatar-wrapper">
              <ARLogo size={64} />
            </div>

            <div className="social-header-actions">
              <a
                href={resume}
                download="AbhishekRaj.pdf"
                className="cyber-action-btn secondary"
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.95rem' }}
              >
                <DownloadIcon />
                <span>RESUME</span>
              </a>

              <a
                href="https://www.linkedin.com/in/abhi581b"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-action-btn primary"
                style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
              >
                <LinkedInIcon />
                <span>CONNECT ON LINKEDIN ↗</span>
              </a>
            </div>
          </div>

          <h1 className="social-name-title">
            Abhishek Raj
            <span style={{ fontSize: '1rem', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
              <span>✓</span> Verified Profile
            </span>
          </h1>

          <p className="social-headline">
            Project Engineer @ C-DAC (R&amp;D) and ex-(HPC Application Engineer @ IIT (BHU)) | Parallel Distributed Computing (MPI, OpenMP, CUDA) | Linux Systems Architecture | National Supercomputing Mission (NSM)
          </p>

          <div className="social-meta-info">
            <div className="social-meta-item">
              <span style={{ color: 'var(--cyber-cyan)' }}>📍</span>
              <span>Pune, Maharashtra, India · Varanasi, Uttar Pradesh, India</span>
            </div>
            <div className="social-meta-item">
              <span style={{ color: 'var(--cyber-cyan)' }}>🏢</span>
              <span>Centre for Development of Advanced Computing (C-DAC)</span>
            </div>
            <div className="social-meta-item">
              <span style={{ color: 'var(--cyber-cyan)' }}>🎓</span>
              <span>C-DAC ACTS Pune &amp; Darbhanga College of Engineering</span>
            </div>
            <div className="social-meta-item">
              <span style={{ color: 'var(--cyber-cyan)', display: 'inline-flex' }}>
                <MailIcon />
              </span>
              <a href="mailto:cisco581b@gmail.com" style={{ color: 'var(--cyber-cyan)', textDecoration: 'none' }}>
                cisco581b@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="social-stats-row">
            <div className="social-stat-item">
              <div className="social-stat-number">2.5+ Yrs</div>
              <div className="social-stat-title">HPC Platform Engineering</div>
            </div>
            <div className="social-stat-item">
              <div className="social-stat-number">9+ Repos · 7+ PRs</div>
              <div className="social-stat-title">Open Source Repos &amp; Upstream</div>
            </div>
            <div className="social-stat-item">
              <div className="social-stat-number">800+</div>
              <div className="social-stat-title">Professional Followers</div>
            </div>
            <div className="social-stat-item">
              <div className="social-stat-number">500+ Mentored</div>
              <div className="social-stat-title">Engineers &amp; Researchers</div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="social-section-card">
        <div className="social-section-title-row">
          <h2 className="social-section-title">
            <span>👤</span>
            <span>About</span>
          </h2>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem', color: 'var(--cyber-cyan)' }}>
            OVERVIEW
          </span>
        </div>

        <p style={{ fontSize: '1.02rem', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
          High Performance Computing (HPC) Engineer with 2+ years of experience designing, deploying, and supporting Linux-based supercomputing infrastructure under India&apos;s National Supercomputing Mission (NSM). Experienced in HPC platform engineering, scientific software deployment, parallel programming (MPI, OpenMP, CUDA, OpenACC), Linux administration, and containerized research environments.
        </p>

        <p style={{ fontSize: '1.02rem', lineHeight: 1.8, color: 'var(--text-muted)', margin: 0 }}>
          Passionate about building scalable computing platforms for large-scale scientific simulations, quantum chemistry, AI/ML research, and open-source systems tooling. Actively involved in national capacity-building initiatives, training engineers in parallel programming and supercomputing architectures.
        </p>
      </section>

      {/* Experience Section */}
      <section className="social-section-card">
        <div className="social-section-title-row">
          <h2 className="social-section-title">
            <span>💼</span>
            <span>Experience</span>
          </h2>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem', color: 'var(--cyber-cyan)' }}>
            2 POSITIONS
          </span>
        </div>

        <div className="social-timeline">
          {experience.map((exp) => (
            <div key={exp.id} className="social-item">
              <div className="social-item-icon">
                <TechIcon name={exp.id === 'cdac' ? 'Linux' : 'Rocky Linux'} size={24} />
              </div>

              <div className="social-item-content">
                <h3 className="social-item-role">{exp.role}</h3>
                <div className="social-item-company">{exp.org}</div>
                <div className="social-item-dates">
                  {exp.period} · {exp.duration} · Full-time
                </div>
                <p className="social-item-desc">{exp.summary}</p>

                <div style={{ marginBottom: '1.2rem' }}>
                  {exp.highlights.map((point: string, idx: number) => (
                    <div key={idx} className="social-item-bullet">
                      <span className="social-item-bullet-dot">•</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {exp.stack.slice(0, 10).map((tech: string) => (
                    <span key={tech} className="tech-badge-cyber">
                      <TechIcon name={tech} size={13} />
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="social-section-card">
        <div className="social-section-title-row">
          <h2 className="social-section-title">
            <span>🎓</span>
            <span>Education</span>
          </h2>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem', color: 'var(--cyber-cyan)' }}>
            ACADEMIC BACKGROUND
          </span>
        </div>

        <div className="social-timeline">
          <div className="social-item">
            <div className="social-item-icon">
              <span style={{ fontSize: '1.3rem' }}>⚡</span>
            </div>
            <div className="social-item-content">
              <h3 className="social-item-role">Post Graduate Diploma in High Performance Computing Application Programming (PG-DAC HPCAP)</h3>
              <div className="social-item-company">Centre for Development of Advanced Computing (C-DAC ACTS), Pune</div>
              <div className="social-item-dates">2023 — 2024 · Grade: A (84.71%)</div>
              <p className="social-item-desc">
                Specialized in High-Performance Computing architectures, Parallel Programming (MPI, OpenMP, CUDA, OpenACC), Linux cluster management, distributed filesystem configurations, and GPU performance optimization.
              </p>
            </div>
          </div>

          <div className="social-item">
            <div className="social-item-icon">
              <span style={{ fontSize: '1.3rem' }}>🏛️</span>
            </div>
            <div className="social-item-content">
              <h3 className="social-item-role">Bachelor of Technology (B.Tech) in Computer Science &amp; Engineering</h3>
              <div className="social-item-company">Darbhanga College of Engineering, Darbhanga (AKU, Patna)</div>
              <div className="social-item-dates">2018 — 2022 · CGPA: 7.80 / 10.0</div>
              <p className="social-item-desc">
                Core coursework in Operating Systems, Computer Architecture, Distributed Systems, Data Structures &amp; Algorithms, Object-Oriented Programming in C++, and Network Protocols.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Highlight */}
      <section className="social-section-card">
        <div className="social-section-title-row">
          <h2 className="social-section-title">
            <span>🚀</span>
            <span>Featured Systems &amp; Projects</span>
          </h2>
          <Link
            to="/projects"
            style={{ color: 'var(--cyber-cyan)', fontSize: '0.82rem', fontFamily: 'var(--font-mono, monospace)', textDecoration: 'none' }}
          >
            VIEW ALL 9+ PROJECTS IN PORTFOLIO →
          </Link>
        </div>

        <div className="github-repos-grid">
          {projects.filter(p => Boolean(p.featured)).map((proj) => (
            <div key={proj.id} className="github-repo-card">
              <div>
                <div className="github-repo-name">
                  <span>{proj.title}</span>
                </div>
                <p className="github-repo-desc">{proj.excerpt}</p>
              </div>

              <div className="github-repo-footer">
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {proj.stack?.slice(0, 3).map((st) => (
                    <span key={st} className="tech-badge-cyber" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                      <TechIcon name={st} size={11} />
                      <span>{st}</span>
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  {proj.repo && (
                    <a
                      href={proj.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--cyber-cyan)', textDecoration: 'none' }}
                      title="GitHub Repository"
                    >
                      <GitHubIcon />
                    </a>
                  )}
                  <Link
                    to={`/project/${proj.id}`}
                    style={{ color: 'var(--cyber-yellow)', textDecoration: 'none' }}
                    title="View Details"
                  >
                    <ExternalLinkIcon />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills & Endorsements Matrix */}
      <section className="social-section-card">
        <div className="social-section-title-row">
          <h2 className="social-section-title">
            <span>⚡</span>
            <span>Skills &amp; Expertise</span>
          </h2>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem', color: 'var(--cyber-cyan)' }}>
            CORE COMPETENCIES
          </span>
        </div>

        <div className="social-skills-grid">
          <div className="social-skill-card">
            <div className="social-skill-category-title">Parallel &amp; Distributed Computing</div>
            <div className="social-skill-badges">
              {['MPI', 'OpenMP', 'CUDA', 'OpenACC', 'Pthreads', 'Intel MPI', 'OpenMPI'].map(s => (
                <span key={s} className="tech-badge-cyber">
                  <TechIcon name={s} size={13} />
                  <span>{s}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="social-skill-card">
            <div className="social-skill-category-title">Linux &amp; Platform Engineering</div>
            <div className="social-skill-badges">
              {['Rocky Linux', 'Ubuntu', 'Arch Linux', 'Slurm', 'Spack', 'Environment Modules', 'Apptainer'].map(s => (
                <span key={s} className="tech-badge-cyber">
                  <TechIcon name={s} size={13} />
                  <span>{s}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="social-skill-card">
            <div className="social-skill-category-title">Programming &amp; Scripting</div>
            <div className="social-skill-badges">
              {['C', 'C++', 'Python', 'Bash Scripting', 'FastAPI', 'Vimscript', 'YAML'].map(s => (
                <span key={s} className="tech-badge-cyber">
                  <TechIcon name={s} size={13} />
                  <span>{s}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="social-skill-card">
            <div className="social-skill-category-title">Scientific Toolchains &amp; Applications</div>
            <div className="social-skill-badges">
              {['Intel oneAPI', 'GCC', 'NVHPC', 'VTune', 'MKL', 'GROMACS', 'Quantum ESPRESSO', 'VASP'].map(s => (
                <span key={s} className="tech-badge-cyber">
                  <TechIcon name={s} size={13} />
                  <span>{s}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Honors */}
      <section className="social-section-card">
        <div className="social-section-title-row">
          <h2 className="social-section-title">
            <span>📜</span>
            <span>Licenses &amp; Certifications</span>
          </h2>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem', color: 'var(--cyber-cyan)' }}>
            ACCREDITATIONS
          </span>
        </div>

        <div className="social-timeline">
          <div className="social-item">
            <div className="social-item-icon">
              <span style={{ fontSize: '1.2rem' }}>🏅</span>
            </div>
            <div className="social-item-content">
              <h3 className="social-item-role">National Supercomputing Mission (NSM) Capacity Building Trainer</h3>
              <div className="social-item-company">Centre for Development of Advanced Computing (C-DAC)</div>
              <div className="social-item-dates">Issued 2024 · NSM Human Resource Development</div>
              <p className="social-item-desc">
                Recognized for delivering high-impact parallel programming and cluster training to academic researchers, graduate engineers, and HPC professionals across India.
              </p>
            </div>
          </div>

          <div className="social-item">
            <div className="social-item-icon">
              <span style={{ fontSize: '1.2rem' }}>🏆</span>
            </div>
            <div className="social-item-content">
              <h3 className="social-item-role">High Performance Computing Application Programming (HPCAP)</h3>
              <div className="social-item-company">C-DAC ACTS, Pune</div>
              <div className="social-item-dates">Issued 2024 · Grade A (84.71%)</div>
              <p className="social-item-desc">
                Rigorous post-graduate specialization in parallel algorithm design, distributed cluster infrastructure, GPU acceleration, and scientific software deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Action Footer Bar */}
      <div className="social-bottom-bar">
        <Link to="/" className="cyber-action-btn secondary">
          ← BACK TO HOME
        </Link>

        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <Link to="/github" className="cyber-action-btn secondary">
            <GitHubIcon />
            <span>GO TO GITHUB PAGE →</span>
          </Link>

          <a
            href="https://www.linkedin.com/in/abhi581b"
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-action-btn primary"
          >
            <LinkedInIcon />
            <span>CONNECT ON LINKEDIN ↗</span>
          </a>
        </div>
      </div>
    </article>
  )
}
