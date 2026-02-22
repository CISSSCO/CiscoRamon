import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Props = {
  scrollT: React.MutableRefObject<number>
}

const CUBE_SIZE = .7
const GAP = 0.01

export default function HeroCube({ scrollT }: Props) {
  const group = useRef<THREE.Group>(null!)

  const cubies = useMemo(() => {
    const pieces: THREE.Mesh[] = []
    const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE)

    const faceMaterials = [
      new THREE.MeshStandardMaterial({ color: '#ff3d3d' }), // right
      new THREE.MeshStandardMaterial({ color: '#ff8c00' }), // left
      new THREE.MeshStandardMaterial({ color: '#ffffff' }), // top
      new THREE.MeshStandardMaterial({ color: '#ffd500' }), // bottom
      new THREE.MeshStandardMaterial({ color: '#009b48' }), // front
      new THREE.MeshStandardMaterial({ color: '#0046ad' }), // back
    ]

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {

          const mesh = new THREE.Mesh(geometry, faceMaterials)

          mesh.position.set(
            x * (CUBE_SIZE + GAP),
            y * (CUBE_SIZE + GAP),
            z * (CUBE_SIZE + GAP)
          )

          pieces.push(mesh)
        }
      }
    }

    return pieces
  }, [])

  useFrame((state, delta) => {
    if (!group.current) return

    // Scroll scale (like orb)
    const targetScale = THREE.MathUtils.lerp(0.7, 3.5, scrollT.current)
    group.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    )

    // Mouse parallax
    const { x, y } = state.pointer
    group.current.rotation.y += x * 0.002
    group.current.rotation.x += y * 0.002

    // Idle rotation
    group.current.rotation.y += delta * 0.2
  })

  return (
    <group ref={group}>
      {cubies.map((cubie, i) => (
        <primitive key={i} object={cubie} />
      ))}
    </group>
  )
}
