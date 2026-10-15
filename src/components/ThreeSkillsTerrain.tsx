import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface ThreeSkillsTerrainProps {
  categories: Array<{
    category: string
    skill_count: number
    avg_level: number
    top_skills: string[]
  }>
  onSelectCategory: (category: string) => void
  activeCategory?: string
}

export default function ThreeSkillsTerrain({
  categories,
  onSelectCategory,
  activeCategory,
}: ThreeSkillsTerrainProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [selectedCat, setSelectedCat] = useState<{
    category: string
    skill_count: number
    avg_level: number
    top_skills: string[]
  } | null>(null)

  useEffect(() => {
    if (activeCategory) {
      const match = categories.find((c) => c.category.toLowerCase() === activeCategory.toLowerCase())
      setSelectedCat(match || null)
    } else {
      setSelectedCat(null)
    }
  }, [activeCategory, categories])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 800
    const height = 480

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 95, 175)
    camera.lookAt(0, 10, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0x00f2fe, 1.5)
    dirLight.position.set(80, 120, 60)
    scene.add(dirLight)

    const pointLight = new THREE.PointLight(0xfcee0a, 2, 200)
    pointLight.position.set(0, 30, 0)
    scene.add(pointLight)

    // 3D Cyber Grid Plane
    const gridHelper = new THREE.GridHelper(260, 26, 0x00f2fe, 0x1f293d)
    gridHelper.position.y = -0.5
    scene.add(gridHelper)

    // Helper: Text sprite (Dynamically measured, zero text cutting)
    const createTextSprite = (text: string, level: number) => {
      const fullLabel = `${text} (${level}%)`
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return new THREE.Sprite()

      ctx.font = 'bold 22px monospace'
      const metrics = ctx.measureText(fullLabel)
      const paddingX = 24
      const canvasWidth = Math.max(160, Math.ceil(metrics.width) + paddingX * 2)
      const canvasHeight = 60

      canvas.width = canvasWidth
      canvas.height = canvasHeight

      // Context state resets on dimension change
      ctx.font = 'bold 22px monospace'
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
      const baseHeight = 5.2
      const aspect = canvasWidth / canvasHeight
      sprite.scale.set(baseHeight * aspect, baseHeight, 1)
      return sprite
    }

    // Terrain Group
    const terrainGroup = new THREE.Group()
    scene.add(terrainGroup)

    const clickablePillars: THREE.Mesh[] = []
    const n = categories.length
    const ringRadius = 72

    categories.forEach((item, i) => {
      const angle = (2 * Math.PI * i) / n
      const x = ringRadius * Math.cos(angle)
      const z = ringRadius * Math.sin(angle)

      // Height proportional to avg proficiency level (0-100% -> 10 to 65 units)
      const pillarHeight = Math.max(12, (item.avg_level / 100) * 62)
      const radiusBottom = 4.8
      const radiusTop = 4.2
      const pillarGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, pillarHeight, 16)

      // Color scheme based on proficiency
      const colorHex =
        item.avg_level >= 85 ? 0x00f2fe : item.avg_level >= 75 ? 0x10b981 : item.avg_level >= 65 ? 0x818cf8 : 0xfcee0a

      const pillarMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.35,
        roughness: 0.25,
        metalness: 0.75,
      })

      const mesh = new THREE.Mesh(pillarGeo, pillarMat)
      mesh.position.set(x, pillarHeight / 2, z)
      mesh.userData = item
      terrainGroup.add(mesh)
      clickablePillars.push(mesh)

      // Cap Ring
      const capGeo = new THREE.TorusGeometry(radiusTop + 0.4, 0.4, 8, 24)
      const capMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
      const cap = new THREE.Mesh(capGeo, capMat)
      cap.rotation.x = Math.PI / 2
      cap.position.set(x, pillarHeight, z)
      terrainGroup.add(cap)

      // Floating 3D Text Sprite
      const sprite = createTextSprite(item.category, item.avg_level)
      sprite.position.set(x, pillarHeight + 6, z)
      terrainGroup.add(sprite)
    })

    // Central Telemetry Hologram
    const centerGeo = new THREE.OctahedronGeometry(14, 0)
    const centerMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    })
    const centerMesh = new THREE.Mesh(centerGeo, centerMat)
    centerMesh.position.set(0, 15, 0)
    terrainGroup.add(centerMesh)

    // Mouse Controls & Drag Interaction
    let isDragging = false
    let prevMouseX = 0
    let targetRotationY = 0
    const currentRotation = { y: 0 }

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevMouseX = e.clientX
    }

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX
        targetRotationY += deltaX * 0.008
        prevMouseX = e.clientX
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
      camera.position.z = Math.max(100, Math.min(260, camera.position.z + e.deltaY * 0.12))
    }

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(clickablePillars)

      if (intersects.length > 0) {
        const hit = intersects[0].object
        const catData = hit.userData as typeof categories[0]
        setSelectedCat(catData)
        onSelectCategory(catData.category)
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
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true
        prevTouchX = e.touches[0].clientX
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevTouchX
        targetRotationY += deltaX * 0.008
        prevTouchX = e.touches[0].clientX
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
      currentRotation.y += (targetRotationY - currentRotation.y) * 0.08

      // Gentle auto-orbit
      if (!isDragging) {
        targetRotationY += 0.0016
      }

      terrainGroup.rotation.y = currentRotation.y
      centerMesh.rotation.y += 0.01
      centerMesh.rotation.x += 0.005

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
      gridHelper.geometry.dispose()
      centerGeo.dispose()
      centerMat.dispose()
    }
  }, [categories, onSelectCategory])

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
        <span>DRAG TO ORBIT 3D TERRAIN · PILLAR HEIGHT = PROFICIENCY · CLICK TO FILTER</span>
      </div>

      {/* Domain Info Floating HUD */}
      {selectedCat && (
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            right: '1rem',
            maxWidth: '460px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--cyber-cyan)',
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            boxShadow: '0 8px 28px rgba(0, 0, 0, 0.6), 0 0 16px rgba(0, 242, 254, 0.25)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            animation: 'fadeIn 0.2s ease',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--cyber-cyan)', fontWeight: 800, fontSize: '1.05rem' }}>
              🌐 {selectedCat.category.toUpperCase()}
            </span>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.78rem', color: 'var(--cyber-yellow)', fontWeight: 700 }}>
              {selectedCat.avg_level}% AVG MASTERY
            </span>
          </div>

          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Domain Capacity: <strong style={{ color: 'var(--text-main)' }}>{selectedCat.skill_count} Competencies</strong> ({selectedCat.top_skills.join(', ')})
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
            <button
              onClick={() => onSelectCategory(selectedCat.category)}
              className="cyber-action-btn primary"
              style={{ fontSize: '0.72rem', padding: '0.3rem 0.8rem' }}
            >
              FILTER SKILLS FOR {selectedCat.category.toUpperCase()} →
            </button>
            <button
              onClick={() => setSelectedCat(null)}
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
