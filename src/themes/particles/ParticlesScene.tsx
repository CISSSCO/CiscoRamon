import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { particlePalettes } from './particlePalettes'
import { useTheme } from '../../app/ThemeContext'

type Props = {
  scrollT: React.MutableRefObject<number>
}

type Ball = {
  velocity: THREE.Vector3
  radius: number
  color: THREE.Color
  position: THREE.Vector3
}

export default function ParticlesScene({ scrollT }: Props) {
  const group = useRef<THREE.Group>(null!)
  const meshRefs = useRef<THREE.Mesh[]>([])

  const {
    particlePalette,
    particleSettings
  } = useTheme()

  const {
    count,
    speed,
    size,
    softness,
    bounds
  } = particleSettings

  const balls = useMemo<Ball[]>(() => {
    const arr: Ball[] = []
    const palette = particlePalettes[particlePalette].colors

    for (let i = 0; i < count; i++) {
      const randomColor =
        palette[Math.floor(Math.random() * palette.length)]

      arr.push({
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2
        ),
        radius: 0.2 + Math.random() * size,
        color: new THREE.Color(randomColor),
        position: new THREE.Vector3(
          (Math.random() - 0.5) * bounds,
          (Math.random() - 0.5) * bounds,
          (Math.random() - 0.5) * bounds
        )
      })
    }

    meshRefs.current = []

    return arr
  }, [particlePalette, count, size, bounds])

  useFrame((_, delta) => {
    if (!group.current) return

    const scale = THREE.MathUtils.lerp(1, 1.5, scrollT.current)
    group.current.scale.setScalar(scale)

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return

      const velocity = balls[i].velocity

      mesh.position.x += velocity.x * delta * speed
      mesh.position.y += velocity.y * delta * speed
      mesh.position.z += velocity.z * delta * speed

      if (Math.abs(mesh.position.x) > bounds / 2) velocity.x *= -1
      if (Math.abs(mesh.position.y) > bounds / 2) velocity.y *= -1
      if (Math.abs(mesh.position.z) > bounds / 2) velocity.z *= -1
    })
  })

  return (
    <group ref={group}>
      {balls.map((ball, i) => (
        <mesh
          key={i}
          ref={el => {
            if (el) meshRefs.current[i] = el
          }}
          position={ball.position.toArray()}
        >
          <sphereGeometry args={[ball.radius, 24, 24]} />
          <meshBasicMaterial
            color={ball.color}
            toneMapped={false}
            transparent
            opacity={1 - softness}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}
