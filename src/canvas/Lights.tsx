export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow
      />

      <directionalLight
        position={[-4, -2, -3]}
        intensity={0.6}
        color="#6b7cff"
      />
    </>
  )
}
