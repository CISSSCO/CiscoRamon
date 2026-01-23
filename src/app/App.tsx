
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import Experience from './Experience'

export default function App() {
  return (
    <Canvas
      gl={{ antialias: true }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 8], fov: 45 }}
    >
      <ScrollControls pages={5} damping={0.25}>
        <Experience />
      </ScrollControls>
    </Canvas>
  )
}
