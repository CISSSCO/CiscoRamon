import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import projectsData from '../data/projects.json'
import analyticsData from '../data/extracts/projects_analytics.json'
import ThreeTechOrbit from '../components/ThreeTechOrbit'
import { TechIcon } from '../ui/TechIcons'
import { ExternalLinkIcon } from '../ui/HeroIcons'
import '../styles/home.css'
import '../styles/graphs.css'

type PlotType = '3d' | 'heatmap' | 'radar' | 'stem' | 'treemap' | 'bubble'

export default function ProjectVisualizerPage() {
  const navigate = useNavigate()
  const [activePlot, setActivePlot] = useState<PlotType>('3d')
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  const [hoveredCell, setHoveredCell] = useState<{ t1: string; t2: string; count: number } | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  // Dynamic analytics data fallback
  const { ranked_technologies, co_occurrence_top8, total_projects, unique_technologies } = useMemo(() => {
    if (analyticsData && analyticsData.ranked_technologies) {
      return analyticsData
    }
    // Fallback compute on the fly
    const counts: Record<string, number> = {}
    projectsData.forEach((p) => {
      ;(p.stack || []).forEach((t) => {
        counts[t] = (counts[t] || 0) + 1
      })
    })
    const ranked = Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / projectsData.length) * 100),
      projects: projectsData.filter((p) => p.stack?.includes(name)).map((p) => p.title),
    }))
    return {
      ranked_technologies: ranked,
      co_occurrence_top8: { labels: [], matrix: [] },
      total_projects: projectsData.length,
      unique_technologies: Object.keys(counts).length,
    }
  }, [])

  // Connected projects for selected technology
  const connectedProjects = useMemo(() => {
    if (!selectedTech) return []
    return projectsData.filter((p) =>
      p.stack?.some((t) => t.toLowerCase() === selectedTech.toLowerCase())
    )
  }, [selectedTech])

  // Radar points for top 8 technologies
  const radarData = useMemo(() => {
    const topItems = ranked_technologies.slice(0, 8)
    const n = topItems.length
    if (n === 0) return { polygonPoints: '', axes: [], centerX: 320, centerY: 240, maxR: 150, maxCount: 1 }

    const centerX = 320
    const centerY = 240
    const maxR = 150
    const maxCount = topItems[0]?.count || 1

    const axes = topItems.map((item, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const r = Math.max(30, (item.count / maxCount) * maxR)
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
    return { polygonPoints, axes, centerX, centerY, maxR, maxCount }
  }, [ranked_technologies])

  const handleTechClick = (techName: string) => {
    setSelectedTech(techName === selectedTech ? null : techName)
  }

  const navigateToCatalog = (techName: string) => {
    navigate('/projects', { state: { filterTech: techName } })
  }

  return (
    <article className="section" style={{ maxWidth: '1280px', margin: '0 auto', padding: '10vh 1.5rem 15vh' }}>
      {/* Top Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <Link
            to="/"
            className="cyber-action-btn secondary"
            style={{ textDecoration: 'none', display: 'inline-flex', padding: '0.5rem 1.1rem', fontSize: '0.8rem' }}
          >
            ← BACK TO HOME
          </Link>
          <Link
            to="/projects"
            className="cyber-action-btn secondary"
            style={{ textDecoration: 'none', display: 'inline-flex', padding: '0.5rem 1.1rem', fontSize: '0.8rem' }}
          >
            ← BACK TO ALL PROJECTS
          </Link>
        </div>

        <Link
          to="/skills/visualize"
          className="cyber-action-btn primary"
          style={{ textDecoration: 'none', display: 'inline-flex', padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}
        >
          <span>SWITCH TO SKILLS VISUALIZER ↗</span>
        </Link>
      </div>

      {/* Header Dossier */}
      <div style={{ marginBottom: '2.8rem' }}>
        <div className="section-tag-hpc">
          <span className="section-tag-dot" />
          <span>ADVANCED REPOSITORY ANALYTICS // 6 PLOT METHODS</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 0.8rem', color: 'var(--text-main)' }}>
          Projects Tech Stack Visualizer
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.08rem', maxWidth: '780px', lineHeight: 1.65, margin: 0 }}>
          Interactive multi-representation analytics of technologies deployed across {total_projects} repositories. Switch between 3D cyber orbits, co-occurrence heatmaps, polar spider matrices, stem distributions, and treemaps.
        </p>
      </div>

      {/* Key Telemetry Metrics Bar */}
      <div className="social-stats-row" style={{ marginBottom: '2.5rem' }}>
        <div className="social-stat-item">
          <div className="social-stat-number">{total_projects}</div>
          <div className="social-stat-title">Repositories Analyzed</div>
        </div>
        <div className="social-stat-item">
          <div className="social-stat-number">{unique_technologies}</div>
          <div className="social-stat-title">Distinct Toolchains</div>
        </div>
        <div className="social-stat-item">
          <div className="social-stat-number">{ranked_technologies[0]?.name || 'N/A'}</div>
          <div className="social-stat-title">Most Deployed ({ranked_technologies[0]?.count || 0}x)</div>
        </div>
        <div className="social-stat-item">
          <div className="social-stat-number">100%</div>
          <div className="social-stat-title">Multi-Stack Environments</div>
        </div>
      </div>

      {/* Main Visualizer Container */}
      <div className="cyber-graph-card" style={{ padding: '1.8rem 2rem' }}>
        {/* Method Switcher Header */}
        <div className="cyber-graph-header">
          <div>
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.78rem', color: 'var(--cyber-cyan)', fontWeight: 700 }}>
              VISUALIZATION METHOD
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
              {activePlot === '3d' && '🎮 3D Interactive Cyber Orbit Constellation'}
              {activePlot === 'heatmap' && '🔥 Matplotlib-Style Co-occurrence Heatmap Matrix'}
              {activePlot === 'radar' && '🕸️ Polar Spider Radar Matrix (Top 8 Technologies)'}
              {activePlot === 'stem' && '📊 Stem & Bar Distribution Spectrum'}
              {activePlot === 'treemap' && '🌲 Proportional Area Treemap (Stack Hierarchy)'}
              {activePlot === 'bubble' && '🌐 Relational Bubble Cluster Graph'}
            </div>
          </div>

          <div className="cyber-graph-switcher">
            <button
              onClick={() => setActivePlot('3d')}
              className={`cyber-graph-switcher-btn ${activePlot === '3d' ? 'active' : ''}`}
            >
              <span>🎮 3D ORBIT</span>
            </button>
            <button
              onClick={() => setActivePlot('heatmap')}
              className={`cyber-graph-switcher-btn ${activePlot === 'heatmap' ? 'active' : ''}`}
            >
              <span>🔥 HEATMAP</span>
            </button>
            <button
              onClick={() => setActivePlot('radar')}
              className={`cyber-graph-switcher-btn ${activePlot === 'radar' ? 'active' : ''}`}
            >
              <span>🕸️ RADAR</span>
            </button>
            <button
              onClick={() => setActivePlot('stem')}
              className={`cyber-graph-switcher-btn ${activePlot === 'stem' ? 'active' : ''}`}
            >
              <span>📊 STEM / BARS</span>
            </button>
            <button
              onClick={() => setActivePlot('treemap')}
              className={`cyber-graph-switcher-btn ${activePlot === 'treemap' ? 'active' : ''}`}
            >
              <span>🌲 TREEMAP</span>
            </button>
            <button
              onClick={() => setActivePlot('bubble')}
              className={`cyber-graph-switcher-btn ${activePlot === 'bubble' ? 'active' : ''}`}
            >
              <span>🌐 BUBBLES</span>
            </button>
          </div>
        </div>

        {/* Selected Technology Banner */}
        {selectedTech && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0, 242, 254, 0.1)', border: '1px solid var(--cyber-cyan)', padding: '0.65rem 1.2rem', borderRadius: '8px', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ color: 'var(--cyber-cyan)', fontWeight: 800 }}>ACTIVE FILTER:</span>
              <strong style={{ color: 'var(--cyber-yellow)', fontSize: '1.05rem' }}>{selectedTech}</strong>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                ({connectedProjects.length} matching {connectedProjects.length === 1 ? 'project' : 'projects'})
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                onClick={() => navigateToCatalog(selectedTech)}
                className="cyber-action-btn primary"
                style={{ fontSize: '0.72rem', padding: '0.35rem 0.85rem' }}
              >
                VIEW IN REPOSITORIES CATALOG →
              </button>
              <button
                onClick={() => setSelectedTech(null)}
                className="cyber-action-btn secondary"
                style={{ fontSize: '0.72rem', padding: '0.35rem 0.65rem' }}
              >
                ✕ CLEAR
              </button>
            </div>
          </div>
        )}

        {/* VIEW 1: THREE.JS 3D CYBER ORBIT */}
        {activePlot === '3d' && (
          <ThreeTechOrbit
            technologies={ranked_technologies}
            onSelectTech={handleTechClick}
            activeTech={selectedTech || undefined}
          />
        )}

        {/* VIEW 2: MATPLOTLIB CO-OCCURRENCE HEATMAP MATRIX */}
        {activePlot === 'heatmap' && co_occurrence_top8 && (
          <div style={{ width: '100%', overflowX: 'auto', padding: '1rem 0' }}>
            <div style={{ minWidth: '600px', margin: '0 auto', maxWidth: '780px' }}>
              <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem', textAlign: 'center' }}>
                Co-occurrence matrix (matplotlib `imshow`): Values denote how many repositories combine Technology A with Technology B.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: `140px repeat(${co_occurrence_top8.labels.length}, 1fr)`, gap: '4px' }}>
                <div />
                {co_occurrence_top8.labels.map((lbl) => (
                  <div
                    key={`col-${lbl}`}
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.72rem',
                      color: 'var(--cyber-cyan)',
                      fontWeight: 700,
                      textAlign: 'center',
                      padding: '0.4rem 0.2rem',
                      wordBreak: 'break-word',
                    }}
                  >
                    {lbl}
                  </div>
                ))}

                {co_occurrence_top8.labels.map((rowLabel, rIdx) => (
                  <div key={`row-${rowLabel}`} style={{ display: 'contents' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--cyber-cyan)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: '0.8rem',
                      }}
                    >
                      {rowLabel}
                    </div>

                    {co_occurrence_top8.matrix[rIdx].map((val, cIdx) => {
                      const isDiagonal = rIdx === cIdx
                      const colLabel = co_occurrence_top8.labels[cIdx]
                      const maxVal = 4
                      const intensity = val / maxVal
                      const bg = isDiagonal
                        ? `rgba(0, 242, 254, ${0.2 + intensity * 0.6})`
                        : val > 0
                        ? `rgba(129, 140, 248, ${0.15 + intensity * 0.65})`
                        : 'rgba(255, 255, 255, 0.02)'

                      return (
                        <div
                          key={`cell-${rIdx}-${cIdx}`}
                          onClick={() => handleTechClick(rowLabel)}
                          onMouseEnter={() => setHoveredCell({ t1: rowLabel, t2: colLabel, count: val })}
                          onMouseLeave={() => setHoveredCell(null)}
                          style={{
                            aspectRatio: '1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: bg,
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontFamily: 'var(--font-mono, monospace)',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            color: val > 0 ? '#ffffff' : 'var(--text-dim)',
                          }}
                          title={`${rowLabel} + ${colLabel}: ${val} projects`}
                        >
                          {val}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>

              {hoveredCell && (
                <div style={{ textAlign: 'center', marginTop: '1.2rem', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--cyber-yellow)' }}>
                  Selected Pair: <strong>{hoveredCell.t1}</strong> + <strong>{hoveredCell.t2}</strong> = {hoveredCell.count} co-occurring {hoveredCell.count === 1 ? 'repository' : 'repositories'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: RADAR MATRIX */}
        {activePlot === 'radar' && radarData.axes.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
            <svg
              className="cyber-radar-svg"
              viewBox="0 0 640 480"
              role="img"
              aria-label="Technology radar matrix"
            >
              <defs>
                <linearGradient id="proj-radar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(0, 242, 254, 0.4)" />
                  <stop offset="100%" stopColor="rgba(129, 140, 248, 0.2)" />
                </linearGradient>
              </defs>

              {/* Grid concentric rings */}
              {[0.25, 0.5, 0.75, 1.0].map((ring) => {
                const ringPoints = radarData.axes
                  .map((a) => {
                    const x = radarData.centerX + a.cos * (radarData.maxR * ring)
                    const y = radarData.centerY + a.sin * (radarData.maxR * ring)
                    return `${x},${y}`
                  })
                  .join(' ')
                return (
                  <g key={`proj-ring-${ring}`}>
                    <polygon
                      points={ringPoints}
                      fill="none"
                      stroke="rgba(0, 242, 254, 0.15)"
                      strokeWidth="1"
                      strokeDasharray={ring === 1.0 ? undefined : '3 3'}
                    />
                    <text
                      x={radarData.centerX + 6}
                      y={radarData.centerY - radarData.maxR * ring + 3}
                      fill="var(--text-dim)"
                      fontSize="9px"
                      fontFamily="var(--font-mono, monospace)"
                    >
                      {Math.round(ring * radarData.maxCount)}x
                    </text>
                  </g>
                )
              })}

              {/* Spokes */}
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

              {/* Filled Polygon */}
              <polygon
                points={radarData.polygonPoints}
                fill="url(#proj-radar-grad)"
                stroke="var(--cyber-cyan)"
                strokeWidth="2.5"
              />

              {/* Vertices & Labels */}
              {radarData.axes.map((a) => {
                const isSelected = selectedTech?.toLowerCase() === a.name.toLowerCase()
                const textAnchor = a.cos > 0.25 ? 'start' : a.cos < -0.25 ? 'end' : 'middle'

                return (
                  <g key={`vtx-${a.name}`} onClick={() => handleTechClick(a.name)}>
                    <circle
                      cx={a.px}
                      cy={a.py}
                      r={isSelected ? 6.5 : 4.5}
                      fill={isSelected ? 'var(--cyber-yellow)' : 'var(--cyber-cyan)'}
                      stroke="var(--bg-base)"
                      strokeWidth="2"
                      className="cyber-radar-vertex"
                    />

                    <text
                      x={a.lx}
                      y={a.ly + 4}
                      textAnchor={textAnchor}
                      className="cyber-radar-axis-label"
                      fill={isSelected ? 'var(--cyber-yellow)' : 'var(--text-main)'}
                    >
                      {a.name} ({a.count}x)
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        )}

        {/* VIEW 4: STEM & HORIZONTAL SPECTRUM (MATPLOTLIB STEM PLOT) */}
        {activePlot === 'stem' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', padding: '0.5rem 0' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Horizontal stem plot: Markers denote exact repository count and proportional system distribution.
            </p>

            {ranked_technologies.map((tech) => {
              const maxCount = ranked_technologies[0]?.count || 1
              const pct = (tech.count / maxCount) * 100
              const isSelected = selectedTech?.toLowerCase() === tech.name.toLowerCase()

              return (
                <div
                  key={tech.name}
                  onClick={() => handleTechClick(tech.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.7rem 1rem',
                    background: isSelected ? 'rgba(252, 238, 10, 0.08)' : 'var(--bg-surface)',
                    border: `1px solid ${isSelected ? 'var(--cyber-yellow)' : 'var(--border-subtle)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ width: '180px', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <TechIcon name={tech.name} size={16} />
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: isSelected ? 'var(--cyber-yellow)' : 'var(--text-main)' }}>
                      {tech.name}
                    </span>
                  </div>

                  {/* Stem line with lollipop head */}
                  <div style={{ flex: 1, position: 'relative', height: '14px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '100%', height: '2px', background: 'var(--border-subtle)' }} />
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        width: `${pct}%`,
                        height: '2px',
                        background: isSelected ? 'var(--cyber-yellow)' : 'var(--cyber-cyan)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: `${pct}%`,
                        transform: 'translate(-50%, 0)',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: isSelected ? 'var(--cyber-yellow)' : 'var(--cyber-cyan)',
                        boxShadow: `0 0 10px ${isSelected ? '#fcee0a' : '#00f2fe'}`,
                      }}
                    />
                  </div>

                  <div style={{ width: '120px', textAlign: 'right', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem', color: 'var(--cyber-cyan)', fontWeight: 700, flexShrink: 0 }}>
                    {tech.count} {tech.count === 1 ? 'Repo' : 'Repos'} ({tech.percentage}%)
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* VIEW 5: HIERARCHY TREEMAP MAP */}
        {activePlot === 'treemap' && (
          <div style={{ width: '100%', padding: '0.5rem 0' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', textAlign: 'center' }}>
              Treemap block distribution: Area size is directly proportional to technology utilization.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', width: '100%' }}>
              {ranked_technologies.map((t) => {
                const flexBasis = t.count >= 4 ? 'calc(50% - 0.4rem)' : t.count === 3 ? 'calc(33.333% - 0.6rem)' : t.count === 2 ? 'calc(25% - 0.6rem)' : 'calc(20% - 0.65rem)'
                const isSelected = selectedTech?.toLowerCase() === t.name.toLowerCase()

                return (
                  <div
                    key={t.name}
                    onClick={() => handleTechClick(t.name)}
                    style={{
                      flex: `1 1 ${flexBasis}`,
                      minWidth: '150px',
                      minHeight: t.count >= 3 ? '110px' : '85px',
                      background: isSelected
                        ? 'rgba(252, 238, 10, 0.15)'
                        : `rgba(0, 242, 254, ${0.05 + (t.count / 4) * 0.12})`,
                      border: `1px solid ${isSelected ? 'var(--cyber-yellow)' : 'var(--border-cyber)'}`,
                      borderRadius: '10px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: isSelected ? '0 0 20px rgba(252, 238, 10, 0.25)' : undefined,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.98rem', color: isSelected ? 'var(--cyber-yellow)' : 'var(--text-main)' }}>
                        {t.name}
                      </span>
                      <TechIcon name={t.name} size={18} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.78rem', color: 'var(--cyber-cyan)', fontWeight: 700 }}>
                        {t.count}x Repos
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        {t.percentage}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* VIEW 6: RELATIONAL BUBBLE CLUSTER */}
        {activePlot === 'bubble' && (
          <div className="cyber-bar-grid">
            {ranked_technologies.map((t) => (
              <div
                key={t.name}
                className={`cyber-bar-card ${selectedTech?.toLowerCase() === t.name.toLowerCase() ? 'active' : ''}`}
                onClick={() => handleTechClick(t.name)}
              >
                <div className="cyber-bar-header">
                  <div className="cyber-bar-title">
                    <TechIcon name={t.name} size={16} />
                    <span>{t.name}</span>
                  </div>
                  <div className="cyber-bar-metric">
                    {t.count} {t.count === 1 ? 'Repo' : 'Repos'} ({t.percentage}%)
                  </div>
                </div>

                <div className="cyber-bar-pills">
                  {t.projects.map((projTitle) => (
                    <span key={projTitle} className="cyber-bar-mini-pill">
                      {projTitle}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Matching Connected Projects Showcase */}
      {selectedTech && connectedProjects.length > 0 && (
        <section style={{ marginTop: '3.5rem' }}>
          <div className="section-tag-hpc">
            <span className="section-tag-dot" />
            <span>CONNECTED REPOSITORIES // {selectedTech.toUpperCase()}</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.4rem 0 1.5rem' }}>
            Repositories Utilizing {selectedTech}
          </h2>

          <div className="projects-grid">
            {connectedProjects.map((p) => (
              <div key={p.id} className="cyber-card" style={{ cursor: 'default' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    {p.title}
                  </h3>
                  {p.repo && (
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--cyber-cyan)', textDecoration: 'none' }}
                      title="View on GitHub"
                    >
                      <ExternalLinkIcon />
                    </a>
                  )}
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                  {p.excerpt}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.2rem' }}>
                  {p.stack?.map((tech) => (
                    <span
                      key={tech}
                      className="tech-badge-cyber"
                      style={{
                        borderColor: tech.toLowerCase() === selectedTech.toLowerCase() ? 'var(--cyber-yellow)' : undefined,
                        color: tech.toLowerCase() === selectedTech.toLowerCase() ? 'var(--cyber-yellow)' : undefined,
                      }}
                    >
                      <TechIcon name={tech} size={12} />
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', marginTop: 'auto' }}>
                  <Link
                    to={`/project/${p.id}`}
                    className="cyber-action-btn secondary"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.8rem' }}
                  >
                    VIEW SPECS →
                  </Link>
                  {p.repo && (
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cyber-action-btn primary"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.8rem' }}
                    >
                      GITHUB ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
