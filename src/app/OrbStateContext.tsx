
import { createContext, useContext, useState } from 'react'

type OrbMode = 'idle' | 'project'

type OrbState = {
  mode: OrbMode
  setMode: (m: OrbMode) => void
}

const OrbStateContext = createContext<OrbState>({
  mode: 'idle',
  setMode: () => {}
})

export function OrbStateProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [mode, setMode] = useState<OrbMode>('idle')

  return (
    <OrbStateContext.Provider value={{ mode, setMode }}>
      {children}
    </OrbStateContext.Provider>
  )
}

export function useOrbState() {
  return useContext(OrbStateContext)
}
