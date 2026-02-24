import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Props = {
  scrollT: React.MutableRefObject<number>
  dimension?: number        // 3 → 10
  cubieSize?: number        // size of each piece
  gap?: number              // spacing
  roundness?: number        // bevel size
  smoothness?: number       // bevel segments
}

const FACE_COLORS = [
  '#ff3d3d',
  '#ff8c00',
  '#ffffff',
  '#ffd500',
  '#009b48',
  '#0046ad'
]

type Cubie = {
  mesh: THREE.Mesh
  coords: { x: number; y: number; z: number }
}

export default function HeroCube({
  scrollT,
  dimension = 3,
  cubieSize = 0.9,
  gap = 0.06,
  roundness = 0.08,
  smoothness = 3
}: Props) {

  const group = useRef<THREE.Group>(null!)
  const cubies = useRef<Cubie[]>([])
  const scrambled = useRef(false)
  const mouse = useRef({ x: 0, y: 0 })

  const STEP = cubieSize + gap
  const offset = (dimension - 1) / 2

  /* ===============================
     Mouse tracking
  =============================== */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () =>
      window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  /* ===============================
     CREATE CUBE
  =============================== */

  const pieces = useMemo(() => {

    const arr: Cubie[] = []

    const geometry = new THREE.BoxGeometry(
      cubieSize,
      cubieSize,
      cubieSize,
      smoothness * 2,
      smoothness * 2,
      smoothness * 2
    )

    // soften normals slightly
    geometry.computeVertexNormals()

    for (let x = 0; x < dimension; x++) {
      for (let y = 0; y < dimension; y++) {
        for (let z = 0; z < dimension; z++) {

          const isOuter =
            x === 0 || x === dimension - 1 ||
            y === 0 || y === dimension - 1 ||
            z === 0 || z === dimension - 1

          const randomColor = () =>
            FACE_COLORS[Math.floor(Math.random() * FACE_COLORS.length)]

          const material = new THREE.MeshStandardMaterial({
            color: isOuter ? randomColor() : '#0a0a0a',
            roughness: 0.35,
            metalness: 0.25
          })

          const mesh = new THREE.Mesh(geometry, material)

          mesh.position.set(
            (x - offset) * STEP,
            (y - offset) * STEP,
            (z - offset) * STEP
          )

          arr.push({
            mesh,
            coords: {
              x: x - offset,
              y: y - offset,
              z: z - offset
            }
          })
        }
      }
    }

    cubies.current = arr
    return arr.map(c => c.mesh)

  }, [dimension, cubieSize, gap, smoothness])

  /* ===============================
     SCRAMBLE
  =============================== */

  useEffect(() => {
    if (scrambled.current) return
    scrambled.current = true
    requestAnimationFrame(() => scrambleCube())
  }, [dimension])

  function scrambleCube() {
    const moves = 20

    for (let i = 0; i < moves; i++) {
      const axis = ['x', 'y', 'z'][
        Math.floor(Math.random() * 3)
      ] as 'x' | 'y' | 'z'

      const layer =
        Math.floor(Math.random() * dimension) - offset

      const direction = Math.random() > 0.5 ? 1 : -1

      rotateLayerInstant(axis, layer, direction)
    }
  }

  function rotateLayerInstant(
    axis: 'x' | 'y' | 'z',
    layer: number,
    dir: number
  ) {
    const axisVec =
      axis === 'x'
        ? new THREE.Vector3(1, 0, 0)
        : axis === 'y'
        ? new THREE.Vector3(0, 1, 0)
        : new THREE.Vector3(0, 0, 1)

    cubies.current.forEach(c => {
      if (Math.round(c.coords[axis]) !== Math.round(layer)) return

      c.mesh.rotateOnWorldAxis(axisVec, dir * Math.PI / 2)

      const pos = new THREE.Vector3(
        c.coords.x,
        c.coords.y,
        c.coords.z
      )

      const matrix = new THREE.Matrix4().makeRotationAxis(
        axisVec,
        dir * Math.PI / 2
      )

      pos.applyMatrix4(matrix)

      const snap = (v: number) => Math.round(v)

      c.coords = {
        x: snap(pos.x),
        y: snap(pos.y),
        z: snap(pos.z),
      }

      c.mesh.position.set(
        c.coords.x * STEP,
        c.coords.y * STEP,
        c.coords.z * STEP
      )
    })
  }

  /* ===============================
     ANIMATION (UNCHANGED)
  =============================== */

  useFrame((_, delta) => {
    if (!group.current) return

    const x = mouse.current.x
    const y = mouse.current.y

    const scrollScale = THREE.MathUtils.lerp(
      0.8,
      3.8,
      scrollT.current
    )

    const mouseZoom = 1 + (-y * 0.8)
    const finalScale = scrollScale * mouseZoom

    group.current.scale.lerp(
      new THREE.Vector3(finalScale, finalScale, finalScale),
      0.1
    )

    const targetRotX = y * 1.2
    const targetRotY = x * 1.5

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetRotX,
      0.08
    )

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetRotY,
      0.08
    )

    group.current.rotation.y += delta * 0.15
  })

  return (
    <group ref={group}>
      {pieces.map((mesh, i) => (
        <primitive key={i} object={mesh} />
      ))}
    </group>
  )
}
