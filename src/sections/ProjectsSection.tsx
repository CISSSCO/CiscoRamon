import { useRef } from 'react'
import * as THREE from 'three'
import { useScrollTimeline } from '../hooks/useScrollTimeline'

const projects = [
  { id: 1, position: [-2, 0, -6], color: '#ff6b6b' },
  { id: 2, position: [0, 0, -8], color: '#6bffb3' },
  { id: 3, position: [2, 0, -6], color: '#6b8bff' }
]

export default function ProjectsSection() {
  const group = useRef<THREE.Group>(null!)

  useScrollTimeline((tl) => {
    tl.fromTo(
      group.current.position,
      { z: -3 },
      { z: 0, duration: 1 }
    )
  })

  return (
    <group ref={group}>
      {projects.map((p) => (
        <mesh
          key={p.id}
          position={p.position as [number, number, number]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={p.color} />
        </mesh>
      ))}
    </group>
  )
}
