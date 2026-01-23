import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { ProceduralMaterial } from './ProceduralMaterial'
import { useScrollTimeline } from '../hooks/useScrollTimeline'

export default function IntroSection() {
  const mesh = useRef<THREE.Mesh>(null!)

  useScrollTimeline((tl) => {
    tl.to(ProceduralMaterial.uniforms.uTime, {
      value: 10,
      duration: 1
    })

    tl.to(mesh.current.rotation, {
      y: Math.PI * 2,
      duration: 1
    }, '<')
  })

  useFrame((_, delta) => {
    ProceduralMaterial.uniforms.uTime.value += delta * 0.5
  })

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.8, 64]} />
      <primitive object={ProceduralMaterial} attach="material" />
    </mesh>
  )
}
