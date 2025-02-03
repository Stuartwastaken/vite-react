import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SolarSystem from '../src/components/SolarSystem';

const App: React.FC = () => {
  const [slowTime, setSlowTime] = useState(true);
  // When slowTime is enabled, the simulation runs at 1/10th speed.
  const timeScale = slowTime ? 0.1 : 1.0;

return (
  <div style={{ width: '100vw', height: '100vh' }}>
    {/* Top-right UI toggle */}
    <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 1000,
        fontFamily: 'sans-serif'
      }}>
        <label>
          <input 
            type="checkbox" 
            checked={slowTime} 
            onChange={(e) => setSlowTime(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Slow Time
        </label>
      </div>
    <Canvas camera={{ position: [0, 40, 100], fov: 60 }}>

      <ambientLight intensity={0.2} />
      <pointLight intensity={1.2} position={[0, 0, 0]} />
      <SolarSystem timeScale={timeScale} />
      <OrbitControls />
    </Canvas>
  </div>
);
};

export default App;
