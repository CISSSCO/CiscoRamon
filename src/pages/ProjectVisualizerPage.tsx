import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import projectsData from '../data/projects.json'
import analyticsData from '../data/extracts/projects_analytics.json'
import ThreeTechOrbit from '../components/ThreeTechOrbit'
import { TechIcon } from '../ui/TechIcons'
import { ExternalLinkIcon } from '../ui/HeroIcons'
import '../styles/home.css'
import '../styles/graphs.css'

type PlotType =
  | '3d'
  | 'parcoords'
  | 'sankey'
  | 'network'
  | 'heatmap'
  | 'scatter'
  | 'radar'
  | 'stem'
  | 'similarity'
  | 'treemap'

export const PROJECT_COLORS: Record<string, string> = {
  hpccfs: '#00f2fe',                // Electric Cyan
  playlisto: '#a855f7',             // Neon Purple
  orgslide: '#ec4899',              // Hot Pink
  cerrfix: '#fcee0a',               // Cyber Yellow
  gitpush: '#3b82f6',               // Cobalt Blue
  dotfiles: '#10b981',              // Emerald Green
  myvimrc: '#f97316',               // Bright Orange
  cisssco: '#06b6d4',               // Light Cyan/Teal
  popularwebsitethemes: '#e11d48',  // Crimson Rose
}

export default function ProjectVisualizerPage() {
  const navigate = useNavigate()
  const [activePlot, setActivePlot] = useState<PlotType>('3d')
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null)
  const [selectedSankeyNode, setSelectedSankeyNode] = useState<string | null>(null)
  const [hoveredCell, setHoveredCell] = useState<{ t1: string; t2: string; count: number } | null>(null)
  const [hoveredSim, setHoveredSim] = useState<{ src: string; target: string; sim: number; shared: string[] } | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  // Dynamic analytics data fallback
  const {
    ranked_technologies,
    co_occurrence_top8,
    total_projects,
    unique_technologies,
    project_quadrants,
    project_similarity,
  } = useMemo(() => {
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
      project_quadrants: [],
      project_similarity: [],
    }
  }, [])

  // Connected projects for selected technology
  const connectedProjects = useMemo(() => {
    if (!selectedTech) return []
    return projectsData.filter((p) =>
      p.stack?.some((t) => t.toLowerCase() === selectedTech.toLowerCase())
    )
  }, [selectedTech])

  // Selected project details
  const activeProject = useMemo(() => {
    if (!selectedProjectId) return null
    return projectsData.find((p) => p.id === selectedProjectId) || null
  }, [selectedProjectId])

  // ==========================================
  // PARALLEL COORDINATES DATA (PLOTLY parcoords)
  // ==========================================
  const parcoordsData = useMemo(() => {
    return projectsData.map((p) => {
      const stack = (p.stack || []).map((s) => s.toLowerCase())
      const stackBreadth = stack.length

      // HPC weight (Slurm, MPI, OpenMPI, Spack, Rocky Linux, Munge, LDAP, NFS)
      const hpcMatches = stack.filter((s) =>
        ['slurm', 'mpi', 'openmpi', 'spack', 'rocky linux', 'munge', 'ldap', 'nfs'].includes(s)
      ).length
      const hpcScore = p.id === 'hpccfs' ? 100 : Math.min(100, hpcMatches * 25)

      // CLI & Automation weight (Bash, Python, YAML, Git)
      const cliMatches = stack.filter((s) =>
        ['bash', 'bash scripting', 'python', 'yaml'].includes(s)
      ).length
      const cliScore = ['cerrfix', 'gitpush'].includes(p.id) ? 95 : Math.min(100, cliMatches * 28)

      // Web & Streaming weight (FastAPI, React, TypeScript, HTML, CSS, JavaScript, Google Drive API)
      const webMatches = stack.filter((s) =>
        ['fastapi', 'react', 'typescript', 'html', 'html5', 'css', 'css3', 'javascript', 'google drive api', 'http streaming'].includes(s)
      ).length
      const webScore = ['playlisto', 'orgslide', 'cisssco', 'popularwebsitethemes'].includes(p.id)
        ? p.id === 'playlisto' ? 95 : 85
        : Math.min(100, webMatches * 20)

      // Workspace & Configs weight (Vimscript, Lisp, Dotfiles, Org-mode, Markdown)
      const configMatches = stack.filter((s) =>
        ['vimscript', 'lisp', 'org-mode', 'markdown'].includes(s)
      ).length
      const configScore = ['myvimrc', 'dotfiles', 'orgslide'].includes(p.id) ? 90 : Math.min(100, configMatches * 30)

      const color = PROJECT_COLORS[p.id] || '#00f2fe'

      return {
        id: p.id,
        title: p.title,
        stackBreadth,
        hpcScore,
        cliScore,
        webScore,
        configScore,
        color,
      }
    })
  }, [])

  // ==========================================
  // SANKEY FLOW DATA (PLOTLY go.Sankey)
  // ==========================================
  const sankeyData = useMemo(() => {
    const domains = [
      { id: 'dom-hpc', label: 'HPC & Clustering', color: '#00f2fe' },
      { id: 'dom-cli', label: 'CLI & Systems Automation', color: '#fcee0a' },
      { id: 'dom-cloud', label: 'Cloud & Web Streaming', color: '#818cf8' },
      { id: 'dom-env', label: 'Reproducible Workspaces', color: '#10b981' },
    ]

    const coreTools = [
      { id: 'tool-bash', label: 'Bash Scripting', color: '#fcee0a' },
      { id: 'tool-slurm', label: 'Slurm & OpenMPI', color: '#00f2fe' },
      { id: 'tool-py', label: 'Python & FastAPI', color: '#38bdf8' },
      { id: 'tool-vim', label: 'Vimscript & Stow', color: '#10b981' },
      { id: 'tool-web', label: 'React & JS Engine', color: '#ec4899' },
    ]

    const repos = [
      { id: 'repo-hpccfs', label: 'HPCCFS', color: PROJECT_COLORS.hpccfs },
      { id: 'repo-playlisto', label: 'Playlisto', color: PROJECT_COLORS.playlisto },
      { id: 'repo-orgslide', label: 'OrgSlide', color: PROJECT_COLORS.orgslide },
      { id: 'repo-cerrfix', label: 'CerrFix', color: PROJECT_COLORS.cerrfix },
      { id: 'repo-gitpush', label: 'GitPush', color: PROJECT_COLORS.gitpush },
      { id: 'repo-dotfiles', label: 'Dotfiles', color: PROJECT_COLORS.dotfiles },
      { id: 'repo-myvimrc', label: 'My VimRC', color: PROJECT_COLORS.myvimrc },
      { id: 'repo-cisssco', label: 'CISSSCO.io', color: PROJECT_COLORS.cisssco },
      { id: 'repo-popularwebsitethemes', label: 'PopularThemes', color: PROJECT_COLORS.popularwebsitethemes },
    ]

    // Flow links between Domain -> Tool -> Repo
    const links = [
      // Stage 1: Domains -> Tools
      { id: 'l-dom-hpc-slurm', source: 'dom-hpc', target: 'tool-slurm', value: 8 },
      { id: 'l-dom-hpc-bash', source: 'dom-hpc', target: 'tool-bash', value: 4 },
      { id: 'l-dom-cli-bash', source: 'dom-cli', target: 'tool-bash', value: 7 },
      { id: 'l-dom-cli-py', source: 'dom-cli', target: 'tool-py', value: 5 },
      { id: 'l-dom-cloud-py', source: 'dom-cloud', target: 'tool-py', value: 6 },
      { id: 'l-dom-cloud-web', source: 'dom-cloud', target: 'tool-web', value: 8 },
      { id: 'l-dom-env-vim', source: 'dom-env', target: 'tool-vim', value: 7 },
      { id: 'l-dom-env-bash', source: 'dom-env', target: 'tool-bash', value: 4 },

      // Stage 2: Tools -> Repos
      { id: 'l-slurm-hpccfs', source: 'tool-slurm', target: 'repo-hpccfs', value: 8 },
      { id: 'l-bash-hpccfs', source: 'tool-bash', target: 'repo-hpccfs', value: 3 },
      { id: 'l-py-playlisto', source: 'tool-py', target: 'repo-playlisto', value: 6 },
      { id: 'l-web-playlisto', source: 'tool-web', target: 'repo-playlisto', value: 5 },
      { id: 'l-web-orgslide', source: 'tool-web', target: 'repo-orgslide', value: 5 },
      { id: 'l-vim-orgslide', source: 'tool-vim', target: 'repo-orgslide', value: 3 },
      { id: 'l-bash-cerrfix', source: 'tool-bash', target: 'repo-cerrfix', value: 4 },
      { id: 'l-py-cerrfix', source: 'tool-py', target: 'repo-cerrfix', value: 4 },
      { id: 'l-bash-gitpush', source: 'tool-bash', target: 'repo-gitpush', value: 5 },
      { id: 'l-vim-dotfiles', source: 'tool-vim', target: 'repo-dotfiles', value: 5 },
      { id: 'l-bash-dotfiles', source: 'tool-bash', target: 'repo-dotfiles', value: 4 },
      { id: 'l-vim-myvimrc', source: 'tool-vim', target: 'repo-myvimrc', value: 6 },
      { id: 'l-web-cisssco', source: 'tool-web', target: 'repo-cisssco', value: 4 },
      { id: 'l-web-popthemes', source: 'tool-web', target: 'repo-popularwebsitethemes', value: 4 },
    ]

    return { domains, coreTools, repos, links }
  }, [])

  // Traced provenance flow in Sankey diagram
  const sankeyActiveFlow = useMemo(() => {
    if (!selectedSankeyNode) return null

    const activeLinks = new Set<string>()
    const activeDomains = new Set<string>()
    const activeTools = new Set<string>()
    const activeRepos = new Set<string>()

    if (selectedSankeyNode.startsWith('repo-')) {
      activeRepos.add(selectedSankeyNode)
      // Step 1: Upstream tools connected to this repo
      const incomingTools = sankeyData.links.filter((l) => l.target === selectedSankeyNode)
      incomingTools.forEach((l) => {
        activeLinks.add(l.id)
        activeTools.add(l.source)
      })
      // Step 2: Upstream domains connected to those tools
      const incomingDomains = sankeyData.links.filter((l) => activeTools.has(l.target))
      incomingDomains.forEach((l) => {
        activeLinks.add(l.id)
        activeDomains.add(l.source)
      })
    } else if (selectedSankeyNode.startsWith('tool-')) {
      activeTools.add(selectedSankeyNode)
      // Domains feeding this tool
      sankeyData.links.filter((l) => l.target === selectedSankeyNode).forEach((l) => {
        activeLinks.add(l.id)
        activeDomains.add(l.source)
      })
      // Repos powered by this tool
      sankeyData.links.filter((l) => l.source === selectedSankeyNode).forEach((l) => {
        activeLinks.add(l.id)
        activeRepos.add(l.target)
      })
    } else if (selectedSankeyNode.startsWith('dom-')) {
      activeDomains.add(selectedSankeyNode)
      // Tools in this domain
      const outgoingTools = sankeyData.links.filter((l) => l.source === selectedSankeyNode)
      outgoingTools.forEach((l) => {
        activeLinks.add(l.id)
        activeTools.add(l.target)
      })
      // Repos using those tools
      sankeyData.links.filter((l) => activeTools.has(l.source)).forEach((l) => {
        activeLinks.add(l.id)
        activeRepos.add(l.target)
      })
    }

    return {
      activeLinks,
      activeDomains,
      activeTools,
      activeRepos,
    }
  }, [selectedSankeyNode, sankeyData])

  // ==========================================
  // INTERACTIVE NETWORK GRAPH (NO COLLISION)
  // ==========================================
  const networkData = useMemo(() => {
    // Select top 12 most prominent toolchains
    const top = ranked_technologies.slice(0, 12)
    const centerX = 340
    const centerY = 210
    const radius = 150

    const nodes = top.map((t, idx) => {
      const angle = (2 * Math.PI * idx) / top.length - Math.PI / 2
      const x = Math.round(centerX + Math.cos(angle) * radius)
      const y = Math.round(centerY + Math.sin(angle) * radius)
      return {
        ...t,
        x,
        y,
        angle,
      }
    })

    // Compute pairwise co-occurrence edges
    const edges: Array<{ source: string; target: string; x1: number; y1: number; x2: number; y2: number; count: number }> = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const t1 = nodes[i].name
        const t2 = nodes[j].name
        const sharedProjects = projectsData.filter(
          (p) => p.stack?.includes(t1) && p.stack?.includes(t2)
        )
        if (sharedProjects.length > 0) {
          edges.push({
            source: t1,
            target: t2,
            x1: nodes[i].x,
            y1: nodes[i].y,
            x2: nodes[j].x,
            y2: nodes[j].y,
            count: sharedProjects.length,
          })
        }
      }
    }

    return { nodes, edges, centerX, centerY }
  }, [ranked_technologies])

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
          <span>ADVANCED REPOSITORY ANALYTICS // 10 SCIENTIFIC PLOTS</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 0.8rem', color: 'var(--text-main)' }}>
          Projects Tech Stack Visualizer
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '820px', lineHeight: 1.65, margin: 0 }}>
          Interactive multi-representation analytics of technologies deployed across {total_projects} repositories. Switch between 3D cyber constellations, Plotly parallel coordinates, architecture Sankey flows, co-occurrence network graphs, Matplotlib heatmaps, and collision-free quadrant scatters.
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
      <div className="cyber-graph-card">
        {/* Method Switcher Header with Horizontal Scroll */}
        <div className="cyber-graph-header">
          <div className="cyber-graph-title-group">
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.78rem', color: 'var(--cyber-cyan)', fontWeight: 700 }}>
              VISUALIZATION METHOD
            </div>
            <div className="cyber-graph-title">
              {activePlot === '3d' && '🎮 3D Interactive Cyber Orbit Constellation'}
              {activePlot === 'parcoords' && '🧭 Plotly Parallel Coordinates (Multi-Axis Trajectory)'}
              {activePlot === 'sankey' && '🌊 Plotly Architecture Sankey Flow (Domain → Tool → Repo)'}
              {activePlot === 'network' && '🕸️ Plotly Interactive Co-occurrence Network Topology'}
              {activePlot === 'heatmap' && '🔥 Matplotlib Co-occurrence Heatmap Matrix'}
              {activePlot === 'scatter' && '🎯 Architectural Scope & Breadth Quadrants (Zero Overlap)'}
              {activePlot === 'radar' && '🕸️ Polar Spider Radar Matrix (Top 8 Technologies)'}
              {activePlot === 'stem' && '📊 Stem & Bar Distribution Spectrum'}
              {activePlot === 'similarity' && '🧬 Project Jaccard Similarity Matrix'}
              {activePlot === 'treemap' && '🌲 Proportional Area Treemap'}
            </div>
          </div>

          {/* Swipeable Tab Strip */}
          <div className="cyber-graph-switcher">
            <button
              onClick={() => setActivePlot('3d')}
              className={`cyber-graph-switcher-btn ${activePlot === '3d' ? 'active' : ''}`}
            >
              <span>🎮 3D ORBIT</span>
            </button>
            <button
              onClick={() => setActivePlot('parcoords')}
              className={`cyber-graph-switcher-btn ${activePlot === 'parcoords' ? 'active' : ''}`}
            >
              <span>🧭 PARALLEL COORDS</span>
            </button>
            <button
              onClick={() => setActivePlot('sankey')}
              className={`cyber-graph-switcher-btn ${activePlot === 'sankey' ? 'active' : ''}`}
            >
              <span>🌊 SANKEY FLOW</span>
            </button>
            <button
              onClick={() => setActivePlot('network')}
              className={`cyber-graph-switcher-btn ${activePlot === 'network' ? 'active' : ''}`}
            >
              <span>🕸️ NETWORK</span>
            </button>
            <button
              onClick={() => setActivePlot('heatmap')}
              className={`cyber-graph-switcher-btn ${activePlot === 'heatmap' ? 'active' : ''}`}
            >
              <span>🔥 HEATMAP</span>
            </button>
            <button
              onClick={() => setActivePlot('scatter')}
              className={`cyber-graph-switcher-btn ${activePlot === 'scatter' ? 'active' : ''}`}
            >
              <span>🎯 QUADRANTS</span>
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
              onClick={() => setActivePlot('similarity')}
              className={`cyber-graph-switcher-btn ${activePlot === 'similarity' ? 'active' : ''}`}
            >
              <span>🧬 SIMILARITY</span>
            </button>
            <button
              onClick={() => setActivePlot('treemap')}
              className={`cyber-graph-switcher-btn ${activePlot === 'treemap' ? 'active' : ''}`}
            >
              <span>🌲 TREEMAP</span>
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

        {/* ========================================================
            VIEW 1: THREE.JS 3D CYBER ORBIT (FIXED DYNAMIC LABELS)
            ======================================================== */}
        {activePlot === '3d' && (
          <ThreeTechOrbit
            technologies={ranked_technologies}
            onSelectTech={handleTechClick}
            activeTech={selectedTech || undefined}
          />
        )}

        {/* ========================================================
            VIEW 2: PLOTLY PARALLEL COORDINATES (parcoords)
            ======================================================== */}
        {activePlot === 'parcoords' && (() => {
          const leftProjects = parcoordsData.slice(0, 5)
          const rightProjects = parcoordsData.slice(5)
          const activeHighlightId = hoveredProjectId || selectedProjectId

          return (
            <div style={{ width: '100%', padding: '1rem 0' }}>
              <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.4rem', textAlign: 'center' }}>
                Plotly `parcoords`: Multi-dimensional continuous trajectory mapping codebase dimensions. Distinct vibrant colors encode each repository with interactive side legends. Click or hover any line or project card to isolate.
              </p>

              <div className="cyber-flanked-container">
                {/* Left Flank: First 5 Projects */}
                <div className="cyber-flanked-side">
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: 'var(--cyber-cyan)', fontWeight: 800, marginBottom: '0.2rem', letterSpacing: '0.06em' }}>
                    PROFILES (1 - 5)
                  </div>
                  {leftProjects.map((p) => {
                    const isSelected = selectedProjectId === p.id
                    const isHovered = hoveredProjectId === p.id
                    const isHighlighted = isSelected || isHovered
                    const isDimmed = activeHighlightId && !isHighlighted
                    return (
                      <div
                        key={`par-left-${p.id}`}
                        className={`cyber-flanked-card ${isSelected ? 'active' : ''} ${isDimmed ? 'dimmed' : ''}`}
                        style={{ '--card-accent': p.color } as React.CSSProperties}
                        onClick={() => setSelectedProjectId(isSelected ? null : p.id)}
                        onMouseEnter={() => setHoveredProjectId(p.id)}
                        onMouseLeave={() => setHoveredProjectId(null)}
                      >
                        <span className="cyber-flanked-swatch" style={{ backgroundColor: p.color, color: p.color }} />
                        <div className="cyber-flanked-card-content">
                          <div className="cyber-flanked-card-title">{p.title}</div>
                          <div className="cyber-flanked-card-meta">
                            {p.stackBreadth} tools • {p.hpcScore > 50 ? 'HPC' : p.webScore > 50 ? 'Web' : 'CLI'}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Center SVG Plot - No text overlap */}
                <div className="cyber-flanked-center">
                  <div style={{ minWidth: '580px', maxWidth: '780px', margin: '0 auto' }}>
                    <svg viewBox="0 0 780 380" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                      {/* 5 Vertical Axes */}
                      {[
                        { label: 'STACK BREADTH (1-14)', x: 70 },
                        { label: 'HPC & CLUSTERS', x: 220 },
                        { label: 'CLI AUTOMATION', x: 370 },
                        { label: 'WEB & STREAMING', x: 520 },
                        { label: 'WORKSPACE & CONFIGS', x: 670 },
                      ].map((ax) => (
                        <g key={ax.label}>
                          {/* Vertical axis line */}
                          <line x1={ax.x} y1={50} x2={ax.x} y2={310} stroke="rgba(0, 242, 254, 0.3)" strokeWidth="1.5" />
                          {/* Top axis cap */}
                          <circle cx={ax.x} cy={50} r="4" fill="#00f2fe" />
                          <text x={ax.x} y={34} textAnchor="middle" fill="var(--cyber-cyan)" fontSize="9" fontFamily="var(--font-mono, monospace)" fontWeight={800}>
                            {ax.label}
                          </text>
                          {/* Bottom axis cap */}
                          <circle cx={ax.x} cy={310} r="4" fill="#00f2fe" />
                          {/* Axis min/max text */}
                          <text x={ax.x - 7} y={54} textAnchor="end" fill="var(--text-muted)" fontSize="8.5" fontFamily="var(--font-mono, monospace)">
                            100%
                          </text>
                          <text x={ax.x - 7} y={314} textAnchor="end" fill="var(--text-muted)" fontSize="8.5" fontFamily="var(--font-mono, monospace)">
                            0%
                          </text>
                        </g>
                      ))}

                      {/* Horizontal reference lines */}
                      {[0.25, 0.5, 0.75].map((lvl) => (
                        <line
                          key={`par-lvl-${lvl}`}
                          x1={70}
                          y1={310 - lvl * 260}
                          x2={670}
                          y2={310 - lvl * 260}
                          stroke="rgba(255, 255, 255, 0.05)"
                          strokeDasharray="3 3"
                        />
                      ))}

                      {/* Project Polylines */}
                      {parcoordsData.map((p) => {
                        const yBreadth = 310 - ((p.stackBreadth - 1) / 13) * 260
                        const yHpc = 310 - (p.hpcScore / 100) * 260
                        const yCli = 310 - (p.cliScore / 100) * 260
                        const yWeb = 310 - (p.webScore / 100) * 260
                        const yConfig = 310 - (p.configScore / 100) * 260

                        const isSelected = selectedProjectId === p.id
                        const isHovered = hoveredProjectId === p.id
                        const isHighlighted = isSelected || isHovered
                        const isDimmed = activeHighlightId && !isHighlighted

                        const opacity = isHighlighted ? 1.0 : isDimmed ? 0.12 : 0.75
                        const strokeWidth = isHighlighted ? 4 : 2.2

                        const pathD = `
                          M 70 ${yBreadth}
                          C 145 ${yBreadth}, 145 ${yHpc}, 220 ${yHpc}
                          C 295 ${yHpc}, 295 ${yCli}, 370 ${yCli}
                          C 445 ${yCli}, 445 ${yWeb}, 520 ${yWeb}
                          C 595 ${yWeb}, 595 ${yConfig}, 670 ${yConfig}
                        `

                        return (
                          <g
                            key={`parcoords-${p.id}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedProjectId(isSelected ? null : p.id)}
                            onMouseEnter={() => setHoveredProjectId(p.id)}
                            onMouseLeave={() => setHoveredProjectId(null)}
                          >
                            <path
                              d={pathD}
                              fill="none"
                              stroke={isHighlighted ? '#fcee0a' : p.color}
                              strokeWidth={strokeWidth}
                              strokeOpacity={opacity}
                              style={{
                                transition: 'stroke-opacity 0.25s ease, stroke-width 0.25s ease',
                                filter: isHighlighted ? `drop-shadow(0 0 10px ${p.color})` : undefined,
                              }}
                            />
                            {/* Vertex Beads */}
                            {[
                              { x: 70, y: yBreadth },
                              { x: 220, y: yHpc },
                              { x: 370, y: yCli },
                              { x: 520, y: yWeb },
                              { x: 670, y: yConfig },
                            ].map((dot, dIdx) => (
                              <circle
                                key={`par-dot-${p.id}-${dIdx}`}
                                cx={dot.x}
                                cy={dot.y}
                                r={isHighlighted ? 5.5 : 3.5}
                                fill={isHighlighted ? '#fcee0a' : p.color}
                                opacity={opacity}
                              />
                            ))}
                          </g>
                        )
                      })}
                    </svg>
                  </div>
                </div>

                {/* Right Flank: Remaining 4 Projects */}
                <div className="cyber-flanked-side">
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: 'var(--cyber-cyan)', fontWeight: 800, marginBottom: '0.2rem', letterSpacing: '0.06em' }}>
                    PROFILES (6 - 9)
                  </div>
                  {rightProjects.map((p) => {
                    const isSelected = selectedProjectId === p.id
                    const isHovered = hoveredProjectId === p.id
                    const isHighlighted = isSelected || isHovered
                    const isDimmed = activeHighlightId && !isHighlighted
                    return (
                      <div
                        key={`par-right-${p.id}`}
                        className={`cyber-flanked-card ${isSelected ? 'active' : ''} ${isDimmed ? 'dimmed' : ''}`}
                        style={{ '--card-accent': p.color } as React.CSSProperties}
                        onClick={() => setSelectedProjectId(isSelected ? null : p.id)}
                        onMouseEnter={() => setHoveredProjectId(p.id)}
                        onMouseLeave={() => setHoveredProjectId(null)}
                      >
                        <span className="cyber-flanked-swatch" style={{ backgroundColor: p.color, color: p.color }} />
                        <div className="cyber-flanked-card-content">
                          <div className="cyber-flanked-card-title">{p.title}</div>
                          <div className="cyber-flanked-card-meta">
                            {p.stackBreadth} tools • {p.webScore > 50 ? 'Frontend' : 'Workspace'}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Selected Project Dossier */}
              {activeProject && (
                <div style={{ marginTop: '1.6rem', background: 'var(--bg-surface)', border: '1px solid var(--border-cyber)', borderRadius: '12px', padding: '1.2rem', maxWidth: '880px', margin: '1.6rem auto 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className="cyber-flanked-swatch" style={{ backgroundColor: PROJECT_COLORS[activeProject.id] || '#fcee0a', color: PROJECT_COLORS[activeProject.id] || '#fcee0a' }} />
                      <strong style={{ fontSize: '1.15rem', color: 'var(--cyber-yellow)' }}>{activeProject.title}</strong>
                    </div>
                    <button
                      onClick={() => setSelectedProjectId(null)}
                      className="cyber-action-btn secondary"
                      style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                    >
                      ✕ CLEAR SELECTION
                    </button>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 0.8rem' }}>{activeProject.excerpt}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {activeProject.stack?.map((t) => (
                      <span
                        key={t}
                        onClick={() => handleTechClick(t)}
                        style={{
                          background: 'rgba(0, 242, 254, 0.1)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '4px',
                          padding: '0.2rem 0.55rem',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.75rem',
                          color: 'var(--cyber-cyan)',
                          cursor: 'pointer',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })()}

        {/* ========================================================
            VIEW 3: PLOTLY SANKEY ARCHITECTURE FLOW
            ======================================================== */}
        {activePlot === 'sankey' && (
          <div style={{ width: '100%', overflowX: 'auto', padding: '1rem 0' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.4rem', textAlign: 'center' }}>
              Plotly `go.Sankey`: Multi-stage flow tracing architectural domains through core toolchains into production repositories. Click any repository in Column 3 to highlight its entire upstream provenance.
            </p>

            <div style={{ minWidth: '820px', maxWidth: '920px', margin: '0 auto' }}>
              <svg viewBox="0 0 920 540" style={{ width: '100%', height: 'auto', overflow: 'visible', userSelect: 'none' }}>
                <defs>
                  <linearGradient id="sankeyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0.35" />
                  </linearGradient>
                </defs>

                {/* Column Headers */}
                <text x="60" y="28" fill="var(--cyber-cyan)" fontSize="11" fontFamily="var(--font-mono, monospace)" fontWeight={800}>
                  [1. ARCHITECTURE DOMAINS]
                </text>
                <text x="365" y="28" fill="var(--cyber-yellow)" fontSize="11" fontFamily="var(--font-mono, monospace)" fontWeight={800}>
                  [2. CORE TOOLCHAINS]
                </text>
                <text x="675" y="28" fill="#a78bfa" fontSize="11" fontFamily="var(--font-mono, monospace)" fontWeight={800}>
                  [3. REPOSITORIES]
                </text>

                {/* Connecting Curved Ribbons */}
                {sankeyData.links.map((link) => {
                  let x1 = 240
                  let y1 = 88
                  let x2 = 365
                  let y2 = 77

                  if (link.source.startsWith('dom-')) {
                    const domIdx = sankeyData.domains.findIndex((d) => d.id === link.source)
                    y1 = 65 + domIdx * 110 + 23
                    const toolIdx = sankeyData.coreTools.findIndex((t) => t.id === link.target)
                    y2 = 55 + toolIdx * 90 + 22
                  } else {
                    x1 = 545
                    x2 = 675
                    const toolIdx = sankeyData.coreTools.findIndex((t) => t.id === link.source)
                    y1 = 55 + toolIdx * 90 + 22
                    const repoIdx = sankeyData.repos.findIndex((r) => r.id === link.target)
                    y2 = 45 + repoIdx * 52 + 20
                  }

                  const ribbonWidth = Math.max(2, link.value * 0.9)
                  const cp1X = x1 + (x2 - x1) * 0.5
                  const cp2X = x1 + (x2 - x1) * 0.5

                  const isActive = sankeyActiveFlow ? sankeyActiveFlow.activeLinks.has(link.id) : false
                  const isDimmed = sankeyActiveFlow ? !isActive : false
                  const activeRepoColor = selectedSankeyNode?.startsWith('repo-')
                    ? sankeyData.repos.find((r) => r.id === selectedSankeyNode)?.color || '#fcee0a'
                    : '#00f2fe'

                  return (
                    <path
                      key={link.id}
                      d={`M ${x1} ${y1} C ${cp1X} ${y1}, ${cp2X} ${y2}, ${x2} ${y2}`}
                      fill="none"
                      stroke={isActive ? activeRepoColor : 'url(#sankeyGrad)'}
                      strokeWidth={isActive ? Math.max(3.5, link.value * 1.4) : ribbonWidth}
                      strokeOpacity={isActive ? 0.95 : isDimmed ? 0.05 : 0.42}
                      style={{
                        transition: 'all 0.25s ease',
                        filter: isActive ? `drop-shadow(0 0 8px ${activeRepoColor})` : undefined,
                      }}
                    />
                  )
                })}

                {/* Stage 1: Domains */}
                {sankeyData.domains.map((dom, i) => {
                  const y = 65 + i * 110
                  const isSelected = selectedSankeyNode === dom.id
                  const isDomActive = sankeyActiveFlow ? sankeyActiveFlow.activeDomains.has(dom.id) : false
                  const isDimmed = sankeyActiveFlow ? !isDomActive : false

                  return (
                    <g
                      key={dom.id}
                      style={{ cursor: 'pointer', transition: 'opacity 0.25s ease' }}
                      opacity={isDimmed ? 0.22 : 1}
                      onClick={() => setSelectedSankeyNode(isSelected ? null : dom.id)}
                    >
                      <rect
                        x="60"
                        y={y}
                        width="180"
                        height="46"
                        rx="8"
                        fill={isDomActive ? 'rgba(0, 242, 254, 0.15)' : 'var(--bg-surface)'}
                        stroke={isDomActive ? '#fcee0a' : dom.color}
                        strokeWidth={isDomActive ? 2.5 : 1.5}
                        style={{
                          transition: 'all 0.25s ease',
                          filter: isDomActive ? 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.5))' : undefined,
                        }}
                      />
                      <text x="74" y={y + 27} fill={isDomActive ? '#fcee0a' : 'var(--text-main)'} fontSize="10.5" fontFamily="var(--font-mono, monospace)" fontWeight={700}>
                        {dom.label}
                      </text>
                    </g>
                  )
                })}

                {/* Stage 2: Core Toolchains */}
                {sankeyData.coreTools.map((tool, i) => {
                  const y = 55 + i * 90
                  const isSelected = selectedSankeyNode === tool.id
                  const isToolActive = sankeyActiveFlow ? sankeyActiveFlow.activeTools.has(tool.id) : false
                  const isDimmed = sankeyActiveFlow ? !isToolActive : false

                  return (
                    <g
                      key={tool.id}
                      style={{ cursor: 'pointer', transition: 'opacity 0.25s ease' }}
                      opacity={isDimmed ? 0.22 : 1}
                      onClick={() => setSelectedSankeyNode(isSelected ? null : tool.id)}
                    >
                      <rect
                        x="365"
                        y={y}
                        width="180"
                        height="44"
                        rx="8"
                        fill={isToolActive ? 'rgba(0, 242, 254, 0.15)' : 'var(--bg-surface)'}
                        stroke={isToolActive ? '#fcee0a' : tool.color}
                        strokeWidth={isToolActive ? 2.5 : 1.5}
                        style={{
                          transition: 'all 0.25s ease',
                          filter: isToolActive ? 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.5))' : undefined,
                        }}
                      />
                      <text x="378" y={y + 26} fill={isToolActive ? '#fcee0a' : 'var(--text-main)'} fontSize="10.5" fontFamily="var(--font-mono, monospace)" fontWeight={700}>
                        {tool.label}
                      </text>
                    </g>
                  )
                })}

                {/* Stage 3: Repositories */}
                {sankeyData.repos.map((repo, i) => {
                  const y = 45 + i * 52
                  const isSelected = selectedSankeyNode === repo.id
                  const isRepoActive = sankeyActiveFlow ? sankeyActiveFlow.activeRepos.has(repo.id) : false
                  const isDimmed = sankeyActiveFlow ? !isRepoActive : false

                  return (
                    <g
                      key={repo.id}
                      style={{ cursor: 'pointer', transition: 'opacity 0.25s ease' }}
                      opacity={isDimmed ? 0.22 : 1}
                      onClick={() => {
                        const next = isSelected ? null : repo.id
                        setSelectedSankeyNode(next)
                        setSelectedProjectId(next ? next.replace('repo-', '') : null)
                      }}
                    >
                      <rect
                        x="675"
                        y={y}
                        width="185"
                        height="40"
                        rx="8"
                        fill={isSelected ? 'rgba(252, 238, 10, 0.2)' : isRepoActive ? 'rgba(0, 242, 254, 0.12)' : 'var(--bg-surface)'}
                        stroke={isSelected ? '#fcee0a' : repo.color}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        style={{
                          transition: 'all 0.25s ease',
                          filter: isSelected ? `drop-shadow(0 0 10px ${repo.color})` : undefined,
                        }}
                      />
                      {/* Color indicator dot */}
                      <circle cx="692" cy={y + 20} r="4.5" fill={repo.color} />
                      <text x="705" y={y + 24} fill={isSelected ? '#fcee0a' : 'var(--text-main)'} fontSize="10.5" fontFamily="var(--font-mono, monospace)" fontWeight={700}>
                        {repo.label}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Traced Provenance Ribbon */}
            {selectedSankeyNode && sankeyActiveFlow && (
              <div
                style={{
                  marginTop: '1.4rem',
                  background: 'rgba(0, 242, 254, 0.05)',
                  border: '1px solid var(--border-cyber)',
                  borderRadius: '12px',
                  padding: '1rem 1.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  maxWidth: '920px',
                  margin: '1.4rem auto 0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--cyber-yellow)', fontWeight: 800 }}>PROVENANCE TRACE:</span>
                  <span style={{ color: 'var(--cyber-cyan)', fontWeight: 700 }}>
                    {sankeyData.domains.filter((d) => sankeyActiveFlow.activeDomains.has(d.id)).map((d) => d.label).join(' & ')}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>➔</span>
                  <span style={{ color: '#ec4899', fontWeight: 700 }}>
                    {sankeyData.coreTools.filter((t) => sankeyActiveFlow.activeTools.has(t.id)).map((t) => t.label).join(', ')}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>➔</span>
                  <span style={{ color: '#fcee0a', fontWeight: 800 }}>
                    {sankeyData.repos.filter((r) => sankeyActiveFlow.activeRepos.has(r.id)).map((r) => r.label).join(', ')}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedSankeyNode(null)
                    setSelectedProjectId(null)
                  }}
                  className="cyber-action-btn secondary"
                  style={{ fontSize: '0.72rem', padding: '0.3rem 0.7rem' }}
                >
                  ✕ RESET FLOW FILTER
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            VIEW 4: INTERACTIVE NETWORK CO-OCCURRENCE TOPOLOGY
            ======================================================== */}
        {activePlot === 'network' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem', textAlign: 'center' }}>
              Interactive Co-occurrence Network Topology: Edges link tools deployed together in repositories. Hover or click any hub node to isolate its connected toolchains.
            </p>

            <svg viewBox="0 0 680 440" style={{ width: '100%', maxWidth: '720px', height: 'auto', overflow: 'visible', userSelect: 'none' }}>
              {/* Central Core Glow */}
              <circle cx={networkData.centerX} cy={networkData.centerY} r="35" fill="rgba(0, 242, 254, 0.04)" stroke="rgba(0, 242, 254, 0.25)" strokeDasharray="3 3" />
              <text x={networkData.centerX} y={networkData.centerY + 4} textAnchor="middle" fill="var(--cyber-cyan)" fontSize="9" fontFamily="var(--font-mono, monospace)" fontWeight={700}>
                STACK HUB
              </text>

              {/* Connecting Edges */}
              {networkData.edges.map((e, idx) => {
                const isHovered = hoveredNode === e.source || hoveredNode === e.target
                const isSelected = selectedTech === e.source || selectedTech === e.target
                const opacity = hoveredNode || selectedTech ? (isHovered || isSelected ? 0.9 : 0.08) : 0.35
                const strokeColor = isSelected ? '#fcee0a' : isHovered ? '#00f2fe' : 'rgba(129, 140, 248, 0.5)'

                return (
                  <line
                    key={`net-edge-${idx}`}
                    x1={e.x1}
                    y1={e.y1}
                    x2={e.x2}
                    y2={e.y2}
                    stroke={strokeColor}
                    strokeWidth={Math.max(1.2, e.count * 1.5)}
                    strokeOpacity={opacity}
                  />
                )
              })}

              {/* Nodes */}
              {networkData.nodes.map((node) => {
                const isSelected = selectedTech?.toLowerCase() === node.name.toLowerCase()
                const isHovered = hoveredNode === node.name
                const r = 18 + (node.count / 4) * 8

                return (
                  <g
                    key={`net-node-${node.name}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleTechClick(node.name)}
                    onMouseEnter={() => setHoveredNode(node.name)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={r}
                      fill={isSelected ? '#fcee0a' : isHovered ? '#00f2fe' : 'var(--bg-surface)'}
                      stroke={isSelected ? '#fff' : '#00f2fe'}
                      strokeWidth={isSelected || isHovered ? 2.5 : 1.5}
                      filter={isSelected || isHovered ? 'drop-shadow(0 0 12px #00f2fe)' : undefined}
                    />
                    <text
                      x={node.x}
                      y={node.y - 2}
                      textAnchor="middle"
                      fill={isSelected ? '#000' : isHovered ? '#000' : 'var(--text-main)'}
                      fontSize="9.5px"
                      fontFamily="var(--font-mono, monospace)"
                      fontWeight={800}
                    >
                      {node.name.length > 9 ? node.name.slice(0, 8) + '.' : node.name}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + 10}
                      textAnchor="middle"
                      fill={isSelected ? '#000' : isHovered ? '#000' : 'var(--cyber-cyan)'}
                      fontSize="8px"
                      fontFamily="var(--font-mono, monospace)"
                      fontWeight={700}
                    >
                      {node.count}x
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        )}

        {/* ========================================================
            VIEW 5: MATPLOTLIB CO-OCCURRENCE HEATMAP MATRIX
            ======================================================== */}
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
                          onMouseEnter={() => setHoveredCell({ t1: rowLabel, t2: colLabel, count: val })}
                          onMouseLeave={() => setHoveredCell(null)}
                          onClick={() => handleTechClick(rowLabel)}
                          style={{
                            aspectRatio: '1',
                            background: bg,
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'var(--font-mono, monospace)',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            color: val > 0 ? (isDiagonal ? '#fff' : '#00f2fe') : 'var(--text-muted)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {val}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>

              {hoveredCell && (
                <div style={{ marginTop: '1.2rem', textAlign: 'center', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.85rem', color: 'var(--cyber-yellow)' }}>
                  Pair synergy: <strong>{hoveredCell.t1}</strong> + <strong>{hoveredCell.t2}</strong> co-exist in {hoveredCell.count} {hoveredCell.count === 1 ? 'repository' : 'repositories'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 6: ARCHITECTURAL QUADRANTS (COLLISION-FREE)
            ======================================================== */}
        {activePlot === 'scatter' && (() => {
          const quadrantItems = project_quadrants.map((p) => ({
            ...p,
            color: PROJECT_COLORS[p.id] || '#00f2fe',
          }))
          const leftQuadrant = quadrantItems.slice(0, 5)
          const rightQuadrant = quadrantItems.slice(5)
          const activeHighlightId = hoveredProjectId || selectedProjectId

          return (
            <div style={{ width: '100%', padding: '1rem 0' }}>
              <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.4rem', textAlign: 'center' }}>
                Matplotlib `scatter()` Quadrants: X-axis represents Stack Breadth (toolchain count); Y-axis represents Architectural Depth. Color-coded bubbles map to flanking interactive legend cards. Click any bubble or project card to isolate.
              </p>

              <div className="cyber-flanked-container">
                {/* Left Flank: First 5 Projects */}
                <div className="cyber-flanked-side">
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: 'var(--cyber-cyan)', fontWeight: 800, marginBottom: '0.2rem', letterSpacing: '0.06em' }}>
                    REPOSITORIES (1 - 5)
                  </div>
                  {leftQuadrant.map((proj) => {
                    const isSelected = selectedProjectId === proj.id
                    const isHovered = hoveredProjectId === proj.id
                    const isHighlighted = isSelected || isHovered
                    const isDimmed = activeHighlightId && !isHighlighted

                    return (
                      <div
                        key={`scat-left-${proj.id}`}
                        className={`cyber-flanked-card ${isSelected ? 'active' : ''} ${isDimmed ? 'dimmed' : ''}`}
                        style={{ '--card-accent': proj.color } as React.CSSProperties}
                        onClick={() => setSelectedProjectId(isSelected ? null : proj.id)}
                        onMouseEnter={() => setHoveredProjectId(proj.id)}
                        onMouseLeave={() => setHoveredProjectId(null)}
                      >
                        <span className="cyber-flanked-swatch" style={{ backgroundColor: proj.color, color: proj.color }} />
                        <div className="cyber-flanked-card-content">
                          <div className="cyber-flanked-card-title">{proj.title}</div>
                          <div className="cyber-flanked-card-meta">
                            {proj.stack_breadth} tools • Level {proj.architectural_depth}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Center SVG Plot: Clean colored bubbles with toolcount, zero text overlap */}
                <div className="cyber-flanked-center">
                  <div style={{ minWidth: '580px', maxWidth: '780px', margin: '0 auto' }}>
                    <svg viewBox="0 0 780 400" className="cyber-scatter-svg" style={{ width: '100%', height: 'auto', overflow: 'visible', userSelect: 'none' }}>
                      {/* Quadrant Background Zones */}
                      <rect x="60" y="30" width="330" height="160" fill="rgba(0, 242, 254, 0.025)" />
                      <rect x="390" y="30" width="340" height="160" fill="rgba(129, 140, 248, 0.04)" />
                      <rect x="60" y="190" width="330" height="160" fill="rgba(255, 255, 255, 0.015)" />
                      <rect x="390" y="190" width="340" height="160" fill="rgba(252, 238, 10, 0.025)" />

                      {/* Quadrant Crosshairs */}
                      <line x1="60" y1="190" x2="730" y2="190" stroke="rgba(255, 255, 255, 0.12)" strokeDasharray="4 4" />
                      <line x1="390" y1="30" x2="390" y2="350" stroke="rgba(255, 255, 255, 0.12)" strokeDasharray="4 4" />

                      {/* Quadrant Titles */}
                      <text x="405" y="48" fill="var(--cyber-cyan)" fontSize="9" fontFamily="var(--font-mono, monospace)" fontWeight={800}>
                        QUADRANT I: DISTRIBUTED &amp; HIGH BREADTH
                      </text>
                      <text x="75" y="48" fill="var(--cyber-yellow)" fontSize="9" fontFamily="var(--font-mono, monospace)" fontWeight={800}>
                        QUADRANT II: DEEP CLI &amp; SYSTEM AUTOMATION
                      </text>
                      <text x="75" y="340" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono, monospace)">
                        QUADRANT III: REPRODUCIBLE WORKSPACES &amp; THEMES
                      </text>
                      <text x="405" y="340" fill="#a78bfa" fontSize="9" fontFamily="var(--font-mono, monospace)">
                        QUADRANT IV: FULL-STACK CLOUD &amp; STREAMING
                      </text>

                      {/* Axis Lines */}
                      <line x1="60" y1="350" x2="730" y2="350" stroke="var(--cyber-cyan)" strokeWidth="1.5" />
                      <line x1="60" y1="30" x2="60" y2="350" stroke="var(--cyber-cyan)" strokeWidth="1.5" />

                      <text x="730" y="375" textAnchor="end" fill="var(--cyber-cyan)" fontSize="10" fontFamily="var(--font-mono, monospace)" fontWeight={700}>
                        Stack Breadth (Toolchains: 1 → 14) →
                      </text>
                      <text x="45" y="30" textAnchor="end" fill="var(--cyber-cyan)" fontSize="10" fontFamily="var(--font-mono, monospace)" fontWeight={700}>
                        ↑ Depth
                      </text>

                      {/* Clean Colored Scatter Bubbles with Toolcount Inside */}
                      {quadrantItems.map((proj) => {
                        const x = 80 + ((proj.stack_breadth - 1) / 13) * 610
                        const y = 320 - ((proj.architectural_depth - 2) / 3) * 240

                        const isSelected = selectedProjectId === proj.id
                        const isHovered = hoveredProjectId === proj.id
                        const isHighlighted = isSelected || isHovered
                        const isDimmed = activeHighlightId && !isHighlighted

                        const r = isHighlighted ? 18 : 11 + proj.stack_breadth * 0.75

                        return (
                          <g
                            key={`scatter-node-${proj.id}`}
                            className="cyber-scatter-node"
                            style={{ cursor: 'pointer', transition: 'all 0.25s ease' }}
                            onClick={() => setSelectedProjectId(isSelected ? null : proj.id)}
                            onMouseEnter={() => setHoveredProjectId(proj.id)}
                            onMouseLeave={() => setHoveredProjectId(null)}
                          >
                            {/* Main Bubble Circle */}
                            <circle
                              cx={x}
                              cy={y}
                              r={r}
                              fill={proj.color}
                              fillOpacity={isHighlighted ? 0.95 : isDimmed ? 0.15 : 0.75}
                              stroke={isHighlighted ? '#fff' : proj.color}
                              strokeWidth={isHighlighted ? 2.5 : 1.5}
                              style={{
                                transition: 'all 0.25s ease',
                                filter: isHighlighted ? `drop-shadow(0 0 12px ${proj.color})` : undefined,
                              }}
                            />

                            {/* Centered Toolcount Digit */}
                            <text
                              x={x}
                              y={y + 3.5}
                              textAnchor="middle"
                              fill={isDimmed ? 'transparent' : '#0a0d14'}
                              fontSize={isHighlighted ? '11px' : '9.5px'}
                              fontFamily="var(--font-mono, monospace)"
                              fontWeight={800}
                              pointerEvents="none"
                              style={{ transition: 'all 0.2s ease' }}
                            >
                              {proj.stack_breadth}
                            </text>
                          </g>
                        )
                      })}
                    </svg>
                  </div>
                </div>

                {/* Right Flank: Remaining 4 Projects */}
                <div className="cyber-flanked-side">
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: 'var(--cyber-cyan)', fontWeight: 800, marginBottom: '0.2rem', letterSpacing: '0.06em' }}>
                    REPOSITORIES (6 - 9)
                  </div>
                  {rightQuadrant.map((proj) => {
                    const isSelected = selectedProjectId === proj.id
                    const isHovered = hoveredProjectId === proj.id
                    const isHighlighted = isSelected || isHovered
                    const isDimmed = activeHighlightId && !isHighlighted

                    return (
                      <div
                        key={`scat-right-${proj.id}`}
                        className={`cyber-flanked-card ${isSelected ? 'active' : ''} ${isDimmed ? 'dimmed' : ''}`}
                        style={{ '--card-accent': proj.color } as React.CSSProperties}
                        onClick={() => setSelectedProjectId(isSelected ? null : proj.id)}
                        onMouseEnter={() => setHoveredProjectId(proj.id)}
                        onMouseLeave={() => setHoveredProjectId(null)}
                      >
                        <span className="cyber-flanked-swatch" style={{ backgroundColor: proj.color, color: proj.color }} />
                        <div className="cyber-flanked-card-content">
                          <div className="cyber-flanked-card-title">{proj.title}</div>
                          <div className="cyber-flanked-card-meta">
                            {proj.stack_breadth} tools • Level {proj.architectural_depth}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Selected Project Dossier */}
              {activeProject && (
                <div style={{ marginTop: '1.6rem', background: 'var(--bg-surface)', border: '1px solid var(--border-cyber)', borderRadius: '12px', padding: '1.2rem', maxWidth: '880px', margin: '1.6rem auto 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className="cyber-flanked-swatch" style={{ backgroundColor: PROJECT_COLORS[activeProject.id] || '#fcee0a', color: PROJECT_COLORS[activeProject.id] || '#fcee0a' }} />
                      <strong style={{ fontSize: '1.15rem', color: 'var(--cyber-yellow)' }}>{activeProject.title}</strong>
                    </div>
                    <button
                      onClick={() => setSelectedProjectId(null)}
                      className="cyber-action-btn secondary"
                      style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                    >
                      ✕ CLEAR SELECTION
                    </button>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 0.8rem' }}>{activeProject.excerpt}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {activeProject.stack?.map((t) => (
                      <span
                        key={t}
                        onClick={() => handleTechClick(t)}
                        style={{
                          background: 'rgba(0, 242, 254, 0.1)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '4px',
                          padding: '0.2rem 0.55rem',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.75rem',
                          color: 'var(--cyber-cyan)',
                          cursor: 'pointer',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })()}

        {/* ========================================================
            VIEW 7: POLAR SPIDER RADAR MATRIX
            ======================================================== */}
        {activePlot === 'radar' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem', textAlign: 'center' }}>
              Polar spider matrix: Radial spikes represent deployment frequency of top 8 technologies across all projects.
            </p>

            <svg viewBox="0 0 640 480" className="cyber-radar-svg">
              <defs>
                <linearGradient id="proj-radar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--cyber-cyan)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="var(--cyber-purple)" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Web Rings */}
              {[0.25, 0.5, 0.75, 1.0].map((ring) => {
                const pts = radarData.axes
                  .map((a) => {
                    const x = radarData.centerX + a.cos * (radarData.maxR * ring)
                    const y = radarData.centerY + a.sin * (radarData.maxR * ring)
                    return `${x},${y}`
                  })
                  .join(' ')

                return (
                  <g key={`ring-${ring}`}>
                    <polygon
                      points={pts}
                      fill="none"
                      stroke={ring === 1.0 ? 'rgba(0, 242, 254, 0.4)' : 'rgba(255, 255, 255, 0.08)'}
                      strokeWidth={ring === 1.0 ? 1.5 : 1}
                      strokeDasharray={ring === 1.0 ? undefined : '3 3'}
                    />
                    <text
                      x={radarData.centerX + 6}
                      y={radarData.centerY - radarData.maxR * ring + 3}
                      fill="var(--text-muted)"
                      fontSize="9"
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

              {/* Polygon */}
              <polygon
                points={radarData.polygonPoints}
                fill="url(#proj-radar-grad)"
                stroke="var(--cyber-cyan)"
                strokeWidth="2.5"
              />

              {/* Vertices */}
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

        {/* ========================================================
            VIEW 8: RESPONSIVE STEM & LOLLIPOP SPECTRUM
            ======================================================== */}
        {activePlot === 'stem' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', padding: '0.5rem 0' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textAlign: 'center' }}>
              Horizontal stem plot: Markers denote exact repository count and proportional system distribution. 100% responsive across mobile and desktop.
            </p>

            {ranked_technologies.map((tech) => {
              const maxCount = ranked_technologies[0]?.count || 1
              const pct = (tech.count / maxCount) * 100
              const isSelected = selectedTech?.toLowerCase() === tech.name.toLowerCase()

              return (
                <div
                  key={tech.name}
                  onClick={() => handleTechClick(tech.name)}
                  className={`cyber-stem-row ${isSelected ? 'active' : ''}`}
                >
                  <div className="cyber-stem-header">
                    <div className="cyber-stem-label">
                      <TechIcon name={tech.name} size={18} />
                      <span style={{ color: isSelected ? 'var(--cyber-yellow)' : 'var(--text-main)' }}>
                        {tech.name}
                      </span>
                    </div>

                    <div className="cyber-stem-metric">
                      {tech.count} {tech.count === 1 ? 'Repo' : 'Repos'} ({tech.percentage}%)
                    </div>
                  </div>

                  <div className="cyber-stem-track">
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
                </div>
              )
            })}
          </div>
        )}

        {/* ========================================================
            VIEW 9: PROJECT JACCARD SIMILARITY MATRIX
            ======================================================== */}
        {activePlot === 'similarity' && (
          <div style={{ width: '100%', overflowX: 'auto', padding: '1rem 0' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem', textAlign: 'center' }}>
              Pairwise Jaccard similarity matrix: Values range from 0.0 (no shared stack) to 1.0 (identical stack). Hover or click cells to reveal shared tech.
            </p>

            <div style={{ minWidth: '680px', maxWidth: '820px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: `140px repeat(${project_similarity.length}, 1fr)`, gap: '4px' }}>
                <div />
                {project_similarity.map((p) => (
                  <div
                    key={`col-${p.source_id}`}
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.72rem',
                      color: 'var(--cyber-cyan)',
                      fontWeight: 700,
                      textAlign: 'center',
                      padding: '0.4rem 0.1rem',
                      wordBreak: 'break-word',
                    }}
                  >
                    {p.source_title}
                  </div>
                ))}

                {project_similarity.map((row) => (
                  <div key={`row-${row.source_id}`} style={{ display: 'contents' }}>
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
                      {row.source_title}
                    </div>

                    {row.comparisons.map((comp) => {
                      const isSelf = row.source_id === comp.target_id
                      const sim = comp.similarity
                      const bg = isSelf
                        ? 'rgba(0, 242, 254, 0.35)'
                        : sim > 0
                        ? `rgba(168, 85, 247, ${0.15 + sim * 0.7})`
                        : 'rgba(255, 255, 255, 0.02)'

                      return (
                        <div
                          key={`sim-${row.source_id}-${comp.target_id}`}
                          onMouseEnter={() =>
                            setHoveredSim({
                              src: row.source_title,
                              target: comp.target_title,
                              sim,
                              shared: comp.shared_tech,
                            })
                          }
                          onMouseLeave={() => setHoveredSim(null)}
                          onClick={() => setSelectedProjectId(comp.target_id)}
                          className="cyber-similarity-cell"
                          style={{
                            background: bg,
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            color: isSelf ? '#fff' : sim > 0 ? '#fcee0a' : 'var(--text-muted)',
                          }}
                        >
                          {isSelf ? '1.0' : sim > 0 ? sim.toFixed(2) : '0'}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>

              {hoveredSim && (
                <div style={{ marginTop: '1.2rem', textAlign: 'center', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.85rem', color: 'var(--cyber-yellow)' }}>
                  Similarity between <strong>{hoveredSim.src}</strong> &amp; <strong>{hoveredSim.target}</strong>: {(hoveredSim.sim * 100).toFixed(1)}%
                  {hoveredSim.shared.length > 0 && (
                    <span style={{ color: 'var(--cyber-cyan)', marginLeft: '0.5rem' }}>
                      (Shared: {hoveredSim.shared.join(', ')})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 10: HIERARCHY TREEMAP
            ======================================================== */}
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
                      minWidth: '130px',
                      background: isSelected
                        ? 'rgba(252, 238, 10, 0.12)'
                        : `rgba(0, 242, 254, ${0.05 + (t.count / 4) * 0.15})`,
                      border: `1px solid ${isSelected ? 'var(--cyber-yellow)' : 'var(--border-subtle)'}`,
                      borderRadius: '8px',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: isSelected ? '0 0 16px rgba(252, 238, 10, 0.3)' : undefined,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <TechIcon name={t.name} size={20} />
                      <strong style={{ fontSize: '0.95rem', color: isSelected ? 'var(--cyber-yellow)' : 'var(--text-main)' }}>
                        {t.name}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {t.projects?.length || 0} projects
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.88rem', fontWeight: 800, color: 'var(--cyber-cyan)' }}>
                        {t.percentage}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          CONNECTED PROJECTS DRAWER
          ======================================================== */}
      {selectedTech && (
        <div style={{ marginTop: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-tag-hpc">
                <span className="section-tag-dot" />
                <span>CONNECTED CODEBASES</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.3rem 0 0', color: 'var(--text-main)' }}>
                Repositories utilizing {selectedTech} ({connectedProjects.length})
              </h2>
            </div>
            <button
              onClick={() => navigateToCatalog(selectedTech)}
              className="cyber-action-btn primary"
              style={{ fontSize: '0.82rem', padding: '0.5rem 1.1rem' }}
            >
              FILTER THIS STACK IN REPOSITORIES CATALOG →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.4rem' }}>
            {connectedProjects.map((proj) => (
              <div
                key={proj.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-cyber)',
                  borderRadius: '12px',
                  padding: '1.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                      {proj.title}
                    </h3>
                    {proj.featured && (
                      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.68rem', fontWeight: 800, color: 'var(--cyber-yellow)', background: 'rgba(252, 238, 10, 0.1)', border: '1px solid var(--cyber-yellow)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        FEATURED
                      </span>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.55, marginBottom: '1.2rem' }}>
                    {proj.excerpt}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.2rem' }}>
                    {proj.stack?.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.72rem',
                          background: t.toLowerCase() === selectedTech.toLowerCase() ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${t.toLowerCase() === selectedTech.toLowerCase() ? 'var(--cyber-cyan)' : 'var(--border-subtle)'}`,
                          color: t.toLowerCase() === selectedTech.toLowerCase() ? 'var(--cyber-cyan)' : 'var(--text-muted)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <Link
                      to={`/project/${proj.id}`}
                      className="cyber-action-btn secondary"
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', textDecoration: 'none' }}
                    >
                      VIEW ARCHITECTURE →
                    </Link>
                    {proj.repo && (
                      <a
                        href={proj.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="cyber-action-btn secondary"
                        style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <span>SOURCE</span>
                        <ExternalLinkIcon />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
