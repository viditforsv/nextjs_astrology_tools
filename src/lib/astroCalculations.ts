import { PlanetPosition } from '@/types/astrology';
// @ts-expect-error - ephemeris-moshier doesn't have TypeScript definitions
import * as ephemeris from 'ephemeris-moshier';

// Vedic zodiac signs (Sidereal)
const RASHIS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Planet names mapping for Vedic astrology
const VEDIC_PLANETS = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];

// Lahiri Ayanamsa for Vedic calculations (approximate for the year 2000)
const AYANAMSA_2000 = 23.85; // degrees

// Calculate Ayanamsa for a given year (simplified formula)
function getAyanamsa(year: number): number {
  // Approximate rate: 50.27 arc-seconds per year
  const yearsSince2000 = year - 2000;
  const ayanamsa = AYANAMSA_2000 + (yearsSince2000 * 50.27 / 3600);
  return ayanamsa;
}

// Convert tropical longitude to sidereal (Vedic)
function tropicalToSidereal(tropicalLong: number, ayanamsa: number): number {
  let sidereal = tropicalLong - ayanamsa;
  if (sidereal < 0) sidereal += 360;
  if (sidereal >= 360) sidereal -= 360;
  return sidereal;
}

// Convert longitude to Rashi and degrees
function longitudeToRashi(longitude: number): { rashi: string; degrees: number; minutes: number; seconds: number } {
  const rashiIndex = Math.floor(longitude / 30);
  const degreeInRashi = longitude - (rashiIndex * 30);
  
  const degrees = Math.floor(degreeInRashi);
  const minutesDecimal = (degreeInRashi - degrees) * 60;
  const minutes = Math.floor(minutesDecimal);
  const seconds = Math.floor((minutesDecimal - minutes) * 60);
  
  return {
    rashi: RASHIS[rashiIndex % 12],
    degrees,
    minutes,
    seconds
  };
}

export interface CalculationInput {
  date: string; // ISO date string
  time: string; // HH:mm format
  latitude: number;
  longitude: number;
}

export function calculatePlanetaryPositions(input: CalculationInput): PlanetPosition[] {
  const { date, time, latitude, longitude } = input;
  
  // Parse date and time
  const [hours, minutes] = time.split(':').map(Number);
  const dateObj = new Date(date);
  dateObj.setHours(hours, minutes, 0, 0);
  
  // Format date for ephemeris-moshier: "DD.MM.YYYY HH:MM:SS"
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();
  const dateString = `${day}.${month}.${year} ${hours}:${minutes}:0`;
  
  // Calculate Ayanamsa for this year
  const ayanamsa = getAyanamsa(year);
  
  const positions: PlanetPosition[] = [];
  
  try {
    // Get all planet positions
    const result = ephemeris.getAllPlanets(dateString, longitude, latitude, 0);
    
    if (!result || !result.observed) {
      throw new Error('Invalid ephemeris calculation result');
    }
    
    // Process each Vedic planet
    VEDIC_PLANETS.forEach(planetKey => {
      const planetData = result.observed[planetKey];
      
      if (planetData && planetData.apparentLongitudeDd !== undefined) {
        // Convert tropical to sidereal
        const tropicalLongitude = planetData.apparentLongitudeDd;
        const siderealLongitude = tropicalToSidereal(tropicalLongitude, ayanamsa);
        const rashiData = longitudeToRashi(siderealLongitude);
        
        positions.push({
          name: planetKey.charAt(0).toUpperCase() + planetKey.slice(1),
          rashi: rashiData.rashi,
          degrees: rashiData.degrees,
          minutes: rashiData.minutes,
          seconds: rashiData.seconds
        });
      }
    });
    
    // Calculate Mean Rahu and Ketu (lunar nodes)
    // Mean Node formula - moves retrograde at approximately 19.35° per year
    // This is the mean ascending node position
    const T = (result.date.gregorianTerrestrialRaw.julian - 2451545.0) / 36525.0; // Julian centuries from J2000
    
    // Mean longitude of ascending node (Rahu) - Meeus formula
    // This moves retrograde, so we subtract
    let meanNode = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + T * T * T / 467441.0 - T * T * T * T / 60616000.0;
    
    // Normalize to 0-360 range
    meanNode = meanNode % 360;
    if (meanNode < 0) meanNode += 360;
    
    // Convert tropical to sidereal for Rahu (North Node)
    const rahuTropicalLong = meanNode;
    const rahuSiderealLong = tropicalToSidereal(rahuTropicalLong, ayanamsa);
    const rahuData = longitudeToRashi(rahuSiderealLong);
    
    // Ketu (South Node) is always exactly 180° opposite to Rahu
    let ketuSiderealLong = rahuSiderealLong + 180;
    if (ketuSiderealLong >= 360) ketuSiderealLong -= 360;
    const ketuData = longitudeToRashi(ketuSiderealLong);
    
    positions.push({
      name: 'Rahu',
      rashi: rahuData.rashi,
      degrees: rahuData.degrees,
      minutes: rahuData.minutes,
      seconds: rahuData.seconds
    });
    
    positions.push({
      name: 'Ketu',
      rashi: ketuData.rashi,
      degrees: ketuData.degrees,
      minutes: ketuData.minutes,
      seconds: ketuData.seconds
    });
    
    return positions;
  } catch (error) {
    console.error('Error calculating planetary positions:', error);
    throw new Error('Failed to calculate planetary positions');
  }
}

