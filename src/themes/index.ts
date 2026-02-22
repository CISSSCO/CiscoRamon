import OrbScene from './orb/OrbScene'
import CubeScene from './cube/CubeScene'
import ParticlesScene from './particles/ParticlesScene'

export const themeRegistry = {
  orb: OrbScene,
  cube: CubeScene,
  particles: ParticlesScene,
}

export type ThemeKey = keyof typeof themeRegistry
