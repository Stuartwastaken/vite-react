import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BODIES, AU_SCALE } from './CelestialBodies';

interface TransferPathProps {
  timeScale: number;
}

const TransferPath: React.FC<TransferPathProps> = ({ timeScale }) => {
  const lineRef = useRef<THREE.Line>(null);
  const probeRef = useRef<THREE.Mesh>(null);
  // Record the departure time and the transfer curve once at launch.
  const departureTimeRef = useRef<number | null>(null);
  const transferCurveRef = useRef<THREE.CatmullRomCurve3 | null>(null);

  // Set a constant transfer time (in simulation seconds). In a real Hohmann transfer,
  // this would be computed as t_transfer = π * sqrt(a_transfer^3/μ) but here we choose 60.
  const transferTime = 1;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * timeScale;

    // Extract Earth and Mars data.
    const earth = BODIES.find(b => b.name === 'Earth');
    const mars = BODIES.find(b => b.name === 'Mars');
    if (!earth || !mars) return;

    // Compute orbital radii (in scene units).
    const R1 = earth.orbitRadiusAU * AU_SCALE;
    const R2 = mars.orbitRadiusAU * AU_SCALE;

    // Compute current positions for Earth and Mars (in the XZ plane).
    const earthAngleCurrent = t * earth.angularSpeed;
    const marsAngleCurrent = t * mars.angularSpeed;
    const EarthPosCurrent = new THREE.Vector3(
      R1 * Math.cos(earthAngleCurrent),
      0,
      R1 * Math.sin(earthAngleCurrent)
    );
    const MarsPosCurrent = new THREE.Vector3(
      R2 * Math.cos(marsAngleCurrent),
      0,
      R2 * Math.sin(marsAngleCurrent)
    );

    // On the first frame, record departure time and compute the transfer orbit.
    if (departureTimeRef.current === null) {
      departureTimeRef.current = t;

      // For a Hohmann transfer, we assume departure from Earth at time t0.
      // Earth's departure position:
      const EarthPosDeparture = EarthPosCurrent.clone();
      // Mars departure position (for the transfer calculation) is taken as the current Mars position.
      const MarsPosDeparture = MarsPosCurrent.clone();

      // For circular orbits, R1 and R2 are constant.
      // The elliptical (Hohmann) transfer orbit has:
      //   a_transfer = (R1 + R2)/2
      //   e_transfer = (R2 - R1)/(R2 + R1)
      const aTransfer = (R1 + R2) / 2;
      const eTransfer = (R2 - R1) / (R2 + R1);

      // Let φ be Earth’s departure angle.
      const φ = earthAngleCurrent;
      // We sample the transfer orbit from φ to φ + π.
      const numPoints = 100;
      const transferPoints: THREE.Vector3[] = [];
      for (let i = 0; i <= numPoints; i++) {
        const θ = φ + (Math.PI * i) / numPoints;
        // r(θ) = a(1 - e²) / (1 + e*cos(θ - φ))
        const r = (aTransfer * (1 - eTransfer * eTransfer)) / (1 + eTransfer * Math.cos(θ - φ));
        const x = r * Math.cos(θ);
        const z = r * Math.sin(θ);
        transferPoints.push(new THREE.Vector3(x, 0, z));
      }
      transferCurveRef.current = new THREE.CatmullRomCurve3(transferPoints);
    }

    // If we have a transfer curve (after departure), compute the fraction of transfer time elapsed.
    const f = departureTimeRef.current !== null ? THREE.MathUtils.clamp((t - departureTimeRef.current) / transferTime, 0, 1) : 0;
    const probePos = transferCurveRef.current ? transferCurveRef.current.getPoint(f) : new THREE.Vector3();

    // Update the probe position.
    if (probeRef.current) {
      probeRef.current.position.copy(probePos);
    }

    // For the path line, sample points from the transfer curve.
    if (lineRef.current && transferCurveRef.current) {
      const points = transferCurveRef.current.getPoints(100);
      const geometry = lineRef.current.geometry as THREE.BufferGeometry;
      const positions = new Float32Array(points.length * 3);
      points.forEach((p, i) => {
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
      });
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.attributes.position.needsUpdate = true;

      // Compute the difference between the probe's position and Mars's current position.
      const error = probePos.distanceTo(MarsPosCurrent);
      // Use this error to interpolate a color: if error is very small, color is green; otherwise, red.
      const optimality = THREE.MathUtils.clamp(1 - error / 50, 0, 1);
      const pathColor = new THREE.Color();
      pathColor.setRGB(1 - optimality, optimality, 0);
      (lineRef.current.material as THREE.LineBasicMaterial).color.copy(pathColor);
    }
  });

  return (
    <group>
      <line ref={lineRef as any}>
        <bufferGeometry />
        <lineBasicMaterial color="red" linewidth={2} />
      </line>
      <mesh ref={probeRef}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial color="cyan" emissive="cyan" />
      </mesh>
    </group>
  );
};

export default TransferPath;
