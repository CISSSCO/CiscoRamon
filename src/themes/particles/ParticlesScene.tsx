import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { particlePalettes } from './particlePalettes'
import { useTheme } from '../../app/ThemeContext'

type Props = {
  scrollT: React.MutableRefObject<number>
}

type Ball = {
  velocity: THREE.Vector3
  basePosition: THREE.Vector3
  radius: number
  color: THREE.Color
  phase: number
}

type MotionType =
  | 'bounce'
  | 'float'
  | 'gravity'
  | 'swirl'
  | 'rain'
  | 'orbit'
  | 'wave'
  | 'spiralRise'
  | 'noiseDrift'

export default function ParticlesScene({ scrollT }: Props) {
  const group = useRef<THREE.Group>(null!)
  const meshRefs = useRef<THREE.Mesh[]>([])
  const { mouse } = useThree()

  const {
    particlePalette,
    particleSettings
  } = useTheme()

  const {
    count,
    speed,
    size,
    softness,
    bounds,
    motion,
    parallax
  } = particleSettings

    const currentMotion: MotionType = motion as MotionType

  const balls = useMemo(() => {
    const arr: Ball[] = []
    const palette = particlePalettes[particlePalette].colors

    for (let i = 0; i < count; i++) {
      arr.push({
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ),
        basePosition: new THREE.Vector3(
          (Math.random() - 0.5) * bounds,
          (Math.random() - 0.5) * bounds,
          (Math.random() - 0.5) * bounds
        ),
        radius: 0.2 + Math.random() * size,
        color: new THREE.Color(
          palette[Math.floor(Math.random() * palette.length)]
        ),
        phase: Math.random() * Math.PI * 2
      })
    }

    meshRefs.current = []
    return arr
  }, [particlePalette, count, size, bounds, motion])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const floorY = -bounds / 2

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const ball = balls[i]

      // reset position
      mesh.position.copy(ball.basePosition)

      switch (currentMotion) {

        case 'bounce':
          ball.basePosition.addScaledVector(ball.velocity, delta * speed)

          if (Math.abs(ball.basePosition.x) > bounds / 2)
            ball.velocity.x *= -1
          if (Math.abs(ball.basePosition.y) > bounds / 2)
            ball.velocity.y *= -1
          if (Math.abs(ball.basePosition.z) > bounds / 2)
            ball.velocity.z *= -1
          break

        case 'float':
          mesh.position.x += Math.sin(t + ball.phase) * 2
          mesh.position.y += Math.cos(t + ball.phase) * 2
          break

        case 'gravity':
          ball.velocity.y -= 9.8 * delta
          ball.basePosition.y += ball.velocity.y

          if (ball.basePosition.y <= floorY + ball.radius) {
            ball.basePosition.y = floorY + ball.radius
            ball.velocity.y *= -0.35

            if (Math.abs(ball.velocity.y) < 0.2)
              ball.velocity.y = 0
          }

          // scroll jump
          if (scrollT.current > 0.15 && scrollT.current < 0.18) {
            ball.velocity.y = 6 + Math.random() * 4
          }
          break

        case 'swirl':
          const swirlRadius = 4 + ball.radius * 3
          const angle = t * 1.5 + ball.phase
          mesh.position.x = Math.cos(angle) * swirlRadius
          mesh.position.z = Math.sin(angle) * swirlRadius
          mesh.position.y += ball.basePosition.y * 0.3
          break

        case 'rain':
          ball.basePosition.y -= delta * speed * 0.5
          if (ball.basePosition.y < floorY)
            ball.basePosition.y = bounds / 2
          break

        case 'orbit':
          const orbitAngle = t * 0.8 + ball.phase
          const orbitRadius = 5
          mesh.position.x = Math.cos(orbitAngle) * orbitRadius
          mesh.position.z = Math.sin(orbitAngle) * orbitRadius
          break

        case 'wave':
          mesh.position.y += Math.sin(t * 2 + ball.phase) * 3
          break

        case 'spiralRise':
          const spiralAngle = t * 2 + ball.phase
          const spiralR = 2 + ball.radius * 2
          mesh.position.x = Math.cos(spiralAngle) * spiralR
          mesh.position.z = Math.sin(spiralAngle) * spiralR

          ball.basePosition.y += delta * 2
          if (ball.basePosition.y > bounds / 2)
            ball.basePosition.y = floorY
          break

        case 'noiseDrift':
          mesh.position.x += Math.sin(t + ball.phase) * delta * speed
          mesh.position.y += Math.cos(t + ball.phase) * delta * speed
          break
      }

      // parallax
      mesh.position.x += mouse.x * parallax * 5
      mesh.position.y += mouse.y * parallax * 5
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
          position={ball.basePosition.toArray()}
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
