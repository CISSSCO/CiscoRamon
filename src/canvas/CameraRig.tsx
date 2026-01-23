import { useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useScrollTimeline } from '../hooks/useScrollTimeline'

export default function CameraRig() {
  const { camera } = useThree()

  const position = useRef(new THREE.Vector3(0, 0, 8))
  const lookAt = useRef(new THREE.Vector3(0, 0, 0))

  useScrollTimeline((tl) => {
    // Intro → Projects
    tl.to(position.current, {
      z: 4,
      x: 1.5,
      duration: 1
    })

    tl.to(lookAt.current, {
      x: 1,
      y: 0.5,
      duration: 1
    }, '<')

    // Projects → Deep space
    tl.to(position.current, {
      z: -2,
      x: -2,
      y: 1,
      duration: 1
    })

    tl.to(lookAt.current, {
      x: 0,
      y: 0,
      z: -2,
      duration: 1
    }, '<')
  })

  return (
    <>
      {camera.position.copy(position.current)}
      {camera.lookAt(lookAt.current)}
    </>
  )
}
