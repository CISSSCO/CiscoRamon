import * as THREE from 'three'

export const ProceduralMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false, // ✅ CRITICAL FIX
  depthTest: true,

  uniforms: {
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color('#ffffff') },
    uColorB: { value: new THREE.Color('#4f6bff') }
  },

  vertexShader: `
    uniform float uTime;

    varying vec3 vNormal;
    varying float vDist;

    float hash(vec3 p) {
      return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
    }

    float noise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);

      float n = mix(
        mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
            mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
            mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
        f.z
      );
      return n;
    }

    float fbm(vec3 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vNormal = normal;

      vec3 pos = position;
      float n = fbm(pos * 1.2 + uTime * 0.4);
      pos += normal * n * 0.6;

      vDist = length(pos);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,

  fragmentShader: `
    uniform vec3 uColorA;
    uniform vec3 uColorB;

    varying vec3 vNormal;
    varying float vDist;

    void main() {
      float fresnel = pow(
        1.0 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)),
        3.0
      );

      vec3 color = mix(uColorA, uColorB, vDist * 0.15);
      color += fresnel * 0.8;

      gl_FragColor = vec4(color, 1.0);
    }
  `
})
