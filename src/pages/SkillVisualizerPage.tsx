import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import skillsData from '../data/skills.json'
import analyticsData from '../data/extracts/skills_analytics.json'
import ThreeSkillsTerrain from '../components/ThreeSkillsTerrain'
import { SkillGlyph } from '../ui/HeroIcons'
import '../styles/home.css'
import '../styles/graphs.css'

type PlotType = '3d' | 'radar' | 'stem' | 'wheel' | 'histogram' | 'treemap'

export default function SkillVisualizerPage() {
  const navigate = useNavigate()
  const [activePlot, setActivePlot] = useState<PlotType>('3d')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [selectedBin, setSelectedBin] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  // Safely extract category metrics and distributions with fallback
  const { total_skills, total_categories, category_stats, all_skills_ranked } = useMemo(() => {
    if (analyticsData && analyticsData.category_stats) {
      return analyticsData
    }
    // Fallback on the fly if needed
    const catMap: Record<string, typeof skillsData> = {}
    skillsData.forEach((s) => {
      catMap[s.category] = catMap[s.category] || []
      catMap[s.category].push(s)
    })
    const stats = Object.entries(catMap).map(([cat, list]) => {
      const avg = Math.round(list.reduce((acc, x) => acc + x.level, 0) / list.length)
      const levels = list.map((x) => x.level)
      return {
        category: cat,
        skill_count: list.length,
        avg_level: avg,
        min_level: Math.min(...levels),
        max_level: Math.max(...levels),
        top_skills: list.slice(0, 3).map((x) => x.name),
        skills: list,
      }
    })
    return {
      total_skills: skillsData.length,
      total_categories: Object.keys(catMap).length,
      category_stats: stats,
      level_distribution: { '50-59%': 5, '60-69%': 8, '70-79%': 13, '80-89%': 10, '90-100%': 16 },
      all_skills_ranked: [...skillsData].sort((a, b) => b.level - a.level),
    }
  }, [])

  // Currently inspected category data
  const activeCategoryData = useMemo(() => {
    if (!selectedCategory) return null
    return category_stats.find((c) => c.category.toLowerCase() === selectedCategory.toLowerCase()) || null
  }, [category_stats, selectedCategory])

  // Category palette generator for vibrant cyber styling
  const getCategoryColor = (cat: string, alpha = 1) => {
    const palette: Record<string, string> = {
      'Systems': `rgba(0, 242, 254, ${alpha})`,
      'HPC': `rgba(56, 189, 248, ${alpha})`,
      'Parallel Computing': `rgba(168, 85, 247, ${alpha})`,
      'Benchmarking': `rgba(236, 72, 153, ${alpha})`,
      'Literate Programming': `rgba(252, 238, 10, ${alpha})`,
      'Programming Languages': `rgba(52, 211, 153, ${alpha})`,
      'Scripting': `rgba(251, 146, 60, ${alpha})`,
      'Developer Tools': `rgba(96, 165, 250, ${alpha})`,
      'Schedulers': `rgba(192, 132, 252, ${alpha})`,
      'DevOps': `rgba(244, 63, 94, ${alpha})`,
      'AI': `rgba(249, 115, 22, ${alpha})`,
      'GPU Computing': `rgba(16, 185, 129, ${alpha})`,
      'Web Technology': `rgba(14, 165, 233, ${alpha})`,
      'Cloud': `rgba(217, 70, 239, ${alpha})`,
    }
    return palette[cat] || `rgba(0, 242, 254, ${alpha})`
  }

  // 1. Radar Polar Calculations
  const radarData = useMemo(() => {
    const n = category_stats.length
    if (n === 0) return { polygonPoints: '', axes: [], centerX: 340, centerY: 260, maxR: 175 }

    const centerX = 340
    const centerY = 260
    const maxR = 175

    const axes = category_stats.map((item, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const r = (item.avg_level / 100) * maxR
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
  }, [category_stats])

  // 2. Radial Wheel Segments
  const wheelData = useMemo(() => {
    const totalCount = category_stats.reduce((acc, c) => acc + c.skill_count, 0)
    let currentAngle = -Math.PI / 2
    const centerX = 260
    const centerY = 260
    const innerR = 90
    const baseOuterR = 165

    return category_stats.map((cat) => {
      const sliceAngle = (cat.skill_count / totalCount) * 2 * Math.PI
      const startAngle = currentAngle
      const endAngle = currentAngle + sliceAngle
      currentAngle = endAngle

      const levelBoost = ((cat.avg_level - 50) / 50) * 25
      const outerR = baseOuterR + levelBoost

      const x1 = centerX + innerR * Math.cos(startAngle)
      const y1 = centerY + innerR * Math.sin(startAngle)
      const x2 = centerX + outerR * Math.cos(startAngle)
      const y2 = centerY + outerR * Math.sin(startAngle)
      const x3 = centerX + outerR * Math.cos(endAngle)
      const y3 = centerY + outerR * Math.sin(endAngle)
      const x4 = centerX + innerR * Math.cos(endAngle)
      const y4 = centerY + innerR * Math.sin(endAngle)

      const largeArc = sliceAngle > Math.PI ? 1 : 0
      const pathData = `
        M ${x1} ${y1}
        L ${x2} ${y2}
        A ${outerR} ${outerR} 0 ${largeArc} 1 ${x3} ${y3}
        L ${x4} ${y4}
        A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1} ${y1}
        Z
      `
      const midAngle = startAngle + sliceAngle / 2
      const textX = centerX + (outerR + 22) * Math.cos(midAngle)
      const textY = centerY + (outerR + 22) * Math.sin(midAngle)

      return {
        ...cat,
        pathData,
        textX,
        textY,
        midAngle,
        color: getCategoryColor(cat.category),
      }
    })
  }, [category_stats])

  // 3. Matplotlib Histogram Bins Data
  const histogramBins = useMemo(() => {
    const binsConfig = [
      { range: '50-59%', min: 50, max: 59, label: '50–59% Basic Proficiency' },
      { range: '60-69%', min: 60, max: 69, label: '60–69% Competent / Working' },
      { range: '70-79%', min: 70, max: 79, label: '70–79% Highly Proficient' },
      { range: '80-89%', min: 80, max: 89, label: '80–89% Advanced Master' },
      { range: '90-100%', min: 90, max: 100, label: '90–100% Core Specialist' },
    ]

    return binsConfig.map((b) => {
      const matchingSkills = all_skills_ranked.filter((s) => s.level >= b.min && s.level <= b.max)
      return {
        ...b,
        count: matchingSkills.length,
        skills: matchingSkills,
        percentage: Math.round((matchingSkills.length / total_skills) * 100),
      }
    })
  }, [all_skills_ranked, total_skills])

  const handleCategoryClick = (catName: string) => {
    setSelectedCategory(catName === selectedCategory ? null : catName)
  }

  const navigateToCatalog = (catName: string) => {
    navigate('/skills', { state: { filterCategory: catName } })
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
            to="/skills"
            className="cyber-action-btn secondary"
            style={{ textDecoration: 'none', display: 'inline-flex', padding: '0.5rem 1.1rem', fontSize: '0.8rem' }}
          >
            ← BACK TO ALL SKILLS
          </Link>
        </div>

        <Link
          to="/projects/visualize"
          className="cyber-action-btn primary"
          style={{ textDecoration: 'none', display: 'inline-flex', padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}
        >
          <span>SWITCH TO PROJECTS VISUALIZER ↗</span>
        </Link>
      </div>

      {/* Header Dossier */}
      <div style={{ marginBottom: '2.8rem' }}>
        <div className="section-tag-hpc">
          <span className="section-tag-dot" />
          <span>ADVANCED COMPETENCY ANALYTICS // 6 PLOT METHODS</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 0.8rem', color: 'var(--text-main)' }}>
          Skills &amp; Expertise Visualizer
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.08rem', maxWidth: '820px', lineHeight: 1.65, margin: 0 }}>
          Interactive multi-representation analytics across {total_skills} technical competencies spanning 14 specialization domains. Switch between 3D competency terrain, polar spider radar matrices, matplotlib stem &amp; whisker plots, radial sunburst wheels, and frequency histograms.
        </p>
      </div>

      {/* Key Telemetry Metrics Bar */}
      <div className="social-stats-row" style={{ marginBottom: '2.5rem' }}>
        <div className="social-stat-item">
          <div className="social-stat-number">{total_skills}</div>
          <div className="social-stat-title">Technical Competencies</div>
        </div>
        <div className="social-stat-item">
          <div className="social-stat-number">{total_categories}</div>
          <div className="social-stat-title">Specialization Domains</div>
        </div>
        <div className="social-stat-item">
          <div className="social-stat-number">{category_stats[0]?.category || 'Systems'}</div>
          <div className="social-stat-title">Top Tier Domain (Avg {category_stats[0]?.avg_level || 91}%)</div>
        </div>
        <div className="social-stat-item">
          <div className="social-stat-number">{all_skills_ranked.filter((s) => s.level >= 90).length}</div>
          <div className="social-stat-title">Core Specialist Skills (≥ 90%)</div>
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
              {activePlot === '3d' && '🎮 3D Interactive Competency Terrain Pillars'}
              {activePlot === 'radar' && '🕸️ Polar Spider Radar Matrix (14 Domain Polygon)'}
              {activePlot === 'stem' && '📍 Matplotlib Stem & Whisker Errorbar Spectrum'}
              {activePlot === 'wheel' && '🎯 Radial Polar Sunburst Wheel (Competency Distribution)'}
              {activePlot === 'histogram' && '📊 Matplotlib Proficiency Level Histogram (hist)'}
              {activePlot === 'treemap' && '🌲 Proportional Category Block Treemap'}
            </div>
          </div>

          <div className="cyber-graph-switcher">
            <button
              onClick={() => setActivePlot('3d')}
              className={`cyber-graph-switcher-btn ${activePlot === '3d' ? 'active' : ''}`}
            >
              <span>🎮 3D TERRAIN</span>
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
              <span>📍 STEM &amp; WHISKER</span>
            </button>
            <button
              onClick={() => setActivePlot('wheel')}
              className={`cyber-graph-switcher-btn ${activePlot === 'wheel' ? 'active' : ''}`}
            >
              <span>🎯 POLAR WHEEL</span>
            </button>
            <button
              onClick={() => setActivePlot('histogram')}
              className={`cyber-graph-switcher-btn ${activePlot === 'histogram' ? 'active' : ''}`}
            >
              <span>📊 HISTOGRAM</span>
            </button>
            <button
              onClick={() => setActivePlot('treemap')}
              className={`cyber-graph-switcher-btn ${activePlot === 'treemap' ? 'active' : ''}`}
            >
              <span>🌲 TREEMAP</span>
            </button>
          </div>
        </div>

        {/* Active Selected Domain Banner */}
        {selectedCategory && activeCategoryData && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0, 242, 254, 0.1)', border: '1px solid var(--cyber-cyan)', padding: '0.65rem 1.2rem', borderRadius: '8px', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ color: 'var(--cyber-cyan)', fontWeight: 800 }}>ACTIVE DOMAIN:</span>
              <strong style={{ color: 'var(--cyber-yellow)', fontSize: '1.05rem' }}>{selectedCategory}</strong>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                ({activeCategoryData.skill_count} skills, Avg {activeCategoryData.avg_level}%, Min {activeCategoryData.min_level}% – Max {activeCategoryData.max_level}%)
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                onClick={() => navigateToCatalog(selectedCategory)}
                className="cyber-action-btn primary"
                style={{ fontSize: '0.72rem', padding: '0.35rem 0.85rem' }}
              >
                FILTER IN SKILLS CATALOG →
              </button>
              <button
                onClick={() => setSelectedCategory(null)}
                className="cyber-action-btn secondary"
                style={{ fontSize: '0.72rem', padding: '0.35rem 0.65rem' }}
              >
                ✕ CLEAR
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 1: THREE.JS 3D COMPETENCY TERRAIN
            ======================================================== */}
        {activePlot === '3d' && (
          <ThreeSkillsTerrain
            categories={category_stats}
            onSelectCategory={handleCategoryClick}
            activeCategory={selectedCategory || undefined}
          />
        )}

        {/* ========================================================
            VIEW 2: POLAR SPIDER RADAR MATRIX (14 DOMAINS)
            ======================================================== */}
        {activePlot === 'radar' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem', textAlign: 'center' }}>
              Polar coordinate projection of all 14 specialization domains. Concentric polygons mark 25%, 50%, 75%, and 100% proficiencies. Click any node or label to inspect.
            </p>

            <svg viewBox="0 0 680 520" className="cyber-radar-svg">
              <defs>
                <linearGradient id="radarSkillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.55" />
                  <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#fcee0a" stopOpacity="0.25" />
                </linearGradient>
              </defs>

              {/* Concentric Reference Webs */}
              {[0.25, 0.5, 0.75, 1.0].map((level) => {
                const r = radarData.maxR * level
                const n = radarData.axes.length
                const pts = Array.from({ length: n })
                  .map((_, i) => {
                    const angle = (2 * Math.PI * i) / n - Math.PI / 2
                    return `${radarData.centerX + Math.cos(angle) * r},${radarData.centerY + Math.sin(angle) * r}`
                  })
                  .join(' ')
                return (
                  <g key={`ring-${level}`}>
                    <polygon
                      points={pts}
                      fill="none"
                      stroke={level === 1.0 ? 'rgba(0, 242, 254, 0.35)' : 'rgba(255, 255, 255, 0.08)'}
                      strokeWidth={level === 1.0 ? 1.5 : 1}
                      strokeDasharray={level === 1.0 ? undefined : '3 3'}
                    />
                    <text
                      x={radarData.centerX + 6}
                      y={radarData.centerY - r + 12}
                      fill="var(--text-muted)"
                      fontSize="9"
                      fontFamily="var(--font-mono, monospace)"
                      opacity={0.7}
                    >
                      {Math.round(level * 100)}%
                    </text>
                  </g>
                )
              })}

              {/* Axis Spokes & Category Labels */}
              {radarData.axes.map((ax) => {
                const isSelected = selectedCategory?.toLowerCase() === ax.category.toLowerCase()
                const isHovered = hoveredCategory?.toLowerCase() === ax.category.toLowerCase()
                return (
                  <g key={`axis-${ax.category}`}>
                    <line
                      x1={radarData.centerX}
                      y1={radarData.centerY}
                      x2={ax.endX}
                      y2={ax.endY}
                      stroke={isSelected ? 'var(--cyber-yellow)' : 'rgba(255, 255, 255, 0.12)'}
                      strokeWidth={isSelected ? 2 : 1}
                    />
                    <text
                      x={ax.lx}
                      y={ax.ly}
                      textAnchor={Math.abs(ax.cos) < 0.2 ? 'middle' : ax.cos > 0 ? 'start' : 'end'}
                      alignmentBaseline="middle"
                      className="cyber-radar-axis-label"
                      fill={isSelected ? 'var(--cyber-yellow)' : isHovered ? 'var(--cyber-cyan)' : 'var(--text-muted)'}
                      fontSize={isSelected ? '12px' : '10.5px'}
                      fontWeight={isSelected ? 800 : 600}
                      onClick={() => handleCategoryClick(ax.category)}
                      onMouseEnter={() => setHoveredCategory(ax.category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      {ax.category} ({ax.avg_level}%)
                    </text>
                  </g>
                )
              })}

              {/* Filled Competency Polygon */}
              <polygon
                points={radarData.polygonPoints}
                fill="url(#radarSkillGrad)"
                stroke="#00f2fe"
                strokeWidth="2.5"
                filter="drop-shadow(0 0 12px rgba(0, 242, 254, 0.5))"
              />

              {/* Vertices / Points */}
              {radarData.axes.map((ax) => {
                const isSelected = selectedCategory?.toLowerCase() === ax.category.toLowerCase()
                return (
                  <circle
                    key={`dot-${ax.category}`}
                    cx={ax.px}
                    cy={ax.py}
                    r={isSelected ? 7 : 5}
                    className="cyber-radar-vertex"
                    fill={isSelected ? '#fcee0a' : '#00f2fe'}
                    stroke={isSelected ? '#fff' : '#0a0d14'}
                    strokeWidth="2"
                    onClick={() => handleCategoryClick(ax.category)}
                    onMouseEnter={() => setHoveredCategory(ax.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <title>{`${ax.category}: Avg ${ax.avg_level}% (${ax.skill_count} skills)`}</title>
                  </circle>
                )
              })}
            </svg>
          </div>
        )}

        {/* ========================================================
            VIEW 3: MATPLOTLIB STEM & WHISKER SPECTRUM
            ======================================================== */}
        {activePlot === 'stem' && (
          <div style={{ width: '100%', overflowX: 'auto', padding: '1rem 0' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem', textAlign: 'center' }}>
              Scientific Matplotlib `stem()` with min/max range whiskers. Vertical stems represent average proficiency; whiskers indicate the minimum-to-maximum range in each domain.
            </p>

            <div style={{ minWidth: '880px', margin: '0 auto' }}>
              <svg viewBox="0 0 880 400" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="stemLineGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0, 242, 254, 0.2)" />
                    <stop offset="100%" stopColor="#00f2fe" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Grid Reference Lines (40% to 100%) */}
                {[40, 50, 60, 70, 80, 90, 100].map((val) => {
                  const y = 300 - ((val - 40) / 60) * 240
                  return (
                    <g key={`y-grid-${val}`}>
                      <line x1={70} y1={y} x2={850} y2={y} stroke="rgba(255, 255, 255, 0.07)" strokeDasharray="3 3" />
                      <text x={60} y={y + 4} textAnchor="end" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono, monospace)">
                        {val}%
                      </text>
                    </g>
                  )
                })}

                {/* Baseline (at 40%) */}
                <line x1={70} y1={300} x2={850} y2={300} stroke="rgba(0, 242, 254, 0.4)" strokeWidth="2" />

                {/* Stems, Whiskers & Caps */}
                {category_stats.map((cat, idx) => {
                  const stepX = (850 - 90) / (category_stats.length - 1)
                  const x = 90 + idx * stepX
                  const avgY = 300 - ((cat.avg_level - 40) / 60) * 240
                  const minY = 300 - ((cat.min_level - 40) / 60) * 240
                  const maxY = 300 - ((cat.max_level - 40) / 60) * 240
                  const isSelected = selectedCategory?.toLowerCase() === cat.category.toLowerCase()
                  const isHovered = hoveredCategory?.toLowerCase() === cat.category.toLowerCase()

                  return (
                    <g
                      key={`stem-${cat.category}`}
                      onClick={() => handleCategoryClick(cat.category)}
                      onMouseEnter={() => setHoveredCategory(cat.category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Whisker Errorbar (min to max) */}
                      <line
                        x1={x}
                        y1={minY}
                        x2={x}
                        y2={maxY}
                        stroke={isSelected ? 'var(--cyber-yellow)' : 'rgba(252, 238, 10, 0.45)'}
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                      {/* Min cap tick */}
                      <line x1={x - 5} y1={minY} x2={x + 5} y2={minY} stroke={isSelected ? 'var(--cyber-yellow)' : '#fcee0a'} strokeWidth="1.5" />
                      {/* Max cap tick */}
                      <line x1={x - 5} y1={maxY} x2={x + 5} y2={maxY} stroke={isSelected ? 'var(--cyber-yellow)' : '#fcee0a'} strokeWidth="1.5" />

                      {/* Main Stem Line */}
                      <line
                        x1={x}
                        y1={300}
                        x2={x}
                        y2={avgY}
                        stroke={isSelected ? '#fcee0a' : isHovered ? '#00f2fe' : 'url(#stemLineGrad)'}
                        strokeWidth={isSelected || isHovered ? 3 : 2}
                      />

                      {/* Stem Marker Cap */}
                      <circle
                        cx={x}
                        cy={avgY}
                        r={isSelected ? 8 : isHovered ? 7 : 5.5}
                        fill={isSelected ? '#fcee0a' : getCategoryColor(cat.category)}
                        stroke="#0a0d14"
                        strokeWidth="2"
                        filter={isSelected || isHovered ? 'drop-shadow(0 0 10px #00f2fe)' : undefined}
                      />

                      {/* Value readout above cap */}
                      <text
                        x={x}
                        y={avgY - 12}
                        textAnchor="middle"
                        fill={isSelected ? 'var(--cyber-yellow)' : 'var(--text-main)'}
                        fontSize="10"
                        fontWeight={700}
                        fontFamily="var(--font-mono, monospace)"
                      >
                        {cat.avg_level}%
                      </text>

                      {/* Category X-Axis Tilted Label */}
                      <text
                        x={x}
                        y={316}
                        textAnchor="end"
                        transform={`rotate(-45, ${x}, 316)`}
                        fill={isSelected ? 'var(--cyber-yellow)' : isHovered ? 'var(--cyber-cyan)' : 'var(--text-muted)'}
                        fontSize="9.5"
                        fontWeight={isSelected ? 700 : 500}
                        fontFamily="var(--font-mono, monospace)"
                      >
                        {cat.category}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 4: RADIAL POLAR SUNBURST WHEEL
            ======================================================== */}
        {activePlot === 'wheel' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem', textAlign: 'center' }}>
              Radial polar partition wheel: Arc angle denotes quantity of skills; radial thickness denotes average proficiency. Click any arc segment to focus.
            </p>

            <svg viewBox="0 0 520 520" className="cyber-wheel-svg">
              <defs>
                <filter id="wheelGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Slices */}
              {wheelData.map((slice) => {
                const isSelected = selectedCategory?.toLowerCase() === slice.category.toLowerCase()
                const isHovered = hoveredCategory?.toLowerCase() === slice.category.toLowerCase()
                return (
                  <path
                    key={`slice-${slice.category}`}
                    d={slice.pathData}
                    fill={slice.color}
                    fillOpacity={isSelected ? 0.95 : isHovered ? 0.8 : 0.6}
                    stroke={isSelected ? '#fcee0a' : 'rgba(10, 13, 20, 0.8)'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="cyber-wheel-slice"
                    filter={isSelected ? 'url(#wheelGlow)' : undefined}
                    onClick={() => handleCategoryClick(slice.category)}
                    onMouseEnter={() => setHoveredCategory(slice.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <title>{`${slice.category}: Avg ${slice.avg_level}%, ${slice.skill_count} skills`}</title>
                  </path>
                )
              })}

              {/* Center Readout Display */}
              <circle
                cx={260}
                cy={260}
                r={84}
                fill="var(--bg-surface)"
                stroke="var(--cyber-cyan)"
                strokeWidth="1.5"
              />
              <text x={260} y={235} className="cyber-wheel-center-label" fill="var(--cyber-cyan)" fontSize="11" fontWeight={700}>
                {hoveredCategory || selectedCategory || 'DOMAIN'}
              </text>
              <text x={260} y={265} className="cyber-wheel-center-label" fill="var(--text-main)" fontSize="24" fontWeight={900}>
                {hoveredCategory
                  ? `${category_stats.find((c) => c.category === hoveredCategory)?.avg_level}%`
                  : selectedCategory
                  ? `${activeCategoryData?.avg_level}%`
                  : `${Math.round(category_stats.reduce((a, b) => a + b.avg_level, 0) / category_stats.length)}%`}
              </text>
              <text x={260} y={285} className="cyber-wheel-center-label" fill="var(--text-muted)" fontSize="9">
                {hoveredCategory
                  ? `${category_stats.find((c) => c.category === hoveredCategory)?.skill_count} Competencies`
                  : selectedCategory
                  ? `${activeCategoryData?.skill_count} Competencies`
                  : 'Overall Avg Proficiency'}
              </text>
            </svg>
          </div>
        )}

        {/* ========================================================
            VIEW 5: MATPLOTLIB PROFICIENCY HISTOGRAM (hist)
            ======================================================== */}
        {activePlot === 'histogram' && (
          <div style={{ width: '100%', padding: '1rem 0' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>
              Frequency distribution of all {total_skills} competencies across proficiency tiers (matplotlib `hist`). Click a bin column to inspect all matching skills.
            </p>

            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', alignItems: 'flex-end', minHeight: '260px', paddingBottom: '1rem', borderBottom: '2px solid rgba(0, 242, 254, 0.4)' }}>
                {histogramBins.map((bin) => {
                  const maxCount = 18
                  const heightPct = Math.max(15, Math.round((bin.count / maxCount) * 100))
                  const isSelected = selectedBin === bin.range

                  return (
                    <div
                      key={bin.range}
                      onClick={() => setSelectedBin(isSelected ? null : bin.range)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.6rem',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', fontWeight: 800, color: isSelected ? 'var(--cyber-yellow)' : 'var(--cyber-cyan)' }}>
                        {bin.count} skills
                      </div>

                      <div
                        style={{
                          width: '100%',
                          height: `${heightPct * 2.2}px`,
                          background: isSelected
                            ? 'linear-gradient(180deg, #fcee0a 0%, rgba(252, 238, 10, 0.25) 100%)'
                            : 'linear-gradient(180deg, #00f2fe 0%, rgba(0, 242, 254, 0.15) 100%)',
                          border: `1px solid ${isSelected ? '#fcee0a' : 'var(--cyber-cyan)'}`,
                          borderRadius: '8px 8px 2px 2px',
                          boxShadow: isSelected ? '0 0 20px rgba(252, 238, 10, 0.4)' : '0 0 15px rgba(0, 242, 254, 0.15)',
                          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />

                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {bin.range}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {bin.percentage}% share
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Skills belonging to selected bin */}
              {selectedBin && (
                <div style={{ marginTop: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-cyber)', borderRadius: '12px', padding: '1.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.6rem' }}>
                    <div style={{ fontWeight: 800, color: 'var(--cyber-yellow)', fontSize: '1.05rem' }}>
                      Competencies in {selectedBin} Tier ({histogramBins.find((b) => b.range === selectedBin)?.count} total):
                    </div>
                    <button
                      onClick={() => setSelectedBin(null)}
                      className="cyber-action-btn secondary"
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                    >
                      ✕ CLOSE
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {histogramBins
                      .find((b) => b.range === selectedBin)
                      ?.skills.map((sk) => (
                        <div
                          key={sk.id}
                          style={{
                            background: 'rgba(0, 242, 254, 0.08)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            padding: '0.45rem 0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>{sk.name}</span>
                          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: 'var(--cyber-cyan)' }}>{sk.level}%</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>[{sk.category}]</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 6: PROPORTIONAL CATEGORY TREEMAP
            ======================================================== */}
        {activePlot === 'treemap' && (
          <div style={{ width: '100%', padding: '1rem 0' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>
              Hierarchical area treemap: Block dimensions represent total skills; color intensity denotes average proficiency. Click any tile to inspect.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {category_stats.map((cat) => {
                const isSelected = selectedCategory?.toLowerCase() === cat.category.toLowerCase()
                return (
                  <div
                    key={cat.category}
                    onClick={() => handleCategoryClick(cat.category)}
                    style={{
                      background: isSelected ? 'rgba(252, 238, 10, 0.08)' : 'var(--bg-surface)',
                      border: `1px solid ${isSelected ? 'var(--cyber-yellow)' : 'var(--border-subtle)'}`,
                      borderRadius: '12px',
                      padding: '1.2rem',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: isSelected ? '0 0 20px rgba(252, 238, 10, 0.2)' : undefined,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.7rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: isSelected ? 'var(--cyber-yellow)' : 'var(--text-main)' }}>
                        {cat.category}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', fontWeight: 800, color: 'var(--cyber-cyan)' }}>
                        {cat.avg_level}%
                      </div>
                    </div>

                    <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                      {cat.skill_count} Competencies // Range: {cat.min_level}–{cat.max_level}%
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {cat.top_skills.map((ts) => (
                        <span
                          key={ts}
                          style={{
                            fontFamily: 'var(--font-mono, monospace)',
                            fontSize: '0.7rem',
                            background: 'rgba(0, 242, 254, 0.08)',
                            border: '1px solid var(--border-subtle)',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {ts}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          CONNECTED DOMAIN INTELLIGENCE DRAWER
          ======================================================== */}
      {selectedCategory && activeCategoryData && (
        <div style={{ marginTop: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-tag-hpc">
                <span className="section-tag-dot" />
                <span>DOMAIN INTELLIGENCE DOSSIER</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.3rem 0 0', color: 'var(--text-main)' }}>
                {activeCategoryData.category} Domain Competencies
              </h2>
            </div>
            <button
              onClick={() => navigateToCatalog(selectedCategory)}
              className="cyber-action-btn primary"
              style={{ fontSize: '0.82rem', padding: '0.5rem 1.1rem' }}
            >
              FILTER THIS DOMAIN IN SKILLS CATALOG →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem' }}>
            {activeCategoryData.skills.map((skill) => (
              <div
                key={skill.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '1.3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.8rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <SkillGlyph id={skill.id} />
                      <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{skill.name}</strong>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.88rem', fontWeight: 800, color: 'var(--cyber-cyan)' }}>
                      {skill.level}%
                    </span>
                  </div>

                  <div className="cyber-bar-track" style={{ margin: '0.5rem 0 0.8rem' }}>
                    <div className="cyber-bar-fill" style={{ width: `${skill.level}%` }} />
                  </div>

                  {('context' in skill && typeof skill.context === 'string') && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                      {skill.context}
                    </p>
                  )}
                </div>

                {skill.featured && (
                  <div style={{ alignSelf: 'flex-start' }}>
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.68rem', fontWeight: 800, color: 'var(--cyber-yellow)', background: 'rgba(252, 238, 10, 0.1)', border: '1px solid var(--cyber-yellow)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      FEATURED COMPETENCY
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
