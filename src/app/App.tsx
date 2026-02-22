import { Canvas } from '@react-three/fiber'
import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'

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
        zIndex: 0,
      }}
    >
      <ExperienceScene />
    </Canvas>
  )
}

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <Background3D />

      {/* UI Layer */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hamburger */}
        <Hamburger onClick={() => setDrawerOpen(true)} />

        {/* Theme Drawer */}
        <ThemeDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />

        {/* Routes */}
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
