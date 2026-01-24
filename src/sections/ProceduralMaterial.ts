import * as THREE from 'three'

export const ProceduralMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#4f6bff') }
  },
  vertexShader: `
    uniform float uTime;
    varying vec3 vNormal;
    void main() {
      vNormal = normal;
      vec3 pos = position + normal * sin(uTime + position.y * 3.0) * 0.2;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying vec3 vNormal;
    void main() {
      float light = dot(normalize(vNormal), vec3(0.0, 0.0, 1.0));
      vec3 color = mix(uColor * 0.6, vec3(1.0), light);
      gl_FragColor = vec4(color, 1.0);
    }
  `
})
