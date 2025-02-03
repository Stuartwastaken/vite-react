export interface CelestialBody {
  name: string;
  color: string;
  orbitRadiusAU: number;          // in astronomical units
  sizeRelativeToEarth: number;    // Earth = 1.0
  orbitalPeriodEarthYears: number; // 0 for the Sun
  mass: number;                   // arbitrary units (for gravitational dip)
  angularSpeed: number;           // pre-computed as (2π/period); 0 if period==0
}

export const AU_SCALE = 50;

export const BODIES: CelestialBody[] = [
  {
    name: 'Sun',
    color: 'orange',
    orbitRadiusAU: 0,
    sizeRelativeToEarth: 10,
    orbitalPeriodEarthYears: 0,
    mass: 300,
    angularSpeed: 0,
  },
  {
    name: 'Mercury',
    color: 'gray',
    orbitRadiusAU: 0.39,
    sizeRelativeToEarth: 0.38,
    orbitalPeriodEarthYears: 0.24,
    mass: 0.055,
    angularSpeed: (2 * Math.PI) / 0.24,
  },
  {
    name: 'Venus',
    color: 'yellow',
    orbitRadiusAU: 0.72,
    sizeRelativeToEarth: 0.95,
    orbitalPeriodEarthYears: 0.62,
    mass: 0.815,
    angularSpeed: (2 * Math.PI) / 0.62,
  },
  {
    name: 'Earth',
    color: 'blue',
    orbitRadiusAU: 1.0,
    sizeRelativeToEarth: 1.0,
    orbitalPeriodEarthYears: 1.0,
    mass: 1.0,
    angularSpeed: (2 * Math.PI) / 1.0,
  },
  {
    name: 'Mars',
    color: 'red',
    orbitRadiusAU: 1.52,
    sizeRelativeToEarth: 0.53,
    orbitalPeriodEarthYears: 1.88,
    mass: 0.107,
    angularSpeed: (2 * Math.PI) / 1.88,
  },
  {
    name: 'Jupiter',
    color: 'orange',
    orbitRadiusAU: 5.2,
    sizeRelativeToEarth: 11.21,
    orbitalPeriodEarthYears: 11.86,
    mass: 317.8,
    angularSpeed: (2 * Math.PI) / 11.86,
  },
  {
    name: 'Saturn',
    color: 'goldenrod',
    orbitRadiusAU: 9.58,
    sizeRelativeToEarth: 9.45,
    orbitalPeriodEarthYears: 29.46,
    mass: 95.2,
    angularSpeed: (2 * Math.PI) / 29.46,
  },
  {
    name: 'Uranus',
    color: 'lightblue',
    orbitRadiusAU: 19.2,
    sizeRelativeToEarth: 4.01,
    orbitalPeriodEarthYears: 84.01,
    mass: 14.5,
    angularSpeed: (2 * Math.PI) / 84.01,
  },
  {
    name: 'Neptune',
    color: 'blue',
    orbitRadiusAU: 30.05,
    sizeRelativeToEarth: 3.88,
    orbitalPeriodEarthYears: 164.8,
    mass: 17.1,
    angularSpeed: (2 * Math.PI) / 164.8,
  },
];