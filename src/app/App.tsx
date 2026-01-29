import { Canvas } from '@react-three/fiber'
import { Routes, Route } from 'react-router-dom'

import Experience from './Experience'
import Home from '../pages/Home'
import ProjectPage from '../pages/ProjectPage'
import ProjectsList from '../pages/ProjectsList'
import ExperiencePage from '../pages/ExperiencePage'
import AboutPage from '../pages/AboutPage'
import SkillsPage from '../pages/SkillsPage'

function Background3D() {
    return (
        <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    >
        <Experience />
        </Canvas>
    )
}

export default function App() {
    return (
        <>
        <Background3D />

        <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="/experience/:id" element={<ExperiencePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/skills" element={<SkillsPage />} />

        </Routes>
        </div>
        </>
    )
}
