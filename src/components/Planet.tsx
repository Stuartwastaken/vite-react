import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { CelestialBody } from './CelestialBodies';
import { Html, useTexture } from '@react-three/drei';

const AU_SCALE = 50; // 1 AU equals 20 scene units

interface PlanetProps {
  body: CelestialBody;
  timeScale: number;
}

const Planet: React.FC<PlanetProps> = ({ body, timeScale }) => {
  const meshRef = useRef<Mesh>(null);
  const orbitRadius = body.orbitRadiusAU * AU_SCALE;
  const planetRadius = body.sizeRelativeToEarth; // using Earth's radius as the unit

  // Load the appropriate texture based on the planet's name.
  // Adjust these paths if necessary.
  let texturePath = '/textures/default.jpg';
  switch (body.name) {
    case 'Sun':
      texturePath = '/textures/2k_sun.jpg';
      break;
    case 'Mercury':
      texturePath = '/textures/2k_mercury.jpg';
      break;
    case 'Venus':
      texturePath = '/textures/2k_venus.jpg';
      break;
    case 'Earth':
      texturePath = '/textures/2k_earth.jpg';
      break;
    case 'Mars':
      texturePath = '/textures/2k_mars.jpg';
      break;
    case 'Jupiter':
      texturePath = '/textures/2k_jupiter.jpg';
      break;
    case 'Saturn':
      texturePath = '/textures/2k_saturn.jpg';
      break;
    case 'Uranus':
      texturePath = '/textures/2k_uranus.jpg';
      break;
    case 'Neptune':
      texturePath = '/textures/2k_neptune.jpg';
      break;
    default:
      texturePath = '/textures/default.jpg';
      break;
  }
  
  // Load the diffuse texture.
  const textureMap = useTexture(texturePath);
  
  useFrame(({ clock }) => {
    if (meshRef.current && body.orbitalPeriodEarthYears > 0) {
      const t = clock.getElapsedTime() * timeScale;
      const angle = t * body.angularSpeed; // angularSpeed is pre-computed
      meshRef.current.position.x = orbitRadius * Math.cos(angle);
      meshRef.current.position.z = orbitRadius * Math.sin(angle);
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Increase the segment count for smoother texture wrapping */}
      <sphereGeometry args={[planetRadius, 64, 64]} />
      <meshStandardMaterial map={textureMap} roughness={1} metalness={0} />
      <Html 
        position={[0, planetRadius + 3, 0]}
        center
        style={{
          color: body.color,
          fontSize: '12px',
          fontWeight: 'bold',
          pointerEvents: 'none'
        }}
      >
        {body.name}
      </Html>
    </mesh>
  );
};

export default Planet;