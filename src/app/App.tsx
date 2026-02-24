import { Canvas } from '@react-three/fiber'
import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import * as THREE from 'three'

import { useTheme } from './ThemeContext'
import ExperienceScene from './ExperienceScene'

import Home from '../pages/Home'
import ProjectPage from '../pages/ProjectPage'
import ProjectsList from '../pages/ProjectsList'
import ExperiencePage from '../pages/ExperiencePage'
import AboutPage from '../pages/AboutPage'
import SkillsPage from '../pages/SkillsPage'
import ProjectDocsPage from '../pages/ProjectDocsPage'
import GithubPage from '../pages/GitHub'

import Hamburger from '../components/Hamburger'
import ThemeDrawer from '../components/ThemeDrawer'

function Background3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
      }}
      gl={{
        alpha: true,
        antialias: true,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color(0x000000), 0)
      }}
    >
      <ExperienceScene />
    </Canvas>
  )
}

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { backgroundSettings, model } = useTheme()


/* ================= BACKGROUND LOGIC ================= */

let background = '#000'

if (backgroundSettings.mode === 'solid') {
  background = backgroundSettings.solidColor
}

if (backgroundSettings.mode === 'gradient') {
  switch (backgroundSettings.gradientType) {
    case 'linear':
      background = `linear-gradient(135deg, ${backgroundSettings.gradientFrom}, ${backgroundSettings.gradientTo})`
      break

    case 'radial':
      background = `radial-gradient(circle at center, ${backgroundSettings.gradientFrom}, ${backgroundSettings.gradientTo})`
      break

    case 'mesh':
      background = `
        radial-gradient(at 20% 30%, ${backgroundSettings.gradientFrom}, transparent),
        radial-gradient(at 80% 70%, ${backgroundSettings.gradientTo}, transparent)
      `
      break
  }
}

if (backgroundSettings.mode === 'image' && backgroundSettings.image) {
  background = `url(${backgroundSettings.image})`
}

  return (
    <>
      {/* BACKGROUND LAYER */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background,
          backgroundSize:
            backgroundSettings.mode === 'image'
              ? backgroundSettings.imageFit
              : 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          transform:
            backgroundSettings.mode === 'image'
              ? `scale(${backgroundSettings.imageZoom})`
              : undefined,
        }}
      />

      {/* 3D CANVAS */}
      {model !== 'none' && <Background3D />}

      {/* UI Layer */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Hamburger onClick={() => setDrawerOpen(true)} />

        <ThemeDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route path="/experience/:id" element={<ExperiencePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/project/:id/docs" element={<ProjectDocsPage />} />
          <Route path="/github" element={<GithubPage />} />
        </Routes>
      </div>
    </>
  )
}
