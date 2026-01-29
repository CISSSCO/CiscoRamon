import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { ProceduralMaterial } from './ProceduralMaterial'

export default function HeroSection() {
    const mesh = useRef<THREE.Mesh>(null!)

    useFrame((_, delta) => {
        ProceduralMaterial.uniforms.uTime.value += delta * 0.5
        mesh.current.rotation.y += delta * 0.15
    })

    return (
        <group position={[0, 0, 0]}>
        <mesh ref={mesh}>
        <icosahedronGeometry args={[1.8, 64]} />
        <primitive object={ProceduralMaterial} attach="material" />
        </mesh>
        </group>
    )
}
