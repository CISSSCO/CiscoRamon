import { useTheme } from '../app/ThemeContext'
import { themeRegistry } from '../themes'

export default function ThemeDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { model, setModel } = useTheme()

  if (!open) return null

  return (
    <>
      {/* Backdrop click area */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
        }}
      />

      {/* Floating Panel */}
      <div
        style={{
          position: 'fixed',
          top: 80,
          right: 24,
          width: 260,
          padding: 20,
          borderRadius: 16,
          zIndex: 45,

          background: 'rgba(15,15,20,0.6)',
          backdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          color: 'white',
        }}
      >
        <h4 style={{ marginBottom: 16 }}>Theme</h4>

        {Object.keys(themeRegistry).map(key => (
          <div
            key={key}
            onClick={() => {
              setModel(key as any)
              onClose()
            }}
            style={{
              padding: '10px 14px',
              marginBottom: 8,
              borderRadius: 10,
              cursor: 'pointer',
              background:
                model === key
                  ? 'rgba(255,255,255,0.08)'
                  : 'transparent',
              transition: 'all 0.2s ease',
            }}
          >
            {key.toUpperCase()}
          </div>
        ))}
      </div>
    </>
  )
}
