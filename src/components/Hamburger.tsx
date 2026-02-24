export default function Hamburger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 50,
        width: 38,
        height: 38,
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.15)',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <div style={{ width: 18 }}>
        <div style={{ height: 2, background: 'white', marginBottom: 4 }} />
        <div style={{ height: 2, background: 'white', marginBottom: 4 }} />
        <div style={{ height: 2, background: 'white' }} />
      </div>
    </button>
  )
}
