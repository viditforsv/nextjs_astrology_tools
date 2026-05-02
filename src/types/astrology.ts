export interface PlanetPosition {
  name: string;
  rashi: string;
  degrees: number;
  minutes: number;
  seconds: number;
}

export interface ChartData {
  planets: PlanetPosition[];
  dateTime: string;
  location: string;
  timezone?: string;
}

export const RASHIS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 
  'Leo', 'Virgo', 'Libra', 'Scorpio', 
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

