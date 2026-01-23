import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { ProceduralMaterial } from './ProceduralMaterial'

export default function IntroSection() {
  const mesh = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    ProceduralMaterial.uniforms.uTime.value += delta
    mesh.current.rotation.y += delta * 0.15
    mesh.current.rotation.x += delta * 0.08
  })

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.8, 64]} />
      <primitive object={ProceduralMaterial} attach="material" />
    </mesh>
  )
}
