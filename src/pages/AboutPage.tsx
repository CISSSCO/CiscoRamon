import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { restoreScroll } from '../app/ScrollMemory'
import resume from '../assets/AbhishekRaj.pdf'
import '../styles/about.css'
import '../styles/project.css' // for stack pills

export default function AboutPage() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
    }, [])

    return (
        <article className="about-page">
        <div className="about-actions">
            {/* BACK BUTTON */}
            <Link
            to="/"
            state={{ from: 'about' }}
            onClick={() => restoreScroll()}
            className="about-back"
        >
            ← Back
            </Link>

            <a
            href={resume}
            download="AbhishekRaj.pdf"
            className="about-resume"
            >
            <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6M12 11v6m-3-3 3 3 3-3" />
            </svg>
            Download Resume
            </a>
        </div>

        {/* NAME */}
        <h1 className="about-title">Abhishek Raj</h1>

        <p className="about-subtitle">
        Project Engineer @ C-DAC (R&amp;D) · HPC Application Engineer @
        IIT (BHU), Varanasi
        </p>

        {/* INTRO */}
        <p className="about-text">
        I am a scientific programmer and HPC engineer working at the
        intersection of high-performance computing, parallel
        programming, and research-driven software systems. I currently
        work at C-DAC as a Project Engineer and am deputed to IIT (BHU),
        Varanasi, where I support large-scale scientific workloads on
        national supercomputing infrastructure.
        </p>

        {/* PROFESSIONAL SUMMARY */}
        <h2 className="about-section-title">
        What I work on
        </h2>

        <p className="about-text">
        My work focuses on designing, optimizing, and maintaining HPC
        environments for researchers and engineers. This includes
        parallelizing applications using MPI and OpenMP, supporting
        GPU-accelerated workloads with CUDA and OpenACC, managing job
        schedulers, and ensuring efficient use of compute resources.
        I am also actively involved in training and mentoring students,
        researchers, and professionals in parallel programming and HPC.
        </p>

        {/* SKILLS */}
        <ul className="stack">
        <li>Linux</li>
        <li>C / C++</li>
        <li>MPI</li>
        <li>OpenMP</li>
        <li>CUDA</li>
        <li>OpenACC</li>
        <li>Slurm</li>
        <li>HPC Systems</li>
        </ul>

        {/* PERSONAL NOTE */}
        <p className="about-note">
        Outside of work, I enjoy customizing Linux environments,
        contributing to open-source projects, and exploring creative
        ways to visualize systems and data. I like building tools that
        balance performance, usability, and clarity.
        </p>
        </article>
    )
}
