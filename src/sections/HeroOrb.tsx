import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ProceduralMaterial } from './ProceduralMaterial'

export default function HeroOrb() {
  const mesh = useRef<THREE.Mesh>(null!)

useFrame((_, delta) => {
  mesh.current.rotation.y += delta * 0.2
  ProceduralMaterial.uniforms.uTime.value += delta

  const s = 1 + Math.sin(ProceduralMaterial.uniforms.uTime.value * 0.5) * 0.05
  mesh.current.scale.setScalar(s)
})

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.8, 64]} />
      <primitive object={ProceduralMaterial} attach="material" />
    </mesh>
  )
}
