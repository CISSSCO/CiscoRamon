import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll } from '@react-three/drei'
import Experience from './Experience'
import ProjectsHTML from '../html/ProjectsHTML'

export default function App() {
  return (
    <Canvas
      gl={{ antialias: true }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 8], fov: 45 }}
    >
      <ScrollControls pages={6} damping={0.25}>
        {/* 3D content */}
        <Experience />

        {/* HTML content (same scroll context) */}
        <Scroll html>
          <ProjectsHTML />
        </Scroll>
      </ScrollControls>
    </Canvas>
  )
}
