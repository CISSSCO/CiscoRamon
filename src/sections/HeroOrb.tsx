import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ProceduralMaterial } from './ProceduralMaterial'
import { useOrbState } from '../app/OrbStateContext'
import { useSectionIndex } from '../app/SectionIndexContext'

type Props = {
    scrollT: React.MutableRefObject<number>
}

export default function HeroOrb({ scrollT }: Props) {
    // 🔒 persistent scale bias (DO NOT jump per section)
    //const currentScaleBias = useRef(1)
    //const targetScaleBias = useRef(1)
    const mesh = useRef<THREE.Mesh>(null!)
    const { mouse } = useThree()
    const { mode, color: projectColor } = useOrbState()
    const { index } = useSectionIndex()

    // 🎨 persistent color state (VERY important)
    const currentColor = useRef(new THREE.Color('#00e5ff'))
    const targetColor = useRef(new THREE.Color('#00e5ff'))

    // cyberpunk accent colors
    const CYAN = new THREE.Color('#00e5ff')
    const VIOLET = new THREE.Color('#8b5cf6')
    const MAGENTA = new THREE.Color('#ff4fd8')
    const BLUE = new THREE.Color('#4f6bdf')     
    const TEAL = new THREE.Color('#2dd4bf')

    useFrame((_, delta) => {
        const t = scrollT.current

        /* ===============================
       SECTION PARAMETERS
    =============================== */
        let speed = 0.6
        let scaleBias = 1
        let rotationSpeed = 1

        /* ===============================
       SECTION COLOR TARGETS
    =============================== */
        if (index === 0) {
            // HERO — electric cyan
            targetColor.current.copy(CYAN)
            speed = 0.9
        }

        if (index === 1) {
            // PROJECTS — neon violet
            targetColor.current.copy(VIOLET)
            speed = 1.1
            scaleBias = 1
            rotationSpeed = 1.2
        }

        if (index === 2) {
            // EXPERIENCE — cyberpunk magenta
            targetColor.current.copy(MAGENTA)
            speed = 1.3
            scaleBias = 1
            rotationSpeed = 1.4
        }

        if (index === 3) {
            targetColor.current.copy(BLUE)
            speed = 1.55
            scaleBias = 1
            rotationSpeed = 1.5
        }

        if (index === 4) {
            // CONTACT — synthwave teal
            targetColor.current.copy(TEAL)
            speed = 1.75
            rotationSpeed = 1.6
        }

        /* ===============================
       PROJECT HOVER OVERRIDE
    =============================== */
        if (projectColor) {
            targetColor.current.copy(projectColor)
        }

        /* ===============================
       CYBERPUNK COLOR DRIFT
       (subtle breathing glow)
    =============================== */
        const glowPhase =
            Math.sin(ProceduralMaterial.uniforms.uTime.value * 0.6) * 0.08

        const glowColor = targetColor.current
            .clone()
            .lerp(MAGENTA, glowPhase)

        /* ===============================
       SMOOTH COLOR TRANSITION
    =============================== */
        currentColor.current.lerp(
            glowColor,
            1 - Math.exp(-delta * 4)
        )

        ProceduralMaterial.uniforms.uColor.value.copy(
            currentColor.current
        )

        /* ===============================
       TIME / DEFORMATION
    =============================== */
        ProceduralMaterial.uniforms.uTime.value +=
            delta * speed * (mode === 'project' ? 1.3 : 1)

        /* ===============================
       ROTATION
    =============================== */
        mesh.current.rotation.y += delta * 0.15 * rotationSpeed
        mesh.current.rotation.x += delta * 0.05 * rotationSpeed

        /* ===============================
       MOUSE ATTRACTION
    =============================== */
        const baseX = 1.5
        const baseY = 0

        mesh.current.position.x = THREE.MathUtils.lerp(
            mesh.current.position.x,
            baseX + mouse.x * 0.6,
            0.05
        )

        mesh.current.position.y = THREE.MathUtils.lerp(
            mesh.current.position.y,
            baseY + mouse.y * 0.4,
            0.05
        )

        /* ===============================
       SCROLL DEPTH
    =============================== */
        mesh.current.position.z = THREE.MathUtils.lerp(0, -12, t)

        /* ===============================
       SCALE + MICRO WOBBLE
       (cyberpunk feel)
    =============================== */
        const baseScale = THREE.MathUtils.lerp(0.7, 6.5, t)

        const pulse =
            mode === 'project'
            ? 1 + Math.sin(ProceduralMaterial.uniforms.uTime.value * 3) * 0.07
            : 1

        const wobble =
            1 + Math.sin(ProceduralMaterial.uniforms.uTime.value * 1.2) * 0.015

        mesh.current.scale.setScalar(
            baseScale * pulse * scaleBias * wobble
        )
    })

    return (
        <mesh ref={mesh}>
        <icosahedronGeometry args={[1.8, 64]} />
        <primitive object={ProceduralMaterial} attach="material" />
        </mesh>
    )
}
