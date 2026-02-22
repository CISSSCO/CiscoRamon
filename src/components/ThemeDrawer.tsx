import { useTheme } from '../app/ThemeContext'
import { themeRegistry } from '../themes'
import { particlePalettes } from '../themes/particles/particlePalettes'

export default function ThemeDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
const {
  model,
  setModel,
  particlePalette,
  setParticlePalette,
  particleSettings,
  setParticleSettings,
  randomizeParticles
} = useTheme()

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
        }}
      />

      {/* Drawer */}
        <div
          style={{
            position: 'fixed',
            top: 80,
            right: 24,
            width: 300,
            maxHeight: '70vh',
            overflowY: 'auto',
            padding: 22,
            borderRadius: 18,
            zIndex: 45,
            background: 'rgba(15,15,20,0.65)',
            backdropFilter: 'blur(22px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 15px 50px rgba(0,0,0,0.6)',
            color: 'white',
          }}
        >
        <h4 style={{ marginBottom: 18, fontWeight: 500 }}>
          3D Scene
        </h4>

        {/* MODEL SELECTOR */}
        {Object.keys(themeRegistry).map(key => (
          <div
            key={key}
            onClick={() => {
              setModel(key as any)
            }}
            style={{
              padding: '10px 14px',
              marginBottom: 8,
              borderRadius: 12,
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

        {/* Particle Controls*/}
        {model === 'particles' && (
          <>
        <h4 style={{ marginTop: 20 }}>Motion Type</h4>

        <select
          value={particleSettings.motion}
          onChange={e =>
            setParticleSettings({
              motion: e.target.value as any
            })
          }
        >
          <option value="bounce">Bounce</option>
          <option value="float">Float</option>
          <option value="gravity">Gravity (Accumulate)</option>
          <option value="swirl">Swirl</option>
          <option value="rain">Rain</option>
          <option value="orbit">Orbit</option>
          <option value="wave">Wave</option>
          <option value="spiralRise">Spiral Rise</option>
          <option value="noiseDrift">Noise Drift</option>
        </select>

        <h4>Parallax</h4>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={particleSettings.parallax}
          onChange={e =>
            setParticleSettings({
              parallax: parseFloat(e.target.value)
            })
          }
        />

        <button
          onClick={randomizeParticles}
          style={{
            marginTop: 16,
            padding: '10px',
            width: '100%',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.08)',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Randomize All
        </button>
            <h4 style={{ marginTop: 20 }}>Particle Controls</h4>

            {[
              { label: 'Count', key: 'count', min: 10, max: 150 },
              { label: 'Speed', key: 'speed', min: 10, max: 150 },
              { label: 'Size', key: 'size', min: 0.2, max: 2, step: 0.1 },
              { label: 'Softness', key: 'softness', min: 0, max: 0.9, step: 0.05 },
              { label: 'Bounds', key: 'bounds', min: 6, max: 25 }
            ].map(control => (
              <div key={control.key} style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12 }}>
                  {control.label}: {particleSettings[control.key]}
                </label>

                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step || 1}
                  value={particleSettings[control.key]}
                  onChange={e =>
                    setParticleSettings({
                      [control.key]:
                        control.step
                          ? parseFloat(e.target.value)
                          : parseInt(e.target.value)
                    })
                  }
                  style={{ width: '100%' }}
                />
              </div>
            ))}
          </>
        )}
        {/* PARTICLE PALETTES */}
        {model === 'particles' && (
          <>
            <h4
              style={{
                marginTop: 24,
                marginBottom: 12,
                fontWeight: 500,
                fontSize: 14,
                opacity: 0.8
              }}
            >
              Particle Palette
            </h4>

            {Object.entries(particlePalettes).map(
              ([key, palette]) => (
                <div
                  key={key}
                  onClick={() => setParticlePalette(key)}
                  style={{
                    padding: '8px 12px',
                    marginBottom: 6,
                    borderRadius: 10,
                    cursor: 'pointer',
                    background:
                      particlePalette === key
                        ? 'rgba(255,255,255,0.08)'
                        : 'transparent',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{palette.name}</span>

                  {/* color preview dots */}
                  <div style={{ display: 'flex', gap: 4 }}>
                    {palette.colors.slice(0, 4).map((c, i) => (
                      <div
                        key={i}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: c
                        }}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>
    </>
  )
}
