# Vedic Astrology Tools

A modern web application built with Next.js for exploring Vedic astrology charts and planetary positions.

## Features

- **D1 Chart (Rashi)**: Display planetary positions with degrees, minutes, and seconds in zodiac signs
- **Real-time Calculations**: Calculate planetary positions for any date/time/location using Moshier Ephemeris
- **Local Computation**: No API dependencies - all calculations run on your server
- **Sidereal Zodiac**: Uses Lahiri Ayanamsa for accurate Vedic astrology calculations
- Clean, minimal, and elegant UI using shadcn/ui components
- Dark mode support
- Responsive design

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **ephemeris-moshier** - Pure JavaScript ephemeris calculations (same accuracy as Swiss Ephemeris)

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   └── D1Chart.tsx  # D1 chart display component
├── data/            # Sample data
├── types/           # TypeScript type definitions
└── lib/             # Utility functions
```

## How It Works

### Planetary Calculations
- Uses **Moshier Ephemeris** - a pure JavaScript astronomical calculation library
- Same calculation method used by professional astrology software like AstroSage
- Converts tropical (Western) positions to sidereal (Vedic) using **Lahiri Ayanamsa**
- All calculations happen locally on your server - no external API needed!

### User Input
1. Enter birth date, time, and location coordinates
2. The app calculates planetary positions for that exact moment
3. Displays all 9 planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)
4. Shows each planet's position in degrees, minutes, and seconds within its Rashi

### Accuracy
- Uses the same astronomical data source as major astrology websites
- Accurate to arc-seconds
- Sidereal calculations using industry-standard Lahiri Ayanamsa
