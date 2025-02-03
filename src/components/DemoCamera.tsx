import React, { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BODIES, AU_SCALE } from './CelestialBodies';

interface DemoCameraProps {
  // Sequence of target planet names and how long (in simulation seconds) each is the focus.
  segmentDuration?: number; // duration for each target
  orbitRadius?: number;     // base orbit radius (scene units) around the target
  orbitSpeed?: number;      // angular speed (radians per second) for the camera orbit
  zoomAmplitude?: number;    // amplitude for zoom in/out oscillation
  zoomSpeed?: number;        // frequency of zoom oscillation (radians per second)
  verticalOffset?: number;   // vertical offset above the target
  smoothing?: number;        // lerp factor (0-1) for smoothing camera transitions
  timeScale?: number;        // simulation time scale factor
}

const targetSequence = ["Sun", "Jupiter", "Uranus", "Neptune", "Earth"];

const DemoCamera: React.FC<DemoCameraProps> = ({
  segmentDuration = 5,
  orbitRadius = 150,
  orbitSpeed = 1.0,
  zoomAmplitude = 50,
  zoomSpeed = 1.0,
  verticalOffset = 50,
  smoothing = 0.1,
  timeScale = 1,
}) => {
  const { camera } = useThree();
  
  // Total duration for one full cycle.
  const totalDuration = segmentDuration * targetSequence.length;
  const currentSegmentIndex = useRef<number>(0);
  // We'll keep a "currentTarget" vector that smoothly tracks the active planet's current position.
  const currentTarget = useRef<THREE.Vector3>(new THREE.Vector3());
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * timeScale;
    const cycleTime = t % totalDuration;

    // Determine active segment index.
    let segIndex = Math.floor(cycleTime / segmentDuration);
    if (segIndex !== currentSegmentIndex.current) {
      currentSegmentIndex.current = segIndex;
    }
    const activeTargetName = targetSequence[currentSegmentIndex.current];

    // Retrieve the active planet's current position from BODIES.
    const targetData = BODIES.find(b => b.name === activeTargetName);
    let newTarget = new THREE.Vector3(0, 0, 0);
    if (targetData) {
      const orbit = targetData.orbitRadiusAU * AU_SCALE;
      const angle = t * targetData.angularSpeed;
      newTarget.set(
        orbit * Math.cos(angle),
        0,
        orbit * Math.sin(angle)
      );
    }
    // Smoothly blend currentTarget toward newTarget.
    currentTarget.current.lerp(newTarget, smoothing);

    // Now, compute a dynamic offset to orbit around the current target.
    const dynamicRadius = orbitRadius + zoomAmplitude * Math.sin(zoomSpeed * t);
    const orbitAngle = t * orbitSpeed;
    const offset = new THREE.Vector3(
      dynamicRadius * Math.cos(orbitAngle),
      verticalOffset,
      dynamicRadius * Math.sin(orbitAngle)
    );

    const desiredPos = currentTarget.current.clone().add(offset);
    // Smooth camera movement (lerp) for extra fluidity.
    camera.position.lerp(desiredPos, smoothing);
    camera.lookAt(currentTarget.current);
  });

  return null;
};

export default DemoCamera;
