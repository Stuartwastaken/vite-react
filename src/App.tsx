import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SolarSystem from '../src/components/SolarSystem';
import LagrangeVertices from '../src/components/LagrangeVertices';
import SceneBackground from './SceneBackground'; 

const App: React.FC = () => {
  const [slowTime, setSlowTime] = useState(true);
  const [showLagrangePoints, setShowLagrangePoints] = useState(false);
  const [startTransferPath, setStartTransferPath] = useState(false);

  // When slowTime is enabled, simulation runs at 1/10 speed.
  const timeScale = slowTime ? 0.02 : 0.2;

  return (
    <div style={{ width: '100vw', height: '100vh' }}>

      {/* Top-right UI toggles */}
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
        <div>
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
        {/* <div style={{ marginTop: '10px' }}>
          <label>
            <input 
              type="checkbox" 
              checked={startTransferPath} 
              onChange={(e) => setStartTransferPath(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Start Mars Transfer
          </label>
        </div> */}
        <div style={{ marginTop: '10px' }}>
          <label>
            <input 
              type="checkbox" 
              checked={showLagrangePoints} 
              onChange={(e) => setShowLagrangePoints(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Lagrange Points
          </label>
        </div>
      </div>
      
      <Canvas camera={{ position: [0, 200, 500], fov: 60, near: 0.1, far: 200000 }}>
        {/* SceneBackground sets scene.background to your starfield image */}
        <SceneBackground />

        <ambientLight intensity={0.2} />
        <pointLight intensity={1.2} position={[0, 0, 0]} />
        
        <SolarSystem
          timeScale={timeScale}
          showLagrangePoints={showLagrangePoints}
          startTransferPath={startTransferPath}
        />
        {showLagrangePoints && (
          <LagrangeVertices
            timeScale={timeScale}
            visible={showLagrangePoints}
          />
        )}

        <OrbitControls minDistance={10} maxDistance={200000} />
      </Canvas>
    </div>
  );
};

export default App;
