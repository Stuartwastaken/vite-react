import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ArrowProps {
  origin: THREE.Vector3;
  direction: THREE.Vector3;
  length: number;
  color: string;
  headLength?: number;
  headWidth?: number;
}

const Arrow: React.FC<ArrowProps> = ({
  origin,
  direction,
  length,
  color,
  headLength = 4,
  headWidth = 2,
}) => {
  const arrowRef = useRef<THREE.ArrowHelper | null>(null);

  // Create the ArrowHelper once.
  useEffect(() => {
    arrowRef.current = new THREE.ArrowHelper(
      direction.clone().normalize(),
      origin.clone(),
      length,
      color,
      headLength,
      headWidth
    );
  }, []); // Create once on mount

  // Update arrow's properties on each frame.
  useFrame(() => {
    if (arrowRef.current) {
      arrowRef.current.setDirection(direction.clone().normalize());
      arrowRef.current.setLength(length, headLength, headWidth);
      arrowRef.current.position.copy(origin);
    }
  });

  // Only render once the arrowRef is non-null.
  return arrowRef.current ? <primitive object={arrowRef.current} /> : null;
};

export default Arrow;
