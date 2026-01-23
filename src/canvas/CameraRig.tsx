import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export default function CameraRig() {
  const { camera } = useThree()
  const lookAt = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    camera.lookAt(lookAt.current)
  })

  return null
}
