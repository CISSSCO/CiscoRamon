import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import Lights from '../canvas/Lights'
import Environment from '../canvas/Environment'
//import HeroOrb from '../sections/HeroOrb'
import HeroCube from '../sections/HeroCube'

import { EffectComposer, Bloom } from '@react-three/postprocessing'

function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3)
}

export default function ExperienceCube() {
    const { camera } = useThree()
    const scrollT = useRef(0)

    useEffect(() => {
        camera.position.set(0, 0, 6)
        camera.lookAt(0, 0, 0)
    }, [camera])

    useFrame(() => {
        const maxScroll =
            document.body.scrollHeight - window.innerHeight

        const raw =
            maxScroll > 0 ? window.scrollY / maxScroll : 0

        scrollT.current = easeOutCubic(
            THREE.MathUtils.clamp(raw, 0, 1)
        )

        camera.position.z = THREE.MathUtils.lerp(
            camera.position.z,
            5.8,
            0.06
        )
    })

    return (
        <>
        {/* 💡 KEEP LIGHTS SUBTLE */}
        <Lights />
        <Environment />
        <HeroCube scrollT={scrollT} />

        {/* ✨ CONTROLLED BLOOM */}
        <EffectComposer multisampling={0}>
        <Bloom
        intensity={0.35}              // ⬇️ much lower
        luminanceThreshold={0.75}     // ⬆️ bloom only bright rim
        luminanceSmoothing={1.0}
        />
        </EffectComposer>
        </>
    )
}
