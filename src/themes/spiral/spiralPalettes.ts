export type VortexPalette = {
  name: string
  core: string
  outer: string
}

export const vortexPalettes: Record<string, VortexPalette> = {

  electricBlue: {
    name: 'Electric Blue',
    core: '#00e5ff',
    outer: '#1e90ff'
  },

  cyberPurple: {
    name: 'Cyber Purple',
    core: '#8b5cf6',
    outer: '#ff4fd8'
  },

  galaxy: {
    name: 'Galaxy',
    core: '#4f46e5',
    outer: '#db2777'
  },

  matrix: {
    name: 'Matrix',
    core: '#00ff41',
    outer: '#008f11'
  },

  fire: {
    name: 'Fire',
    core: '#ff6b35',
    outer: '#ff006e'
  }

}
