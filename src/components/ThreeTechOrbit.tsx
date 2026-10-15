import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface ThreeTechOrbitProps {
  technologies: Array<{
    name: string
    count: number
    percentage: number
    projects: string[]
  }>
  onSelectTech: (tech: string) => void
  activeTech?: string
}

export default function ThreeTechOrbit({ technologies, onSelectTech, activeTech }: ThreeTechOrbitProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [selectedNode, setSelectedNode] = useState<{
    name: string
    count: number
    projects: string[]
  } | null>(null)

  useEffect(() => {
    if (activeTech) {
      const match = technologies.find((t) => t.name.toLowerCase() === activeTech.toLowerCase())
      setSelectedNode(match || null)
    } else {
      setSelectedNode(null)
    }
  }, [activeTech, technologies])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 800
    const height = 480

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.set(0, 20, 180)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x00f2fe, 3, 250)
    pointLight.position.set(0, 0, 0)
    scene.add(pointLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(50, 80, 100)
    scene.add(dirLight)

    // Central Cyber Sphere Core
    const coreGeometry = new THREE.IcosahedronGeometry(22, 1)
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    })
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial)
    scene.add(coreMesh)

    // Particle Cloud Background
    const particleCount = 200
    const particleGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 350
      positions[i + 1] = (Math.random() - 0.5) * 300
      positions[i + 2] = (Math.random() - 0.5) * 350
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 1.8,
      transparent: true,
      opacity: 0.5,
    })
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particleSystem)

    // Helper: Create Text Sprite (Dynamically measured, zero text cutting)
    const createTextSprite = (text: string, count: number) => {
      const fullLabel = `${text} (${count}x)`
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return new THREE.Sprite()

      ctx.font = 'bold 24px monospace'
      const metrics = ctx.measureText(fullLabel)
      const paddingX = 26
      const canvasWidth = Math.max(170, Math.ceil(metrics.width) + paddingX * 2)
      const canvasHeight = 64

      canvas.width = canvasWidth
      canvas.height = canvasHeight

      // Context state resets on canvas dimension resize
      ctx.font = 'bold 24px monospace'
      ctx.fillStyle = 'rgba(10, 15, 28, 0.92)'
      ctx.strokeStyle = '#00f2fe'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.roundRect(4, 4, canvasWidth - 8, canvasHeight - 8, 10)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(fullLabel, canvasWidth / 2, canvasHeight / 2)

      const texture = new THREE.CanvasTexture(canvas)
      texture.minFilter = THREE.LinearFilter
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.95 })
      const sprite = new THREE.Sprite(spriteMaterial)
      const baseHeight = 5.6
      const aspect = canvasWidth / canvasHeight
      sprite.scale.set(baseHeight * aspect, baseHeight, 1)
      return sprite
    }

    // Technology Nodes Group
    const nodesGroup = new THREE.Group()
    scene.add(nodesGroup)

    const clickableMeshes: THREE.Mesh[] = []
    const topTech = technologies.slice(0, 22)
    const n = topTech.length

    topTech.forEach((tech, i) => {
      // Fibonacci sphere distribution for uniform 3D distribution
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n)
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
      const orbitRadius = 65 + (i % 3) * 16

      const x = orbitRadius * Math.sin(phi) * Math.cos(theta)
      const y = orbitRadius * Math.sin(phi) * Math.sin(theta) * 0.75
      const z = orbitRadius * Math.cos(phi)

      // Node Radius based on count
      const nodeRadius = tech.count >= 4 ? 6.5 : tech.count === 3 ? 5.2 : tech.count === 2 ? 4.2 : 3.2
      const nodeGeo = new THREE.SphereGeometry(nodeRadius, 20, 20)

      // Color scheme based on frequency
      const colorHex = tech.count >= 4 ? 0xfcee0a : tech.count === 3 ? 0x00f2fe : tech.count === 2 ? 0x818cf8 : 0x10b981
      const nodeMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.35,
        roughness: 0.2,
        metalness: 0.8,
      })

      const mesh = new THREE.Mesh(nodeGeo, nodeMat)
      mesh.position.set(x, y, z)
      mesh.userData = tech
      nodesGroup.add(mesh)
      clickableMeshes.push(mesh)

      // Text Sprite Label
      const sprite = createTextSprite(tech.name, tech.count)
      sprite.position.set(x, y + nodeRadius + 5, z)
      nodesGroup.add(sprite)

      // Orbital connecting ray to center
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, z),
      ])
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x00f2fe,
        transparent: true,
        opacity: tech.count >= 3 ? 0.35 : 0.15,
      })
      const rayLine = new THREE.Line(lineGeo, lineMat)
      nodesGroup.add(rayLine)
    })

    // Mouse Controls & Drag Interaction
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    let targetRotationX = 0.2
    let targetRotationY = 0
    const currentRotation = { x: 0.2, y: 0 }

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX
        const deltaY = e.clientY - prevMouseY
        targetRotationY += deltaX * 0.008
        targetRotationX += deltaY * 0.008
        prevMouseX = e.clientX
        prevMouseY = e.clientY
      }

      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }

    const onMouseUp = () => {
      isDragging = false
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      camera.position.z = Math.max(90, Math.min(260, camera.position.z + e.deltaY * 0.12))
    }

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(clickableMeshes)

      if (intersects.length > 0) {
        const hit = intersects[0].object
        const techData = hit.userData as typeof topTech[0]
        setSelectedNode(techData)
        onSelectTech(techData.name)
      }
    }

    const dom = renderer.domElement
    dom.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    dom.addEventListener('wheel', onWheel, { passive: false })
    dom.addEventListener('click', onClick)

    // Touch Support for mobile
    let prevTouchX = 0
    let prevTouchY = 0
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true
        prevTouchX = e.touches[0].clientX
        prevTouchY = e.touches[0].clientY
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevTouchX
        const deltaY = e.touches[0].clientY - prevTouchY
        targetRotationY += deltaX * 0.008
        targetRotationX += deltaY * 0.008
        prevTouchX = e.touches[0].clientX
        prevTouchY = e.touches[0].clientY
      }
    }
    const onTouchEnd = () => {
      isDragging = false
    }
    dom.addEventListener('touchstart', onTouchStart, { passive: true })
    dom.addEventListener('touchmove', onTouchMove, { passive: true })
    dom.addEventListener('touchend', onTouchEnd)

    // Resize Handler
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = 480
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // Animation Loop
    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)

      // Momentum damping
      currentRotation.x += (targetRotationX - currentRotation.x) * 0.08
      currentRotation.y += (targetRotationY - currentRotation.y) * 0.08

      // Slow idle rotation when not dragging
      if (!isDragging) {
        targetRotationY += 0.0018
      }

      nodesGroup.rotation.y = currentRotation.y
      nodesGroup.rotation.x = currentRotation.x
      coreMesh.rotation.y += 0.008
      coreMesh.rotation.x += 0.004

      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      dom.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      dom.removeEventListener('wheel', onWheel)
      dom.removeEventListener('click', onClick)
      dom.removeEventListener('touchstart', onTouchStart)
      dom.removeEventListener('touchmove', onTouchMove)
      dom.removeEventListener('touchend', onTouchEnd)

      if (container.contains(dom)) {
        container.removeChild(dom)
      }
      renderer.dispose()
      coreGeometry.dispose()
      coreMaterial.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
    }
  }, [technologies, onSelectTech])

  return (
    <div style={{ position: 'relative', width: '100%', height: '480px', userSelect: 'none' }}>
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          borderRadius: '14px',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at center, rgba(12, 17, 30, 0.6) 0%, rgba(6, 8, 15, 0.95) 100%)',
          border: '1px solid var(--border-cyber)',
        }}
      />

      {/* Control Instructions Badge */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.72rem',
          color: 'var(--cyber-cyan)',
          background: 'rgba(12, 18, 32, 0.85)',
          padding: '0.35rem 0.75rem',
          borderRadius: '6px',
          border: '1px solid var(--border-cyber)',
          pointerEvents: 'none',
        }}
      >
        <span>DRAG TO ORBIT 3D · SCROLL TO ZOOM · CLICK TO FILTER</span>
      </div>

      {/* Node Info Floating HUD */}
      {selectedNode && (
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            right: '1rem',
            maxWidth: '460px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--cyber-yellow)',
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            boxShadow: '0 8px 28px rgba(0, 0, 0, 0.6), 0 0 16px rgba(252, 238, 10, 0.25)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            animation: 'fadeIn 0.2s ease',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--cyber-yellow)', fontWeight: 800, fontSize: '1.05rem' }}>
              ⚡ {selectedNode.name.toUpperCase()}
            </span>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: 'var(--cyber-cyan)' }}>
              {selectedNode.count} {selectedNode.count === 1 ? 'REPOSITORY' : 'REPOSITORIES'}
            </span>
          </div>

          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Associated Projects: <strong style={{ color: 'var(--text-main)' }}>{selectedNode.projects.join(', ')}</strong>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
            <button
              onClick={() => onSelectTech(selectedNode.name)}
              className="cyber-action-btn primary"
              style={{ fontSize: '0.72rem', padding: '0.3rem 0.8rem' }}
            >
              FILTER PROJECTS FOR {selectedNode.name.toUpperCase()} →
            </button>
            <button
              onClick={() => setSelectedNode(null)}
              className="cyber-action-btn secondary"
              style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
            >
              DISMISS
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
