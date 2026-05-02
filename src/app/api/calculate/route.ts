import { NextRequest, NextResponse } from 'next/server';
import { calculatePlanetaryPositions } from '@/lib/astroCalculations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, time, latitude, longitude, location, timezone } = body;
    
    // Validate inputs
    if (!date || !time || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: date, time, latitude, longitude' },
        { status: 400 }
      );
    }
    
    // Calculate planetary positions
    const planets = calculatePlanetaryPositions({
      date,
      time,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    });
    
    // Format response
    const response = {
      planets,
      dateTime: `${new Date(date).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      })} at ${time}`,
      location: location || `${latitude}, ${longitude}`,
      timezone: timezone || 'UTC'
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate planetary positions' },
      { status: 500 }
    );
  }
}

