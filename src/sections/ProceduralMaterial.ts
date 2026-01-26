import * as THREE from 'three'

export const ProceduralMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,

  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#00e5ff') }
  },

  vertexShader: `
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vWorldPos;

    void main() {
      vNormal = normalize(normalMatrix * normal);

      vec3 pos = position;
      float wave = sin(uTime * 0.8 + position.y * 3.0) * 0.18;
      pos += normal * wave;

      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vWorldPos = worldPos.xyz;

      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,

  fragmentShader: `
    uniform vec3 uColor;
    uniform float uTime;

    varying vec3 vNormal;
    varying vec3 vWorldPos;

    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPos);
      float fresnel = pow(1.0 - dot(vNormal, viewDir), 2.5);

      // 🌈 Base color (slightly darkened)
      vec3 base = uColor * 0.55;

      // ✨ Rim glow (edge only)
      vec3 rim = uColor * fresnel * 1.2;

      // 📺 Scanlines (very subtle)
      float scan = sin(gl_FragCoord.y * 0.8) * 0.03;

      // 🌫️ Soft noise
      float n = noise(gl_FragCoord.xy * 0.5 + uTime * 10.0) * 0.04;

      vec3 color = base + rim + scan + n;

      gl_FragColor = vec4(color, 1.0);
    }
  `
})
