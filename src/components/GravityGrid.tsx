import React, { useRef, useEffect } from "react";
import { useFrame, extend, Object3DNode } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { BODIES, AU_SCALE } from "./CelestialBodies";

const NUM_BODIES = BODIES.length; // e.g. 9

// Custom shader material that computes a gravitational dip (warp) in the grid.
// The grid is defined in the XZ plane (with y as up) and the warp is applied to y.
// The warp factor is computed non-linearly and is used to darken the grid as it deepens.
const GravityGridMaterial = shaderMaterial(
  {
    planetPositions: new Array(NUM_BODIES).fill(new THREE.Vector3()),
    planetMasses: new Array(NUM_BODIES).fill(0.0),
    numPlanets: NUM_BODIES,
    time: 0.0,
  },
  // Vertex Shader

  ` #define NUM_BODIES ${NUM_BODIES}
    uniform vec3 planetPositions[NUM_BODIES];
    uniform float planetMasses[NUM_BODIES];
    uniform int numPlanets;
    uniform float time;
    varying float vWarp;
    
    void main() {
      vec3 pos = position; // The grid is in the XZ plane
      float displacement = 0.0;
      // For each body, compute contribution based on distance (in XZ)
      for (int i = 0; i < NUM_BODIES; i++) {
        if (i < numPlanets) {
          float d = distance(vec2(pos.x, pos.z), vec2(planetPositions[i].x, planetPositions[i].z));
          displacement += sqrt(planetMasses[i]*1.11) / (d + 5.0);
          }
      }
      // Compute a non-linear warp factor. Adjust sensitivity with 0.05.
      float warp = 1.0 - exp(-displacement * 0.08);
      warp = sqrt(warp); // Smooth the warp so it's less pointy.
      // Apply the warp as a vertical dip (on y)
      pos.y -= warp * 150.0;
      vWarp = warp;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
      `,
  // Fragment Shader – mix between light grey and dark grey based on warp depth.

  ` varying float vWarp;
    void main() {
      float shade = mix(0.6, 0.01, (vWarp * 1.2));
      gl_FragColor = vec4(vec3(shade), 1.0);
    }
  `
);

extend({ GravityGridMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      gravityGridMaterial: Object3DNode<
        THREE.ShaderMaterial,
        typeof GravityGridMaterial
      >;
    }
  }
}

interface GravityGridProps {
  timeScale: number;
}

const GravityGrid: React.FC<GravityGridProps> = ({ timeScale }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const geometryRef = useRef<THREE.PlaneGeometry>(null);

  // Rotate the plane geometry so its vertices are in the XZ plane.
  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.rotateX(-Math.PI / 2);
    }
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * timeScale;
    const positions: THREE.Vector3[] = [];
    const masses: number[] = [];
    // Compute the current (x,z) positions of each body from the shared BODIES array.
    BODIES.forEach((body) => {
      const orbitRadius = body.orbitRadiusAU * AU_SCALE;
      const angle =
        body.orbitalPeriodEarthYears > 0 ? t * body.angularSpeed : 0;
      const x = orbitRadius * Math.cos(angle);
      const z = orbitRadius * Math.sin(angle);
      positions.push(new THREE.Vector3(x, 0, z));
      masses.push(body.mass);
    });
    if (materialRef.current) {
      materialRef.current.uniforms.planetPositions.value = positions;
      materialRef.current.uniforms.planetMasses.value = masses;
      materialRef.current.uniforms.numPlanets.value = NUM_BODIES;
      materialRef.current.uniforms.time.value = t;
    }
  });

  return (
    // The grid is positioned beneath the solar system.
    <mesh position={[0, 25, 0]}>
      <planeGeometry ref={geometryRef} args={[3200, 3200, 1000, 1000]} />
      <gravityGridMaterial
        ref={materialRef}
        side={THREE.DoubleSide}
        wireframe={true}
        polygonOffset
        polygonOffsetFactor={1}
        polygonOffsetUnits={1}
      />
    </mesh>
  );
};

export default GravityGrid;
