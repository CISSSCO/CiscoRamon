import { useThree, useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

export default function CameraRig() {
    const { camera } = useThree()
    const scroll = useScroll()

    useFrame(() => {
        const z = THREE.MathUtils.lerp(8, -28, scroll.offset)
        camera.position.set(0, 0, z)
        camera.lookAt(0, 0, z - 5)
    })

    return null
}
