import { useState, useMemo, useEffect } from 'react'
import initialContributions from '../data/contributions.json'
import {
  GitHubIcon,
  GitMergeIcon,
  GitPullRequestIcon,
  ExternalLinkIcon,
  SearchIcon,
  ChevronDownIcon,
} from '../ui/HeroIcons'
import '../styles/social-pages.css'
import '../styles/graphs.css'

export interface ContributionItem {
  id: string
  number: number
  title: string
  repo: string
  repo_url: string
  url: string
  state: 'merged' | 'open' | 'closed' | string
  merged: boolean
  created_at?: string
  merged_at?: string | null
  description?: string
  labels?: string[]
  checks?: string
  organization?: string
  category?: string
}

type ViewMode = 'cards' | 'progress' | 'list'

export default function OpenSourceContributions() {
  const [contributions, setContributions] = useState<ContributionItem[]>(initialContributions as ContributionItem[])
  const [selectedRepo, setSelectedRepo] = useState<string>('All')
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [statusFilters, setStatusFilters] = useState<{ merged: boolean; open: boolean; closed: boolean }>({
    merged: true,
    open: true,
    closed: true,
  })
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [expandedPrId, setExpandedPrId] = useState<string | null>(null)
  const [showAllReposDropdown, setShowAllReposDropdown] = useState<boolean>(false)
  const [isLiveSynced, setIsLiveSynced] = useState<boolean>(false)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)

  // Hybrid live-sync: attempt a background fetch to GitHub's public search API
  useEffect(() => {
    let isMounted = true
    const fetchLatest = async () => {
      try {
        setIsSyncing(true)
        const res = await fetch(
          'https://api.github.com/search/issues?q=is:pr+author:CISSSCO+-user:CISSSCO&sort=created&order=desc',
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
            },
          }
        )

        if (!res.ok) {
          setIsSyncing(false)
          return
        }

        const data = await res.json()
        if (!isMounted || !data.items || !Array.isArray(data.items)) {
          setIsSyncing(false)
          return
        }

        // Map fresh items from GitHub Search API
        const freshItems: ContributionItem[] = data.items.map((it: any) => {
          const repoName = (it.repository_url || '').replace('https://api.github.com/repos/', '')
          const isMerged = it.pull_request?.merged_at != null
          const state = isMerged ? 'merged' : it.state === 'closed' ? 'closed' : 'open'
          const existing = (initialContributions as ContributionItem[]).find(
            (c) => c.repo === repoName && c.number === it.number
          )

          return {
            id: `pr-${it.number}-${repoName.replace('/', '-')}`,
            number: it.number,
            title: it.title,
            repo: repoName,
            repo_url: `https://github.com/${repoName}`,
            url: it.html_url,
            state,
            merged: isMerged,
            created_at: it.created_at,
            merged_at: it.pull_request?.merged_at || existing?.merged_at,
            description: existing?.description || `Upstream open source Pull Request in ${repoName}.`,
            labels: (it.labels || []).map((lbl: any) => lbl.name),
            checks: existing?.checks || (isMerged ? 'Approved & Merged' : 'In Review'),
            organization: repoName.split('/')[0] || 'OpenSource',
            category: existing?.category || 'Community Contribution',
          }
        })

        if (freshItems.length > 0 && isMounted) {
          setContributions(freshItems)
          setIsLiveSynced(true)
        }
      } catch (err) {
        console.debug('GitHub API live sync skipped, using cached contributions:', err)
      } finally {
        if (isMounted) setIsSyncing(false)
      }
    }

    fetchLatest()
    return () => {
      isMounted = false
    }
  }, [])

  // Compute repository stats and ranking by PR count
  const rankedRepos = useMemo(() => {
    const counts: Record<string, { total: number; merged: number }> = {}
    contributions.forEach((c) => {
      if (!counts[c.repo]) {
        counts[c.repo] = { total: 0, merged: 0 }
      }
      counts[c.repo].total++
      if (c.state === 'merged') counts[c.repo].merged++
    })

    return Object.entries(counts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total)
  }, [contributions])

  // Top 5 repositories with the most PRs
  const top5Repos = useMemo(() => rankedRepos.slice(0, 5), [rankedRepos])

  // Overall telemetry stats
  const stateCounts = useMemo(() => {
    let merged = 0
    let open = 0
    let closed = 0
    contributions.forEach((c) => {
      if (c.state === 'merged') merged++
      else if (c.state === 'open') open++
      else closed++
    })
    return { merged, open, closed, total: contributions.length }
  }, [contributions])

  // Filtered contributions list
  const filteredContributions = useMemo(() => {
    return contributions.filter((item) => {
      // 1. Repo filter
      if (selectedRepo !== 'All' && item.repo !== selectedRepo) {
        return false
      }

      // 2. Status checkbox filter
      const stateKey = (item.state === 'merged' ? 'merged' : item.state === 'open' ? 'open' : 'closed') as
        | 'merged'
        | 'open'
        | 'closed'
      if (!statusFilters[stateKey]) {
        return false
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesTitle = item.title.toLowerCase().includes(q)
        const matchesNumber = `#${item.number}`.includes(q) || String(item.number).includes(q)
        const matchesRepo = item.repo.toLowerCase().includes(q)
        const matchesDesc = (item.description || '').toLowerCase().includes(q)
        const matchesLabels = (item.labels || []).some((l) => l.toLowerCase().includes(q))
        if (!matchesTitle && !matchesNumber && !matchesRepo && !matchesDesc && !matchesLabels) {
          return false
        }
      }

      return true
    })
  }, [contributions, selectedRepo, statusFilters, searchQuery])

  // Grouped by repository for Progress Graph view (sorted PR # ascending: lowest -> highest)
  const groupedByRepo = useMemo(() => {
    const groups: Record<string, ContributionItem[]> = {}
    filteredContributions.forEach((item) => {
      if (!groups[item.repo]) {
        groups[item.repo] = []
      }
      groups[item.repo].push(item)
    })

    // Sort PRs inside each repo by number ascending (lowest -> highest top to bottom)
    Object.keys(groups).forEach((repo) => {
      groups[repo].sort((a, b) => a.number - b.number)
    })

    return groups
  }, [filteredContributions])

  const toggleStatus = (key: 'merged' | 'open' | 'closed') => {
    setStatusFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const togglePrExpand = (id: string) => {
    setExpandedPrId((prev) => (prev === id ? null : id))
  }

  return (
    <div id="contributions" className="social-section-card contributions-section">
      {/* Header Row */}
      <div className="social-section-title-row" style={{ alignItems: 'flex-start' }}>
        <div>
          <div className="section-tag-hpc" style={{ marginBottom: '0.4rem' }}>
            <span className="section-tag-dot" />
            <span>GLOBAL OPEN-SOURCE ECOSYSTEM</span>
          </div>
          <h2 className="social-section-title" style={{ margin: 0 }}>
            <span>🌐</span>
            <span>Upstream Open-Source Contributions</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '0.4rem 0 0', maxWidth: '820px', lineHeight: 1.55 }}>
            Merged pull requests, package recipes, and architectural enhancements contributed to external organizations across supercomputing, package managers, and open systems.
          </p>
        </div>

        {/* Sync Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, marginTop: '0.2rem' }}>
          {isLiveSynced ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#10b981',
                padding: '0.3rem 0.75rem',
                borderRadius: '20px',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.74rem',
                fontWeight: 700,
              }}
              title="Verified & live synchronized with GitHub API"
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              LIVE SYNCED
            </span>
          ) : isSyncing ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(0, 242, 254, 0.1)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                color: 'var(--cyber-cyan)',
                padding: '0.3rem 0.75rem',
                borderRadius: '20px',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.74rem',
              }}
            >
              SYNCING GITHUB...
            </span>
          ) : (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                padding: '0.3rem 0.75rem',
                borderRadius: '20px',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.74rem',
              }}
            >
              HYBRID CACHE
            </span>
          )}
        </div>
      </div>

      {/* High-level Telemetry Stats Bar */}
      <div className="social-stats-row" style={{ margin: '1.2rem 0 1.6rem', width: '100%' }}>
        <div className="social-stat-item">
          <div className="social-stat-number">{stateCounts.total}</div>
          <div className="social-stat-title">Tracked PRs</div>
        </div>
        <div className="social-stat-item">
          <div className="social-stat-number" style={{ color: '#10b981' }}>{stateCounts.merged}</div>
          <div className="social-stat-title">Merged Upstream</div>
        </div>
        <div className="social-stat-item">
          <div className="social-stat-number">{rankedRepos.length}</div>
          <div className="social-stat-title">External Projects</div>
        </div>
        <div className="social-stat-item">
          <div className="social-stat-number">
            {stateCounts.total > 0 ? `${Math.round((stateCounts.merged / stateCounts.total) * 100)}%` : '100%'}
          </div>
          <div className="social-stat-title">Merge Acceptance</div>
        </div>
      </div>

      {/* View Switcher Header Bar */}
      <div className="contributions-view-header">
        <div className="contributions-view-controls">
          <span className="contributions-view-label">
            REPRESENTATION VIEW:
          </span>
          <div className="cyber-graph-switcher contributions-switcher-bar">
            <button
              onClick={() => setViewMode('cards')}
              className={`cyber-graph-switcher-btn ${viewMode === 'cards' ? 'active' : ''}`}
            >
              🎴 Cards
            </button>
            <button
              onClick={() => setViewMode('progress')}
              className={`cyber-graph-switcher-btn ${viewMode === 'progress' ? 'active' : ''}`}
            >
              📈 Stems
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`cyber-graph-switcher-btn ${viewMode === 'list' ? 'active' : ''}`}
            >
              📋 List
            </button>
          </div>
        </div>

        {/* PR Count Counter */}
        <div className="contributions-count-badge">
          Showing <strong>{filteredContributions.length}</strong> of {contributions.length} PRs
        </div>
      </div>

      {/* Interactive Controls & Filters */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '1.8rem',
          background: 'var(--bg-surface)',
          padding: '1.2rem',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Repositories Filter (Top 5 + All Projects Dropdown) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.74rem', color: 'var(--cyber-cyan)', fontWeight: 800, letterSpacing: '0.04em' }}>
              FILTER BY REPOSITORY (TOP 5 ACTIVE):
            </div>
            {selectedRepo !== 'All' && (
              <button
                onClick={() => setSelectedRepo('All')}
                className="cyber-action-btn secondary"
                style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}
              >
                ✕ RESET TO ALL
              </button>
            )}
          </div>

          <div className="contributions-repo-pills-row">
            {/* "All" Option */}
            <button
              onClick={() => setSelectedRepo('All')}
              className="cyber-graph-switcher-btn repo-pill-btn"
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.76rem',
                background: selectedRepo === 'All' ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedRepo === 'All' ? 'var(--cyber-cyan)' : 'var(--text-muted)',
                borderColor: selectedRepo === 'All' ? 'var(--cyber-cyan)' : 'var(--border-subtle)',
                boxShadow: selectedRepo === 'All' ? '0 0 10px rgba(0, 242, 254, 0.25)' : undefined,
              }}
            >
              <span>All Projects</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.8, marginLeft: '0.25rem' }}>({contributions.length})</span>
            </button>

            {/* Top 5 Repositories */}
            {top5Repos.map((r) => {
              const isSelected = selectedRepo === r.name
              return (
                <button
                  key={r.name}
                  onClick={() => setSelectedRepo(r.name)}
                  className="cyber-graph-switcher-btn repo-pill-btn"
                  style={{
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.76rem',
                    background: isSelected ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? 'var(--cyber-cyan)' : 'var(--text-muted)',
                    borderColor: isSelected ? 'var(--cyber-cyan)' : 'var(--border-subtle)',
                    boxShadow: isSelected ? '0 0 10px rgba(0, 242, 254, 0.25)' : undefined,
                  }}
                  title={r.name}
                >
                  <span className="repo-pill-text">{r.name}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.8, marginLeft: '0.25rem' }}>({r.total})</span>
                </button>
              )
            })}

            {/* "List All Projects" Dropdown Toggle */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowAllReposDropdown((prev) => !prev)}
                className="cyber-graph-switcher-btn repo-pill-btn"
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.76rem',
                  background: showAllReposDropdown || !top5Repos.some((r) => r.name === selectedRepo) && selectedRepo !== 'All'
                    ? 'rgba(252, 238, 10, 0.12)'
                    : 'rgba(255, 255, 255, 0.03)',
                  color: showAllReposDropdown || !top5Repos.some((r) => r.name === selectedRepo) && selectedRepo !== 'All'
                    ? 'var(--cyber-yellow)'
                    : 'var(--text-muted)',
                  borderColor: showAllReposDropdown ? 'var(--cyber-yellow)' : 'var(--border-subtle)',
                }}
              >
                <span>☰ List All Projects ({rankedRepos.length})</span>
                <ChevronDownIcon rotated={showAllReposDropdown} />
              </button>

              {/* All Projects Popover Dropdown */}
              {showAllReposDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    zIndex: 50,
                    minWidth: '260px',
                    maxWidth: 'calc(100vw - 3rem)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-cyber)',
                    borderRadius: '12px',
                    padding: '0.8rem',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 242, 254, 0.2)',
                    backdropFilter: 'blur(16px)',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: 'var(--cyber-cyan)', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    ALL CONTRIBUTED REPOSITORIES
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '240px', overflowY: 'auto' }}>
                    {rankedRepos.map((r) => (
                      <button
                        key={r.name}
                        onClick={() => {
                          setSelectedRepo(r.name)
                          setShowAllReposDropdown(false)
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.45rem 0.75rem',
                          borderRadius: '6px',
                          border: 'none',
                          background: selectedRepo === r.name ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                          color: selectedRepo === r.name ? 'var(--cyber-cyan)' : 'var(--text-main)',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.75rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          gap: '0.5rem',
                        }}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
                        <span style={{ color: '#10b981', fontWeight: 700, flexShrink: 0 }}>{r.total} PRs</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Filter Controls: Status Checkboxes + Search */}
        <div className="contributions-filter-footer">
          {/* Status Checkbox Toggles */}
          <div className="contributions-status-toggles">
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              STATUS:
            </span>

            {/* Merged Checkbox */}
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.76rem',
                color: statusFilters.merged ? '#10b981' : 'var(--text-muted)',
                background: statusFilters.merged ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                border: `1px solid ${statusFilters.merged ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'}`,
                padding: '0.28rem 0.65rem',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                type="checkbox"
                checked={statusFilters.merged}
                onChange={() => toggleStatus('merged')}
                style={{ accentColor: '#10b981', cursor: 'pointer' }}
              />
              <span>Merged ({stateCounts.merged})</span>
            </label>

            {/* Open Checkbox */}
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.76rem',
                color: statusFilters.open ? '#3b82f6' : 'var(--text-muted)',
                background: statusFilters.open ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                border: `1px solid ${statusFilters.open ? 'rgba(59, 130, 246, 0.4)' : 'var(--border-subtle)'}`,
                padding: '0.28rem 0.65rem',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                type="checkbox"
                checked={statusFilters.open}
                onChange={() => toggleStatus('open')}
                style={{ accentColor: '#3b82f6', cursor: 'pointer' }}
              />
              <span>Open ({stateCounts.open})</span>
            </label>

            {/* Closed Checkbox */}
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.76rem',
                color: statusFilters.closed ? '#ec4899' : 'var(--text-muted)',
                background: statusFilters.closed ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
                border: `1px solid ${statusFilters.closed ? 'rgba(236, 72, 153, 0.4)' : 'var(--border-subtle)'}`,
                padding: '0.28rem 0.65rem',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                type="checkbox"
                checked={statusFilters.closed}
                onChange={() => toggleStatus('closed')}
                style={{ accentColor: '#ec4899', cursor: 'pointer' }}
              />
              <span>Closed ({stateCounts.closed})</span>
            </label>
          </div>

          {/* Quick Search Input */}
          <div className="contributions-search-wrapper">
            <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none' }}>
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Filter title, #number, labels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.45rem 0.8rem 0.45rem 2.2rem',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono, monospace)',
                color: 'var(--text-main)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      </div>

      {/* Zero State */}
      {filteredContributions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'var(--bg-surface)', borderRadius: '14px', border: '1px solid var(--border-subtle)', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>🔍</div>
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 700 }}>
            No matching pull requests found
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.4rem' }}>
            Try adjusting your status checkboxes or clearing the search query.
          </div>
        </div>
      ) : (
        <>
          {/* ========================================================
              VIEW 1: RESPONSIVE CARDS (FULL WIDTH AUTO-FIT)
              ======================================================== */}
          {viewMode === 'cards' && (
            <div className="contributions-grid">
              {filteredContributions.map((item) => {
                const isMerged = item.state === 'merged'
                const isOpen = item.state === 'open'
                const statusColor = isMerged ? '#10b981' : isOpen ? '#3b82f6' : '#ec4899'
                const statusBg = isMerged
                  ? 'rgba(16, 185, 129, 0.12)'
                  : isOpen
                  ? 'rgba(59, 130, 246, 0.12)'
                  : 'rgba(236, 72, 153, 0.12)'

                return (
                  <div key={item.id} className="contribution-card">
                    <div>
                      {/* Top Repo Link & Status Pill */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.6rem', marginBottom: '0.7rem', flexWrap: 'wrap' }}>
                        <a
                          href={item.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            fontFamily: 'var(--font-mono, monospace)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: 'var(--cyber-cyan)',
                            textDecoration: 'none',
                          }}
                          title={`Open ${item.repo} on GitHub`}
                        >
                          <GitHubIcon />
                          <span>{item.repo}</span>
                          <ExternalLinkIcon />
                        </a>

                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: statusBg,
                            border: `1px solid ${statusColor}40`,
                            color: statusColor,
                            padding: '0.22rem 0.6rem',
                            borderRadius: '20px',
                            fontFamily: 'var(--font-mono, monospace)',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {isMerged ? <GitMergeIcon size={13} /> : <GitPullRequestIcon size={13} />}
                          <span>{item.state}</span>
                        </span>
                      </div>

                      {/* PR Title and Number Link */}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'block',
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: 'var(--text-main)',
                          textDecoration: 'none',
                          lineHeight: 1.45,
                          marginBottom: '0.5rem',
                        }}
                        className="hover-cyber-yellow"
                      >
                        <span style={{ color: 'var(--cyber-yellow)', fontFamily: 'var(--font-mono, monospace)', marginRight: '0.45rem' }}>
                          #{item.number}
                        </span>
                        {item.title}
                      </a>

                      {/* Description */}
                      {item.description && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 0.8rem', lineHeight: 1.55 }}>
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Footer with Labels & View Action */}
                    <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {item.labels && item.labels.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {item.labels.map((lbl) => (
                            <span
                              key={lbl}
                              style={{
                                background: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                color: 'var(--text-muted)',
                                borderRadius: '4px',
                                padding: '0.15rem 0.45rem',
                                fontSize: '0.68rem',
                                fontFamily: 'var(--font-mono, monospace)',
                              }}
                            >
                              {lbl}
                            </span>
                          ))}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {item.checks && (
                          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: isMerged ? '#10b981' : 'var(--text-muted)' }}>
                            ✓ {item.checks}
                          </span>
                        )}

                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cyber-action-btn secondary"
                          style={{
                            padding: '0.3rem 0.75rem',
                            fontSize: '0.72rem',
                            marginLeft: 'auto',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <span>VIEW PR ON GITHUB</span>
                          <ExternalLinkIcon />
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ========================================================
              VIEW 2: PROGRESS & STEMS GRAPH (# LOWEST -> HIGHEST)
              ======================================================== */}
          {viewMode === 'progress' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.5rem', textAlign: 'center' }}>
                Pull requests sequenced ascending by PR Number (lowest → highest, top to bottom). Click any PR node to inspect full details.
              </p>

              {Object.entries(groupedByRepo).map(([repoName, items]) => {
                const total = items.length
                const mergedCount = items.filter((it) => it.state === 'merged').length
                const pct = Math.round((mergedCount / total) * 100)

                return (
                  <div key={`repo-prog-${repoName}`} className="contributions-progress-group">
                    {/* Repository Progress Header */}
                    <div className="contributions-progress-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ color: 'var(--cyber-cyan)' }}><GitHubIcon /></span>
                        <a
                          href={`https://github.com/${repoName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', textDecoration: 'none' }}
                          className="hover-cyber-yellow"
                        >
                          {repoName}
                        </a>
                        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          ({total} PRs · {mergedCount} Merged)
                        </span>
                      </div>

                      {/* Progress Bar Track */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: '220px' }}>
                        <div style={{ flex: 1, height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, #10b981, #00f2fe)',
                              boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
                              transition: 'width 0.4s ease',
                            }}
                          />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                          {pct}% MERGED
                        </span>
                      </div>
                    </div>

                    {/* Sequential Track (Lowest to Highest PR #) */}
                    <div className="contributions-progress-track">
                      {items.map((pr) => {
                        const isExpanded = expandedPrId === pr.id
                        const isMerged = pr.state === 'merged'
                        const isOpen = pr.state === 'open'
                        const statusColor = isMerged ? '#10b981' : isOpen ? '#3b82f6' : '#ec4899'

                        return (
                          <div
                            key={pr.id}
                            className={`contributions-stem-item ${isExpanded ? 'active' : ''}`}
                            onClick={() => togglePrExpand(pr.id)}
                          >
                            {/* Connected Stem Dot */}
                            <span
                              className="contributions-stem-dot"
                              style={{ '--node-color': statusColor, color: statusColor } as React.CSSProperties}
                            />

                            {/* Node Header Row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.85rem', color: 'var(--cyber-yellow)', fontWeight: 800 }}>
                                  #{pr.number}
                                </span>
                                <span style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                  {pr.title}
                                </span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <span
                                  style={{
                                    fontFamily: 'var(--font-mono, monospace)',
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    color: statusColor,
                                    textTransform: 'uppercase',
                                    background: `${statusColor}18`,
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '12px',
                                    border: `1px solid ${statusColor}40`,
                                  }}
                                >
                                  {pr.state}
                                </span>
                                <ChevronDownIcon rotated={isExpanded} />
                              </div>
                            </div>

                            {/* Expanded Details Dossier */}
                            {isExpanded && (
                              <div
                                style={{
                                  marginTop: '0.8rem',
                                  paddingTop: '0.8rem',
                                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                                  animation: 'fadeIn 0.2s ease',
                                }}
                              >
                                {pr.description && (
                                  <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.55, margin: '0 0 0.8rem' }}>
                                    {pr.description}
                                  </p>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
                                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                    {pr.labels?.map((lbl) => (
                                      <span
                                        key={lbl}
                                        style={{
                                          background: 'rgba(255, 255, 255, 0.05)',
                                          border: '1px solid rgba(255, 255, 255, 0.1)',
                                          borderRadius: '4px',
                                          padding: '0.15rem 0.45rem',
                                          fontFamily: 'var(--font-mono, monospace)',
                                          fontSize: '0.68rem',
                                          color: 'var(--cyber-cyan)',
                                        }}
                                      >
                                        {lbl}
                                      </span>
                                    ))}
                                    {pr.checks && (
                                      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: isMerged ? '#10b981' : 'var(--text-muted)', marginLeft: '0.4rem' }}>
                                        ✓ {pr.checks}
                                      </span>
                                    )}
                                  </div>

                                  <a
                                    href={pr.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cyber-action-btn primary"
                                    style={{
                                      padding: '0.35rem 0.85rem',
                                      fontSize: '0.72rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.4rem',
                                      textDecoration: 'none',
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span>OPEN PR #{pr.number} ON GITHUB</span>
                                    <ExternalLinkIcon />
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ========================================================
              VIEW 3: DETAILED LIST TABLE
              ======================================================== */}
          {viewMode === 'list' && (
            <div className="contributions-list-table">
              {filteredContributions.map((pr) => {
                const isExpanded = expandedPrId === pr.id
                const isMerged = pr.state === 'merged'
                const isOpen = pr.state === 'open'
                const statusColor = isMerged ? '#10b981' : isOpen ? '#3b82f6' : '#ec4899'

                return (
                  <div
                    key={pr.id}
                    className={`contributions-list-row ${isExpanded ? 'active' : ''}`}
                    onClick={() => togglePrExpand(pr.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: '160px' }}>
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: statusColor,
                          boxShadow: `0 0 8px ${statusColor}`,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.78rem', color: 'var(--cyber-yellow)', fontWeight: 800 }}>
                        #{pr.number}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.68rem',
                          color: statusColor,
                          textTransform: 'uppercase',
                          fontWeight: 700,
                        }}
                      >
                        {pr.state}
                      </span>
                    </div>

                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                        {pr.title}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.74rem', color: 'var(--cyber-cyan)' }}>
                        {pr.repo}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexShrink: 0 }}>
                      {pr.checks && (
                        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: isMerged ? '#10b981' : 'var(--text-muted)' }}>
                          ✓ {pr.checks}
                        </span>
                      )}

                      <a
                        href={pr.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cyber-action-btn secondary"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem', textDecoration: 'none' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>VIEW PR ↗</span>
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
