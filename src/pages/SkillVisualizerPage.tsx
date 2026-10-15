import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import skillsData from '../data/skills.json'
import analyticsData from '../data/extracts/skills_analytics.json'
import ThreeSkillsTerrain from '../components/ThreeSkillsTerrain'
import { SkillGlyph } from '../ui/HeroIcons'
import '../styles/home.css'
import '../styles/graphs.css'

type PlotType =
  | '3d'
  | 'sunburst'
  | 'polarbar'
  | 'boxplot'
  | 'radar'
  | 'superclusters'
  | 'ecdf'
  | 'honeycomb'
  | 'stem'
  | 'histogram'
  | 'treemap'

export default function SkillVisualizerPage() {
  const navigate = useNavigate()
  const [activePlot, setActivePlot] = useState<PlotType>('3d')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [selectedBin, setSelectedBin] = useState<string | null>(null)
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  // Safely extract category metrics and distributions with fallback
  const {
    total_skills,
    total_categories,
    category_stats,
    super_clusters,
    ecdf_points,
    overall_percentiles,
    featured_count,
    all_skills_ranked,
  } = useMemo(() => {
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
        q1: avg - 5,
        median: avg,
        q3: avg + 5,
        iqr: 10,
        levels,
        top_skills: list.slice(0, 3).map((x) => x.name),
        skills: list,
      }
    })
    return {
      total_skills: skillsData.length,
      total_categories: Object.keys(catMap).length,
      category_stats: stats,
      super_clusters: [],
      ecdf_points: [],
      overall_percentiles: { p25: 70, median: 75, p75: 85, p90: 90 },
      featured_count: skillsData.filter((s) => s.featured).length,
      all_skills_ranked: [...skillsData].sort((a, b) => b.level - a.level),
    }
  }, [])

  // Currently inspected category data
  const activeCategoryData = useMemo(() => {
    if (!selectedCategory) return null
    return category_stats.find((c) => c.category.toLowerCase() === selectedCategory.toLowerCase()) || null
  }, [category_stats, selectedCategory])

  // Category palette generator
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

  // ==========================================
  // PLOTLY INTERACTIVE SUNBURST DATA
  // ==========================================
  const sunburstArcs = useMemo(() => {
    const centerX = 300
    const centerY = 300
    const r1 = 65 // Super-clusters inner ring
    const r2 = 135 // Categories ring
    const r3 = 205 // Outer ring (top skills)

    const total = category_stats.reduce((acc, c) => acc + c.skill_count, 0)
    let currentAngle = -Math.PI / 2

    return category_stats.map((cat) => {
      const sliceAngle = (cat.skill_count / total) * 2 * Math.PI
      const startAngle = currentAngle
      const endAngle = currentAngle + sliceAngle
      currentAngle = endAngle

      const createArc = (innerR: number, outerR: number) => {
        const x1 = centerX + innerR * Math.cos(startAngle)
        const y1 = centerY + innerR * Math.sin(startAngle)
        const x2 = centerX + outerR * Math.cos(startAngle)
        const y2 = centerY + outerR * Math.sin(startAngle)
        const x3 = centerX + outerR * Math.cos(endAngle)
        const y3 = centerY + outerR * Math.sin(endAngle)
        const x4 = centerX + innerR * Math.cos(endAngle)
        const y4 = centerY + innerR * Math.sin(endAngle)
        const largeArc = sliceAngle > Math.PI ? 1 : 0
        return `M ${x1} ${y1} L ${x2} ${y2} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1} ${y1} Z`
      }

      const midAngle = startAngle + sliceAngle / 2
      const textX = centerX + ((r1 + r2) / 2) * Math.cos(midAngle)
      const textY = centerY + ((r1 + r2) / 2) * Math.sin(midAngle)

      return {
        ...cat,
        catPath: createArc(r1, r2),
        skillPath: createArc(r2 + 3, r3),
        textX,
        textY,
        midAngle,
        color: getCategoryColor(cat.category),
      }
    })
  }, [category_stats])

  // ==========================================
  // PLOTLY POLAR BAR / WIND ROSE DATA (go.Barpolar)
  // ==========================================
  const polarBarData = useMemo(() => {
    const centerX = 300
    const centerY = 260
    const maxR = 190
    const n = category_stats.length

    return category_stats.map((cat, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2
      const barLen = Math.max(25, (cat.avg_level / 100) * maxR)
      const widthAngle = (2 * Math.PI / n) * 0.75

      const startA = angle - widthAngle / 2
      const endA = angle + widthAngle / 2

      const x1 = centerX + 18 * Math.cos(startA)
      const y1 = centerY + 18 * Math.sin(startA)
      const x2 = centerX + barLen * Math.cos(startA)
      const y2 = centerY + barLen * Math.sin(startA)
      const x3 = centerX + barLen * Math.cos(endA)
      const y3 = centerY + barLen * Math.sin(endA)
      const x4 = centerX + 18 * Math.cos(endA)
      const y4 = centerY + 18 * Math.sin(endA)

      const pathD = `M ${x1} ${y1} L ${x2} ${y2} A ${barLen} ${barLen} 0 0 1 ${x3} ${y3} L ${x4} ${y4} Z`
      const labelX = centerX + (barLen + 22) * Math.cos(angle)
      const labelY = centerY + (barLen + 22) * Math.sin(angle)

      return {
        ...cat,
        pathD,
        labelX,
        labelY,
        angle,
        cos: Math.cos(angle),
        color: getCategoryColor(cat.category),
      }
    })
  }, [category_stats])

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

  // 2. Matplotlib Histogram Bins Data
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
          <span>ADVANCED COMPETENCY ANALYTICS // 11 SCIENTIFIC PLOTS</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 0.8rem', color: 'var(--text-main)' }}>
          Skills &amp; Expertise Visualizer
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '820px', lineHeight: 1.65, margin: 0 }}>
          Interactive multi-representation analytics across {total_skills} technical competencies spanning 14 specialization domains. Switch between 3D competency terrain, Plotly interactive sunburst partitions, polar bar wind roses, scientific boxplots, and cyber honeycombs.
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
          <div className="social-stat-title">Top Domain (Avg {category_stats[0]?.avg_level || 91}%)</div>
        </div>
        <div className="social-stat-item">
          <div className="social-stat-number">{featured_count}</div>
          <div className="social-stat-title">Cornerstone Featured Skills</div>
        </div>
      </div>

      {/* Main Visualizer Container */}
      <div className="cyber-graph-card">
        {/* Method Switcher Header with Horizontal Scroll */}
        <div className="cyber-graph-header">
          <div className="cyber-graph-title-group">
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.78rem', color: 'var(--cyber-cyan)', fontWeight: 700 }}>
              VISUALIZATION METHOD
            </div>
            <div className="cyber-graph-title">
              {activePlot === '3d' && '🎮 3D Interactive Competency Terrain Pillars'}
              {activePlot === 'sunburst' && '☀️ Plotly Interactive Multi-Level Sunburst Partition'}
              {activePlot === 'polarbar' && '🎯 Plotly Polar Bar / Wind Rose (go.Barpolar)'}
              {activePlot === 'boxplot' && '📦 Matplotlib Box & Whisker Quartile Spectrum (boxplot)'}
              {activePlot === 'radar' && '🕸️ Polar Spider Radar Matrix (14 Domain Polygon)'}
              {activePlot === 'superclusters' && '🪐 Strategic Domain Super-Clusters Dashboard'}
              {activePlot === 'ecdf' && '📈 Empirical Cumulative Distribution Function (ECDF)'}
              {activePlot === 'honeycomb' && '🐝 Hexagonal Cyber Competency Honeycomb Grid'}
              {activePlot === 'stem' && '📍 Matplotlib Stem & Whisker Errorbar Spectrum'}
              {activePlot === 'histogram' && '📊 Matplotlib Proficiency Level Histogram (hist)'}
              {activePlot === 'treemap' && '🌲 Proportional Category Block Treemap'}
            </div>
          </div>

          {/* Swipeable Tab Strip */}
          <div className="cyber-graph-switcher">
            <button
              onClick={() => setActivePlot('3d')}
              className={`cyber-graph-switcher-btn ${activePlot === '3d' ? 'active' : ''}`}
            >
              <span>🎮 3D TERRAIN</span>
            </button>
            <button
              onClick={() => setActivePlot('sunburst')}
              className={`cyber-graph-switcher-btn ${activePlot === 'sunburst' ? 'active' : ''}`}
            >
              <span>☀️ SUNBURST</span>
            </button>
            <button
              onClick={() => setActivePlot('polarbar')}
              className={`cyber-graph-switcher-btn ${activePlot === 'polarbar' ? 'active' : ''}`}
            >
              <span>🎯 POLAR BARS</span>
            </button>
            <button
              onClick={() => setActivePlot('boxplot')}
              className={`cyber-graph-switcher-btn ${activePlot === 'boxplot' ? 'active' : ''}`}
            >
              <span>📦 BOXPLOT</span>
            </button>
            <button
              onClick={() => setActivePlot('radar')}
              className={`cyber-graph-switcher-btn ${activePlot === 'radar' ? 'active' : ''}`}
            >
              <span>🕸️ RADAR</span>
            </button>
            <button
              onClick={() => setActivePlot('superclusters')}
              className={`cyber-graph-switcher-btn ${activePlot === 'superclusters' ? 'active' : ''}`}
            >
              <span>🪐 SUPER-CLUSTERS</span>
            </button>
            <button
              onClick={() => setActivePlot('ecdf')}
              className={`cyber-graph-switcher-btn ${activePlot === 'ecdf' ? 'active' : ''}`}
            >
              <span>📈 ECDF CURVE</span>
            </button>
            <button
              onClick={() => setActivePlot('honeycomb')}
              className={`cyber-graph-switcher-btn ${activePlot === 'honeycomb' ? 'active' : ''}`}
            >
              <span>🐝 HONEYCOMB</span>
            </button>
            <button
              onClick={() => setActivePlot('stem')}
              className={`cyber-graph-switcher-btn ${activePlot === 'stem' ? 'active' : ''}`}
            >
              <span>📍 STEM &amp; WHISKER</span>
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
            VIEW 1: THREE.JS 3D COMPETENCY TERRAIN (DYNAMIC LABELS)
            ======================================================== */}
        {activePlot === '3d' && (
          <ThreeSkillsTerrain
            categories={category_stats}
            onSelectCategory={handleCategoryClick}
            activeCategory={selectedCategory || undefined}
          />
        )}

        {/* ========================================================
            VIEW 2: PLOTLY INTERACTIVE SUNBURST PARTITION
            ======================================================== */}
        {activePlot === 'sunburst' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem', textAlign: 'center' }}>
              Plotly `px.sunburst`: Multi-tiered radial hierarchy. Center hub → 14 Specialization domains → outer skill leaves. Click any sector to focus.
            </p>

            <svg viewBox="0 0 600 600" style={{ width: '100%', maxWidth: '580px', height: 'auto', overflow: 'visible', userSelect: 'none' }}>
              {/* Outer skill leaves */}
              {sunburstArcs.map((arc) => {
                const isSelected = selectedCategory === arc.category
                const isHovered = hoveredCategory === arc.category
                return (
                  <path
                    key={`sun-skill-${arc.category}`}
                    d={arc.skillPath}
                    fill={arc.color}
                    fillOpacity={isSelected ? 0.95 : isHovered ? 0.8 : 0.4}
                    stroke="#0a0d14"
                    strokeWidth="1.5"
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onClick={() => handleCategoryClick(arc.category)}
                    onMouseEnter={() => setHoveredCategory(arc.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <title>{`${arc.category}: ${arc.top_skills.join(', ')}`}</title>
                  </path>
                )
              })}

              {/* Middle domain sectors */}
              {sunburstArcs.map((arc) => {
                const isSelected = selectedCategory === arc.category
                const isHovered = hoveredCategory === arc.category
                return (
                  <g key={`sun-cat-${arc.category}`}>
                    <path
                      d={arc.catPath}
                      fill={arc.color}
                      fillOpacity={isSelected ? 1.0 : isHovered ? 0.9 : 0.75}
                      stroke={isSelected ? '#fcee0a' : '#0a0d14'}
                      strokeWidth={isSelected ? 3 : 1.5}
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onClick={() => handleCategoryClick(arc.category)}
                      onMouseEnter={() => setHoveredCategory(arc.category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    />
                    <text
                      x={arc.textX}
                      y={arc.textY}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fill="#ffffff"
                      fontSize="9px"
                      fontWeight={800}
                      fontFamily="var(--font-mono, monospace)"
                      style={{ pointerEvents: 'none' }}
                    >
                      {arc.category.length > 8 ? arc.category.slice(0, 7) + '.' : arc.category}
                    </text>
                  </g>
                )
              })}

              {/* Center Hub */}
              <circle
                cx={300}
                cy={300}
                r={62}
                fill="var(--bg-surface)"
                stroke="var(--cyber-cyan)"
                strokeWidth="2"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedCategory(null)
                }}
              />
              <text x={300} y={285} textAnchor="middle" fill="var(--cyber-cyan)" fontSize="9.5" fontFamily="var(--font-mono, monospace)" fontWeight={800}>
                {hoveredCategory || selectedCategory || 'ALL DOMAINS'}
              </text>
              <text x={300} y={312} textAnchor="middle" fill="var(--text-main)" fontSize="20" fontFamily="var(--font-mono, monospace)" fontWeight={900}>
                {hoveredCategory
                  ? `${category_stats.find((c) => c.category === hoveredCategory)?.avg_level}%`
                  : selectedCategory
                  ? `${activeCategoryData?.avg_level}%`
                  : '52 SKILLS'}
              </text>
              <text x={300} y={328} textAnchor="middle" fill="var(--text-muted)" fontSize="8.5" fontFamily="var(--font-mono, monospace)">
                {hoveredCategory || selectedCategory ? 'Avg Proficiency' : 'Click sector'}
              </text>
            </svg>
          </div>
        )}

        {/* ========================================================
            VIEW 3: PLOTLY POLAR BAR / WIND ROSE (go.Barpolar)
            ======================================================== */}
        {activePlot === 'polarbar' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem', textAlign: 'center' }}>
              Plotly `go.Barpolar`: Radial wind rose bar chart. Each domain sector extends outwards proportional to its average proficiency (0% to 100%).
            </p>

            <svg viewBox="0 0 600 520" style={{ width: '100%', maxWidth: '600px', height: 'auto', overflow: 'visible', userSelect: 'none' }}>
              {/* Concentric Guide Circles */}
              {[0.25, 0.5, 0.75, 1.0].map((ring) => (
                <g key={`polar-ring-${ring}`}>
                  <circle
                    cx={300}
                    cy={260}
                    r={190 * ring}
                    fill="none"
                    stroke={ring === 1.0 ? 'rgba(0, 242, 254, 0.35)' : 'rgba(255, 255, 255, 0.07)'}
                    strokeDasharray={ring === 1.0 ? undefined : '3 3'}
                  />
                  <text x={306} y={260 - 190 * ring + 11} fill="var(--text-muted)" fontSize="8.5" fontFamily="var(--font-mono, monospace)">
                    {Math.round(ring * 100)}%
                  </text>
                </g>
              ))}

              {/* Polar Bars */}
              {polarBarData.map((bar) => {
                const isSelected = selectedCategory === bar.category
                const isHovered = hoveredCategory === bar.category

                return (
                  <g
                    key={`polar-bar-${bar.category}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleCategoryClick(bar.category)}
                    onMouseEnter={() => setHoveredCategory(bar.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <path
                      d={bar.pathD}
                      fill={bar.color}
                      fillOpacity={isSelected ? 0.95 : isHovered ? 0.8 : 0.6}
                      stroke={isSelected ? '#fcee0a' : '#0a0d14'}
                      strokeWidth={isSelected ? 2.5 : 1}
                      filter={isSelected ? 'drop-shadow(0 0 10px #fcee0a)' : undefined}
                    />
                    <text
                      x={bar.labelX}
                      y={bar.labelY}
                      textAnchor={bar.cos > 0.2 ? 'start' : bar.cos < -0.2 ? 'end' : 'middle'}
                      alignmentBaseline="middle"
                      fill={isSelected ? 'var(--cyber-yellow)' : isHovered ? 'var(--cyber-cyan)' : 'var(--text-muted)'}
                      fontSize="9.5px"
                      fontFamily="var(--font-mono, monospace)"
                      fontWeight={isSelected ? 800 : 600}
                    >
                      {bar.category} ({bar.avg_level}%)
                    </text>
                  </g>
                )
              })}

              {/* Center Core */}
              <circle cx={300} cy={260} r="18" fill="var(--bg-surface)" stroke="var(--cyber-cyan)" strokeWidth="1.5" />
            </svg>
          </div>
        )}

        {/* ========================================================
            VIEW 4: MATPLOTLIB BOX & WHISKER SPECTRUM (boxplot)
            ======================================================== */}
        {activePlot === 'boxplot' && (
          <div style={{ width: '100%', overflowX: 'auto', padding: '1rem 0' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem', textAlign: 'center' }}>
              Scientific Matplotlib `boxplot()`: Displays Q1 (25%), Median, Q3 (75%), and Min/Max error whiskers for each domain category.
            </p>

            <div style={{ minWidth: '880px', margin: '0 auto' }}>
              <svg viewBox="0 0 880 400" className="cyber-boxplot-svg">
                {/* Y-Axis Grid Reference Lines */}
                {[40, 50, 60, 70, 80, 90, 100].map((val) => {
                  const y = 300 - ((val - 40) / 60) * 240
                  return (
                    <g key={`box-y-${val}`}>
                      <line x1={70} y1={y} x2={850} y2={y} stroke="rgba(255, 255, 255, 0.07)" strokeDasharray="3 3" />
                      <text x={60} y={y + 4} textAnchor="end" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono, monospace)">
                        {val}%
                      </text>
                    </g>
                  )
                })}

                <line x1={70} y1={300} x2={850} y2={300} stroke="rgba(0, 242, 254, 0.4)" strokeWidth="2" />

                {/* Boxplots */}
                {category_stats.map((cat, idx) => {
                  const stepX = (850 - 90) / (category_stats.length - 1)
                  const x = 90 + idx * stepX
                  const boxWidth = 26
                  const minY = 300 - ((cat.min_level - 40) / 60) * 240
                  const maxY = 300 - ((cat.max_level - 40) / 60) * 240
                  const q1Y = 300 - (((cat.q1 || cat.avg_level - 5) - 40) / 60) * 240
                  const q3Y = 300 - (((cat.q3 || cat.avg_level + 5) - 40) / 60) * 240
                  const medY = 300 - (((cat.median || cat.avg_level) - 40) / 60) * 240
                  const isSelected = selectedCategory?.toLowerCase() === cat.category.toLowerCase()

                  return (
                    <g
                      key={`box-${cat.category}`}
                      className="cyber-boxplot-item"
                      onClick={() => handleCategoryClick(cat.category)}
                    >
                      {/* Whiskers */}
                      <line x1={x} y1={q3Y} x2={x} y2={maxY} stroke="#00f2fe" strokeWidth="1.5" strokeDasharray="2 2" />
                      <line x1={x} y1={minY} x2={x} y2={q1Y} stroke="#00f2fe" strokeWidth="1.5" strokeDasharray="2 2" />

                      <line x1={x - 6} y1={maxY} x2={x + 6} y2={maxY} stroke="#00f2fe" strokeWidth="2" />
                      <line x1={x - 6} y1={minY} x2={x + 6} y2={minY} stroke="#00f2fe" strokeWidth="2" />

                      {/* Box */}
                      <rect
                        x={x - boxWidth / 2}
                        y={q3Y}
                        width={boxWidth}
                        height={Math.max(4, q1Y - q3Y)}
                        fill={isSelected ? 'rgba(252, 238, 10, 0.25)' : 'rgba(0, 242, 254, 0.12)'}
                        stroke={isSelected ? '#fcee0a' : '#00f2fe'}
                        strokeWidth={isSelected ? 2 : 1.5}
                        rx="3"
                      />

                      {/* Median Line */}
                      <line
                        x1={x - boxWidth / 2}
                        y1={medY}
                        x2={x + boxWidth / 2}
                        y2={medY}
                        stroke="#fcee0a"
                        strokeWidth="2.5"
                      />

                      {/* Label */}
                      <text
                        x={x}
                        y={316}
                        textAnchor="end"
                        transform={`rotate(-45, ${x}, 316)`}
                        fill={isSelected ? 'var(--cyber-yellow)' : 'var(--text-muted)'}
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
            VIEW 5: POLAR SPIDER RADAR MATRIX (14 DOMAINS)
            ======================================================== */}
        {activePlot === 'radar' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem', textAlign: 'center' }}>
              Polar spider radar matrix: 14-domain polygon connecting average proficiencies. Concentric polygons mark 25%, 50%, 75%, and 100%.
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

              {/* Axis Spokes */}
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

              <polygon
                points={radarData.polygonPoints}
                fill="url(#radarSkillGrad)"
                stroke="#00f2fe"
                strokeWidth="2.5"
                filter="drop-shadow(0 0 12px rgba(0, 242, 254, 0.5))"
              />

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
                  />
                )
              })}
            </svg>
          </div>
        )}

        {/* ========================================================
            VIEW 6: STRATEGIC SUPER-CLUSTERS DASHBOARD
            ======================================================== */}
        {activePlot === 'superclusters' && (
          <div style={{ width: '100%', padding: '1rem 0' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>
              Strategic Engineering Pillars: Aggregating competencies into 4 overarching architectural super-clusters.
            </p>

            <div className="cyber-supercluster-grid">
              {super_clusters.map((sc) => (
                <div key={sc.name} className="cyber-supercluster-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--cyber-cyan)' }}>
                      {sc.name}
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '1.2rem', fontWeight: 900, color: 'var(--cyber-yellow)' }}>
                      {sc.avg_level}%
                    </span>
                  </div>

                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {sc.skill_count} Competencies across {sc.categories.length} Domains
                  </div>

                  <div className="cyber-bar-track">
                    <div className="cyber-bar-fill" style={{ width: `${sc.avg_level}%` }} />
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                    {sc.category_details.map((cd) => (
                      <span
                        key={cd.category}
                        onClick={() => handleCategoryClick(cd.category)}
                        style={{
                          background: 'rgba(0, 242, 254, 0.08)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '4px',
                          padding: '0.2rem 0.55rem',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.72rem',
                          color: selectedCategory === cd.category ? 'var(--cyber-yellow)' : 'var(--text-main)',
                          cursor: 'pointer',
                        }}
                      >
                        {cd.category} ({cd.avg_level}%)
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 7: EMPIRICAL CUMULATIVE DISTRIBUTION (ECDF)
            ======================================================== */}
        {activePlot === 'ecdf' && (
          <div style={{ width: '100%', overflowX: 'auto', padding: '1rem 0' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem', textAlign: 'center' }}>
              Matplotlib `ecdf()`: Cumulative percentage of skills ≤ level X. Demonstrates that 69% of all skills are ≥ 70% and 31% are in the top specialist tier (≥ 90%).
            </p>

            <div style={{ minWidth: '680px', maxWidth: '820px', margin: '0 auto' }}>
              <svg viewBox="0 0 820 400" className="cyber-ecdf-svg">
                <defs>
                  <linearGradient id="ecdfGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0, 242, 254, 0.05)" />
                    <stop offset="100%" stopColor="rgba(0, 242, 254, 0.35)" />
                  </linearGradient>
                </defs>

                {[0, 25, 50, 75, 100].map((pct) => {
                  const y = 320 - (pct / 100) * 260
                  return (
                    <g key={`ecdf-y-${pct}`}>
                      <line x1={70} y1={y} x2={780} y2={y} stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="3 3" />
                      <text x={60} y={y + 4} textAnchor="end" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono, monospace)">
                        {pct}%
                      </text>
                    </g>
                  )
                })}

                {[50, 60, 70, 80, 90, 100].map((lvl) => {
                  const x = 70 + ((lvl - 50) / 50) * 710
                  return (
                    <g key={`ecdf-x-${lvl}`}>
                      <line x1={x} y1={60} x2={x} y2={320} stroke="rgba(255, 255, 255, 0.05)" />
                      <text x={x} y={340} textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono, monospace)">
                        {lvl}%
                      </text>
                    </g>
                  )
                })}

                <line x1={70} y1={320} x2={780} y2={320} stroke="var(--cyber-cyan)" strokeWidth="1.5" />
                <line x1={70} y1={60} x2={70} y2={320} stroke="var(--cyber-cyan)" strokeWidth="1.5" />

                {ecdf_points.length > 0 && (
                  <path
                    d={`M 70 320 ` + ecdf_points.map((pt) => {
                      const x = 70 + ((pt.level - 50) / 50) * 710
                      const y = 320 - (pt.cumulative_percent / 100) * 260
                      return `L ${x} ${y}`
                    }).join(' ') + ` L 780 60 L 780 320 Z`}
                    fill="url(#ecdfGrad)"
                    stroke="#00f2fe"
                    strokeWidth="2.5"
                  />
                )}

                <circle cx={70 + ((overall_percentiles.median - 50) / 50) * 710} cy={320 - 0.5 * 260} r="6" fill="#fcee0a" />
                <text x={70 + ((overall_percentiles.median - 50) / 50) * 710 + 10} y={320 - 0.5 * 260 - 8} fill="#fcee0a" fontSize="11" fontFamily="var(--font-mono, monospace)" fontWeight={800}>
                  Median (P50): {overall_percentiles.median}%
                </text>

                <circle cx={70 + ((overall_percentiles.p75 - 50) / 50) * 710} cy={320 - 0.75 * 260} r="6" fill="#00f2fe" />
                <text x={70 + ((overall_percentiles.p75 - 50) / 50) * 710 + 10} y={320 - 0.75 * 260 - 8} fill="#00f2fe" fontSize="11" fontFamily="var(--font-mono, monospace)" fontWeight={800}>
                  P75: {overall_percentiles.p75}%
                </text>
              </svg>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 8: HEXAGONAL CYBER COMPETENCY HONEYCOMB
            ======================================================== */}
        {activePlot === 'honeycomb' && (
          <div style={{ width: '100%', padding: '1rem 0' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>
              Futuristic honeycomb matrix: All {total_skills} competencies mapped with level badges and authentic logos. Click any cell to inspect context.
            </p>

            <div className="cyber-honeycomb-grid">
              {all_skills_ranked.map((sk) => {
                const isSelected = selectedSkillId === sk.id
                const isMaster = sk.level >= 90
                const isAdvanced = sk.level >= 80

                return (
                  <div
                    key={sk.id}
                    onClick={() => setSelectedSkillId(isSelected ? null : sk.id)}
                    className={`cyber-honeycomb-cell ${isSelected ? 'selected' : ''}`}
                  >
                    <SkillGlyph id={sk.id} />
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.2 }}>
                      {sk.name}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: isMaster ? 'var(--cyber-yellow)' : isAdvanced ? 'var(--cyber-cyan)' : 'var(--text-muted)',
                      }}
                    >
                      {sk.level}%
                    </div>
                  </div>
                )
              })}
            </div>

            {selectedSkillId && (
              <div style={{ marginTop: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-cyber)', borderRadius: '12px', padding: '1.4rem' }}>
                {(() => {
                  const sk = all_skills_ranked.find((s) => s.id === selectedSkillId)
                  if (!sk) return null
                  return (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <SkillGlyph id={sk.id} />
                          <strong style={{ fontSize: '1.2rem', color: 'var(--cyber-yellow)' }}>{sk.name}</strong>
                          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.85rem', color: 'var(--cyber-cyan)', fontWeight: 800 }}>
                            {sk.level}% [{sk.category}]
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedSkillId(null)}
                          className="cyber-action-btn secondary"
                          style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                        >
                          ✕ CLOSE
                        </button>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
                        {sk.context || 'Cornerstone technical competency within production environments.'}
                      </p>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            VIEW 9: MATPLOTLIB STEM & WHISKER SPECTRUM
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

                <line x1={70} y1={300} x2={850} y2={300} stroke="rgba(0, 242, 254, 0.4)" strokeWidth="2" />

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
                      <line
                        x1={x}
                        y1={minY}
                        x2={x}
                        y2={maxY}
                        stroke={isSelected ? 'var(--cyber-yellow)' : 'rgba(252, 238, 10, 0.45)'}
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                      <line x1={x - 5} y1={minY} x2={x + 5} y2={minY} stroke={isSelected ? 'var(--cyber-yellow)' : '#fcee0a'} strokeWidth="1.5" />
                      <line x1={x - 5} y1={maxY} x2={x + 5} y2={maxY} stroke={isSelected ? 'var(--cyber-yellow)' : '#fcee0a'} strokeWidth="1.5" />

                      <line
                        x1={x}
                        y1={300}
                        x2={x}
                        y2={avgY}
                        stroke={isSelected ? '#fcee0a' : isHovered ? '#00f2fe' : 'url(#stemLineGrad)'}
                        strokeWidth={isSelected || isHovered ? 3 : 2}
                      />

                      <circle
                        cx={x}
                        cy={avgY}
                        r={isSelected ? 8 : isHovered ? 7 : 5.5}
                        fill={isSelected ? '#fcee0a' : getCategoryColor(cat.category)}
                        stroke="#0a0d14"
                        strokeWidth="2"
                        filter={isSelected || isHovered ? 'drop-shadow(0 0 10px #00f2fe)' : undefined}
                      />

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
            VIEW 10: MATPLOTLIB PROFICIENCY HISTOGRAM (hist)
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
            VIEW 11: PROPORTIONAL CATEGORY TREEMAP
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
