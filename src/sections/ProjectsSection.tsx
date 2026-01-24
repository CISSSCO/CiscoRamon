import { useRef } from 'react'
import * as THREE from 'three'
import { useScrollTimeline } from '../hooks/useScrollTimeline'
import { useProjectFocus } from '../app/ProjectFocusContext'
import type { Project } from '../app/ProjectFocusContext'

const projects: Project[] = [
  { id: 1, position: [-2, 0, -6], color: '#ff6b6b' },
  { id: 2, position: [0, 0, -8], color: '#6bffb3' },
  { id: 3, position: [2, 0, -6], color: '#6b8bff' }
]

export default function ProjectsSection() {
  const group = useRef<THREE.Group>(null!)
  const { focus } = useProjectFocus()

  useScrollTimeline((tl) => {
    tl.fromTo(
      group.current.position,
      { z: -2 },
      { z: 0, duration: 1 }
    )
  })

  return (
    <group ref={group}>
      {projects.map((p) => (
        <mesh
          key={p.id}
          position={p.position}
          onClick={(e) => {
            e.stopPropagation()
            focus(p)
          }}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={p.color}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}
