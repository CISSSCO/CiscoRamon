import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function ProjectsHTML() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!sectionRef.current) return

    gsap.fromTo(
      cardsRef.current,
      {
        y: 40,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%'
        }
      }
    )
  }, [])

  return (
    <section ref={sectionRef} className="projects-section">
      <h2 className="projects-title">Selected Projects</h2>

      <div className="projects-grid">
        {['Project One', 'Project Two', 'Project Three'].map(
          (title, i) => (
            <article
              key={title}
              className="project-card"
              ref={(el) => {
                if (el) cardsRef.current[i] = el
              }}
            >
              <h3>{title}</h3>
              <p>
                Experimental systems exploring visuals, interaction,
                and tooling with WebGL.
              </p>
              <span className="tag">Creative Dev</span>
            </article>
          )
        )}
      </div>
    </section>
  )
}
