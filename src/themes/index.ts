import OrbScene from './orb/OrbScene'
import CubeScene from './cube/CubeScene'

export const themeRegistry = {
  orb: OrbScene,
  cube: CubeScene,
}

export type ThemeKey = keyof typeof themeRegistry
