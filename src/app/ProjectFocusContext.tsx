import { createContext, useContext, useState } from 'react'

export type Project = {
  id: number
  position: [number, number, number]
  color: string
}

type FocusContextType = {
  focused: Project | null
  focus: (p: Project) => void
  clear: () => void
}

// ✅ default SAFE context (no throw)
const FocusContext = createContext<FocusContextType>({
  focused: null,
  focus: () => {},
  clear: () => {}
})

export function ProjectFocusProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [focused, setFocused] = useState<Project | null>(null)

  return (
    <FocusContext.Provider
      value={{
        focused,
        focus: setFocused,
        clear: () => setFocused(null)
      }}
    >
      {children}
    </FocusContext.Provider>
  )
}

export function useProjectFocus() {
  return useContext(FocusContext)
}
