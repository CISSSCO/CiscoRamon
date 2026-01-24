import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useScrollTimeline(
  setup: (tl: gsap.core.Timeline) => void
) {
  const scroll = useScroll()
  const timeline = useRef<gsap.core.Timeline | null>(null)

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
    timeline.current.progress(scroll.offset)
  })
}
