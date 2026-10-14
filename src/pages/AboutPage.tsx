import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { restoreScroll } from '../app/ScrollMemory'
import resume from '../assets/AbhishekRaj.pdf'
import '../styles/home.css'
import { DownloadIcon, MailIcon, GitHubIcon, LinkedInIcon } from '../ui/HeroIcons'

export default function AboutPage() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
    }, [])

    return (
        <article className="section" style={{ maxWidth: '950px', margin: '0 auto', padding: '10vh 1.5rem 15vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                <Link
                    to="/"
                    state={{ from: 'about' }}
                    onClick={() => restoreScroll()}
                    className="cyber-action-btn secondary"
                    style={{ textDecoration: 'none', display: 'inline-flex', padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}
                >
                    ← BACK TO HOME
                </Link>

                <a
                    href={resume}
                    download="AbhishekRaj.pdf"
                    className="cyber-action-btn primary"
                >
                    <DownloadIcon />
                    <span>DOWNLOAD RESUME</span>
                </a>
            </div>

            <div style={{ marginBottom: '3rem' }}>
                <div className="section-tag-hpc">
                    <span className="section-tag-dot" />
                    <span>ENGINEERING DOSSIER // ABHISHEK RAJ</span>
                </div>

                <h1 style={{ fontSize: '3.6rem', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 1rem', color: '#fff' }}>
                    Abhishek Raj
                </h1>

                <p style={{ fontSize: '1.2rem', color: '#00f2fe', fontWeight: 600, margin: '0 0 1.5rem' }}>
                    Project Engineer @ C-DAC (R&amp;D) · HPC Application Engineer @ IIT (BHU), Varanasi
                </p>

                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                    <a href="mailto:abhi581b@gmail.com" className="cyber-icon-btn" aria-label="Email">
                        <MailIcon />
                        <span style={{ marginLeft: '0.4rem', fontSize: '0.82rem' }}>abhi581b@gmail.com</span>
                    </a>
                    <a href="https://github.com/CISSSCO" target="_blank" rel="noopener noreferrer" className="cyber-icon-btn" aria-label="GitHub">
                        <GitHubIcon />
                        <span style={{ marginLeft: '0.4rem', fontSize: '0.82rem' }}>GitHub</span>
                    </a>
                    <a href="https://www.linkedin.com/in/abhi581b" target="_blank" rel="noopener noreferrer" className="cyber-icon-btn" aria-label="LinkedIn">
                        <LinkedInIcon />
                        <span style={{ marginLeft: '0.4rem', fontSize: '0.82rem' }}>LinkedIn</span>
                    </a>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <div style={{ padding: '2rem', borderRadius: '16px', background: 'rgba(13, 18, 30, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
                        Background
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '1.05rem', margin: 0 }}>
                        I am a scientific programmer and HPC engineer working at the intersection of high-performance computing, parallel programming, and research-driven software systems. I currently work at C-DAC as a Project Engineer and am deputed to IIT (BHU), Varanasi, where I support large-scale scientific and computational research workloads.
                    </p>
                </div>

                <div style={{ padding: '2rem', borderRadius: '16px', background: 'rgba(13, 18, 30, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
                        What I Work On
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '1.05rem', margin: 0 }}>
                        My work focuses on designing, optimizing, and maintaining HPC environments for researchers and engineers. This includes parallelizing applications using MPI and OpenMP, supporting GPU-accelerated workloads with CUDA and OpenACC, managing job schedulers, and ensuring efficient use of compute resources. I am also actively involved in training and mentoring students, researchers, and professionals in parallel programming and HPC.
                    </p>
                </div>

                <div style={{ padding: '2rem', borderRadius: '16px', background: 'rgba(13, 18, 30, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.2rem' }}>
                        Core Toolchains
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                        {['Linux', 'C / C++', 'MPI', 'OpenMP', 'CUDA', 'OpenACC', 'Slurm', 'Spack', 'Python', 'Shell Scripting', 'HPC Systems'].map((tech) => (
                            <span key={tech} className="tech-badge-cyber" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                <div style={{ padding: '2rem', borderRadius: '16px', background: 'rgba(13, 18, 30, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
                        Beyond Work
                    </h2>
                    <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '1rem', margin: 0 }}>
                        Outside of work, I enjoy customizing Linux environments, contributing to open-source projects, and exploring creative ways to visualize systems and data. I like building tools that balance performance, usability, and clarity.
                    </p>
                </div>
            </div>
        </article>
    )
}
