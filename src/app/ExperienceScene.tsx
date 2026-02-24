import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import Lights from '../canvas/Lights'
import Environment from '../canvas/Environment'
import { useTheme } from './ThemeContext'
import { themeRegistry } from '../themes'

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export default function ExperienceScene() {
  const scrollT = useRef(0)
  //const { model } = useTheme()
    const { model, cubeSettings } = useTheme()

  const SceneComponent = themeRegistry[model]

  useFrame(() => {
    const maxScroll =
      document.body.scrollHeight - window.innerHeight

    const raw =
      maxScroll > 0 ? window.scrollY / maxScroll : 0

    scrollT.current = easeOutCubic(
      THREE.MathUtils.clamp(raw, 0, 1)
    )
  })

  return (
    <>
      {model !== 'none' && (
        <>
          <Lights />
          <Environment />

          {SceneComponent ? (
            model === 'cube' ? (
              <SceneComponent scrollT={scrollT} {...cubeSettings} />
            ) : (
              <SceneComponent scrollT={scrollT} />
            )
          ) : null}
        </>
      )}
    </>
  )
}
