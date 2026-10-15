export function TechIcon({
  name,
  size = 20,
  className = '',
}: {
  name: string
  size?: number
  className?: string
}) {
  const norm = name.toLowerCase().trim()

  // 1. Python (Official blue & yellow interlocking snakes)
  if (norm === 'python') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <path
          fill="#387EB8"
          d="M63.586.012c-15.06 0-24.195 6.55-24.195 19.348v14.168h24.707v3.543H29.742C13.254 37.07 0 47.925 0 64.675c0 16.516 11.234 26.547 26.297 26.547h8.86v-12.4c0-14.17 11.957-25.86 26.574-25.86h24.672v-3.543H61.695v-7.086h35.438c14.617 0 23.03-9.52 23.03-23.027 0-14.172-10.437-19.3-24.81-19.3zm-13.29 7.086c2.44 0 4.43 1.988 4.43 4.43 0 2.44-1.99 4.43-4.43 4.43-2.44 0-4.43-1.99-4.43-4.43 0-2.442 1.99-4.43 4.43-4.43z"
        />
        <path
          fill="#FFE052"
          d="M64.414 127.988c15.06 0 24.195-6.55 24.195-19.348v-14.168H63.902v-3.543h34.355c16.488 0 29.743-10.855 29.743-27.605 0-16.516-11.235-26.547-26.297-26.547h-8.86v12.4c0 14.17-11.957 25.86-26.574 25.86H41.597v3.543h24.707v7.086H30.867c-14.617 0-23.03 9.52-23.03 23.027 0 14.172 10.437 19.3 24.81 19.3zm13.29-7.086c-2.44 0-4.43-1.988-4.43-4.43 0-2.44 1.99-4.43 4.43-4.43 2.44 0 4.43 1.99 4.43 4.43 0 2.442-1.99 4.43-4.43 4.43z"
        />
      </svg>
    )
  }

  // 2. C++
  if (norm.includes('c++') || norm === 'cpp') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <path
          fill="#00599C"
          d="M116.27 28.5L67.5 0.35a7 7 0 0 0-7 0L11.73 28.5A7 7 0 0 0 8.23 34.56v58.88a7 7 0 0 0 3.5 6.06l48.77 28.15a7 7 0 0 0 7 0l48.77-28.15a7 7 0 0 0 3.5-6.06V34.56a7 7 0 0 0-3.5-6.06z"
        />
        <path
          fill="#A8B9CC"
          d="M64 10.35L17.23 37.35a3.5 3.5 0 0 0-1.75 3.03v54.24a3.5 3.5 0 0 0 1.75 3.03L64 117.65a3.5 3.5 0 0 0 3.5 0l46.77-27a3.5 3.5 0 0 0 1.75-3.03V40.38a3.5 3.5 0 0 0-1.75-3.03L67.5 10.35a3.5 3.5 0 0 0-3.5 0z"
        />
        <path
          fill="#00599C"
          d="M64 16.35L22.23 40.47a2.5 2.5 0 0 0-1.25 2.16v48.74a2.5 2.5 0 0 0 1.25 2.16L64 111.65a2.5 2.5 0 0 0 2.5 0l41.77-24.12a2.5 2.5 0 0 0 1.25-2.16V42.63a2.5 2.5 0 0 0-1.25-2.16L66.5 16.35a2.5 2.5 0 0 0-2.5 0z"
        />
        <path
          fill="#FFFFFF"
          d="M52 38c-14.36 0-26 11.64-26 26s11.64 26 26 26c10.28 0 19.17-5.97 23.38-14.64l-10.65-5.32C62.08 75.61 57.54 79 52 79c-8.28 0-15-6.72-15-15s6.72-15 15-15c5.54 0 10.08 3.39 12.73 8.96l10.65-5.32C71.17 43.97 62.28 38 52 38z"
        />
        <path
          fill="#FFFFFF"
          d="M83 57v5h5v4h-5v5h-4v-5h-5v-4h5v-5h4zm18 0v5h5v4h-5v5h-4v-5h-5v-4h5v-5h4z"
        />
      </svg>
    )
  }

  // 3. C Language (Official ISO C blue hex logo)
  if (norm === 'c' || norm === 'c_cpp' || norm === 'c / c++') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <path
          fill="#00599C"
          d="M116.27 28.5L67.5 0.35a7 7 0 0 0-7 0L11.73 28.5A7 7 0 0 0 8.23 34.56v58.88a7 7 0 0 0 3.5 6.06l48.77 28.15a7 7 0 0 0 7 0l48.77-28.15a7 7 0 0 0 3.5-6.06V34.56a7 7 0 0 0-3.5-6.06z"
        />
        <path
          fill="#A8B9CC"
          d="M64 10.35L17.23 37.35a3.5 3.5 0 0 0-1.75 3.03v54.24a3.5 3.5 0 0 0 1.75 3.03L64 117.65a3.5 3.5 0 0 0 3.5 0l46.77-27a3.5 3.5 0 0 0 1.75-3.03V40.38a3.5 3.5 0 0 0-1.75-3.03L67.5 10.35a3.5 3.5 0 0 0-3.5 0z"
        />
        <path
          fill="#00599C"
          d="M64 16.35L22.23 40.47a2.5 2.5 0 0 0-1.25 2.16v48.74a2.5 2.5 0 0 0 1.25 2.16L64 111.65a2.5 2.5 0 0 0 2.5 0l41.77-24.12a2.5 2.5 0 0 0 1.25-2.16V42.63a2.5 2.5 0 0 0-1.25-2.16L66.5 16.35a2.5 2.5 0 0 0-2.5 0z"
        />
        <path
          fill="#FFFFFF"
          d="M64 36c-15.46 0-28 12.54-28 28s12.54 28 28 28c11.05 0 20.61-6.42 25.13-15.74l-11.45-5.73C74.63 76.5 69.75 80 64 80c-8.84 0-16-7.16-16-16s7.16-16 16-16c5.75 0 10.63 3.5 13.68 8.47l11.45-5.73C84.61 42.42 75.05 36 64 36z"
        />
      </svg>
    )
  }

  // 4. Linux (Official Tux silhouette & terminal)
  if (norm.includes('linux') || norm === 'arch' || norm === 'rocky linux' || norm === 'centos') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <path
          fill="#FCC624"
          d="M48 94c-8 6-18 8-22 12-4 4-2 9 4 10 12 2 24-2 34-8 4-3 5-7 1-10-5-4-11-6-17-4zm32 0c8 6 18 8 22 12 4 4 2 9-4 10-12 2-24-2-34-8-4-3-5-7-1-10 5-4 11-6 17-4z"
        />
        <path
          fill="#333333"
          d="M64 4c-16 0-24 16-24 32 0 8 2 18 2 26-10 8-16 22-16 36 0 10 6 18 16 20 8 2 28 2 44 2s36 0 44-2c10-2 16-10 16-20 0-14-6-28-16-36 0-8 2-18 2-26 0-16-8-32-24-32H64z"
        />
        <ellipse cx="64" cy="78" rx="22" ry="28" fill="#FFFFFF" />
        <ellipse cx="54" cy="28" rx="4" ry="7" fill="#FFFFFF" />
        <ellipse cx="74" cy="28" rx="4" ry="7" fill="#FFFFFF" />
        <ellipse cx="54" cy="30" rx="2" ry="3.5" fill="#000000" />
        <ellipse cx="74" cy="30" rx="2" ry="3.5" fill="#000000" />
        <path
          fill="#FFA500"
          d="M56 36c0 0 3-4 8-4s8 4 8 4-2 10-8 10-8-10-8-10z"
        />
      </svg>
    )
  }

  // 5. CUDA / GPU (Nvidia Tensor & GPU Architecture)
  if (norm.includes('cuda') || norm.includes('gpu') || norm === 'openacc') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <rect width="128" height="128" rx="24" fill="#0A0E17" />
        <rect x="6" y="6" width="116" height="116" rx="20" stroke="#76B900" strokeWidth="4" fill="none" />
        <path
          fill="#76B900"
          d="M64 26C43.013 26 26 43.013 26 64s17.013 38 38 38c16.2 0 30.088-10.15 35.538-24.5H86.2C81.7 81.388 73.575 88 64 88c-13.255 0-24-10.745-24-24s10.745-24 24-24c6.763 0 12.875 2.8 17.225 7.325l9.95-9.95C84.388 30.563 74.725 26 64 26z"
        />
        <circle cx="64" cy="64" r="8" fill="#76B900" />
        <text
          x="64"
          y="114"
          textAnchor="middle"
          fill="#76B900"
          fontFamily="monospace"
          fontWeight="900"
          fontSize="18"
          letterSpacing="1"
        >
          CUDA
        </text>
      </svg>
    )
  }

  // 6. MPI / Distributed Computing (Official Network Interconnect)
  if (norm.includes('mpi') || norm.includes('distributed') || norm === 'openmpi') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <circle cx="28" cy="64" r="14" fill="#0284C7" stroke="#38BDF8" strokeWidth="4" />
        <circle cx="64" cy="24" r="14" fill="#6366F1" stroke="#818CF8" strokeWidth="4" />
        <circle cx="64" cy="104" r="14" fill="#6366F1" stroke="#818CF8" strokeWidth="4" />
        <circle cx="100" cy="64" r="14" fill="#0284C7" stroke="#38BDF8" strokeWidth="4" />
        <circle cx="64" cy="64" r="18" fill="#00F2FE" />
        <line x1="28" y1="64" x2="64" y2="24" stroke="#00F2FE" strokeWidth="4" strokeDasharray="3 3" />
        <line x1="64" y1="24" x2="100" y2="64" stroke="#00F2FE" strokeWidth="4" strokeDasharray="3 3" />
        <line x1="100" y1="64" x2="64" y2="104" stroke="#00F2FE" strokeWidth="4" strokeDasharray="3 3" />
        <line x1="64" y1="104" x2="28" y2="64" stroke="#00F2FE" strokeWidth="4" strokeDasharray="3 3" />
        <line x1="28" y1="64" x2="100" y2="64" stroke="#FFFFFF" strokeWidth="3" />
        <line x1="64" y1="24" x2="64" y2="104" stroke="#FFFFFF" strokeWidth="3" />
      </svg>
    )
  }

  // 7. OpenMP (Official Parallel Shared-Memory Threads)
  if (norm.includes('openmp') || norm.includes('pthread')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <path
          fill="none"
          stroke="#0284C7"
          strokeWidth="12"
          strokeLinecap="round"
          d="M34 94C22 82 20 54 36 36s46-16 64 0 14 46-2 62"
        />
        <path
          fill="none"
          stroke="#FCEE0A"
          strokeWidth="6"
          strokeLinecap="round"
          d="M48 84C38 74 38 54 50 42s32-12 44 0 10 32 0 42"
        />
        <circle cx="64" cy="64" r="10" fill="#00F2FE" />
        <text
          x="64"
          y="118"
          textAnchor="middle"
          fill="#38BDF8"
          fontFamily="monospace"
          fontWeight="900"
          fontSize="18"
        >
          OpenMP
        </text>
      </svg>
    )
  }

  // 8. Slurm / Supercomputing / HPC Cluster Workload Manager
  if (norm.includes('slurm') || norm.includes('supercomputing') || norm.includes('hpc') || norm.includes('cluster')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        {/* Cluster Rack Nodes */}
        <rect x="14" y="16" width="100" height="24" rx="4" fill="#1E293B" stroke="#00F2FE" strokeWidth="3" />
        <rect x="14" y="52" width="100" height="24" rx="4" fill="#1E293B" stroke="#38BDF8" strokeWidth="3" />
        <rect x="14" y="88" width="100" height="24" rx="4" fill="#1E293B" stroke="#818CF8" strokeWidth="3" />
        {/* Telemetry LED nodes */}
        <circle cx="28" cy="28" r="4" fill="#10B981" />
        <circle cx="42" cy="28" r="4" fill="#10B981" />
        <line x1="56" y1="28" x2="98" y2="28" stroke="#00F2FE" strokeWidth="3" strokeLinecap="round" />
        <circle cx="28" cy="64" r="4" fill="#FCEE0A" />
        <circle cx="42" cy="64" r="4" fill="#10B981" />
        <line x1="56" y1="64" x2="98" y2="64" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="28" cy="100" r="4" fill="#10B981" />
        <circle cx="42" cy="100" r="4" fill="#FF0055" />
        <line x1="56" y1="100" x2="98" y2="100" stroke="#818CF8" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }

  // 9. Shell Scripting / Bash
  if (norm.includes('shell') || norm.includes('bash') || norm.includes('zsh')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <rect x="8" y="14" width="112" height="100" rx="14" fill="#1E293B" stroke="#475569" strokeWidth="4" />
        <rect x="8" y="14" width="112" height="24" rx="14" fill="#0F172A" />
        <circle cx="24" cy="26" r="4" fill="#EF4444" />
        <circle cx="38" cy="26" r="4" fill="#F59E0B" />
        <circle cx="52" cy="26" r="4" fill="#10B981" />
        <path
          d="M26 62l18 14-18 14"
          stroke="#4ADE80"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <line x1="54" y1="90" x2="84" y2="90" stroke="#FCEE0A" strokeWidth="6" strokeLinecap="round" />
      </svg>
    )
  }

  // 10. Spack / Conda (Scientific Package Managers)
  if (norm.includes('spack') || norm.includes('conda')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <polygon points="64,12 112,40 112,88 64,116 16,88 16,40" fill="#2563EB" opacity="0.3" stroke="#38BDF8" strokeWidth="4" />
        <polygon points="64,12 112,40 64,68 16,40" fill="#38BDF8" />
        <polygon points="64,68 112,40 112,88 64,116" fill="#1D4ED8" />
        <polygon points="16,40 64,68 64,116 16,88" fill="#2563EB" />
      </svg>
    )
  }

  // 11. Docker / Containers
  if (norm.includes('docker') || norm.includes('apptainer') || norm.includes('singularity') || norm.includes('container')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <path
          fill="#2496ED"
          d="M120 54c-2.4-1.6-7.8-2.6-12.8-1.4-1.4-9.8-8.6-17.6-18.2-19.6l-3.2-.6-1.8 2.8c-4.4 7-4.4 15.6-.2 22.8-2.6 1.4-8.8 2-15.8.6l-3.4-.6v30c0 14.4-8.6 22-26.6 22-19.6 0-35.4-9.8-41.2-25.6h94.2c9.2 0 17.4-4 22.8-11.2 5.8-7.8 7.6-17.2 6.2-19.2z"
        />
        <rect x="22" y="44" width="10" height="10" rx="1.5" fill="#2496ED" />
        <rect x="36" y="44" width="10" height="10" rx="1.5" fill="#2496ED" />
        <rect x="50" y="44" width="10" height="10" rx="1.5" fill="#2496ED" />
        <rect x="36" y="30" width="10" height="10" rx="1.5" fill="#2496ED" />
        <rect x="50" y="30" width="10" height="10" rx="1.5" fill="#2496ED" />
        <rect x="64" y="44" width="10" height="10" rx="1.5" fill="#2496ED" />
        <rect x="64" y="30" width="10" height="10" rx="1.5" fill="#2496ED" />
        <rect x="78" y="44" width="10" height="10" rx="1.5" fill="#2496ED" />
      </svg>
    )
  }

  // 12. React
  if (norm.includes('react')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <circle cx="64" cy="64" r="11" fill="#61DAFB" />
        <ellipse cx="64" cy="64" rx="48" ry="18" fill="none" stroke="#61DAFB" strokeWidth="5" />
        <ellipse
          cx="64"
          cy="64"
          rx="48"
          ry="18"
          fill="none"
          stroke="#61DAFB"
          strokeWidth="5"
          transform="rotate(60 64 64)"
        />
        <ellipse
          cx="64"
          cy="64"
          rx="48"
          ry="18"
          fill="none"
          stroke="#61DAFB"
          strokeWidth="5"
          transform="rotate(120 64 64)"
        />
      </svg>
    )
  }

  // 13. Git / GitHub
  if (norm.includes('git')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <path
          fill="#F05032"
          d="M124.6 57.5L70.5 3.4a9.1 9.1 0 0 0-12.9 0L3.4 57.5a9.1 9.1 0 0 0 0 12.9l54.1 54.1a9.1 9.1 0 0 0 12.9 0l54.1-54.1a9.1 9.1 0 0 0 .1-12.9z"
        />
        <circle cx="86" cy="42" r="10" fill="#FFFFFF" />
        <circle cx="42" cy="86" r="10" fill="#FFFFFF" />
        <circle cx="64" cy="64" r="10" fill="#FFFFFF" />
        <line x1="42" y1="86" x2="86" y2="42" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
      </svg>
    )
  }

  // 14. JavaScript
  if (norm.includes('javascript') || norm === 'js') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <rect width="128" height="128" rx="16" fill="#F7DF1E" />
        <path
          fill="#000000"
          d="M37.5 98.4c4.3 2.5 9.2 4.1 14.2 4.1 11.6 0 19-5.9 19-19.7V39h-15.6v43.7c0 5.6-2.9 7.8-7.5 7.8-3.7 0-6.9-1.6-9.1-3.3l-1 11.2zm48.7.6c6.2 3.4 14.1 5.4 22 5.4 18.7 0 28.8-9.4 28.8-23.7 0-12.7-7.9-18.7-21.6-24.3-9.5-4-13.4-7.2-13.4-12.7 0-4.6 3.7-8.1 11.2-8.1 5.9 0 11.1 1.7 15.3 4.1l3.5-11.6c-4.9-2.2-11.4-3.5-18.7-3.5-17.7 0-27.4 9.9-27.4 23.3 0 12.9 8.6 19.3 21.6 24.6 9.8 4.2 13.8 7.7 13.8 13.6 0 5.4-4.8 9.2-12.8 9.2-7.5 0-13.7-2.6-18.5-5.6l-3.9 11.2z"
        />
      </svg>
    )
  }

  // 15. TypeScript
  if (norm.includes('typescript') || norm === 'ts') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <rect width="128" height="128" rx="16" fill="#3178C6" />
        <path
          fill="#FFFFFF"
          d="M31 52h44V40H8v12h44v60h12V52zm43 27c3.4 2.1 7.4 3.3 11.5 3.3 5.8 0 8.8-2.3 8.8-5.8 0-4-3.8-5.6-10.4-8.1-10.6-3.8-16.9-8.4-16.9-17.9 0-10.6 8.9-18.5 22.8-18.5 6.9 0 13.4 1.8 17.5 4.3l-3.8 10.3c-3.1-1.8-6.9-3.1-11.1-3.1-6.1 0-8.9 2.5-8.9 5.3 0 3.7 3.5 5.2 10.8 7.9 11.1 4.2 16.5 9.1 16.5 18.2 0 11.9-9.4 18.9-23.7 18.9-7.9 0-15.6-2.2-20.2-5.1L74 79z"
        />
      </svg>
    )
  }

  // 16. Fortran
  if (norm.includes('fortran')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <rect width="128" height="128" rx="20" fill="#734F96" />
        <path
          fill="#FFFFFF"
          d="M36 28h56v16H54v20h32v16H54v28H36V28z"
        />
      </svg>
    )
  }

  // 17. Java
  if (norm.includes('java') && !norm.includes('script')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <path
          fill="#EA2D2E"
          d="M48.2 88.5s-6.3 3.6 4.3 4.8c12.9 1.4 19.5 1.3 33.9-1.4 0 0 3.8 2.4 8.7 4.5-27.4 11.3-64.8-1.5-46.9-7.9zM43.9 74.2s-7.2 4.9 3.4 6.2c13.7 1.6 24.3 1.8 43.1-2.2 0 0 2.7 2.6 6.5 4.4-33.3 10.6-70.8.2-53-8.4z"
        />
        <path
          fill="#007396"
          d="M69.8 18s12.5 12.8-11.8 32.5c-19.4 15.7-4.4 24.6 0 34.6-11.5-10.4-15.2-19.6-10.9-28.1 6.3-12.7 27.5-18.7 22.7-39zM80.2 36.3s14.8 10.3-6.2 30.6c-17.1 16.5-6.5 24.9-1.9 33.9-12.9-12.3-13.8-21.7-8.1-29.4 8.4-11.3 22.4-16.6 16.2-35.1z"
        />
      </svg>
    )
  }

  // 18. Vim / Neovim / Configs
  if (norm.includes('vim')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <polygon points="12,12 116,12 116,116 12,116" fill="#019833" rx="16" />
        <path
          fill="#FFFFFF"
          d="M26 28h28l22 46 22-46h24L76 108H52L26 28z"
        />
      </svg>
    )
  }

  // 19. HTML5 (Official orange shield)
  if (norm.includes('html')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <path fill="#E44D26" d="M19 12l9 101.3 36 10 36-10 9-101.3H19z" />
        <path fill="#F16529" d="M64 113.8l28.6-7.9 7.4-83.9H64v91.8z" />
        <path fill="#EBEBEB" d="M64 48.6H46.8l-1.3-14.7H64V20.8H30.4l3.8 42.6H64V48.6zm0 35.3l-15.6-4.2-1-11.2H33.8l2 22.4 28.2 7.8v-14.8z" />
        <path fill="#FFFFFF" d="M64 48.6h17.2l-1.6 18.2-15.6 4.2v14.8l28.2-7.8 3.8-42.6H64v13.2zm0-27.8v13.1h32.2l1.3-13.1H64z" />
      </svg>
    )
  }

  // 20. CSS3 (Official blue shield)
  if (norm.includes('css')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <path fill="#1572B6" d="M19 12l9 101.3 36 10 36-10 9-101.3H19z" />
        <path fill="#33A9DC" d="M64 113.8l28.6-7.9 7.4-83.9H64v91.8z" />
        <path fill="#EBEBEB" d="M64 48.6H46.8l-1.3-14.7H64V20.8H30.4l3.8 42.6H64V48.6zm0 35.3l-15.6-4.2-1-11.2H33.8l2 22.4 28.2 7.8v-14.8z" />
        <path fill="#FFFFFF" d="M64 48.6h17.2l-1.6 18.2-15.6 4.2v14.8l28.2-7.8 3.8-42.6H64v13.2zm0-27.8v13.1h32.2l1.3-13.1H64z" />
      </svg>
    )
  }

  // 21. Kubernetes (Official helm wheel)
  if (norm.includes('k8s') || norm.includes('kubernetes')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <circle cx="64" cy="64" r="56" fill="#326CE5" />
        <path
          fill="#FFFFFF"
          d="M64 22l28 16v32l-28 16-28-16V38l28-16zm0 10.5L44 44v20l20 11.5L84 64V44L64 32.5z"
        />
        <circle cx="64" cy="54" r="9" fill="#FFFFFF" />
      </svg>
    )
  }

  // 22. AWS (Official Cloud / Arrow)
  if (norm.includes('aws') || norm.includes('amazon')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <rect width="128" height="128" rx="20" fill="#232F3E" />
        <path
          fill="#FF9900"
          d="M32 78c18 14 46 14 64 0 2-1 4 1 2 3-20 16-50 16-70 0-2-2 1-4 4-3z"
        />
        <path fill="#FF9900" d="M96 76l6 8-10 1 4-9z" />
        <text x="64" y="58" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="900" fontSize="30" textAnchor="middle">
          AWS
        </text>
      </svg>
    )
  }

  // 23. CMake (Official Triangles)
  if (norm.includes('cmake')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <polygon points="64,12 118,106 72,106" fill="#064F8C" />
        <polygon points="64,12 10,106 56,106" fill="#2980B9" />
        <polygon points="10,106 118,106 64,59" fill="#E74C3C" opacity="0.85" />
      </svg>
    )
  }

  // 24. Emacs & Org Mode
  if (norm.includes('emacs') || norm.includes('org')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <circle cx="64" cy="64" r="56" fill="#7F5AB6" />
        <path
          fill="#FFFFFF"
          d="M44 40c0-10 14-16 26-10 14 7 10 26-2 32-10 5-18 15-18 26 0 12 12 18 24 12 6-3 8-10 5-16l6-3c4 9 1 19-8 23-16 8-33 0-33-16 0-14 10-25 21-30 11-5 14-17 5-22-9-5-18 0-19 8l-7-4z"
        />
      </svg>
    )
  }

  // 25. Blender (Official logo)
  if (norm.includes('blender')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <circle cx="64" cy="64" r="56" fill="#EA7600" />
        <circle cx="64" cy="64" r="24" fill="#FFFFFF" />
        <circle cx="64" cy="64" r="14" fill="#225796" />
        <path d="M64 16v24M16 64h24M96 40l18-18" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
      </svg>
    )
  }

  // 26. Markdown & Technical Documentation
  if (norm.includes('markdown') || norm.includes('documentation')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <rect x="10" y="24" width="108" height="80" rx="12" fill="#080D1A" stroke="#38BDF8" strokeWidth="6" />
        <path
          fill="#FFFFFF"
          d="M26 84V44h12l10 14 10-14h12v40H58V58l-10 14-10-14v26H26zm56-20h10V44h12v20h10l-16 20-16-20z"
        />
      </svg>
    )
  }

  // 27. LaTeX
  if (norm.includes('latex')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <rect width="128" height="128" rx="20" fill="#008080" />
        <text x="64" y="78" fill="#FFFFFF" fontFamily="serif" fontWeight="900" fontSize="32" textAnchor="middle">
          L&#7424;T&#408;X
        </text>
      </svg>
    )
  }

  // 28. Prometheus / Grafana / Monitoring
  if (norm.includes('prometheus') || norm.includes('grafana') || norm.includes('monitoring')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <circle cx="64" cy="64" r="56" fill="#F46800" />
        <path
          fill="#FFFFFF"
          d="M64 26c-18 24-4 44-4 44s-14-6-14-22c-10 12-12 28-6 40 8 16 28 22 44 14 16-8 22-28 14-44-6-12-18-20-34-32z"
        />
      </svg>
    )
  }

  // Fallback: Futuristic Universal Supercomputing Tech Glyph
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#00F2FE"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0 }}
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}
