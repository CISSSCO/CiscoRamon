import { createContext, useContext, useState } from 'react'

type SectionIndexContextType = {
    index: number
    setIndex: (i: number) => void
}

const SectionIndexContext = createContext<SectionIndexContextType>({
    index: 0,
    setIndex: () => {}
})

export function SectionIndexProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [index, setIndex] = useState(0)

    return (
        <SectionIndexContext.Provider value={{ index, setIndex }}>
        {children}
        </SectionIndexContext.Provider>
    )
}

export function useSectionIndex() {
    return useContext(SectionIndexContext)
}
