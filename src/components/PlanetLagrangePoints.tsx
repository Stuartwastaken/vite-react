import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CelestialBody, AU_SCALE, BODIES } from './CelestialBodies';
import { Html } from '@react-three/drei';

interface PlanetLagrangePointsProps {
  body: CelestialBody;
  timeScale: number;
}

const PlanetLagrangePoints: React.FC<PlanetLagrangePointsProps> = ({ body, timeScale }) => {
  // We'll use a ref object to store references for each Lagrange point.
  const lagrangeRefs = useRef<{ [key: string]: THREE.Mesh | null }>({});

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * timeScale;
    // Compute the planet's position (P) in the XZ plane.
    const orbitRadius = body.orbitRadiusAU * AU_SCALE;
    const angle = body.orbitalPeriodEarthYears > 0 ? t * body.angularSpeed : 0;
    const P = new THREE.Vector3(orbitRadius * Math.cos(angle), 0, orbitRadius * Math.sin(angle));

    // Use the Sun as primary. Assume the Sun is the first element in BODIES.
    const M1 = BODIES[0].mass;
    const M2 = body.mass;
    const delta = Math.pow(M2 / (3 * M1), 1 / 3);

    // Compute L1 and L2 along the line joining the Sun (at origin) and the planet.
    const L1 = P.clone().multiplyScalar(1 - delta);
    const L2 = P.clone().multiplyScalar(1 + delta);

    // For L4 and L5: if the planet's orbit radius is nonzero.
    const R = P.length();
    let L4 = new THREE.Vector3();
    let L5 = new THREE.Vector3();
    if (R > 0) {
      const u = P.clone().normalize();
      // Perpendicular in the XZ plane: if u = (cosθ, 0, sinθ), then v = (-sinθ, 0, cosθ)
      const v = new THREE.Vector3(-u.z, 0, u.x);
      const cos60 = 0.5;
      const sin60 = Math.sqrt(3) / 2; // ~0.866
      L4 = u.clone().multiplyScalar(R * cos60).add(v.clone().multiplyScalar(R * sin60));
      L5 = u.clone().multiplyScalar(R * cos60).sub(v.clone().multiplyScalar(R * sin60));
    }

    // Update the positions of the corresponding meshes if they exist.
    if (lagrangeRefs.current['L1']) lagrangeRefs.current['L1'].position.copy(L1);
    if (lagrangeRefs.current['L2']) lagrangeRefs.current['L2'].position.copy(L2);
    if (lagrangeRefs.current['L4']) lagrangeRefs.current['L4'].position.copy(L4);
    if (lagrangeRefs.current['L5']) lagrangeRefs.current['L5'].position.copy(L5);
  });

  // Render four small spheres (with labels) for L1, L2, L4, and L5.
  // You can adjust the sphere radius as desired.
  return (
    <group>
      <mesh ref={(ref) => (lagrangeRefs.current['L1'] = ref)}>
        <sphereGeometry args={[5, 16, 16]} />
        <meshStandardMaterial color="red" />
        <Html position={[0, 8, 0]} center style={{ fontSize: '10px', color: 'red' }}>
          L1
        </Html>
      </mesh>
      <mesh ref={(ref) => (lagrangeRefs.current['L2'] = ref)}>
        <sphereGeometry args={[5, 16, 16]} />
        <meshStandardMaterial color="green" />
        <Html position={[0, 8, 0]} center style={{ fontSize: '10px', color: 'green' }}>
          L2
        </Html>
      </mesh>
      <mesh ref={(ref) => (lagrangeRefs.current['L4'] = ref)}>
        <sphereGeometry args={[5, 16, 16]} />
        <meshStandardMaterial color="purple" />
        <Html position={[0, 8, 0]} center style={{ fontSize: '10px', color: 'purple' }}>
          L4
        </Html>
      </mesh>
      <mesh ref={(ref) => (lagrangeRefs.current['L5'] = ref)}>
        <sphereGeometry args={[5, 16, 16]} />
        <meshStandardMaterial color="purple" />
        <Html position={[0, 8, 0]} center style={{ fontSize: '10px', color: 'purple' }}>
          L5
        </Html>
      </mesh>
    </group>
  );
};

export default PlanetLagrangePoints;
