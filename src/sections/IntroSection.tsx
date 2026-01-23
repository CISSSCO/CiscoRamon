import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export default function IntroSection() {
  const mesh = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    mesh.current.rotation.y += delta * 0.25
    mesh.current.rotation.x += delta * 0.15
  })

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.6, 2]} />
      <meshStandardMaterial
        color="#ffffff"
        roughness={0.15}
        metalness={0.7}
      />
    </mesh>
  )
}
