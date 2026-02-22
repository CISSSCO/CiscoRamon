import { useTheme } from '../app/ThemeContext'

export default function ThemeSelector() {
  const { model, setModel } = useTheme()

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 10,
      background: 'rgba(0,0,0,0.6)',
      padding: '10px 15px',
      borderRadius: 8,
      color: 'white'
    }}>
      <div style={{ marginBottom: 8 }}>3D Model</div>

      <button onClick={() => setModel('orb')}>
        Orb
      </button>

      <button
        style={{ marginLeft: 8 }}
        onClick={() => setModel('cube')}
      >
        Cube
      </button>
    </div>
  )
}
