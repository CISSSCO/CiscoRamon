import { Canvas } from '@react-three/fiber'
import { Routes, Route, useLocation } from 'react-router-dom'

import Experience from './Experience'
import Home from '../pages/Home'
import ProjectPage from '../pages/ProjectPage'
import { useOrbState } from './OrbStateContext'
import { useEffect } from 'react'

function Background3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0
      }}
    >
      <Experience />
    </Canvas>
  )
}

export default function App() {
  const location = useLocation()
  const { setMode } = useOrbState()

  // 🔁 Switch orb mode per route
  useEffect(() => {
    if (location.pathname.startsWith('/project')) {
      setMode('project')
    } else {
      setMode('idle')
    }
  }, [location.pathname, setMode])

  return (
    <>
      {/* Always render background */}
      <Background3D />

      {/* HTML content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>
      </div>
    </>
  )
}
