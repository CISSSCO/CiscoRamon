import { createContext, useContext, useEffect, useState } from 'react'

/* ===============================
   TYPES
================================ */

export type SceneModel = 'orb' | 'cube' | 'particles' | 'spiral' | 'none'
export type MotionType = 'bounce' | 'float' | 'gravity' | 'swirl'

type ParticleSettings = {
  count: number
  speed: number
  size: number
  softness: number
  bounds: number
  motion: MotionType
  parallax: number
}

type SpiralSettings = {
  particleSize: number
  rings: number
  pointsPerRing: number
  depthStep: number
  spiralTightness: number
  rotationSpeed: number
  zoomStrength: number
  hollowSize: number
  waveStrength: number
}

type CubeSettings = {
  dimension: number
  cubieSize: number
  gap: number
  smoothness: number
}

/* ===============================
   ✅ BACKGROUND
================================ */


type BackgroundMode = 'solid' | 'gradient' | 'image'
type GradientType = 'linear' | 'radial' | 'mesh'
type ImageFit = 'cover' | 'contain' | 'auto'

type BackgroundSettings = {
  mode: BackgroundMode
  solidColor: string
  gradientType: GradientType
  gradientFrom: string
  gradientTo: string
  image: string | null
  imageFit: ImageFit
  imageZoom: number
}

type ThemeState = {
  model: SceneModel
  setModel: (m: SceneModel) => void

  particlePalette: string
  setParticlePalette: (p: string) => void
  particleSettings: ParticleSettings
  setParticleSettings: (s: Partial<ParticleSettings>) => void
  randomizeParticles: () => void

  spiralPalette: string
  setSpiralPalette: (p: string) => void
  spiralSettings: SpiralSettings
  setSpiralSettings: (s: Partial<SpiralSettings>) => void

  cubeSettings: CubeSettings
  setCubeSettings: (s: Partial<CubeSettings>) => void
  randomizeCube: () => void

  /* ✅ background */
  backgroundSettings: BackgroundSettings
  setBackgroundSettings: (s: Partial<BackgroundSettings>) => void
}

const ThemeContext = createContext<ThemeState | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {

  const [model, setModel] = useState<SceneModel>(
    () => (localStorage.getItem('model') as SceneModel) || 'orb'
  )

  /* ================= PARTICLES ================= */

  const [particlePalette, setParticlePalette] = useState(
    () => localStorage.getItem('particlePalette') || 'cyberpunk'
  )

  const [particleSettings, setParticleSettingsState] =
    useState<ParticleSettings>(() => {
      const saved = localStorage.getItem('particleSettings')
      return saved
        ? JSON.parse(saved)
        : {
            count: 50,
            speed: 50,
            size: 0.7,
            softness: 0.15,
            bounds: 14,
            motion: 'bounce',
            parallax: 0.4
          }
    })

  function setParticleSettings(update: Partial<ParticleSettings>) {
    setParticleSettingsState(prev => ({ ...prev, ...update }))
  }

  function randomizeParticles() {
    setParticleSettingsState({
      count: Math.floor(30 + Math.random() * 80),
      speed: 20 + Math.random() * 100,
      size: 0.3 + Math.random() * 1.5,
      softness: Math.random() * 0.6,
      bounds: 8 + Math.random() * 20,
      motion: ['bounce', 'float', 'gravity', 'swirl'][
        Math.floor(Math.random() * 4)
      ] as MotionType,
      parallax: Math.random() * 1.2
    })
  }

  /* ================= SPIRAL ================= */

  const [spiralPalette, setSpiralPalette] = useState(
    () => localStorage.getItem('spiralPalette') || 'electricBlue'
  )

  const [spiralSettings, setSpiralSettingsState] =
    useState<SpiralSettings>(() => {
      const saved = localStorage.getItem('spiralSettings')
      return saved
        ? JSON.parse(saved)
        : {
            particleSize: 0.03,
            rings: 120,
            pointsPerRing: 120,
            depthStep: 0.3,
            spiralTightness: 0.15,
            rotationSpeed: 0.3,
            zoomStrength: 3,
            hollowSize: 1.5,
            waveStrength: 0.7
          }
    })

  function setSpiralSettings(update: Partial<SpiralSettings>) {
    setSpiralSettingsState(prev => ({ ...prev, ...update }))
  }

  /* ================= CUBE ================= */

  const [cubeSettings, setCubeSettingsState] =
    useState<CubeSettings>(() => {
      const saved = localStorage.getItem('cubeSettings')
      return saved
        ? JSON.parse(saved)
        : {
            dimension: 3,
            cubieSize: 0.9,
            gap: 0.06,
            smoothness: 3
          }
    })

  function setCubeSettings(update: Partial<CubeSettings>) {
    setCubeSettingsState(prev => ({ ...prev, ...update }))
  }

  function randomizeCube() {
    setCubeSettingsState({
      dimension: 3 + Math.floor(Math.random() * 6),
      cubieSize: 0.6 + Math.random() * 0.6,
      gap: 0.03 + Math.random() * 0.1,
      smoothness: 2 + Math.floor(Math.random() * 6)
    })
  }

  /* ================= BACKGROUND ================= */

    const [backgroundSettings, setBackgroundSettingsState] =
      useState<BackgroundSettings>(() => {
        const saved = localStorage.getItem('backgroundSettings')
        return saved
          ? JSON.parse(saved)
          : {
              mode: 'solid',
              solidColor: '#000000',
              gradientType: 'linear',
              gradientFrom: '#000000',
              gradientTo: '#111111',
              image: null,
              imageFit: 'cover',
              imageZoom: 1
            }
      })

  function setBackgroundSettings(update: Partial<BackgroundSettings>) {
    setBackgroundSettingsState(prev => ({ ...prev, ...update }))
  }

  /* ================= PERSISTENCE ================= */

  useEffect(() => {
    localStorage.setItem('model', model)
  }, [model])

  useEffect(() => {
    localStorage.setItem('particlePalette', particlePalette)
  }, [particlePalette])

  useEffect(() => {
    localStorage.setItem('particleSettings', JSON.stringify(particleSettings))
  }, [particleSettings])

  useEffect(() => {
    localStorage.setItem('spiralPalette', spiralPalette)
  }, [spiralPalette])

  useEffect(() => {
    localStorage.setItem('spiralSettings', JSON.stringify(spiralSettings))
  }, [spiralSettings])

  useEffect(() => {
    localStorage.setItem('cubeSettings', JSON.stringify(cubeSettings))
  }, [cubeSettings])

  useEffect(() => {
    localStorage.setItem('backgroundSettings', JSON.stringify(backgroundSettings))
  }, [backgroundSettings])

  return (
    <ThemeContext.Provider
      value={{
        model,
        setModel,

        particlePalette,
        setParticlePalette,
        particleSettings,
        setParticleSettings,
        randomizeParticles,

        spiralPalette,
        setSpiralPalette,
        spiralSettings,
        setSpiralSettings,

        cubeSettings,
        setCubeSettings,
        randomizeCube,

        backgroundSettings,
        setBackgroundSettings
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('ThemeContext not found')
  return ctx
}
