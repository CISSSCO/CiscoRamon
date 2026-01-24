import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import Lights from '../canvas/Lights'
import Environment from '../canvas/Environment'
import HeroOrb from '../sections/HeroOrb'

/**
 * Smooth easing function (cinematic)
 */
function easeInOutCubic(t: number) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export default function Experience() {
  const { camera } = useThree()
  const targetZ = useRef(8)

  useEffect(() => {
    camera.lookAt(0, 0, 0)
  }, [camera])

  useFrame(() => {
    const scrollY = window.scrollY
    const maxScroll =
      document.body.scrollHeight - window.innerHeight

    // Normalize scroll (0 → 1)
    const rawT = maxScroll > 0 ? scrollY / maxScroll : 0

    // Apply easing
    const t = easeInOutCubic(rawT)

    // 🔥 SLOWER, SHORTER CAMERA TRAVEL
    const startZ = 9
    const endZ = -10

    targetZ.current = THREE.MathUtils.lerp(
      startZ,
      endZ,
      t
    )

    // Smooth camera motion (lerp)
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      targetZ.current,
      0.06
    )
  })

  return (
    <>
      <Lights />
      <Environment />
      <HeroOrb />
    </>
  )
}
