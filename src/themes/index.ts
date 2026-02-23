import HeroOrb from './orb/OrbScene'
import HeroCube from './cube/CubeScene'
import ParticlesScene from './particles/ParticlesScene'
import HeroPortal from './portal/HeroPortal'

export const themeRegistry = {
  orb: HeroOrb,
  cube: HeroCube,
  particles: ParticlesScene,
  portal: HeroPortal
}

export type ThemeKey = keyof typeof themeRegistry
