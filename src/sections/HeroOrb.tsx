import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ProceduralMaterial } from './ProceduralMaterial'
import { useOrbState } from '../app/OrbStateContext'

type Props = {
  scrollT: React.MutableRefObject<number>
}

export default function HeroOrb({ scrollT }: Props) {
  const mesh = useRef<THREE.Mesh>(null!)
  const { mouse } = useThree()
  const { mode } = useOrbState()

  useFrame((_, delta) => {
    const t = scrollT.current

    /**
     * TIME
     */
    ProceduralMaterial.uniforms.uTime.value +=
      delta * (mode === 'project' ? 1.2 : 0.6)

    /**
     * ROTATION
     */
    mesh.current.rotation.y += delta * 0.15
    mesh.current.rotation.x += delta * 0.05

    /**
     * 🧲 MOUSE ATTRACTION (subtle)
     */
    const baseX = 1.2   // 👈 push orb right (important)
    const baseY = 0

    const targetX = mouse.x * 0.6
    const targetY = mouse.y * 0.4

    mesh.current.position.x = THREE.MathUtils.lerp(
      mesh.current.position.x,
      baseX + targetX,
      0.05
    )

    mesh.current.position.y = THREE.MathUtils.lerp(
      mesh.current.position.y,
      baseY + targetY,
      0.05
    )

    /**
     * Z — scroll driven
     */
    mesh.current.position.z = THREE.MathUtils.lerp(0, -12, t)

    /**
     * SCALE — reduced so it doesn’t eat UI
     */
    const baseScale = THREE.MathUtils.lerp(0.7, 2.4, t)
    const pulse =
      mode === 'project'
        ? 1 + Math.sin(ProceduralMaterial.uniforms.uTime.value * 3) * 0.05
        : 1

    mesh.current.scale.setScalar(baseScale * pulse)
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.8, 64]} />
      <primitive object={ProceduralMaterial} attach="material" />
    </mesh>
  )
}
