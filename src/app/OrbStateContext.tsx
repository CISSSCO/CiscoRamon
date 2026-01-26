import * as THREE from 'three'
import { createContext, useContext, useState } from 'react'

type OrbMode = 'idle' | 'project'

type OrbState = {
  mode: OrbMode
  setMode: (m: OrbMode) => void
  color: THREE.Color | null
  setColor: (c: THREE.Color | null) => void
}

const OrbStateContext = createContext<OrbState>({
  mode: 'idle',
  setMode: () => {},
  color: null,
  setColor: () => {}
})

export function OrbStateProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [mode, setMode] = useState<OrbMode>('idle')
  const [color, setColor] = useState<THREE.Color | null>(null)

  return (
    <OrbStateContext.Provider
      value={{ mode, setMode, color, setColor }}
    >
      {children}
    </OrbStateContext.Provider>
  )
}

export function useOrbState() {
  return useContext(OrbStateContext)
}
