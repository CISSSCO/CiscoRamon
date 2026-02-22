import { createContext, useContext, useState } from 'react'

export type SceneModel = 'orb' | 'cube'

type ThemeState = {
  model: SceneModel
  setModel: (m: SceneModel) => void

  sectionColors: Record<string, string>
  setSectionColor: (section: string, color: string) => void
}

const defaultColors = {
  home: '#ffffff',
  projects: '#00bfff',
  about: '#ff69b4',
  skills: '#ffd700',
  github: '#00ff7f',
}

const ThemeContext = createContext<ThemeState | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState<SceneModel>('orb')
  const [sectionColors, setSectionColors] =
    useState<Record<string, string>>(defaultColors)

  function setSectionColor(section: string, color: string) {
    setSectionColors(prev => ({
      ...prev,
      [section]: color,
    }))
  }

  return (
    <ThemeContext.Provider
      value={{
        model,
        setModel,
        sectionColors,
        setSectionColor,
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
