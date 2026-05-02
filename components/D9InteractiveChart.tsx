'use client'

import React, { useState, useMemo } from 'react'
import VedicChart from './VedicChart'
import { d9HouseMeanings } from './d9HouseMeanings'

// Rashi names mapping
const rashiNames: { [key: number]: string } = {
  1: '🐏 मेष',
  2: '🐂 वृषभ',
  3: '👥 मिथुन',
  4: '🦀 कर्क',
  5: '🦁 सिंह',
  6: '👧 कन्या',
  7: '⚖️ तुला',
  8: '🦂 वृश्चिक',
  9: '🏹 धनु',
  10: '🐐 मकर',
  11: '🪣 कुंभ',
  12: '🐟 मीन'
}

// Planet names
const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']

// Calculate rashi for each house based on lagna rashi (anticlockwise)
function calculateHouseRashis(lagnaRashi: number): { [house: number]: number } {
  const houseRashis: { [house: number]: number } = {}
  for (let house = 1; house <= 12; house++) {
    // Anticlockwise: House 1 = lagnaRashi, House 2 = lagnaRashi + 1, etc.
    // Wrap around using modulo
    const rashi = ((lagnaRashi - 1 + (house - 1)) % 12) + 1
    houseRashis[house] = rashi
  }
  return houseRashis
}

interface Planet {
  name: string
  house: number
  vakri?: boolean
  combust?: boolean
  vargottam?: boolean
}

export default function D9InteractiveChart() {
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null)
  const [lagnaRashi, setLagnaRashi] = useState<number | null>(null)
  const [planets, setPlanets] = useState<Planet[]>([])
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const [draggedPlanet, setDraggedPlanet] = useState<string | null>(null)

  // Calculate house rashis based on lagna
  const houseRashis = useMemo(() => {
    if (!lagnaRashi) return {}
    return calculateHouseRashis(lagnaRashi)
  }, [lagnaRashi])

  const handleHouseClick = (houseNumber: number) => {
    // Toggle selection - if same house clicked, deselect
    setSelectedHouse(selectedHouse === houseNumber ? null : houseNumber)
    setSelectedPlanet(null)
  }

  const handlePlanetDrop = (planetName: string, houseNumber: number) => {
    console.log('Planet dropped:', planetName, 'in house:', houseNumber)
    // Remove planet from previous house if exists
    const updatedPlanets = planets.filter(p => p.name !== planetName)
    // Add planet to new house
    updatedPlanets.push({
      name: planetName,
      house: houseNumber,
      vakri: planetName === 'Rahu' || planetName === 'Ketu'
    })
    setPlanets(updatedPlanets)
    setSelectedPlanet(planetName)
    setSelectedHouse(houseNumber)
    setDraggedPlanet(null)
  }

  const handlePlanetDragStart = (planetName: string) => {
    setDraggedPlanet(planetName)
  }

  const handlePlanetDragEnd = () => {
    setDraggedPlanet(null)
  }

  const removePlanet = (planetName: string) => {
    setPlanets(planets.filter(p => p.name !== planetName))
    if (selectedPlanet === planetName) {
      setSelectedPlanet(null)
    }
  }

  const selectedHouseMeaning = selectedHouse ? d9HouseMeanings[selectedHouse] : null
  const selectedPlanetData = selectedPlanet 
    ? planets.find(p => p.name === selectedPlanet)
    : null

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1400px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ 
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Interactive D9 Navmansha Chart</h3>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Select lagna rashi, then drag and drop planets to assess their impact
        </p>
      </div>

      {/* Controls Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Lagna Rashi Selector */}
        <div style={{
          padding: '1.5rem',
          background: 'var(--nextra-bg, #f9fafb)',
          borderRadius: '8px',
          border: '1px solid var(--nextra-border-color, #e5e7eb)'
        }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 500,
            fontSize: '14px'
          }}>
            Select Lagna Rashi (House 1)
          </label>
          <select
            value={lagnaRashi || ''}
            onChange={(e) => setLagnaRashi(e.target.value ? Number(e.target.value) : null)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--nextra-border-color, #ccc)',
              fontSize: '16px',
              background: 'white'
            }}
          >
            <option value="">-- Select Rashi --</option>
            {Object.entries(rashiNames).map(([num, name]) => (
              <option key={num} value={num}>{name}</option>
            ))}
          </select>
          {lagnaRashi && (
            <p style={{ marginTop: '0.5rem', fontSize: '12px', color: '#666' }}>
              All rashis will be arranged anticlockwise from {rashiNames[lagnaRashi]}
            </p>
          )}
        </div>

        {/* Planet Palette */}
        <div style={{
          padding: '1.5rem',
          background: 'var(--nextra-bg, #f9fafb)',
          borderRadius: '8px',
          border: '1px solid var(--nextra-border-color, #e5e7eb)'
        }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.75rem', 
            fontWeight: 500,
            fontSize: '14px'
          }}>
            Planets (Drag to houses)
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem'
          }}>
            {planetNames.map(planet => {
              const planetInChart = planets.find(p => p.name === planet)
              return (
                <div
                  key={planet}
                  draggable={true}
                  onDragStart={(e) => {
                    handlePlanetDragStart(planet)
                    e.dataTransfer.effectAllowed = 'move'
                    e.dataTransfer.setData('planet', planet)
                    e.dataTransfer.setData('text/plain', planet) // Fallback
                    console.log('Drag started:', planet)
                  }}
                  onDragEnd={(e) => {
                    handlePlanetDragEnd()
                    console.log('Drag ended')
                  }}
                  style={{
                    padding: '0.5rem',
                    background: planetInChart ? 'rgba(102, 126, 234, 0.1)' : 'white',
                    border: `2px solid ${planetInChart ? '#667eea' : '#d1d5db'}`,
                    borderRadius: '6px',
                    cursor: 'grab',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: 500,
                    opacity: draggedPlanet === planet ? 0.5 : 1,
                    transition: 'all 0.2s'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
                  onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
                >
                  {planet}
                  {planetInChart && (
                    <span style={{ 
                      display: 'block', 
                      fontSize: '10px', 
                      color: '#667eea',
                      marginTop: '0.25rem'
                    }}>
                      H{planetInChart.house}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        marginBottom: '2rem'
      }}>
        <VedicChart
          planets={planets}
          showLabels={true}
          size={500}
          onHouseClick={handleHouseClick}
          highlightedHouse={selectedHouse || undefined}
          houseRashis={houseRashis}
          onPlanetDrop={handlePlanetDrop}
        />
      </div>

      {/* Analysis Panels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: selectedHouseMeaning && selectedPlanetData ? '1fr 1fr' : '1fr',
        gap: '1.5rem'
      }}>
        {/* House Meaning Display Panel */}
        {selectedHouseMeaning && (
          <div style={{
            padding: '1.5rem',
            background: 'var(--nextra-bg, #f9fafb)',
            borderRadius: '8px',
            border: '2px solid #667eea',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.3s ease-in'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem'
            }}>
              <h4 style={{ 
                margin: 0,
                color: '#667eea',
                borderBottom: '2px solid #667eea',
                paddingBottom: '0.5rem',
                flex: 1
              }}>
                {selectedHouseMeaning.title}
              </h4>
              <button
                onClick={() => setSelectedHouse(null)}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginLeft: '1rem',
                  fontWeight: 500
                }}
              >
                Close
              </button>
            </div>
            
            <div style={{ 
              padding: '1rem',
              background: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '6px',
              lineHeight: '1.8',
              fontSize: '16px'
            }}>
              <p style={{ margin: 0 }}>
                {selectedHouseMeaning.description}
              </p>
            </div>
          </div>
        )}

        {/* Planet Analysis Panel */}
        {selectedPlanetData && (
          <div style={{
            padding: '1.5rem',
            background: 'var(--nextra-bg, #f9fafb)',
            borderRadius: '8px',
            border: '2px solid #667eea',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.3s ease-in'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem'
            }}>
              <h4 style={{ 
                margin: 0,
                color: '#667eea',
                borderBottom: '2px solid #667eea',
                paddingBottom: '0.5rem',
                flex: 1
              }}>
                {selectedPlanetData.name} in House {selectedPlanetData.house}
              </h4>
              <button
                onClick={() => {
                  removePlanet(selectedPlanetData.name)
                }}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginLeft: '1rem',
                  fontWeight: 500
                }}
              >
                Remove
              </button>
            </div>
            
            <div style={{ 
              padding: '1rem',
              background: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '6px',
              lineHeight: '1.8',
              fontSize: '16px'
            }}>
              <p style={{ margin: 0, fontStyle: 'italic', color: '#666' }}>
                Analysis details will be added here. Edit this component to add planet-specific analysis.
              </p>
              <div style={{ marginTop: '1rem', fontSize: '14px' }}>
                <strong>House Rashi:</strong> {houseRashis[selectedPlanetData.house] ? rashiNames[houseRashis[selectedPlanetData.house]] : 'N/A'}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
