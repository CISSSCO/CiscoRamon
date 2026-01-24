import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useProjectFocus } from '../app/ProjectFocusContext'

export function useScrollTimeline(
  setup: (tl: gsap.core.Timeline) => void
) {
  const scroll = useScroll()
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const { focused } = useProjectFocus()

  useEffect(() => {
    const tl = gsap.timeline({ paused: true })
    setup(tl)
    timeline.current = tl

    return () => {
      tl.kill()
      timeline.current = null
    }
  }, [setup])

  useFrame(() => {
    if (!timeline.current) return

    // 🔒 Focus NEVER alters the scroll narrative
    if (focused) return

    // Scroll is authoritative and reversible
    timeline.current.progress(scroll.offset)
  })
}
