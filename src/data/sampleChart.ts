import { ChartData } from "@/types/astrology";

// Sample D1 chart data - Example birth chart
export const sampleChartData: ChartData = {
  dateTime: "August 15, 2024 at 10:30 AM",
  location: "New Delhi, India",
  timezone: "IST (GMT+5:30)",
  planets: [
  {
    name: "Sun",
    rashi: "Leo",
    degrees: 15,
    minutes: 23,
    seconds: 45
  },
  {
    name: "Moon",
    rashi: "Cancer",
    degrees: 8,
    minutes: 12,
    seconds: 30
  },
  {
    name: "Mars",
    rashi: "Aries",
    degrees: 22,
    minutes: 45,
    seconds: 18
  },
  {
    name: "Mercury",
    rashi: "Virgo",
    degrees: 12,
    minutes: 34,
    seconds: 56
  },
  {
    name: "Jupiter",
    rashi: "Sagittarius",
    degrees: 18,
    minutes: 56,
    seconds: 12
  },
  {
    name: "Venus",
    rashi: "Libra",
    degrees: 25,
    minutes: 15,
    seconds: 42
  },
  {
    name: "Saturn",
    rashi: "Capricorn",
    degrees: 5,
    minutes: 48,
    seconds: 27
  },
  {
    name: "Rahu",
    rashi: "Gemini",
    degrees: 14,
    minutes: 22,
    seconds: 8
  },
  {
    name: "Ketu",
    rashi: "Sagittarius",
    degrees: 14,
    minutes: 22,
    seconds: 8
  }
]
};

