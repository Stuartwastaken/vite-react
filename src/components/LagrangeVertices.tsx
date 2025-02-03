import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BODIES, AU_SCALE } from './CelestialBodies';
import { Html } from '@react-three/drei';
import Arrow from './Arrow';

interface LagrangeVerticesProps {
  timeScale: number;
  visible: boolean;
}

const LagrangeVertices: React.FC<LagrangeVerticesProps> = ({ timeScale, visible }) => {
  if (!visible) return null; // If not visible, render nothing

  // We'll render Lagrange points for Earth-Mars only.
  const earthBody = BODIES.find(b => b.name === 'Earth');
  const marsBody = BODIES.find(b => b.name === 'Mars');
  if (!earthBody || !marsBody) return null;

  // Refs for the spheres representing Lagrange points.
  const L1Ref = useRef<THREE.Mesh>(null);
  const L2Ref = useRef<THREE.Mesh>(null);
  const L4Ref = useRef<THREE.Mesh>(null);
  const L5Ref = useRef<THREE.Mesh>(null);

  // We'll store arrow parameters locally.
  const arrowL1Ref = useRef<{ origin: THREE.Vector3; direction: THREE.Vector3; length: number }>({
    origin: new THREE.Vector3(),
    direction: new THREE.Vector3(),
    length: 0,
  });
  const arrowL2Ref = useRef<{ origin: THREE.Vector3; direction: THREE.Vector3; length: number }>({
    origin: new THREE.Vector3(),
    direction: new THREE.Vector3(),
    length: 0,
  });
  const arrowL4Ref = useRef<{ origin: THREE.Vector3; direction: THREE.Vector3; length: number }>({
    origin: new THREE.Vector3(),
    direction: new THREE.Vector3(),
    length: 0,
  });
  const arrowL5Ref = useRef<{ origin: THREE.Vector3; direction: THREE.Vector3; length: number }>({
    origin: new THREE.Vector3(),
    direction: new THREE.Vector3(),
    length: 0,
  });

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * timeScale;
    const earthOrbit = earthBody.orbitRadiusAU * AU_SCALE;
    const marsOrbit = marsBody.orbitRadiusAU * AU_SCALE;
    const earthAngle = t * earthBody.angularSpeed;
    const marsAngle = t * marsBody.angularSpeed;
    
    // Compute Earth and Mars positions (in the XZ plane)
    const EarthPos = new THREE.Vector3(
      earthOrbit * Math.cos(earthAngle),
      0,
      earthOrbit * Math.sin(earthAngle)
    );
    const MarsPos = new THREE.Vector3(
      marsOrbit * Math.cos(marsAngle),
      0,
      marsOrbit * Math.sin(marsAngle)
    );

    // Relative vector from Earth to Mars
    const R = new THREE.Vector3().subVectors(MarsPos, EarthPos);
    const r = R.length();
    const u = R.clone().normalize();
    // Compute a perpendicular vector in the XZ plane.
    const v = new THREE.Vector3(-u.z, 0, u.x);

    // Compute delta = (M_mars / (3*M_earth))^(1/3)
    const delta = Math.pow(marsBody.mass / (3 * earthBody.mass), 1 / 3);

    // Lagrange points along the line (L1 and L2)
    const L1 = EarthPos.clone().add(R.clone().multiplyScalar(1 - delta));
    const L2 = EarthPos.clone().add(R.clone().multiplyScalar(1 + delta));
    // Lagrange points forming an equilateral triangle with Earth and Mars (L4 and L5)
    const L4 = EarthPos.clone().add(u.clone().multiplyScalar(r * 0.5).add(v.clone().multiplyScalar(r * 0.866)));
    const L5 = EarthPos.clone().add(u.clone().multiplyScalar(r * 0.5).sub(v.clone().multiplyScalar(r * 0.866)));

    // Update the positions of the spheres.
    if (L1Ref.current) L1Ref.current.position.copy(L1);
    if (L2Ref.current) L2Ref.current.position.copy(L2);
    if (L4Ref.current) L4Ref.current.position.copy(L4);
    if (L5Ref.current) L5Ref.current.position.copy(L5);

    // For each arrow, set its origin at EarthPos and direction toward the Lagrange point.
    const updateArrowData = (
      arrowRef: React.MutableRefObject<{ origin: THREE.Vector3; direction: THREE.Vector3; length: number }>,
      target: THREE.Vector3
    ) => {
      const direction = new THREE.Vector3().subVectors(target, EarthPos).normalize();
      const length = target.distanceTo(EarthPos);
      arrowRef.current.origin.copy(EarthPos);
      arrowRef.current.direction.copy(direction);
      arrowRef.current.length = length;
    };

    updateArrowData(arrowL1Ref, L1);
    updateArrowData(arrowL2Ref, L2);
    updateArrowData(arrowL4Ref, L4);
    updateArrowData(arrowL5Ref, L5);
  });

  return (
    <group>
      {/* Lagrange point spheres */}
      <mesh ref={L1Ref}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial color="red" emissive="red" />
        <Html position={[0, 3, 0]} center style={{ fontSize: '10px', color: 'red' }}>
          L1
        </Html>
      </mesh>
      <mesh ref={L2Ref}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial color="green" emissive="green" />
        <Html position={[0, 3, 0]} center style={{ fontSize: '10px', color: 'green' }}>
          L2
        </Html>
      </mesh>
      <mesh ref={L4Ref}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial color="purple" emissive="purple" />
        <Html position={[0, 3, 0]} center style={{ fontSize: '10px', color: 'purple' }}>
          L4
        </Html>
      </mesh>
      <mesh ref={L5Ref}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial color="purple" emissive="purple" />
        <Html position={[0, 3, 0]} center style={{ fontSize: '10px', color: 'purple' }}>
          L5
        </Html>
      </mesh>

      {/* Render arrows from Earth to each Lagrange point using our custom Arrow component */}
      <Arrow
        origin={arrowL1Ref.current ? arrowL1Ref.current.origin : new THREE.Vector3()}
        direction={arrowL1Ref.current ? arrowL1Ref.current.direction : new THREE.Vector3(1,0,0)}
        length={arrowL1Ref.current ? arrowL1Ref.current.length : 0}
        color="red"
      />
      <Arrow
        origin={arrowL2Ref.current ? arrowL2Ref.current.origin : new THREE.Vector3()}
        direction={arrowL2Ref.current ? arrowL2Ref.current.direction : new THREE.Vector3(1,0,0)}
        length={arrowL2Ref.current ? arrowL2Ref.current.length : 0}
        color="green"
      />
      <Arrow
        origin={arrowL4Ref.current ? arrowL4Ref.current.origin : new THREE.Vector3()}
        direction={arrowL4Ref.current ? arrowL4Ref.current.direction : new THREE.Vector3(1,0,0)}
        length={arrowL4Ref.current ? arrowL4Ref.current.length : 0}
        color="purple"
      />
      <Arrow
        origin={arrowL5Ref.current ? arrowL5Ref.current.origin : new THREE.Vector3()}
        direction={arrowL5Ref.current ? arrowL5Ref.current.direction : new THREE.Vector3(1,0,0)}
        length={arrowL5Ref.current ? arrowL5Ref.current.length : 0}
        color="purple"
      />
    </group>
  );
};

export default LagrangeVertices;
