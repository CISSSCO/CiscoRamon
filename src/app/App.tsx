import { Routes, Route } from 'react-router-dom'

import Home from '../pages/Home'
import ProjectPage from '../pages/ProjectPage'
import ProjectsList from '../pages/ProjectsList'
import ExperiencePage from '../pages/ExperiencePage'
import AboutPage from '../pages/AboutPage'
import SkillsPage from '../pages/SkillsPage'
import ProjectDocsPage from '../pages/ProjectDocsPage'
import GithubPage from '../pages/GitHub'

import ModernBackground from '../components/ModernBackground'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* High-Performance Ambient Background */}
      <ModernBackground />

      {/* Global Navigation Bar */}
      <Navbar />

      {/* Content Layer */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1, paddingTop: '70px' }}>
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
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  )
}
