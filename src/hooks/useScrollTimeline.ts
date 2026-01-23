
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

export function useScrollTimeline(
  setup: (tl: gsap.core.Timeline) => void
) {
  const scroll = useScroll()
  const timeline = useRef<gsap.core.Timeline | null>(null)

  useLayoutEffect(() => {
    const tl = gsap.timeline({ paused: true })
    setup(tl)
    timeline.current = tl

    return () => {
      tl.kill()
    }
  }, [setup])

  useFrame(() => {
    if (!timeline.current) return
    const progress = scroll.offset // 0 → 1
    timeline.current.progress(progress)
  })
}
