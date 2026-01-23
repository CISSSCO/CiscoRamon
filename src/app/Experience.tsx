import { Fog } from 'three'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

import CameraRig from '../canvas/CameraRig'
import Lights from '../canvas/Lights'
import Environment from '../canvas/Environment'
import IntroSection from '../sections/IntroSection'

export default function Experience() {
  const { scene } = useThree()

  useEffect(() => {
    scene.fog = new Fog('#000000', 6, 18)
  }, [scene])

  return (
    <>
      <CameraRig />
      <Lights />
      <Environment />
      <IntroSection />
    </>
  )
}
