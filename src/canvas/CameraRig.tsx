import { useThree, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useScrollTimeline } from '../hooks/useScrollTimeline'

export default function CameraRig() {
  const { camera } = useThree()

  const position = useRef(new THREE.Vector3(0, 0, 8))
  const lookAt = useRef(new THREE.Vector3(0, 0, 0))

  useScrollTimeline((tl) => {
    tl.to(position.current, { z: 4, x: 1.5, duration: 1 })
    tl.to(lookAt.current, { x: 1, y: 0.5, duration: 1 }, '<')

    tl.to(position.current, { z: -2, x: -2, y: 1, duration: 1 })
    tl.to(lookAt.current, { x: 0, y: 0, z: -2, duration: 1 }, '<')
  })

  useFrame(() => {
    camera.position.copy(position.current)
    camera.lookAt(lookAt.current)
  })

  return null
}
