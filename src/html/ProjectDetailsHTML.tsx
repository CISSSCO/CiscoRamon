
import { useEffect, useRef } from 'react'
import { useProjectFocus } from '../app/ProjectFocusContext'
import gsap from 'gsap'

export default function ProjectDetailsHTML() {
    const { focused } = useProjectFocus()
    const panelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!panelRef.current) return

        if (focused) {
            gsap.fromTo(
                panelRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
            )
        }
    }, [focused])

    if (!focused) return null

    return (
        <div ref={panelRef} className="project-panel">
        <h3>Project {focused.id}</h3>

        <p className="description">
        Experimental system exploring graphics, interaction, and tooling.
        </p>

        <ul className="stack">
        <li>React</li>
        <li>Three.js</li>
        <li>GSAP</li>
        <li>TypeScript</li>
        </ul>

        <div className="links">
        <a href="#" target="_blank">GitHub</a>
        <a href="#" target="_blank">Live Demo</a>
        </div>
        </div>
    )
}
