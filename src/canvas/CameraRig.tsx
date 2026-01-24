import { useThree, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useScrollTimeline } from '../hooks/useScrollTimeline'
import { useProjectFocus } from '../app/ProjectFocusContext'

export default function CameraRig() {
  const { camera } = useThree()
  const { focused } = useProjectFocus()

  // Scroll-controlled camera state
  const position = useRef(new THREE.Vector3(0, 0, 8))
  const lookAt = useRef(new THREE.Vector3(0, 0, 0))

  useScrollTimeline((tl) => {
    tl.to(position.current, { z: 4, x: 1.5, duration: 1 })
    tl.to(lookAt.current, { x: 1, y: 0.5, duration: 1 }, '<')

    tl.to(position.current, { z: -2, x: -2, y: 1, duration: 1 })
    tl.to(lookAt.current, { x: 0, y: 0, z: -2, duration: 1 }, '<')
  })

  useFrame(() => {
    if (focused) {
      // 🎯 Temporary focus override
      const target = new THREE.Vector3(
        focused.position[0],
        focused.position[1],
        focused.position[2] + 3
      )

      camera.position.lerp(target, 0.08)
      camera.lookAt(
        focused.position[0],
        focused.position[1],
        focused.position[2]
      )
    } else {
      // 🔑 Scroll immediately regains authority
      camera.position.copy(position.current)
      camera.lookAt(lookAt.current)
    }
  })

  return null
}
