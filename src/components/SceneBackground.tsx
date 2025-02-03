import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function SceneBackground() {
  const { scene } = useThree();
  // Load the image as a texture (e.g. an equirectangular star field).
  const texture = useTexture('/textures/2k_stars.jpg');

  useEffect(() => {
    // Once loaded, set it as the scene background.
    // This means it won't move (like a skybox) and will fill the entire background.
    if (texture) {
      // We can set wrapS + wrapT for equirectangular images if needed.
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      scene.background = texture;
    }
    // If we wanted a reflection environment, we might also set scene.environment = texture.
  }, [texture, scene]);

  return null; // This component doesn't render any visible DOM node.
}
