import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

interface FloodSim3DProps {
  activeRunId?: string;
}

const PI = Math.PI;

// ─── Gerstner Wave ────────────────────────────────────────────────────────────
// Physically accurate ocean wave: gives rolling, trochoidal shape
function gerstnerWave(
  pos: THREE.Vector2,
  dir: THREE.Vector2,
  amplitude: number,
  wavelength: number,
  steepness: number,
  time: number
): THREE.Vector3 {
  const k = (2 * PI) / wavelength;
  const c = Math.sqrt(9.81 / k);
  const f = k * (dir.x * pos.x + dir.y * pos.y - c * time);
  const Q = steepness / (k * amplitude);
  return new THREE.Vector3(
    Q * amplitude * dir.x * Math.cos(f),
    amplitude * Math.sin(f),
    Q * amplitude * dir.y * Math.cos(f)
  );
}

export const FloodSim3D: React.FC<FloodSim3DProps> = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    progress: 0,
    isPlaying: false,
    camMode: 'orbital' as 'orbital' | 'flythrough' | 'top',
    isDragging: false,
    lastMouse: { x: 0, y: 0 },
    camTheta: -0.3,
    camPhi: 0.5,
    camRadius: 80,
    camTarget: new THREE.Vector3(0, 4, 10),
    flyCamT: 0,
  });
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waterDepth, setWaterDepth] = useState(0);
  const [camMode, setCamMode] = useState<'orbital' | 'flythrough' | 'top'>('orbital');
  const animRef = useRef<number>(0);

  // Sync state to ref
  useEffect(() => { stateRef.current.isPlaying = isPlaying; }, [isPlaying]);
  useEffect(() => { stateRef.current.camMode = camMode; }, [camMode]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const W = container.clientWidth || 800;
    const H = container.clientHeight || 600;

    // ─── Renderer ──────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    // ─── Scene ────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xbcd9ea, 0.012);

    // ─── Camera ───────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 2000);
    camera.position.set(0, 40, 80);
    camera.lookAt(0, 0, 0);

    // ─── Sky (gradient dome) ──────────────────────────────────────
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        topColor: { value: new THREE.Color(0x0a4f8a) },
        horizonColor: { value: new THREE.Color(0x7cb8d9) },
        bottomColor: { value: new THREE.Color(0xd8eef8) },
      },
      vertexShader: `
        varying vec3 vPos;
        void main() { vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
      fragmentShader: `
        uniform vec3 topColor, horizonColor, bottomColor;
        varying vec3 vPos;
        void main() {
          float h = normalize(vPos).y;
          vec3 col = h > 0.0 ? mix(horizonColor, topColor, pow(h, 0.5)) : mix(horizonColor, bottomColor, -h * 3.0);
          gl_FragColor = vec4(col, 1.0);
        }`,
    });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(800, 20, 10), skyMat));

    // ─── Lighting ─────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xd8eef8, 0.55));
    const sun = new THREE.DirectionalLight(0xfff5cc, 3.0);
    sun.position.set(80, 120, 60);
    sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 500;
    sun.shadow.camera.left = -120; sun.shadow.camera.right = 120;
    sun.shadow.camera.top = 120; sun.shadow.camera.bottom = -120;
    sun.shadow.bias = -0.0003;
    scene.add(sun);
    scene.add(new THREE.HemisphereLight(0x4a90d9, 0x8B7355, 0.7));

    // ─── Terrain ──────────────────────────────────────────────────
    const TG = 220;
    const terrainGeo = new THREE.PlaneGeometry(160, 200, TG, TG);
    terrainGeo.rotateX(-PI / 2);
    const tPos = terrainGeo.attributes.position as THREE.BufferAttribute;
    const terrainHeights: number[] = [];

    const hash = (n: number) => {
      let x = Math.sin(n) * 43758.5453123;
      return x - Math.floor(x);
    };
    const noise2 = (x: number, y: number) => {
      const ix = Math.floor(x), iy = Math.floor(y);
      const fx = x - ix, fy = y - iy;
      const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
      const a = hash(ix + iy * 57);
      const b = hash(ix + 1 + iy * 57);
      const c = hash(ix + (iy + 1) * 57);
      const d = hash(ix + 1 + (iy + 1) * 57);
      return a + (b - a) * ux + (c - a) * uy + (d - b - c + a) * ux * uy;
    };
    const fbm = (x: number, y: number, oct: number) => {
      let v = 0, amp = 0.5, freq = 1;
      for (let i = 0; i < oct; i++) {
        v += amp * noise2(x * freq, y * freq);
        amp *= 0.5; freq *= 2.1;
      }
      return v;
    };

    for (let i = 0; i <= TG; i++) {
      for (let j = 0; j <= TG; j++) {
        const idx = i * (TG + 1) + j;
        const px = tPos.getX(idx); // -80..80
        const pz = tPos.getZ(idx); // -100..100

        // Gorge walls (canyon sides)
        const gorgeWidth = pz < 0 ? 12 : 14 + pz * 0.18;
        const wallDist = Math.max(0, Math.abs(px) - gorgeWidth);
        const wallH = wallDist * wallDist * 0.085 + wallDist * 0.8;

        // Base slope: reservoir (back z<0) elevated, city (front z>0) low
        const baseSlope = Math.max(0, -pz * 0.06);

        // Reservoir: bowl shape
        const inRes = pz < -10;
        const resH = inRes ? Math.max(0, 2 - (pz + 10) * 0.08 - Math.abs(px) * 0.04) : 0;

        // City floor (downstream): very flat, slight channels
        const cityChannels = pz > 20 ? Math.abs(Math.sin(px * 0.3)) * 0.6 : 0;

        // Combine
        let h = wallH + baseSlope + resH + cityChannels;
        h += fbm(px * 0.08 + 3.1, pz * 0.07 + 1.4, 6) * 4.5;

        // Clamp reservoir and city floor
        if (inRes) h = Math.min(h, 3.5);
        if (pz > 40) h = Math.max(0, Math.min(h, 1.5 + fbm(px * 0.1, pz * 0.1, 3) * 2));

        h = Math.max(0, h);
        tPos.setY(idx, h);
        terrainHeights.push(h);
      }
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.ShaderMaterial({
      uniforms: { waterLevel: { value: 0.0 }, sunDir: { value: new THREE.Vector3(0.55, 0.78, 0.33) } },
      vertexShader: `
        varying float vH;
        varying vec3 vN, vWP;
        void main() {
          vH = position.y;
          vN = normalize(normalMatrix * normal);
          vWP = (modelMatrix * vec4(position,1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }`,
      fragmentShader: `
        uniform float waterLevel;
        uniform vec3 sunDir;
        varying float vH;
        varying vec3 vN, vWP;
        void main() {
          vec3 rock    = vec3(0.50, 0.42, 0.30);
          vec3 earth   = vec3(0.60, 0.48, 0.30);
          vec3 grass   = vec3(0.38, 0.50, 0.22);
          vec3 cliff   = vec3(0.52, 0.48, 0.40);
          vec3 snow    = vec3(0.88, 0.87, 0.84);
          vec3 mud     = vec3(0.40, 0.33, 0.22);

          float slope = 1.0 - abs(vN.y);

          vec3 col;
          if (vH < 1.0) col = mix(rock, earth, vH);
          else if (vH < 5.0) col = mix(earth, grass, (vH-1.)/4.);
          else if (vH < 15.0) col = mix(grass, cliff, (vH-5.)/10.);
          else col = mix(cliff, snow, min((vH-15.)/8., 1.0));

          col = mix(col, cliff, slope * 0.6);

          // Wet shoreline
          float wet = smoothstep(waterLevel + 1.0, waterLevel - 0.3, vH);
          col = mix(col, mud, wet * 0.6);

          float diff = max(dot(vN, sunDir), 0.0) * 0.8 + 0.35;
          col *= diff;
          gl_FragColor = vec4(col, 1.0);
        }`,
    });

    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // ─── Dam ──────────────────────────────────────────────────────
    const damGroup = new THREE.Group();
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x8a8070, roughness: 0.8, metalness: 0.08 });
    const damBody = new THREE.Mesh(new THREE.BoxGeometry(24, 18, 5), concreteMat);
    damBody.position.set(0, 9, -10);
    damBody.castShadow = true;
    damGroup.add(damBody);
    // Top walk
    damGroup.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(26, 1.2, 2.5), concreteMat), { position: new THREE.Vector3(0, 18, -10) }));
    // Gates
    const gateMat = new THREE.MeshStandardMaterial({ color: 0x444455, metalness: 0.7, roughness: 0.3 });
    for (let g = -4; g <= 4; g += 2) {
      const gate = new THREE.Mesh(new THREE.BoxGeometry(1.6, 6, 0.5), gateMat);
      gate.position.set(g, 3, -7.4);
      damGroup.add(gate);
    }
    scene.add(damGroup);

    // ─── Static Reservoir behind dam ───────────────────────────────
    const resMat = new THREE.MeshStandardMaterial({
      color: 0x1b5e8e, roughness: 0.03, metalness: 0.12, transparent: true, opacity: 0.85
    });
    const res = new THREE.Mesh(new THREE.PlaneGeometry(50, 40), resMat);
    res.rotation.x = -PI / 2;
    res.position.set(0, 8.5, -38);
    scene.add(res);

    // ─── Cinematic WATER ──────────────────────────────────────────
    // High-resolution water mesh — covers the downstream valley
    const WGRID = 200;
    const waterGeo = new THREE.PlaneGeometry(100, 160, WGRID, WGRID);
    waterGeo.rotateX(-PI / 2);

    const waterVS = `
      #define PI 3.14159265358979

      uniform float time;
      uniform float floodProgress;      // 0-1 flood extent
      uniform float floodLevel;         // actual water height

      varying vec2 vUv;
      varying float vDepth;
      varying vec3 vWorldPos;
      varying vec3 vNormal;
      varying float vFoam;
      varying float vWaveHeight;

      // Gerstner wave
      vec3 gerstner(vec2 pos, vec2 dir, float A, float L, float S, float Q) {
        float k = 2.0 * PI / L;
        float c = sqrt(9.81 / k);
        float f = k * (dot(dir, pos) - c * time * S);
        return vec3(
          Q * A * dir.x * cos(f),
          A * sin(f),
          Q * A * dir.y * cos(f)
        );
      }

      void main() {
        vUv = uv;
        vec3 pos = position;

        // Terrain approximation: valley narrows near dam
        float dFromDam = pos.z + 10.0;
        float valleyHalf = 14.0 + dFromDam * 0.2;
        float wallH = pow(max(0.0, abs(pos.x) - valleyHalf) / 20.0, 1.5) * 30.0;
        float terrainApprox = wallH * 0.15;

        // Water surface level: starts at dam, rises then spreads
        float floodFront = floodProgress * 150.0 - 80.0;   // z position of flood front
        float inFlood = 1.0 - smoothstep(floodFront - 10.0, floodFront + 5.0, pos.z);
        float wLevel = max(terrainApprox, floodLevel * inFlood);

        pos.y = wLevel;

        // Gerstner waves — 4 wave trains flowing downstream
        float speed = 1.0 + floodProgress * 1.5;
        vec3 w1 = gerstner(pos.xz, normalize(vec2( 0.0, 1.0)), 0.35, 14.0, speed, 0.5);
        vec3 w2 = gerstner(pos.xz, normalize(vec2( 0.15, 1.0)), 0.22, 9.0, speed*1.2, 0.4);
        vec3 w3 = gerstner(pos.xz, normalize(vec2(-0.12, 1.0)), 0.18, 6.0, speed*1.4, 0.3);
        vec3 w4 = gerstner(pos.xz, normalize(vec2( 0.05, 1.0)), 0.28, 18.0, speed*0.8, 0.45);

        float nearDam = 1.0 - smoothstep(0.0, 30.0, dFromDam);
        float turbAmp = 1.0 + nearDam * 2.5;

        // Total displacement
        vec3 disp = (w1 + w2 + w3 + w4) * turbAmp * inFlood;
        pos += disp;

        // Foam at wave crests (high displacement)
        vWaveHeight = disp.y;
        float crestFoam = smoothstep(0.25, 0.65, disp.y / turbAmp) * inFlood;

        // Turbulence foam near dam
        float turbFoam = nearDam * (sin(pos.x * 2.5 + time * 4.0) * 0.5 + 0.5);

        // Flood-front foam
        float frontDist = abs(pos.z - floodFront);
        float frontFoam = smoothstep(6.0, 0.0, frontDist) * inFlood;

        vFoam = clamp(crestFoam + turbFoam * 0.6 + frontFoam * 0.8, 0.0, 1.0);
        vDepth = wLevel;
        vWorldPos = pos;

        // Approx normal from wave derivatives
        vec3 tangent = vec3(1.0, disp.x * 0.3, 0.0);
        vec3 bitangent = vec3(0.0, disp.z * 0.3, 1.0);
        vNormal = normalize(cross(bitangent, tangent));

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }`;

    const waterFS = `
      uniform float time;
      uniform float floodProgress;
      uniform vec3 sunDir;
      uniform vec3 cameraPos;

      varying vec2 vUv;
      varying float vDepth;
      varying vec3 vWorldPos;
      varying vec3 vNormal;
      varying float vFoam;
      varying float vWaveHeight;

      // Hash noise for texture detail
      float hash(vec2 p) {
        p = fract(p * vec2(234.34, 435.345));
        p += dot(p, p + 34.23);
        return fract(p.x * p.y);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
                   mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
      }
      float fbm(vec2 p) {
        float v = 0.0; float a = 0.5;
        for (int i=0;i<5;i++){v+=a*noise(p); p*=2.1; a*=0.5;}
        return v;
      }

      void main() {
        // ── Water colour by depth ──
        vec3 deepCol    = vec3(0.02, 0.12, 0.35);
        vec3 midCol     = vec3(0.08, 0.32, 0.62);
        vec3 shallowCol = vec3(0.20, 0.60, 0.80);
        vec3 turbidCol  = vec3(0.42, 0.52, 0.28); // silty near dam/front

        float df = clamp(vDepth / 9.0, 0.0, 1.0);
        vec3 baseColor = mix(shallowCol, mix(midCol, deepCol, df * df), df);

        // Near-breach turbidity
        float turbidity = smoothstep(30.0, 0.0, vWorldPos.z + 10.0);
        baseColor = mix(baseColor, turbidCol, turbidity * 0.35);

        // Flood-front turbidity
        float frontProgress = floodProgress * 150.0 - 80.0;
        float frontMix = smoothstep(8.0, 0.0, abs(vWorldPos.z - frontProgress));
        baseColor = mix(baseColor, turbidCol, frontMix * 0.5);

        // ── Fresnel reflection ──
        vec3 viewDir = normalize(cameraPos - vWorldPos);
        float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
        vec3 skyRefl = mix(vec3(0.55, 0.78, 0.90), vec3(0.05, 0.20, 0.55), fresnel);
        baseColor = mix(baseColor, skyRefl, fresnel * 0.55);

        // ── Specular sun glint ──
        vec3 reflDir = reflect(-sunDir, vNormal);
        float spec = pow(max(dot(viewDir, reflDir), 0.0), 80.0);
        float spec2 = pow(max(dot(viewDir, reflDir), 0.0), 25.0);
        baseColor += vec3(1.0, 0.95, 0.85) * spec * 0.9;
        baseColor += vec3(1.0, 0.98, 0.90) * spec2 * 0.25;

        // ── Caustic glimmers ──
        vec2 causticUV = vWorldPos.xz * 0.3 + vec2(time * 0.15, time * 0.11);
        float caustics = fbm(causticUV) * fbm(causticUV * 1.7 + 0.5);
        caustics = pow(caustics, 2.5) * 0.5;
        baseColor += vec3(0.9, 0.97, 1.0) * caustics * (1.0 - df) * 0.6;

        // ── Foam ──
        vec2 foamUV1 = vWorldPos.xz * 0.8 + vec2(time * 0.4, time * 0.22);
        vec2 foamUV2 = vWorldPos.xz * 1.4 + vec2(-time * 0.3, time * 0.5);
        float foamNoise = fbm(foamUV1) * fbm(foamUV2);
        float foamMask = smoothstep(0.45, 0.7, foamNoise) * vFoam;
        baseColor = mix(baseColor, vec3(0.95, 0.97, 1.0), foamMask * 0.9);

        // ── Flow streaks ──
        float flowStreak = pow(abs(sin(vWorldPos.x * 0.9 + fbm(vWorldPos.xz * 0.2) * 3.0)), 8.0);
        float flowFade = smoothstep(80.0, 0.0, vWorldPos.z);
        baseColor = mix(baseColor, vec3(0.88, 0.94, 0.98), flowStreak * 0.3 * flowFade);

        // ── Edge alpha (where water meets shore) ──
        float edgeFade = 1.0 - smoothstep(floodProgress * 150.0 - 80.0, floodProgress * 150.0 - 74.0, vWorldPos.z);
        float alpha = 0.88 - edgeFade * 0.5;
        alpha *= clamp(vDepth * 0.6, 0.0, 1.0);

        gl_FragColor = vec4(baseColor, alpha);
      }`;

    const waterUniforms = {
      time: { value: 0.0 },
      floodProgress: { value: 0.0 },
      floodLevel: { value: 0.0 },
      sunDir: { value: new THREE.Vector3(0.55, 0.78, 0.33).normalize() },
      cameraPos: { value: camera.position.clone() },
    };

    const waterMat = new THREE.ShaderMaterial({
      uniforms: waterUniforms,
      vertexShader: waterVS,
      fragmentShader: waterFS,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, 0, 20);
    scene.add(waterMesh);

    // ─── Mist / Spray at Breach ───────────────────────────────────
    const mistCount = 1200;
    const mistGeo = new THREE.BufferGeometry();
    const mistPos = new Float32Array(mistCount * 3);
    const mistVel = new Float32Array(mistCount * 3);
    const mistLife = new Float32Array(mistCount);
    const mistMaxLife = new Float32Array(mistCount);

    for (let i = 0; i < mistCount; i++) {
      mistLife[i] = Math.random();
      mistMaxLife[i] = 0.5 + Math.random() * 1.5;
      mistPos[i * 3] = (Math.random() - 0.5) * 14;
      mistPos[i * 3 + 1] = 4 + Math.random() * 12;
      mistPos[i * 3 + 2] = -8 + Math.random() * 6;
      mistVel[i * 3] = (Math.random() - 0.5) * 0.12;
      mistVel[i * 3 + 1] = 0.02 + Math.random() * 0.06;
      mistVel[i * 3 + 2] = 0.05 + Math.random() * 0.2;
    }
    mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPos, 3));
    const mistMat = new THREE.PointsMaterial({
      color: 0xc8e8f8, size: 0.55, transparent: true, opacity: 0.45, sizeAttenuation: true
    });
    const mist = new THREE.Points(mistGeo, mistMat);
    scene.add(mist);

    // ─── Spray droplets (heavier, near breach) ────────────────────
    const sprayCount = 400;
    const sprayGeo = new THREE.BufferGeometry();
    const sprayPos = new Float32Array(sprayCount * 3);
    const sprayVel = new Float32Array(sprayCount * 3);
    for (let i = 0; i < sprayCount; i++) {
      sprayPos[i * 3] = (Math.random() - 0.5) * 10;
      sprayPos[i * 3 + 1] = 8 + Math.random() * 10;
      sprayPos[i * 3 + 2] = -9 + Math.random() * 5;
      sprayVel[i * 3] = (Math.random() - 0.5) * 0.3;
      sprayVel[i * 3 + 1] = -(0.08 + Math.random() * 0.15);
      sprayVel[i * 3 + 2] = 0.12 + Math.random() * 0.35;
    }
    sprayGeo.setAttribute('position', new THREE.BufferAttribute(sprayPos, 3));
    const sprayMat = new THREE.PointsMaterial({ color: 0x88c8f0, size: 0.22, transparent: true, opacity: 0.8, sizeAttenuation: true });
    const spray = new THREE.Points(sprayGeo, sprayMat);
    scene.add(spray);

    // ─── Buildings ────────────────────────────────────────────────
    const bldMat = new THREE.MeshStandardMaterial({ color: 0xd4c4a0, roughness: 0.85 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.9 });
    const bldData: { mesh: THREE.Group; x: number; z: number; h: number }[] = [];

    const cityLayout = [
      { x: -22, z: 20 }, { x: -14, z: 24 }, { x: -6, z: 19 }, { x: 2, z: 23 }, { x: 10, z: 20 }, { x: 18, z: 25 }, { x: 25, z: 21 },
      { x: -25, z: 34 }, { x: -16, z: 38 }, { x: -5, z: 33 }, { x: 6, z: 37 }, { x: 16, z: 32 }, { x: 26, z: 36 },
      { x: -28, z: 50 }, { x: -10, z: 52 }, { x: 4, z: 48 }, { x: 18, z: 53 }, { x: 28, z: 50 },
      { x: -20, z: 64 }, { x: 0, z: 66 }, { x: 22, z: 62 },
    ];

    cityLayout.forEach(({ x, z }) => {
      const g = new THREE.Group();
      const bw = 2.5 + Math.random() * 2;
      const bh = 3 + Math.random() * 8;
      const bMesh = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bw * 0.9), bldMat.clone());
      bMesh.position.y = bh / 2;
      bMesh.castShadow = true;
      g.add(bMesh);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(bw * 0.75, 1.5, 4), roofMat);
      roof.position.y = bh + 0.75;
      roof.rotation.y = PI / 4;
      g.add(roof);
      g.position.set(x + (Math.random() - 0.5), 0.5, z);
      scene.add(g);
      bldData.push({ mesh: g, x, z, h: bh });
    });

    // ─── Camera controls ──────────────────────────────────────────
    const updateCamera = () => {
      const s = stateRef.current;
      if (s.camMode !== 'orbital') return;
      const { camTheta, camPhi, camRadius, camTarget } = s;
      camera.position.set(
        camTarget.x + camRadius * Math.sin(camPhi) * Math.sin(camTheta),
        camTarget.y + camRadius * Math.cos(camPhi),
        camTarget.z + camRadius * Math.sin(camPhi) * Math.cos(camTheta)
      );
      camera.lookAt(camTarget);
    };
    updateCamera();

    const onDown = (e: MouseEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.lastMouse = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => { stateRef.current.isDragging = false; };
    const onMove = (e: MouseEvent) => {
      const s = stateRef.current;
      if (!s.isDragging || s.camMode !== 'orbital') return;
      const dx = e.clientX - s.lastMouse.x;
      const dy = e.clientY - s.lastMouse.y;
      s.camTheta -= dx * 0.007;
      s.camPhi = Math.max(0.12, Math.min(1.4, s.camPhi + dy * 0.005));
      s.lastMouse = { x: e.clientX, y: e.clientY };
      updateCamera();
    };
    const onWheel = (e: WheelEvent) => {
      stateRef.current.camRadius = Math.max(15, Math.min(160, stateRef.current.camRadius + e.deltaY * 0.08));
      updateCamera();
    };

    container.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    container.addEventListener('wheel', onWheel, { passive: true });

    // ─── Animation ────────────────────────────────────────────────
    const SIM_DURATION = 15; // seconds
    let wallTime = 0;
    let lastT = performance.now();

    const flythroughWaypoints = [
      { pos: new THREE.Vector3(0, 55, 80), target: new THREE.Vector3(0, 4, 10) },
      { pos: new THREE.Vector3(35, 28, 40), target: new THREE.Vector3(0, 2, 0) },
      { pos: new THREE.Vector3(-10, 15, -5), target: new THREE.Vector3(0, 5, 30) },
      { pos: new THREE.Vector3(50, 35, 60), target: new THREE.Vector3(0, 2, 40) },
      { pos: new THREE.Vector3(0, 20, 100), target: new THREE.Vector3(0, 0, 50) },
    ];

    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      wallTime += dt;

      const s = stateRef.current;

      if (s.isPlaying) {
        s.progress = Math.min(s.progress + dt / SIM_DURATION, 1.0);
        setProgress(Math.round(s.progress * 100));
        setWaterDepth(parseFloat((s.progress * 9.5).toFixed(1)));
      }

      const p = s.progress;

      // Flood parameters
      const floodProg = Math.pow(p, 0.55);   // eased expansion speed
      const floodLvl = p < 0.05
        ? p / 0.05 * 3.0                       // initial surge
        : 3.0 + Math.pow((p - 0.05) / 0.95, 0.65) * 8.5; // progressive rise

      waterUniforms.time.value = wallTime;
      waterUniforms.floodProgress.value = floodProg;
      waterUniforms.floodLevel.value = floodLvl;
      waterUniforms.cameraPos.value.copy(camera.position);
      (terrainMat as THREE.ShaderMaterial).uniforms.waterLevel.value = floodLvl;

      // Buildings react to flood
      bldData.forEach(({ mesh, z, h }) => {
        const floodFront = floodProg * 150 - 80;
        if (z < floodFront) {
          const sub = Math.max(0, floodLvl - z * 0.02 - 0.5);
          if (sub > 0.5) {
            mesh.rotation.z = Math.sin(wallTime * 0.7 + z) * sub * 0.025;
            mesh.rotation.x = Math.sin(wallTime * 0.4) * 0.008;
          }
        }
      });

      // Spray particles
      const sprayArr = sprayGeo.attributes.position.array as Float32Array;
      const breachOpen = Math.min(p / 0.04, 1.0);
      for (let i = 0; i < sprayCount; i++) {
        sprayArr[i * 3] += sprayVel[i * 3];
        sprayArr[i * 3 + 1] += sprayVel[i * 3 + 1] - 0.003;
        sprayArr[i * 3 + 2] += sprayVel[i * 3 + 2];
        if (sprayArr[i * 3 + 1] < 0 || sprayArr[i * 3 + 2] > 8) {
          sprayArr[i * 3] = (Math.random() - 0.5) * 12 * breachOpen;
          sprayArr[i * 3 + 1] = 6 + Math.random() * 10;
          sprayArr[i * 3 + 2] = -9 + Math.random() * 4;
        }
      }
      (sprayGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      spray.visible = p > 0 && p < 0.7;

      // Mist particles
      const mistArr = mistGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < mistCount; i++) {
        mistArr[i * 3] += mistVel[i * 3] + Math.sin(wallTime + i) * 0.005;
        mistArr[i * 3 + 1] += mistVel[i * 3 + 1] * 0.5;
        mistArr[i * 3 + 2] += mistVel[i * 3 + 2];
        mistLife[i] += dt;
        if (mistLife[i] > mistMaxLife[i] || mistArr[i * 3 + 1] > 25) {
          mistLife[i] = 0;
          mistArr[i * 3] = (Math.random() - 0.5) * 14;
          mistArr[i * 3 + 1] = 4 + Math.random() * 8;
          mistArr[i * 3 + 2] = -8 + Math.random() * 6;
        }
      }
      (mistGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      mist.visible = p > 0;

      // ── Camera modes ──────────────────────────────────────────
      if (s.camMode === 'orbital' && !s.isDragging) {
        s.camTheta += 0.0003;
        updateCamera();
      } else if (s.camMode === 'flythrough') {
        s.flyCamT = (s.flyCamT + dt * 0.06) % flythroughWaypoints.length;
        const idx = Math.floor(s.flyCamT);
        const t = s.flyCamT - idx;
        const wp0 = flythroughWaypoints[idx];
        const wp1 = flythroughWaypoints[(idx + 1) % flythroughWaypoints.length];
        const smooth = t * t * (3 - 2 * t);
        camera.position.lerpVectors(wp0.pos, wp1.pos, smooth);
        const tgt = new THREE.Vector3().lerpVectors(wp0.target, wp1.target, smooth);
        camera.lookAt(tgt);
      } else if (s.camMode === 'top') {
        camera.position.set(0, 120, 15);
        camera.lookAt(0, 0, 15);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Expose controls
    (window as any).__flood3d = {
      setProgress: (v: number) => { stateRef.current.progress = v; setProgress(Math.round(v * 100)); setWaterDepth(parseFloat((v * 9.5).toFixed(1))); },
    };

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  const simHrs = (stateRef.current.progress * 3).toFixed(1);

  const severity =
    waterDepth < 1 ? { label: 'Rising', color: '#6dd5fa' } :
    waterDepth < 3 ? { label: 'Moderate', color: '#f9ca24' } :
    waterDepth < 6 ? { label: 'Severe', color: '#f0932b' } :
                     { label: 'Catastrophic', color: '#eb4d4b' };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000', borderRadius: '0.5rem', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* Top-left HUD */}
      <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)', borderRadius: 8, padding: '8px 14px', border: '1px solid rgba(255,255,255,0.12)' }}>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 15, letterSpacing: '-0.3px' }}>🌊 Mettur Dam Breach</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Real-time 3D Flood Simulation</div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', borderRadius: 6, padding: '6px 12px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 16 }}>
          {[['Sim Time', `T+${simHrs} hrs`], ['Depth', `${waterDepth} m`]].map(([l, v]) => (
            <div key={l}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{v}</div>
            </div>
          ))}
          <div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Severity</div>
            <div style={{ color: severity.color, fontWeight: 700, fontSize: 14 }}>{severity.label}</div>
          </div>
        </div>
      </div>

      {/* Camera mode buttons */}
      <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {(['orbital', 'flythrough', 'top'] as const).map(mode => (
          <button key={mode} onClick={() => { setCamMode(mode); stateRef.current.camMode = mode; }}
            style={{ background: camMode === mode ? '#6B4E2B' : 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '7px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            {mode === 'orbital' ? '🖱 Orbit' : mode === 'flythrough' ? '🎥 Cinematic' : '🗺 Top View'}
          </button>
        ))}
      </div>

      {/* Depth legend */}
      <div style={{ position: 'absolute', right: 14, bottom: 80, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Water Depth</div>
        {[['< 1 m', '#6dd5fa'], ['1–3 m', '#f9ca24'], ['3–6 m', '#f0932b'], ['> 6 m', '#eb4d4b']].map(([l, c]) => (
          <div key={l as string} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: c as string }} />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{l}</span>
          </div>
        ))}
      </div>

      {/* Bottom playbar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => { stateRef.current.progress = 0; setProgress(0); setWaterDepth(0); setIsPlaying(false); }}
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '7px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>⏮</button>
        <button onClick={() => { stateRef.current.isPlaying = !stateRef.current.isPlaying; setIsPlaying(p => !p); }}
          style={{ background: '#6B4E2B', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: 6, fontWeight: 700, fontSize: 14, cursor: 'pointer', minWidth: 90 }}>
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, whiteSpace: 'nowrap', minWidth: 80 }}>T+{simHrs} / 3.0 hrs</span>
        <input type="range" min={0} max={100} value={progress}
          onChange={e => { const v = parseInt(e.target.value) / 100; stateRef.current.progress = v; (window as any).__flood3d?.setProgress(v); }}
          style={{ flex: 1, accentColor: '#D4A96A', height: 3, cursor: 'pointer' }} />
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, whiteSpace: 'nowrap' }}>Drag • Scroll to zoom</span>
      </div>
    </div>
  );
};
