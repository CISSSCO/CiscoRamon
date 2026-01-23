
import * as THREE from 'three'

export const ProceduralMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color('#ffffff') },
    uColorB: { value: new THREE.Color('#4f6bff') }
  },

  vertexShader: `
    uniform float uTime;

    varying vec3 vNormal;
    varying float vElevation;

    // Simple hash noise (cheap & stable)
    float noise(vec3 p) {
      return sin(p.x) * sin(p.y) * sin(p.z);
    }

    void main() {
      vNormal = normal;

      vec3 pos = position;

      float n = noise(pos * 1.5 + uTime * 0.8);
      float elevation = n * 0.4;

      pos += normal * elevation;
      vElevation = elevation;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,

  fragmentShader: `
    uniform vec3 uColorA;
    uniform vec3 uColorB;

    varying vec3 vNormal;
    varying float vElevation;

    void main() {
      float intensity = dot(normalize(vNormal), vec3(0.0, 0.0, 1.0));
      intensity = smoothstep(0.0, 1.0, intensity);

      float mixStrength = vElevation * 2.0 + 0.5;
      vec3 color = mix(uColorA, uColorB, mixStrength);

      gl_FragColor = vec4(color * intensity, 1.0);
    }
  `
})
