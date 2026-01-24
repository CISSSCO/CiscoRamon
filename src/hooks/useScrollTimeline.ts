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

  const lastOffset = useRef(scroll.offset)
  const { focused, clear } = useProjectFocus()

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

    const delta = Math.abs(scroll.offset - lastOffset.current)
    lastOffset.current = scroll.offset

    // ✅ ANY scroll movement cancels focus
    if (focused && delta > 0.0001) {
      clear()
    }

    // ✅ Scroll always drives the timeline
    timeline.current.progress(scroll.offset)
  })
}
