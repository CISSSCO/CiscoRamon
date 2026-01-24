import { Canvas } from '@react-three/fiber'
import { Routes, Route, useLocation } from 'react-router-dom'

import Experience from './Experience'
import Home from '../pages/Home'
import ProjectPage from '../pages/ProjectPage'

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

  return (
    <>
      {/* 3D background only on home */}
      {location.pathname === '/' && <Background3D />}

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
