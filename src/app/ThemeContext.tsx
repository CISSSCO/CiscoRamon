import { createContext, useContext, useEffect, useState } from 'react'

export type SceneModel = 'orb' | 'cube' | 'particles'

type ParticleSettings = {
  count: number
  speed: number
  size: number
  softness: number
  bounds: number
}

type ThemeState = {
  model: SceneModel
  setModel: (m: SceneModel) => void

  particlePalette: string
  setParticlePalette: (p: string) => void

  particleSettings: ParticleSettings
  setParticleSettings: (s: Partial<ParticleSettings>) => void
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
          }
    })

  function setParticleSettings(update: Partial<ParticleSettings>) {
    setParticleSettingsState(prev => ({
      ...prev,
      ...update,
    }))
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
