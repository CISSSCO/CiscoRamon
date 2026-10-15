import { useState, useMemo } from 'react'
import skills from '../data/skills.json'
import '../styles/graphs.css'

interface SkillExpertiseGraphProps {
  onSelectCategory: (category: string) => void
  activeCategory?: string
}

type ViewMode = 'radar' | 'wheel' | 'bars'

export default function SkillExpertiseGraph({ onSelectCategory, activeCategory }: SkillExpertiseGraphProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('radar')
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  // Dynamically compute category stats from skills.json
  const { categoryStats, totalSkillsCount } = useMemo(() => {
    const map: Record<string, { count: number; totalLevel: number; skills: typeof skills }> = {}

    skills.forEach((s) => {
      if (!map[s.category]) {
        map[s.category] = { count: 0, totalLevel: 0, skills: [] }
      }
      map[s.category].count += 1
      map[s.category].totalLevel += s.level
      map[s.category].skills.push(s)
    })

    const stats = Object.entries(map)
      .map(([category, d]) => ({
        category,
        count: d.count,
        avgLevel: Math.round(d.totalLevel / d.count),
        topSkills: d.skills
          .sort((a, b) => b.level - a.level)
          .slice(0, 3)
          .map((s) => s.name),
      }))
      .sort((a, b) => b.avgLevel - a.avgLevel || b.count - a.count)

    return { categoryStats: stats, totalSkillsCount: skills.length }
  }, [])

  // Radar points for categories (taking top 10 for optimum spider polygon aesthetics)
  const radarData = useMemo(() => {
    const centerX = 300
    const centerY = 240
    const maxR = 150
    const topCategories = categoryStats.slice(0, 10)
    const n = topCategories.length
    if (n === 0) return { polygonPoints: '', axes: [], centerX, centerY, maxR }

    const axes = topCategories.map((item, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const fraction = item.avgLevel / 100
      const r = Math.max(25, fraction * maxR)
      const px = centerX + cos * r
      const py = centerY + sin * r

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
  }, [categoryStats])

  // Radial wheel segments
  const wheelSlices = useMemo(() => {
    const centerX = 250
    const centerY = 250
    const radius = 180
    const innerRadius = 105
    const circumference = 2 * Math.PI * ((radius + innerRadius) / 2)
    const strokeWidth = radius - innerRadius

    let accumulatedPct = 0

    return categoryStats.map((item, i) => {
      const pct = item.count / totalSkillsCount
      const dashLength = circumference * pct
      const dashOffset = -circumference * accumulatedPct
      accumulatedPct += pct

      // Color based on proficiency level
      const hue = item.avgLevel >= 85 ? 185 : item.avgLevel >= 75 ? 210 : item.avgLevel >= 65 ? 250 : 330
      const strokeColor = `hsl(${hue}, 90%, 55%)`

      return {
        ...item,
        dashLength,
        dashOffset,
        strokeColor,
        circumference,
        strokeWidth,
        centerX,
        centerY,
        r: (radius + innerRadius) / 2,
        index: i,
      }
    })
  }, [categoryStats, totalSkillsCount])

  const activeHoveredData = useMemo(() => {
    const target = hoveredCategory || (activeCategory !== 'All' ? activeCategory : null)
    if (!target) return null
    return categoryStats.find((c) => c.category.toLowerCase() === target.toLowerCase()) || null
  }, [hoveredCategory, activeCategory, categoryStats])

  return (
    <div className="cyber-graph-card">
      <div className="cyber-graph-header">
        <div className="cyber-graph-title-group">
          <div className="section-tag-hpc">
            <span className="section-tag-dot" />
            <span>CORE COMPETENCIES // DOMAIN TELEMETRY</span>
          </div>
          <h2 className="cyber-graph-title">
            <span>Expertise Matrix &amp; Domain Distribution</span>
          </h2>
          <p className="cyber-graph-subtitle">
            Calculated dynamically across {totalSkillsCount} verified technical competencies and {categoryStats.length} domains. Click any domain to inspect matching skills.
          </p>

          {activeCategory && activeCategory !== 'All' && (
            <button
              onClick={() => onSelectCategory('All')}
              className="cyber-graph-filter-badge"
              title="Click to reset category filter"
            >
              <span>✕ DOMAIN FILTER:</span>
              <strong style={{ color: 'var(--cyber-yellow)' }}>{activeCategory}</strong>
              <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>(SHOW ALL)</span>
            </button>
          )}
        </div>

        {/* Multi-view Representation Switcher */}
        <div className="cyber-graph-switcher">
          <button
            onClick={() => setViewMode('radar')}
            className={`cyber-graph-switcher-btn ${viewMode === 'radar' ? 'active' : ''}`}
            title="Spider polygon view"
          >
            <span>🕸️</span>
            <span>SPIDER RADAR</span>
          </button>
          <button
            onClick={() => setViewMode('wheel')}
            className={`cyber-graph-switcher-btn ${viewMode === 'wheel' ? 'active' : ''}`}
            title="Radial donut wheel view"
          >
            <span>⭕</span>
            <span>RADIAL WHEEL</span>
          </button>
          <button
            onClick={() => setViewMode('bars')}
            className={`cyber-graph-switcher-btn ${viewMode === 'bars' ? 'active' : ''}`}
            title="Domain breakdown meters"
          >
            <span>📊</span>
            <span>DOMAIN METERS</span>
          </button>
        </div>
      </div>

      <div className="cyber-graph-canvas-container">
        {/* VIEW 1: SPIDER RADAR POLYGON */}
        {viewMode === 'radar' && radarData.axes.length > 0 && (
          <svg
            className="cyber-radar-svg"
            viewBox="0 0 600 480"
            role="img"
            aria-label="Skill expertise spider radar"
          >
            <defs>
              <linearGradient id="skill-radar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(0, 242, 254, 0.38)" />
                <stop offset="50%" stopColor="rgba(129, 140, 248, 0.22)" />
                <stop offset="100%" stopColor="rgba(16, 185, 129, 0.15)" />
              </linearGradient>
            </defs>

            {/* Concentric Web Rings */}
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((levelFraction) => {
              const ringPoints = radarData.axes
                .map((a) => {
                  const x = radarData.centerX + a.cos * (radarData.maxR * levelFraction)
                  const y = radarData.centerY + a.sin * (radarData.maxR * levelFraction)
                  return `${x},${y}`
                })
                .join(' ')
              return (
                <g key={`ring-${levelFraction}`}>
                  <polygon
                    points={ringPoints}
                    fill="none"
                    stroke="rgba(0, 242, 254, 0.12)"
                    strokeWidth="1"
                    strokeDasharray={levelFraction === 1.0 ? undefined : '3 3'}
                  />
                  <text
                    x={radarData.centerX + 6}
                    y={radarData.centerY - radarData.maxR * levelFraction + 3}
                    fill="var(--text-dim)"
                    fontSize="9px"
                    fontFamily="var(--font-mono, monospace)"
                  >
                    {Math.round(levelFraction * 100)}%
                  </text>
                </g>
              )
            })}

            {/* Spoke Axes */}
            {radarData.axes.map((a) => (
              <line
                key={`spoke-${a.category}`}
                x1={radarData.centerX}
                y1={radarData.centerY}
                x2={a.endX}
                y2={a.endY}
                stroke="rgba(0, 242, 254, 0.22)"
                strokeWidth="1"
              />
            ))}

            {/* Glowing Filled Area */}
            <polygon
              points={radarData.polygonPoints}
              fill="url(#skill-radar-grad)"
              stroke="var(--cyber-cyan)"
              strokeWidth="2.5"
            />

            {/* Vertices & Category Labels */}
            {radarData.axes.map((a) => {
              const isSelected = activeCategory?.toLowerCase() === a.category.toLowerCase()
              const textAnchor = a.cos > 0.25 ? 'start' : a.cos < -0.25 ? 'end' : 'middle'

              return (
                <g key={`vertex-${a.category}`} onClick={() => onSelectCategory(a.category)}>
                  <circle
                    cx={a.px}
                    cy={a.py}
                    r={isSelected ? 6.5 : 4.5}
                    fill={isSelected ? 'var(--cyber-yellow)' : 'var(--cyber-cyan)'}
                    stroke="var(--bg-base)"
                    strokeWidth="2"
                    className="cyber-radar-vertex"
                    onMouseEnter={() => setHoveredCategory(a.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />

                  <text
                    x={a.lx}
                    y={a.ly + 4}
                    textAnchor={textAnchor}
                    className="cyber-radar-axis-label"
                    fill={isSelected ? 'var(--cyber-yellow)' : 'var(--text-main)'}
                    onMouseEnter={() => setHoveredCategory(a.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    {a.category} ({a.avgLevel}%)
                  </text>
                </g>
              )
            })}
          </svg>
        )}

        {/* VIEW 2: RADIAL DONUT WHEEL */}
        {viewMode === 'wheel' && (
          <svg
            className="cyber-wheel-svg"
            viewBox="0 0 500 500"
            role="img"
            aria-label="Skill expertise radial wheel"
          >
            <g transform="rotate(-90 250 250)">
              {wheelSlices.map((slice) => {
                const isSelected = activeCategory?.toLowerCase() === slice.category.toLowerCase()
                const isHovered = hoveredCategory === slice.category

                return (
                  <circle
                    key={slice.category}
                    cx={slice.centerX}
                    cy={slice.centerY}
                    r={slice.r}
                    fill="none"
                    stroke={isSelected ? 'var(--cyber-yellow)' : slice.strokeColor}
                    strokeWidth={slice.strokeWidth}
                    strokeDasharray={`${slice.dashLength - 3} ${slice.circumference}`}
                    strokeDashoffset={slice.dashOffset}
                    className="cyber-wheel-slice"
                    style={{
                      opacity: isSelected || isHovered ? 1 : 0.82,
                    }}
                    onClick={() => onSelectCategory(slice.category)}
                    onMouseEnter={() => setHoveredCategory(slice.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                )
              })}
            </g>

            {/* Center Telemetry Readout */}
            <circle
              cx="250"
              cy="250"
              r="95"
              fill="var(--bg-card)"
              stroke="var(--border-cyber)"
              strokeWidth="2"
            />

            {activeHoveredData ? (
              <>
                <text
                  x="250"
                  y="225"
                  className="cyber-wheel-center-label"
                  fill="var(--cyber-cyan)"
                  fontSize="12px"
                  fontWeight="700"
                >
                  {activeHoveredData.category.toUpperCase()}
                </text>
                <text
                  x="250"
                  y="255"
                  className="cyber-wheel-center-label"
                  fill="var(--text-main)"
                  fontSize="24px"
                  fontWeight="900"
                >
                  {activeHoveredData.avgLevel}%
                </text>
                <text
                  x="250"
                  y="280"
                  className="cyber-wheel-center-label"
                  fill="var(--text-muted)"
                  fontSize="11px"
                >
                  {activeHoveredData.count} {activeHoveredData.count === 1 ? 'Skill' : 'Skills'} in domain
                </text>
              </>
            ) : (
              <>
                <text
                  x="250"
                  y="235"
                  className="cyber-wheel-center-label"
                  fill="var(--cyber-cyan)"
                  fontSize="11px"
                  fontWeight="700"
                  letterSpacing="0.08em"
                >
                  TOTAL EXPERTISE
                </text>
                <text
                  x="250"
                  y="265"
                  className="cyber-wheel-center-label"
                  fill="var(--text-main)"
                  fontSize="28px"
                  fontWeight="900"
                >
                  {totalSkillsCount}
                </text>
                <text
                  x="250"
                  y="288"
                  className="cyber-wheel-center-label"
                  fill="var(--text-dim)"
                  fontSize="11px"
                >
                  {categoryStats.length} DOMAINS
                </text>
              </>
            )}
          </svg>
        )}

        {/* VIEW 3: DOMAIN METERS */}
        {viewMode === 'bars' && (
          <div className="cyber-bar-grid">
            {categoryStats.map((item) => {
              const isSelected = activeCategory?.toLowerCase() === item.category.toLowerCase()

              return (
                <div
                  key={item.category}
                  className={`cyber-bar-card ${isSelected ? 'active' : ''}`}
                  onClick={() => onSelectCategory(item.category)}
                  onMouseEnter={() => setHoveredCategory(item.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="cyber-bar-header">
                    <div className="cyber-bar-title">
                      <span style={{ color: 'var(--cyber-cyan)' }}>⚡</span>
                      <span>{item.category}</span>
                    </div>
                    <div className="cyber-bar-metric">
                      {item.avgLevel}% Avg · {item.count} {item.count === 1 ? 'Skill' : 'Skills'}
                    </div>
                  </div>

                  <div className="cyber-bar-track">
                    <div
                      className="cyber-bar-fill"
                      style={{
                        width: `${item.avgLevel}%`,
                        background:
                          item.avgLevel >= 85
                            ? 'linear-gradient(90deg, #00f2fe, #10b981)'
                            : item.avgLevel >= 75
                            ? 'linear-gradient(90deg, #00f2fe, #818cf8)'
                            : 'linear-gradient(90deg, #818cf8, #ff0055)',
                      }}
                    />
                  </div>

                  <div className="cyber-bar-pills">
                    {item.topSkills.map((sk) => (
                      <span key={sk} className="cyber-bar-mini-pill">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Dynamic Telemetry Tooltip */}
        {activeHoveredData && (
          <div className="cyber-graph-tooltip">
            <span style={{ color: 'var(--cyber-cyan)', fontWeight: 800 }}>
              🌐 {activeHoveredData.category.toUpperCase()}
            </span>
            <span style={{ color: 'var(--text-dim)' }}>|</span>
            <span style={{ color: 'var(--cyber-yellow)' }}>
              Avg Proficiency: {activeHoveredData.avgLevel}%
            </span>
            <span style={{ color: 'var(--text-dim)' }}>|</span>
            <span>
              {activeHoveredData.count} {activeHoveredData.count === 1 ? 'Skill' : 'Skills'} ({activeHoveredData.topSkills.join(', ')})
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
