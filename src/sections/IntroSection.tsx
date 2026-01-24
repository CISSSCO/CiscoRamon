import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { ProceduralMaterial } from './ProceduralMaterial'
import { useScrollTimeline } from '../hooks/useScrollTimeline'

export default function IntroSection() {
  const mesh = useRef<THREE.Mesh>(null!)

  useScrollTimeline((tl) => {
    // Fade + move out
    tl.to(mesh.current.position, {
      z: -3,
      duration: 1
    })

    tl.to(
      mesh.current.scale,
      {
        x: 2.5,
        y: 2.5,
        z: 2.5,
        duration: 1
      },
      '<'
    )

    tl.to(
      (mesh.current.material as THREE.ShaderMaterial),
      {
        opacity: 0,
        duration: 1
      },
      '<'
    )

    // 🔁 Fade back in (for infinite loop)
    tl.to(
      (mesh.current.material as THREE.ShaderMaterial),
      {
        opacity: 1,
        duration: 1
      }
    )

    tl.to(mesh.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1
    }, '<')

    tl.to(mesh.current.position, {
      z: 0,
      duration: 1
    }, '<')
  })

  useFrame((_, delta) => {
    ProceduralMaterial.uniforms.uTime.value += delta * 0.5
  })

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.8, 64]} />
      <primitive
        object={ProceduralMaterial}
        attach="material"
        transparent
      />
    </mesh>
  )
}
