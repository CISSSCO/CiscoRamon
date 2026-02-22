import { createContext, useContext, useEffect, useState } from 'react'

export type SceneModel = 'orb' | 'cube' | 'particles'
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

type ThemeState = {
  model: SceneModel
  setModel: (m: SceneModel) => void

  particlePalette: string
  setParticlePalette: (p: string) => void

  particleSettings: ParticleSettings
  setParticleSettings: (s: Partial<ParticleSettings>) => void

  randomizeParticles: () => void
}

const ThemeContext = createContext<ThemeState | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState<SceneModel>(
    () => (localStorage.getItem('model') as SceneModel) || 'orb'
  )

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

  useEffect(() => {
    localStorage.setItem('model', model)
  }, [model])

  useEffect(() => {
    localStorage.setItem('particlePalette', particlePalette)
  }, [particlePalette])

  useEffect(() => {
    localStorage.setItem(
      'particleSettings',
      JSON.stringify(particleSettings)
    )
  }, [particleSettings])

  return (
    <ThemeContext.Provider
      value={{
        model,
        setModel,
        particlePalette,
        setParticlePalette,
        particleSettings,
        setParticleSettings,
        randomizeParticles
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
