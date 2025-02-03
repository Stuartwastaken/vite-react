import React from 'react';

const Sun: React.FC = () => {
  const sunRadius = 10;
  return (
    <mesh>
      <sphereGeometry args={[sunRadius, 32, 32]} />
      <meshStandardMaterial emissive="yellow" emissiveIntensity={1} color="orange" />
    </mesh>
  );
};

export default Sun;
