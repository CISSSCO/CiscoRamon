import { useState, useMemo } from 'react'
import projects from '../data/projects.json'
import { TechIcon } from '../ui/TechIcons'
import '../styles/graphs.css'

interface ProjectTechGraphProps {
  onSelectTech: (tech: string) => void
  activeTech?: string
}

type ViewMode = 'bubble' | 'bars' | 'radar'

export default function ProjectTechGraph({ onSelectTech, activeTech }: ProjectTechGraphProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('bubble')
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)

  // Dynamically aggregate tech stack frequencies and project associations from projects.json
  const { techStats, maxCount, totalProjects } = useMemo(() => {
    const map: Record<string, { count: number; projectTitles: string[] }> = {}
    let total = projects.length

    projects.forEach((p) => {
      ;(p.stack || []).forEach((t) => {
        const cleanName = t.trim()
        if (!map[cleanName]) {
          map[cleanName] = { count: 0, projectTitles: [] }
        }
        map[cleanName].count += 1
        map[cleanName].projectTitles.push(p.title)
      })
    })

    const sorted = Object.entries(map)
      .map(([name, data]) => ({
        name,
        count: data.count,
        percentage: Math.round((data.count / total) * 100),
        projectTitles: data.projectTitles,
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

    const max = sorted.length > 0 ? sorted[0].count : 1

    return { techStats: sorted, maxCount: max, totalProjects: total }
  }, [])

  // Position nodes for Bubble Cluster (SVG coordinates)
  const bubbleNodes = useMemo(() => {
    // Take top 18 technologies for clear, beautiful bubble layout
    const displayItems = techStats.slice(0, 18)
    const width = 800
    const height = 440
    const centerX = width / 2
    const centerY = height / 2

    return displayItems.map((item, index) => {
      // Golden angle spiral distribution
      const angle = index * 2.39996 + 0.5
      // Radius from center based on index
      const dist = index === 0 ? 0 : 55 + Math.sqrt(index) * 62
      const x = Math.max(70, Math.min(width - 70, centerX + Math.cos(angle) * dist))
      const y = Math.max(60, Math.min(height - 60, centerY + Math.sin(angle) * (dist * 0.78)))

      // Radius based on frequency
      const r = item.count >= 4 ? 46 : item.count === 3 ? 40 : item.count === 2 ? 34 : 28

      return {
        ...item,
        x,
        y,
        r,
      }
    })
  }, [techStats])

  // Radar points for top 8 technologies
  const radarData = useMemo(() => {
    const centerX = 300
    const centerY = 240
    const maxR = 150
    const topItems = techStats.slice(0, 8)
    const n = topItems.length
    if (n === 0) return { polygonPoints: '', axes: [], centerX, centerY, maxR }

    const axes = topItems.map((item, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const fraction = item.count / maxCount
      const r = Math.max(25, fraction * maxR)
      const px = centerX + cos * r
      const py = centerY + sin * r

      // Outer label coordinate
      const lx = centerX + cos * (maxR + 32)
      const ly = centerY + sin * (maxR + 32)

      return {
        ...item,
        angle,
        cos,
        sin,
        px,
        py,
        lx,
        ly,
        endX: centerX + cos * maxR,
        endY: centerY + sin * maxR,
      }
    })

    const polygonPoints = axes.map((a) => `${a.px},${a.py}`).join(' ')

    return { polygonPoints, axes, centerX, centerY, maxR }
  }, [techStats, maxCount])

  const activeHoveredData = useMemo(() => {
    const target = hoveredTech || activeTech
    if (!target) return null
    return techStats.find((t) => t.name.toLowerCase() === target.toLowerCase()) || null
  }, [hoveredTech, activeTech, techStats])

  return (
    <div className="cyber-graph-card">
      <div className="cyber-graph-header">
        <div className="cyber-graph-title-group">
          <div className="section-tag-hpc">
            <span className="section-tag-dot" />
            <span>PROJECTS TECH SPECTRUM // DYNAMIC TELEMETRY</span>
          </div>
          <h2 className="cyber-graph-title">
            <span>Stack Frequency &amp; Project Distribution</span>
          </h2>
          <p className="cyber-graph-subtitle">
            Dynamic aggregation across all {totalProjects} open source repositories. Click any technology to filter and explore connected projects.
          </p>

          {activeTech && (
            <button
              onClick={() => onSelectTech('')}
              className="cyber-graph-filter-badge"
              title="Click to reset filter"
            >
              <span>✕ FILTER ACTIVE:</span>
              <strong style={{ color: 'var(--cyber-yellow)' }}>{activeTech}</strong>
              <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>(CLEAR)</span>
            </button>
          )}
        </div>

        {/* Multi-view Representation Switcher */}
        <div className="cyber-graph-switcher">
          <button
            onClick={() => setViewMode('bubble')}
            className={`cyber-graph-switcher-btn ${viewMode === 'bubble' ? 'active' : ''}`}
            title="Cluster nodes view"
          >
            <span>🌐</span>
            <span>BUBBLE CLUSTER</span>
          </button>
          <button
            onClick={() => setViewMode('bars')}
            className={`cyber-graph-switcher-btn ${viewMode === 'bars' ? 'active' : ''}`}
            title="Ranked spectrum bars"
          >
            <span>📊</span>
            <span>STACK RANKING</span>
          </button>
          <button
            onClick={() => setViewMode('radar')}
            className={`cyber-graph-switcher-btn ${viewMode === 'radar' ? 'active' : ''}`}
            title="Multi-axis spider matrix"
          >
            <span>🕸️</span>
            <span>RADAR MATRIX</span>
          </button>
        </div>
      </div>

      <div className="cyber-graph-canvas-container">
        {/* VIEW 1: BUBBLE CLUSTER */}
        {viewMode === 'bubble' && (
          <svg
            className="cyber-bubble-svg"
            viewBox="0 0 800 440"
            role="img"
            aria-label="Project technologies bubble cluster"
          >
            <defs>
              <pattern id="graph-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0, 242, 254, 0.04)" strokeWidth="1" />
              </pattern>
              <radialGradient id="bubble-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0, 242, 254, 0.25)" />
                <stop offset="70%" stopColor="rgba(129, 140, 248, 0.12)" />
                <stop offset="100%" stopColor="rgba(6, 8, 15, 0)" />
              </radialGradient>
            </defs>

            {/* Cyber Grid Background */}
            <rect width="800" height="440" fill="url(#graph-grid)" />

            {/* Connecting Lines for Multi-project Stacks */}
            {bubbleNodes.slice(0, 6).map((node, i) => (
              <line
                key={`line-${i}`}
                x1="400"
                y1="220"
                x2={node.x}
                y2={node.y}
                stroke="rgba(0, 242, 254, 0.12)"
                strokeDasharray="3 3"
              />
            ))}

            {/* Central Ambient Hub */}
            <circle cx="400" cy="220" r="140" fill="url(#bubble-glow)" />

            {/* Bubble Nodes */}
            {bubbleNodes.map((node) => {
              const isSelected = activeTech?.toLowerCase() === node.name.toLowerCase()
              const isHovered = hoveredTech === node.name

              return (
                <g
                  key={node.name}
                  transform={`translate(${node.x}, ${node.y})`}
                  className={`cyber-bubble-node ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectTech(node.name)}
                  onMouseEnter={() => setHoveredTech(node.name)}
                  onMouseLeave={() => setHoveredTech(null)}
                >
                  {/* Outer Pulsing Ring */}
                  <circle
                    r={node.r + (isHovered || isSelected ? 4 : 2)}
                    className="outer-glow"
                    fill="none"
                    stroke={isSelected ? '#fcee0a' : isHovered ? '#00f2fe' : 'rgba(0, 242, 254, 0.25)'}
                    strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                    strokeDasharray={isHovered ? '4 2' : undefined}
                  />

                  {/* Bubble Base */}
                  <circle
                    r={node.r}
                    fill={isSelected ? 'rgba(252, 238, 10, 0.2)' : isHovered ? 'rgba(0, 242, 254, 0.22)' : 'var(--bg-surface)'}
                    stroke={isSelected ? 'var(--cyber-yellow)' : 'var(--border-cyber)'}
                    strokeWidth="1.5"
                  />

                  {/* Project Count Pill at Top Right */}
                  <circle
                    cx={node.r * 0.65}
                    cy={-node.r * 0.65}
                    r="10"
                    fill="var(--bg-card)"
                    stroke="var(--cyber-cyan)"
                    strokeWidth="1"
                  />
                  <text
                    x={node.r * 0.65}
                    y={-node.r * 0.65 + 3.5}
                    textAnchor="middle"
                    fill="var(--cyber-cyan)"
                    fontSize="9px"
                    fontWeight="800"
                    fontFamily="var(--font-mono, monospace)"
                  >
                    {node.count}x
                  </text>

                  {/* Tech Label */}
                  <text
                    y={node.r > 36 ? 3 : 2}
                    textAnchor="middle"
                    fill="var(--text-main)"
                    fontSize={node.r > 40 ? '11px' : node.r > 32 ? '10px' : '9px'}
                    fontWeight="700"
                    fontFamily="var(--font-sans, sans-serif)"
                  >
                    {node.name.length > 13 ? `${node.name.slice(0, 11)}..` : node.name}
                  </text>
                </g>
              )
            })}
          </svg>
        )}

        {/* VIEW 2: RANKED STACK SPECTRUM BARS */}
        {viewMode === 'bars' && (
          <div className="cyber-bar-grid">
            {techStats.map((item) => {
              const isSelected = activeTech?.toLowerCase() === item.name.toLowerCase()
              const widthPct = Math.round((item.count / maxCount) * 100)

              return (
                <div
                  key={item.name}
                  className={`cyber-bar-card ${isSelected ? 'active' : ''}`}
                  onClick={() => onSelectTech(item.name)}
                  onMouseEnter={() => setHoveredTech(item.name)}
                  onMouseLeave={() => setHoveredTech(null)}
                >
                  <div className="cyber-bar-header">
                    <div className="cyber-bar-title">
                      <TechIcon name={item.name} size={16} />
                      <span>{item.name}</span>
                    </div>
                    <div className="cyber-bar-metric">
                      {item.count} {item.count === 1 ? 'Project' : 'Projects'} ({item.percentage}%)
                    </div>
                  </div>

                  <div className="cyber-bar-track">
                    <div className="cyber-bar-fill" style={{ width: `${widthPct}%` }} />
                  </div>

                  <div className="cyber-bar-pills">
                    {item.projectTitles.map((pTitle) => (
                      <span key={pTitle} className="cyber-bar-mini-pill">
                        {pTitle}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* VIEW 3: RADAR MATRIX */}
        {viewMode === 'radar' && radarData.axes.length > 0 && (
          <svg
            className="cyber-radar-svg"
            viewBox="0 0 600 480"
            role="img"
            aria-label="Technology radar matrix"
          >
            <defs>
              <linearGradient id="radar-fill-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(0, 242, 254, 0.35)" />
                <stop offset="100%" stopColor="rgba(129, 140, 248, 0.15)" />
              </linearGradient>
            </defs>

            {/* Concentric Grid Rings */}
            {[0.25, 0.5, 0.75, 1.0].map((ringFraction) => {
              const ringPoints = radarData.axes
                .map((a) => {
                  const x = radarData.centerX + a.cos * (radarData.maxR * ringFraction)
                  const y = radarData.centerY + a.sin * (radarData.maxR * ringFraction)
                  return `${x},${y}`
                })
                .join(' ')
              return (
                <g key={`ring-${ringFraction}`}>
                  <polygon
                    points={ringPoints}
                    fill="none"
                    stroke="rgba(0, 242, 254, 0.12)"
                    strokeWidth="1"
                    strokeDasharray={ringFraction === 1.0 ? undefined : '3 3'}
                  />
                  <text
                    x={radarData.centerX + 6}
                    y={radarData.centerY - radarData.maxR * ringFraction + 3}
                    fill="var(--text-dim)"
                    fontSize="9px"
                    fontFamily="var(--font-mono, monospace)"
                  >
                    {Math.round(ringFraction * maxCount)}x
                  </text>
                </g>
              )
            })}

            {/* Spoke Axes Lines */}
            {radarData.axes.map((a) => (
              <line
                key={`spoke-${a.name}`}
                x1={radarData.centerX}
                y1={radarData.centerY}
                x2={a.endX}
                y2={a.endY}
                stroke="rgba(0, 242, 254, 0.2)"
                strokeWidth="1"
              />
            ))}

            {/* Filled Polygon Area */}
            <polygon
              points={radarData.polygonPoints}
              fill="url(#radar-fill-grad)"
              stroke="var(--cyber-cyan)"
              strokeWidth="2.5"
            />

            {/* Vertices & Labels */}
            {radarData.axes.map((a) => {
              const isSelected = activeTech?.toLowerCase() === a.name.toLowerCase()
              const textAnchor = a.cos > 0.25 ? 'start' : a.cos < -0.25 ? 'end' : 'middle'

              return (
                <g key={`vertex-${a.name}`} onClick={() => onSelectTech(a.name)}>
                  <circle
                    cx={a.px}
                    cy={a.py}
                    r={isSelected ? 6 : 4.5}
                    fill={isSelected ? 'var(--cyber-yellow)' : 'var(--cyber-cyan)'}
                    stroke="var(--bg-base)"
                    strokeWidth="2"
                    className="cyber-radar-vertex"
                    onMouseEnter={() => setHoveredTech(a.name)}
                    onMouseLeave={() => setHoveredTech(null)}
                  />

                  <text
                    x={a.lx}
                    y={a.ly + 4}
                    textAnchor={textAnchor}
                    className="cyber-radar-axis-label"
                    fill={isSelected ? 'var(--cyber-yellow)' : 'var(--text-main)'}
                    onMouseEnter={() => setHoveredTech(a.name)}
                    onMouseLeave={() => setHoveredTech(null)}
                  >
                    {a.name} ({a.count}x)
                  </text>
                </g>
              )
            })}
          </svg>
        )}

        {/* Dynamic Telemetry Tooltip */}
        {activeHoveredData && (
          <div className="cyber-graph-tooltip">
            <span style={{ color: 'var(--cyber-cyan)', fontWeight: 800 }}>
              ⚡ {activeHoveredData.name.toUpperCase()}
            </span>
            <span style={{ color: 'var(--text-dim)' }}>|</span>
            <span>
              {activeHoveredData.count} {activeHoveredData.count === 1 ? 'Repository' : 'Repositories'} ({activeHoveredData.percentage}% coverage)
            </span>
            <span style={{ color: 'var(--text-dim)' }}>|</span>
            <span style={{ color: 'var(--cyber-yellow)' }}>
              Used in: {activeHoveredData.projectTitles.join(', ')}
            </span>
            <span style={{ color: 'var(--cyber-blue)', fontSize: '0.72rem' }}>
              [CLICK TO FILTER]
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
