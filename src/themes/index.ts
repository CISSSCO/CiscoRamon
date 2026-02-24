import HeroOrb from './orb/OrbScene'
import HeroCube from './cube/CubeScene'
import ParticlesScene from './particles/ParticlesScene'
import HeroSpiral from './spiral/HeroSpiral'

export const themeRegistry = {
  orb: HeroOrb,
  cube: HeroCube,
  particles: ParticlesScene,
  spiral: HeroSpiral,
  none: () => null
}

export type ThemeKey = keyof typeof themeRegistry
