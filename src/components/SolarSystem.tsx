import React from 'react';
import Sun from './Sun';
import Planet from './Planet';
import GravityGrid from './GravityGrid';
import TransferPath from './TransferPath';
import { BODIES } from './CelestialBodies';
import LagrangeVertices from './LagrangeVertices';

interface SolarSystemProps {
  timeScale: number;
  showLagrangePoints: boolean;
  startTransferPath: boolean;
}

const SolarSystem: React.FC<SolarSystemProps> = ({ timeScale, showLagrangePoints, startTransferPath }) => {
  return (
    <>
      <Sun />
      {BODIES.filter(body => body.name !== 'Sun').map((body) => (
        <Planet key={body.name} body={body} timeScale={timeScale} />
      ))}
      <GravityGrid timeScale={timeScale} />
      {showLagrangePoints && <LagrangeVertices timeScale={timeScale} visible={true} />}
      {startTransferPath && <TransferPath timeScale={timeScale} />}
    </>
  );
};

export default SolarSystem;
