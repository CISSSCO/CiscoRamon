import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { vortexPalettes } from './portalPalettes'

type Props = {
  scrollT: React.MutableRefObject<number>
}

export default function HeroPortal({ scrollT }: Props) {
  const points = useRef<THREE.Points>(null!)

  /* ===============================
     USER CONTROLS (EDIT LIVE)
  =============================== */

  const [paletteKey, setPaletteKey] =
    useState<keyof typeof vortexPalettes>('electricBlue')

  const [particleSize, setParticleSize] = useState(0.13)
  const [rings, setRings] = useState(120)
  const [pointsPerRing, setPointsPerRing] = useState(120)
  const [depthStep, setDepthStep] = useState(0.3)
  const [spiralTightness, setSpiralTightness] = useState(0.15)
  const [rotationSpeed, setRotationSpeed] = useState(0.3)
  const [zoomStrength, setZoomStrength] = useState(3)
  const [hollowSize, setHollowSize] = useState(1.5)
  const [waveStrength, setWaveStrength] = useState(0.7)

  const palette = vortexPalettes[paletteKey]

  /* ===============================
     GEOMETRY
  =============================== */

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
    paletteKey,
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

  /* ===============================
     ANIMATION
  =============================== */

  useFrame((state, delta) => {
    const t = scrollT.current

    points.current.rotation.z += delta * rotationSpeed

    points.current.position.z =
      THREE.MathUtils.lerp(0, rings * depthStep * 0.8, t)

    const scale =
      THREE.MathUtils.lerp(1, zoomStrength, t)

    points.current.scale.setScalar(scale)
  })

  /* ===============================
     UI PANEL
  =============================== */

  return (
    <>
      <points ref={points} geometry={geometry} material={material} />

      <Html position={[0, 6, 0]} center>
        <div
          style={{
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(12px)',
            padding: 14,
            borderRadius: 10,
            color: 'white',
            width: 260,
            fontSize: 12
          }}
        >

          <div>
            <label>Palette</label>
            <select
              value={paletteKey}
              onChange={e =>
                setPaletteKey(e.target.value as any)
              }
              style={{ width: '100%' }}
            >
              {Object.keys(vortexPalettes).map(key => (
                <option key={key} value={key}>
                  {vortexPalettes[key].name}
                </option>
              ))}
            </select>
          </div>

          <Slider label="Particle Size" value={particleSize} min={0.005} max={0.1} step={0.005} onChange={setParticleSize} />
          <Slider label="Rings" value={rings} min={20} max={200} step={10} onChange={setRings} />
          <Slider label="Points/Ring" value={pointsPerRing} min={20} max={200} step={10} onChange={setPointsPerRing} />
          <Slider label="Depth Step" value={depthStep} min={0.1} max={1} step={0.05} onChange={setDepthStep} />
          <Slider label="Spiral Tightness" value={spiralTightness} min={0.05} max={0.4} step={0.01} onChange={setSpiralTightness} />
          <Slider label="Rotation Speed" value={rotationSpeed} min={0} max={2} step={0.05} onChange={setRotationSpeed} />
          <Slider label="Zoom Strength" value={zoomStrength} min={1} max={6} step={0.1} onChange={setZoomStrength} />
          <Slider label="Hollow Size" value={hollowSize} min={0.5} max={4} step={0.1} onChange={setHollowSize} />
          <Slider label="Wave Strength" value={waveStrength} min={0} max={2} step={0.05} onChange={setWaveStrength} />

        </div>
      </Html>
    </>
  )
}

/* ===============================
   REUSABLE SLIDER COMPONENT
=============================== */

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange
}: any) {
  return (
    <div style={{ marginTop: 6 }}>
      <div>{label}: {value}</div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={e =>
          onChange(parseFloat(e.target.value))
        }
        style={{ width: '100%' }}
      />
    </div>
  )
}
