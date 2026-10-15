import { useEffect, useState } from 'react'

export default function ModernBackground() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let frameId: number
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 40
        const y = (e.clientY / window.innerHeight - 0.5) * 40
        setMouse({ x, y })
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        backgroundColor: 'var(--bg-base)',
        transition: 'background-color 0.35s ease',
      }}
    >
      {/* Subtle grid pattern with radial fade */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(var(--border-subtle) 1px, transparent 1px),
            linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 80%)',
        }}
      />

      {/* Primary Cyan Glow Blob */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '20%',
          width: '55vw',
          height: '55vw',
          maxWidth: '800px',
          maxHeight: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.16) 0%, rgba(14, 165, 233, 0) 70%)',
          filter: 'blur(90px)',
          transform: `translate(${mouse.x * 0.8}px, ${mouse.y * 0.8}px)`,
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* Violet Glow Blob */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '15%',
          width: '60vw',
          height: '60vw',
          maxWidth: '850px',
          maxHeight: '850px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.14) 0%, rgba(139, 92, 246, 0) 70%)',
          filter: 'blur(110px)',
          transform: `translate(${mouse.x * -0.6}px, ${mouse.y * -0.6}px)`,
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* Emerald Accent Blob */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '35%',
          width: '45vw',
          height: '45vw',
          maxWidth: '650px',
          maxHeight: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 70%)',
          filter: 'blur(100px)',
          transform: `translate(${mouse.x * 0.4}px, ${mouse.y * 0.4}px)`,
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* Top ambient highlight line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.4), rgba(168, 85, 247, 0.4), transparent)',
        }}
      />
    </div>
  )
}

