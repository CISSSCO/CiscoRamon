import { useTheme } from '../app/ThemeContext'
import { themeRegistry } from '../themes'
import { particlePalettes } from '../themes/particles/particlePalettes'
import { vortexPalettes } from '../themes/spiral/spiralPalettes'

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
    randomizeParticles,

    spiralPalette,
    setSpiralPalette,
    spiralSettings,
    setSpiralSettings,

    cubeSettings,
    setCubeSettings,
    randomizeCube,

    /* ✅ BACKGROUND */
    backgroundSettings,
    setBackgroundSettings
  } = useTheme()

  if (!open) return null

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 40 }}
      />

      <div
        style={{
          position: 'fixed',
          top: 80,
          right: 24,
          width: 320,
          maxHeight: '75vh',
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

        {/* ================= SCENE ================= */}
        <h4 style={{ marginBottom: 18 }}>3D Scene</h4>

        {/* Existing scenes */}
        {Object.keys(themeRegistry)
          .filter(key => key !== 'none')
          .map(key => (
          <div
            key={key}
            onClick={() => setModel(key as any)}
            style={{
              padding: '10px 14px',
              marginBottom: 8,
              borderRadius: 12,
              cursor: 'pointer',
              background:
                model === key
                  ? 'rgba(255,255,255,0.08)'
                  : 'transparent',
            }}
          >
            {key.toUpperCase()}
          </div>
        ))}

        {/* ✅ NONE SCENE */}
        <div
          onClick={() => setModel('none')}
          style={{
            padding: '10px 14px',
            marginBottom: 8,
            borderRadius: 12,
            cursor: 'pointer',
            background:
              model === 'none'
                ? 'rgba(255,255,255,0.08)'
                : 'transparent',
          }}
        >
          BACKGROUND
        </div>

        {/* ================= CUBE ================= */}
        {model === 'cube' && (() => {

          const cubeControls: {
            label: string
            key: keyof typeof cubeSettings
            min: number
            max: number
            step: number
          }[] = [
            { label: 'Dimension', key: 'dimension', min: 2, max: 10, step: 1 },
            { label: 'Cubie Size', key: 'cubieSize', min: 0.4, max: 1.5, step: 0.1 },
            { label: 'Gap', key: 'gap', min: 0.01, max: 0.2, step: 0.01 },
            { label: 'Smoothness', key: 'smoothness', min: 1, max: 10, step: 1 },
          ]

          return (
            <>
              <h4 style={{ marginTop: 24 }}>Cube Settings</h4>

              {cubeControls.map(control => (
                <div key={control.key} style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12 }}>
                    {control.label}: {cubeSettings[control.key]}
                  </label>

                  <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={cubeSettings[control.key]}
                    onChange={e =>
                      setCubeSettings({
                        [control.key]:
                          control.step === 1
                            ? parseInt(e.target.value)
                            : parseFloat(e.target.value)
                      })
                    }
                    style={{ width: '100%' }}
                  />
                </div>
              ))}

              <button
                onClick={randomizeCube}
                style={buttonStyle}
              >
                Randomize Cube
              </button>
            </>
          )
        })()}

        {/* ================= PARTICLES ================= */}
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
              <option value="gravity">Gravity</option>
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
              style={buttonStyle}
            >
              Randomize All
            </button>

            <h4 style={{ marginTop: 20 }}>Particle Controls</h4>

        {(() => {

          const particleControls: {
            label: string
            key: keyof typeof particleSettings
            min: number
            max: number
            step?: number
          }[] = [
            { label: 'Count', key: 'count', min: 10, max: 150 },
            { label: 'Speed', key: 'speed', min: 10, max: 150 },
            { label: 'Size', key: 'size', min: 0.2, max: 2, step: 0.1 },
            { label: 'Softness', key: 'softness', min: 0, max: 0.9, step: 0.05 },
            { label: 'Bounds', key: 'bounds', min: 6, max: 25 }
          ]

          return particleControls.map(control => (
            <Slider
              key={control.key}
              label={control.label}
              value={particleSettings[control.key]}
              min={control.min}
              max={control.max}
              step={control.step || 1}
              onChange={(v: number) =>
                setParticleSettings({
                  [control.key]: v
                })
              }
            />
          ))
        })()}
            {/* PARTICLE PALETTE */}
            <h4 style={{ marginTop: 24 }}>Particle Palette</h4>

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
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{palette.name}</span>
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

        {/* ================= PORTAL ================= */}
        {model === 'spiral' && (
          <>
            <h4 style={{ marginTop: 24 }}>Spiral Palette</h4>

            {Object.entries(vortexPalettes).map(
              ([key, palette]) => (
                <div
                  key={key}
                  onClick={() => setSpiralPalette(key)}
                  style={{
                    padding: '8px 12px',
                    marginBottom: 6,
                    borderRadius: 10,
                    cursor: 'pointer',
                    background:
                      spiralPalette === key
                        ? 'rgba(255,255,255,0.08)'
                        : 'transparent',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{palette.name}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <div style={dot(palette.core)} />
                    <div style={dot(palette.outer)} />
                  </div>
                </div>
              )
            )}

            <h4 style={{ marginTop: 20 }}>Spiral Controls</h4>

            <Slider
              label="Particle Size"
              value={spiralSettings.particleSize}
              min={0.005}
              max={0.5}
              step={0.005}
              onChange={(v: number) =>
                setSpiralSettings({ particleSize: v })
              }
            />

            <Slider
              label="Spiral"
              value={spiralSettings.spiralTightness}
              min={0.05}
              max={0.4}
              step={0.01}
              onChange={(v: number) =>
                setSpiralSettings({ spiralTightness: v })
              }
            />

            <Slider
              label="Zoom"
              value={spiralSettings.zoomStrength}
              min={1}
              max={6}
              step={0.1}
              onChange={(v: number) =>
                setSpiralSettings({ zoomStrength: v })
              }
            />
            <Slider
              label="Rings"
              value={spiralSettings.rings}
              min={20}
              max={200}
              step={10}
              onChange={(v: number) =>
                setSpiralSettings({ rings: v })
              }
            />

            <Slider
              label="Points Per Ring"
              value={spiralSettings.pointsPerRing}
              min={20}
              max={200}
              step={10}
              onChange={(v: number) =>
                setSpiralSettings({ pointsPerRing: v })
              }
            />

            <Slider
              label="Depth Step"
              value={spiralSettings.depthStep}
              min={0.1}
              max={1}
              step={0.05}
              onChange={(v: number) =>
                setSpiralSettings({ depthStep: v })
              }
            />

            <Slider
              label="Rotation Speed"
              value={spiralSettings.rotationSpeed}
              min={0}
              max={2}
              step={0.05}
              onChange={(v: number) =>
                setSpiralSettings({ rotationSpeed: v })
              }
            />

            <Slider
              label="Hollow Size"
              value={spiralSettings.hollowSize}
              min={0.5}
              max={4}
              step={0.1}
              onChange={(v: number) =>
                setSpiralSettings({ hollowSize: v })
              }
            />

            <Slider
              label="Wave Strength"
              value={spiralSettings.waveStrength}
              min={0}
              max={2}
              step={0.05}
              onChange={(v: number) =>
                setSpiralSettings({ waveStrength: v })
              }
            />
            <button
              onClick={() =>
                setSpiralSettings({
                  particleSize: 0.005 + Math.random() * 0.095,

                  rings: 40 + Math.floor(Math.random() * 160),

                  pointsPerRing: 40 + Math.floor(Math.random() * 160),

                  depthStep: 0.1 + Math.random() * 0.9,

                  spiralTightness: 0.05 + Math.random() * 0.35,

                  rotationSpeed: Math.random() * 2,

                  zoomStrength: 1 + Math.random() * 5,

                  hollowSize: 0.5 + Math.random() * 3.5,

                  waveStrength: Math.random() * 2
                })
              }
              style={buttonStyle}
            >
              Randomize Spiral
            </button>
          </>
        )}


    {/* ================= BACKGROUND ================= */}
    {model === 'none' && (
      <>
        <h4 style={{ marginTop: 28 }}>Background</h4>

        <select
          value={backgroundSettings.mode}
          onChange={e =>
            setBackgroundSettings({ mode: e.target.value as any })
          }
          style={{ width: '100%', marginBottom: 12 }}
        >
          <option value="solid">Solid</option>
          <option value="gradient">Gradient</option>
          <option value="image">Image</option>
        </select>

        {/* ================= SOLID ================= */}
        {backgroundSettings.mode === 'solid' && (
          <input
            type="color"
            value={backgroundSettings.solidColor}
            onChange={e =>
              setBackgroundSettings({ solidColor: e.target.value })
            }
            style={{ width: '100%' }}
          />
        )}

        {/* ================= GRADIENT ================= */}
        {backgroundSettings.mode === 'gradient' && (
          <>
            <select
              value={backgroundSettings.gradientType}
              onChange={e =>
                setBackgroundSettings({
                  gradientType: e.target.value as any
                })
              }
              style={{ width: '100%', marginBottom: 8 }}
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
              <option value="mesh">Mesh</option>
            </select>

            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="color"
                value={backgroundSettings.gradientFrom}
                onChange={e =>
                  setBackgroundSettings({ gradientFrom: e.target.value })
                }
                style={{ width: '100%' }}
              />

              <input
                type="color"
                value={backgroundSettings.gradientTo}
                onChange={e =>
                  setBackgroundSettings({ gradientTo: e.target.value })
                }
                style={{ width: '100%' }}
              />
            </div>
          </>
        )}

        {/* ================= IMAGE ================= */}
        {backgroundSettings.mode === 'image' && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0]
                if (!file) return

                const reader = new FileReader()
                reader.onload = () =>
                  setBackgroundSettings({ image: reader.result as string })

                reader.readAsDataURL(file)
              }}
              style={{ marginBottom: 8 }}
            />

            <select
              value={backgroundSettings.imageFit}
              onChange={e =>
                setBackgroundSettings({ imageFit: e.target.value as any })
              }
              style={{ width: '100%', marginBottom: 8 }}
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="auto">Auto</option>
            </select>

            <Slider
              label="Zoom"
              value={backgroundSettings.imageZoom}
              min={0.5}
              max={3}
              step={0.1}
              onChange={(v: number) =>
                setBackgroundSettings({ imageZoom: v })
              }
            />
          </>
        )}
      </>
    )}


      </div>
    </>
  )
}

/* ================= HELPERS ================= */

const buttonStyle = {
  marginTop: 16,
  padding: '10px',
  width: '100%',
  borderRadius: 10,
  background: 'rgba(255,255,255,0.08)',
  color: 'white',
  cursor: 'pointer'
}

function dot(color: string) {
  return {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: color
  }
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange
}: any) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12 }}>
        {label}: {value}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e =>
          onChange(parseFloat(e.target.value))
        }
        style={{ width: '100%' }}
      />
    </div>
  )
}
