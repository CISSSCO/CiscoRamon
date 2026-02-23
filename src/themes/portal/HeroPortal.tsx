import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { vortexPalettes } from './portalPalettes'
import { useTheme } from '../../app/ThemeContext'

type Props = {
  scrollT: React.MutableRefObject<number>
}

export default function HeroPortal({ scrollT }: Props) {
  const points = useRef<THREE.Points>(null!)

  const { portalPalette, portalSettings } = useTheme()

  const {
    particleSize,
    rings,
    pointsPerRing,
    depthStep,
    spiralTightness,
    rotationSpeed,
    zoomStrength,
    hollowSize,
    waveStrength
  } = portalSettings

  const palette = vortexPalettes[portalPalette]

  const geometry = useMemo(() => {
    const positions: number[] = []
    const colors: number[] = []

    for (let i = 0; i < rings; i++) {

      const radius = hollowSize + i * 0.05
      const depth = -i * depthStep

      for (let j = 0; j < pointsPerRing; j++) {

        const angle =
          (j / pointsPerRing) * Math.PI * 2 +
          i * spiralTightness

        const wave =
          Math.sin(i * 0.2) * waveStrength

        const x = Math.cos(angle) * (radius + wave)
        const y = Math.sin(angle) * (radius + wave)
        const z = depth

        positions.push(x, y, z)

        const mixFactor = i / rings
        const color = new THREE.Color(palette.core)
          .lerp(new THREE.Color(palette.outer), mixFactor)

        colors.push(color.r, color.g, color.b)
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    )
    geo.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    )

    return geo
  }, [
    portalPalette,
    rings,
    pointsPerRing,
    depthStep,
    spiralTightness,
    hollowSize,
    waveStrength
  ])

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: particleSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  }, [particleSize])

  useFrame((_, delta) => {
    const t = scrollT.current

    points.current.rotation.z += delta * rotationSpeed

    points.current.position.z =
      THREE.MathUtils.lerp(0, rings * depthStep * 0.8, t)

    const scale =
      THREE.MathUtils.lerp(1, zoomStrength, t)

    points.current.scale.setScalar(scale)
  })

  return <points ref={points} geometry={geometry} material={material} />
}
