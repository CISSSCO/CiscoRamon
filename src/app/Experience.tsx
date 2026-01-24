import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import Lights from '../canvas/Lights'
import Environment from '../canvas/Environment'
import HeroOrb from '../sections/HeroOrb'

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export default function Experience() {
  const { camera } = useThree()
  const scrollT = useRef(0)

  useEffect(() => {
    camera.position.set(0, 0, 6)
    camera.lookAt(0, 0, 0)
  }, [camera])

  useFrame(() => {
    const maxScroll =
      document.body.scrollHeight - window.innerHeight

    const raw =
      maxScroll > 0 ? window.scrollY / maxScroll : 0

    scrollT.current = easeOutCubic(
      THREE.MathUtils.clamp(raw, 0, 1)
    )

    // camera stays stable (important)
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      5.8,
      0.06
    )
  })

  return (
    <>
      <Lights />
      <Environment />
      <HeroOrb scrollT={scrollT} />
    </>
  )
}
