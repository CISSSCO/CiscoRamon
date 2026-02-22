import * as THREE from 'three'

export type ParticlePalette = {
  name: string
  colors: string[]
}

export const particlePalettes: Record<string, ParticlePalette> = {

  /* =========================
     CYBERPUNK
  ========================== */
  cyberpunk: {
    name: 'Cyberpunk',
    colors: [
      '#00e5ff',
      '#ff4fd8',
      '#8b5cf6',
      '#4f6bdf',
      '#2dd4bf',
    ]
  },

  /* =========================
     SYNTHWAVE
  ========================== */
  synthwave: {
    name: 'Synthwave',
    colors: [
      '#ff71ce',
      '#01cdfe',
      '#05ffa1',
      '#b967ff',
      '#fffb96'
    ]
  },

  /* =========================
     NORD (Cool Arctic)
  ========================== */
  nord: {
    name: 'Nord',
    colors: [
      '#88c0d0',
      '#81a1c1',
      '#5e81ac',
      '#8fbcbb',
      '#b48ead'
    ]
  },

  /* =========================
     GOTHAM (Muted Urban Blues)
  ========================== */
  gotham: {
    name: 'Gotham',
    colors: [
      '#1f2937',
      '#334155',
      '#475569',
      '#64748b',
      '#94a3b8'
    ]
  },

  /* =========================
     HACKER GREENS (Matrix)
  ========================== */
  matrix: {
    name: 'Matrix',
    colors: [
      '#00ff41',
      '#008f11',
      '#00ff9f',
      '#39ff14',
      '#00cc66'
    ]
  },

  /* =========================
     GRUVBOX (Warm Retro)
  ========================== */
  gruvbox: {
    name: 'Gruvbox',
    colors: [
      '#fabd2f',
      '#fb4934',
      '#b8bb26',
      '#83a598',
      '#d3869b'
    ]
  },

  /* =========================
     AFTERGLOW (Terminal Theme)
  ========================== */
  afterglow: {
    name: 'Afterglow',
    colors: [
      '#e5c07b',
      '#98c379',
      '#61afef',
      '#c678dd',
      '#e06c75'
    ]
  },

  /* =========================
     WHITEBOX (Soft Glass UI)
  ========================== */
  whitebox: {
    name: 'Whitebox',
    colors: [
      '#ffffff',
      '#f1f5f9',
      '#e2e8f0',
      '#cbd5e1',
      '#94a3b8'
    ]
  },

  /* =========================
     OCEAN BLUES
  ========================== */
  blues: {
    name: 'Ocean Blues',
    colors: [
      '#0ea5e9',
      '#0284c7',
      '#0369a1',
      '#38bdf8',
      '#7dd3fc'
    ]
  },

  /* =========================
     SPACE GALAXY
  ========================== */
  galaxy: {
    name: 'Galaxy',
    colors: [
      '#6d28d9',
      '#9333ea',
      '#db2777',
      '#0ea5e9',
      '#22d3ee'
    ]
  },

  /* =========================
     SUNSET
  ========================== */
  sun: {
    name: 'Sunset',
    colors: [
      '#ff6b35',
      '#ff9f1c',
      '#ffba08',
      '#f72585',
      '#b5179e'
    ]
  },

  /* =========================
     MARS
  ========================== */
  mars: {
    name: 'Mars',
    colors: [
      '#9e2a2b',
      '#540b0e',
      '#ba181b',
      '#e5383b',
      '#f77f00'
    ]
  },

  /* =========================
     VOLCANO
  ========================== */
  volcano: {
    name: 'Volcano',
    colors: [
      '#ff3c38',
      '#ff6f00',
      '#ff8c42',
      '#8b0000',
      '#ffb703'
    ]
  },

  /* =========================
     NATURE EARTH
  ========================== */
  earth: {
    name: 'Earth',
    colors: [
      '#386641',
      '#6a994e',
      '#a7c957',
      '#bc6c25',
      '#dda15e'
    ]
  },

  /* =========================
     PINK DREAM
  ========================== */
  pink: {
    name: 'Pink Dream',
    colors: [
      '#ffafcc',
      '#ffc8dd',
      '#ff8fab',
      '#f15bb5',
      '#feeafa'
    ]
  },

  /* =========================
     ICE
  ========================== */
  ice: {
    name: 'Ice',
    colors: [
      '#e0fbfc',
      '#c2dfe3',
      '#9db4c0',
      '#5c6b73',
      '#253237'
    ]
  }
}
