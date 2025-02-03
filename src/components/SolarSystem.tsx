import React from 'react';
import Sun from './Sun';
import Planet from './Planet';
import GravityGrid from './GravityGrid';
import { BODIES } from './CelestialBodies';

interface SolarSystemProps {
  timeScale: number;
}

const SolarSystem: React.FC<SolarSystemProps> = ({ timeScale }) => {
  return (
    <>
      <Sun />
      {BODIES.filter(body => body.name !== 'Sun').map((body) => (
        <Planet key={body.name} body={body} timeScale={timeScale} />
      ))}
      <GravityGrid timeScale={timeScale} />
    </>
  );
};

export default SolarSystem;
