'use client'

import React, { useState, useMemo } from 'react'
import VedicChart from './VedicChart'

interface Planet {
  name: string
  house: number
  rashi: number // 1-12 (Mesha to Meena)
  vakri?: boolean
  combust?: boolean
  vargottam?: boolean
}

// Rashi types mapping
const rashiTypes: { [key: number]: 'char' | 'achar' | 'dwiswabhavi' } = {
  1: 'char',   // Mesha (Movable)
  2: 'achar',  // Vrishabha (Fixed)
  3: 'dwiswabhavi', // Mithuna (Dual)
  4: 'char',   // Karka (Movable)
  5: 'achar',  // Simha (Fixed)
  6: 'dwiswabhavi', // Kanya (Dual)
  7: 'char',   // Tula (Movable)
  8: 'achar',  // Vrishchika (Fixed)
  9: 'dwiswabhavi', // Dhanu (Dual)
  10: 'char',  // Makara (Movable)
  11: 'achar', // Kumbha (Fixed)
  12: 'dwiswabhavi' // Meena (Dual)
}

// Rashi names
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

// Calculate D9 house from D1 house and rashi
function calculateD9House(d1House: number, rashi: number): number {
  const rashiType = rashiTypes[rashi]
  let d9House: number

  switch (rashiType) {
    case 'char': // Movable - count from same sign
      d9House = d1House
      break
    case 'achar': // Fixed - count 9th from sign
      d9House = ((d1House - 1 + 8) % 12) + 1
      break
    case 'dwiswabhavi': // Dual - count 5th from sign
      d9House = ((d1House - 1 + 4) % 12) + 1
      break
    default:
      d9House = d1House
  }

  return d9House
}

// Check if planet is vargottam (same sign in D1 and D9)
function isVargottam(d1House: number, d9House: number, d1Rashi: number, d9Rashi: number): boolean {
  // For vargottam, we need same sign in D1 and D9
  // Simplified: if the calculation results in same house, likely vargottam
  // But proper check would need actual sign positions
  return d1Rashi === d9Rashi
}

// D9 House Qualities - Navmansha specific meanings
const d9HouseQualities: { [key: number]: { title: string; description: string; keyPoints: string[] } } = {
  1: {
    title: 'D9 1st House - <span className="hindi">लग्न</span> (Lagna)',
    description: 'Inherent qualities and natural abilities. What you know naturally (God-gifted), no practice needed.',
    keyPoints: [
      'Represents inherent knowledge and qualities',
      'Planet here gives its qualities most strongly',
      'Mostly good qualities are indicated',
      'Many malefics suggest difficult birth/C-section'
    ]
  },
  5: {
    title: 'D9 5th House - Practice at Home',
    description: 'Self-learning and practice done at home. Back of the mind - subconscious mind.',
    keyPoints: [
      'Represents self-learning at home',
      'Subconscious mind (D1H5 = conscious mind)',
      'Benefics: Easy life, skills come naturally',
      'Malefics: Life is difficult, internal struggle',
      '<span className="hindi">चंद्र</span> (Moon) here: Natural cooking/singing ability',
      '<span className="hindi">मंगल</span> (Mars) here: Person will make a home gym'
    ]
  },
  9: {
    title: 'D9 9th House - Practice at Teacher\'s Place',
    description: 'Learning from a Teacher/Guru/Institution. Represents luck and dharma.',
    keyPoints: [
      'Represents learning from Guru/Teacher',
      '<span className="hindi">गुरु</span> (Jupiter) here: Blessed, divine support always available',
      '<span className="hindi">शुक्र</span> (Venus) here: Luck rises after marriage',
      '<span className="hindi">राहु</span> (Rahu) here: Warning - may be cheated by Gurus',
      '<span className="hindi">शनि</span> (Saturn) here: Luck opens late',
      'The "99" Rule: Malefics act like snake at 99 in Snakes and Ladders'
    ]
  },
  10: {
    title: 'D9 10th House - Wealth (Artha)',
    description: 'Money/Wealth in D9. Shows financial results from past karma (bhagya).',
    keyPoints: [
      'Shows Money/Wealth (not just career)',
      'Benefics here: Rich, money from luck',
      'Malefics here: Past debts, losses in dasha',
      'Exception: Exalted/Own Sign malefics give massive wealth',
      'Malefics require voluntary donation before dasha'
    ]
  }
}

// D1 House Qualities - General house meanings
const d1HouseQualities: { [key: number]: { title: string; description: string; keyPoints: string[] } } = {
  1: {
    title: '1st House - <span className="hindi">लग्न</span> (Lagna)',
    description: 'Self, personality, physical body, overall life path. How you think or act.',
    keyPoints: [
      'Represents your thought process (soch)',
      'Physical body and appearance',
      'Personality and character',
      'Intellect and discrimination'
    ]
  },
  2: {
    title: '2nd House - <span className="hindi">धन भाव</span> (Dhana)',
    description: 'Wealth, family, speech, food, early education.',
    keyPoints: [
      'Wealth and material possessions',
      'Family and speech',
      'Food and eating habits',
      'Early education'
    ]
  },
  3: {
    title: '3rd House - <span className="hindi">सहज भाव</span> (Sahaj)',
    description: 'Siblings, courage, communication, short travels, skills.',
    keyPoints: [
      'Siblings and relationships',
      'Courage and effort',
      'Communication skills',
      'Short travels'
    ]
  },
  4: {
    title: '4th House - <span className="hindi">सुख भाव</span> (Sukha)',
    description: 'Mother, home, property, vehicles, emotions, education.',
    keyPoints: [
      'Mother and home',
      'Property and vehicles',
      'Emotions and mind',
      'Education and comfort'
    ]
  },
  5: {
    title: '5th House - <span className="hindi">पुत्र भाव</span> (Putra)',
    description: 'Children, creativity, intelligence, conscious mind.',
    keyPoints: [
      'Children and progeny',
      'Creativity and intelligence',
      'Conscious mind (D1H5)',
      'Merit and past karma'
    ]
  },
  6: {
    title: '6th House - <span className="hindi">रिपु भाव</span> (Ripu)',
    description: 'Enemies, diseases, service, debts.',
    keyPoints: [
      'Enemies and obstacles',
      'Diseases and health issues',
      'Service and daily work',
      'Debts and litigation'
    ]
  },
  7: {
    title: '7th House - <span className="hindi">कलत्र भाव</span> (Kalatra)',
    description: 'Spouse, marriage, partnerships, business.',
    keyPoints: [
      'Spouse and marriage',
      'Partnerships and relationships',
      'Business partnerships',
      'Public dealings'
    ]
  },
  8: {
    title: '8th House - <span className="hindi">आयु भाव</span> (Ayur)',
    description: 'Longevity, transformation, occult, hidden matters.',
    keyPoints: [
      'Longevity and lifespan',
      'Transformation and change',
      'Occult and hidden knowledge',
      'Unexpected events'
    ]
  },
  9: {
    title: '9th House - <span className="hindi">भाग्य भाव</span> (Bhagya)',
    description: 'Father, guru, fortune, dharma, higher learning.',
    keyPoints: [
      'Father and guru',
      'Fortune and luck',
      'Dharma and righteousness',
      'Higher learning and philosophy'
    ]
  },
  10: {
    title: '10th House - <span className="hindi">कर्म भाव</span> (Karma)',
    description: 'Career, status, reputation, profession.',
    keyPoints: [
      'Career and profession',
      'Status and reputation',
      'Public image',
      'Karma and actions'
    ]
  },
  11: {
    title: '11th House - <span className="hindi">लाभ भाव</span> (Labha)',
    description: 'Gains, income, friends, aspirations.',
    keyPoints: [
      'Gains and income',
      'Friends and social circle',
      'Aspirations and desires',
      'Elder siblings'
    ]
  },
  12: {
    title: '12th House - <span className="hindi">व्यय भाव</span> (Vyaya)',
    description: 'Losses, expenses, moksha, spirituality.',
    keyPoints: [
      'Losses and expenses',
      'Moksha and spirituality',
      'Foreign lands',
      'Bed pleasures and isolation'
    ]
  }
}

export default function NavmanshaChart() {
  const [d1Planets, setD1Planets] = useState<Planet[]>([
    { name: 'Sun', house: 1, rashi: 1 },
    { name: 'Moon', house: 2, rashi: 2 },
    { name: 'Mars', house: 3, rashi: 3 },
    { name: 'Mercury', house: 4, rashi: 4 },
    { name: 'Jupiter', house: 5, rashi: 5 },
    { name: 'Venus', house: 6, rashi: 6 },
    { name: 'Saturn', house: 7, rashi: 7 },
    { name: 'Rahu', house: 8, rashi: 8 },
    { name: 'Ketu', house: 9, rashi: 9 },
  ])
  const [selectedPlanet, setSelectedPlanet] = useState<string>('Sun')
  const [selectedHouse, setSelectedHouse] = useState<number>(1)
  const [selectedRashi, setSelectedRashi] = useState<number>(1)
  const [showD1, setShowD1] = useState<boolean>(true)
  const [showD9, setShowD9] = useState<boolean>(true)
  const [selectedD1House, setSelectedD1House] = useState<number | null>(null)
  const [selectedD9House, setSelectedD9House] = useState<number | null>(null)

  // Calculate D9 planets from D1
  const d9Planets = useMemo(() => {
    return d1Planets.map(planet => {
      const d9House = calculateD9House(planet.house, planet.rashi)
      // For D9, we assume same rashi for simplicity (actual calculation would need degrees)
      const d9Rashi = planet.rashi
      const vargottam = isVargottam(planet.house, d9House, planet.rashi, d9Rashi)
      
      return {
        name: planet.name,
        house: d9House,
        rashi: d9Rashi,
        vakri: planet.vakri,
        combust: planet.combust,
        vargottam: vargottam
      }
    })
  }, [d1Planets])

  const addPlanet = () => {
    const existingPlanet = d1Planets.find(p => p.name === selectedPlanet)
    if (existingPlanet) {
      // Update existing planet
      setD1Planets(d1Planets.map(p => 
        p.name === selectedPlanet 
          ? { ...p, house: selectedHouse, rashi: selectedRashi }
          : p
      ))
    } else {
      // Add new planet
      setD1Planets([...d1Planets, {
        name: selectedPlanet,
        house: selectedHouse,
        rashi: selectedRashi,
        vakri: selectedPlanet === 'Rahu' || selectedPlanet === 'Ketu'
      }])
    }
  }

  const removePlanet = (planetName: string) => {
    setD1Planets(d1Planets.filter(p => p.name !== planetName))
  }

  const planetOptions = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ 
        marginBottom: '2rem',
        padding: '1.5rem',
        background: 'var(--nextra-bg, #fff)',
        borderRadius: '8px',
        border: '1px solid var(--nextra-border-color, #e5e7eb)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Configure D1 (Birth Chart)</h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Planet
            </label>
            <select
              value={selectedPlanet}
              onChange={(e) => setSelectedPlanet(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid var(--nextra-border-color, #ccc)'
              }}
            >
              {planetOptions.map(planet => (
                <option key={planet} value={planet}>{planet}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              House (1-12)
            </label>
            <select
              value={selectedHouse}
              onChange={(e) => setSelectedHouse(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid var(--nextra-border-color, #ccc)'
              }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(house => (
                <option key={house} value={house}>{house}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Rashi (Sign)
            </label>
            <select
              value={selectedRashi}
              onChange={(e) => setSelectedRashi(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid var(--nextra-border-color, #ccc)'
              }}
            >
              {Object.entries(rashiNames).map(([num, name]) => (
                <option key={num} value={num}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={addPlanet}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 500,
            marginRight: '0.5rem'
          }}
        >
          {d1Planets.find(p => p.name === selectedPlanet) ? 'Update' : 'Add'} Planet
        </button>

        <div style={{ marginTop: '1rem' }}>
          <strong>Current Planets:</strong>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.5rem',
            marginTop: '0.5rem'
          }}>
            {d1Planets.map(planet => (
              <div
                key={planet.name}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--nextra-bg, #f3f4f6)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span><strong>{planet.name}</strong>: H{planet.house}, {rashiNames[planet.rashi]}</span>
                <button
                  onClick={() => removePlanet(planet.name)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.25rem 0.5rem',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        alignItems: 'center'
      }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showD1}
            onChange={(e) => setShowD1(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span>Show D1 (Birth Chart)</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showD9}
            onChange={(e) => setShowD9(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span>Show D9 (Navmansha)</span>
        </label>
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: showD1 && showD9 ? '1fr 1fr' : '1fr',
        gap: '2rem',
        marginTop: '1rem'
      }}>
        {showD1 && (
          <div>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>
              D1 - Birth Chart
            </h3>
            <VedicChart
              planets={d1Planets.map(p => ({
                name: p.name,
                house: p.house,
                vakri: p.vakri,
                combust: p.combust
              }))}
              showLabels={true}
              size={400}
              onHouseClick={(house) => setSelectedD1House(house === selectedD1House ? null : house)}
              highlightedHouse={selectedD1House || undefined}
            />
            <div style={{ 
              marginTop: '1rem',
              padding: '1rem',
              background: 'var(--nextra-bg, #f9fafb)',
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              <strong>Planets:</strong>
              <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                {d1Planets.map(p => (
                  <li key={p.name}>
                    <strong>{p.name}</strong> in House {p.house} ({rashiNames[p.rashi]})
                    {rashiTypes[p.rashi] === 'char' && ' - Char (Same)'}
                    {rashiTypes[p.rashi] === 'achar' && ' - Achar (9th)'}
                    {rashiTypes[p.rashi] === 'dwiswabhavi' && ' - Dwiswabhavi (5th)'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {showD9 && (
          <div>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>
              D9 - Navmansha Chart
            </h3>
            <VedicChart
              planets={d9Planets.map(p => ({
                name: p.name,
                house: p.house,
                vakri: p.vakri,
                combust: p.combust,
                vargottam: p.vargottam
              }))}
              showLabels={true}
              size={400}
              onHouseClick={(house) => setSelectedD9House(house === selectedD9House ? null : house)}
              highlightedHouse={selectedD9House || undefined}
            />
            <div style={{ 
              marginTop: '1rem',
              padding: '1rem',
              background: 'var(--nextra-bg, #f9fafb)',
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              <strong>D9 Planets:</strong>
              <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                {d9Planets.map(p => {
                  const d1Planet = d1Planets.find(dp => dp.name === p.name)
                  return (
                    <li key={p.name}>
                      <strong>{p.name}</strong> in House {p.house} 
                      {p.vargottam && ' (Vargottam)'}
                      {d1Planet && ` (from D1 H${d1Planet.house})`}
                    </li>
                  )
                })}
              </ul>
              <div style={{ marginTop: '0.5rem', fontSize: '12px', color: '#666' }}>
                <strong>Legend:</strong> * = Retrograde, ^ = Combust, □ = Vargottam
              </div>
            </div>
          </div>
        )}
      </div>

      {/* House Qualities Display */}
      {(selectedD1House || selectedD9House) && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--nextra-bg, #f9fafb)',
          borderRadius: '8px',
          border: '2px solid #667eea',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: selectedD1House && selectedD9House ? '1fr 1fr' : '1fr',
            gap: '1.5rem'
          }}>
            {selectedD1House && d1HouseQualities[selectedD1House] && (
              <div>
                <h4 style={{ 
                  marginTop: 0,
                  color: '#667eea',
                  borderBottom: '2px solid #667eea',
                  paddingBottom: '0.5rem'
                }}>
                  <span dangerouslySetInnerHTML={{ __html: d1HouseQualities[selectedD1House].title }} />
                </h4>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                  {d1HouseQualities[selectedD1House].description}
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                  {d1HouseQualities[selectedD1House].keyPoints.map((point, idx) => (
                    <li key={idx} dangerouslySetInnerHTML={{ __html: point }} />
                  ))}
                </ul>
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '6px' }}>
                  <strong>Planets in this house:</strong>
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {d1Planets.filter(p => p.house === selectedD1House).map(p => (
                      <span key={p.name} style={{
                        padding: '0.25rem 0.75rem',
                        background: '#667eea',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}>
                        {p.name} ({rashiNames[p.rashi]})
                      </span>
                    ))}
                    {d1Planets.filter(p => p.house === selectedD1House).length === 0 && (
                      <span style={{ color: '#666', fontStyle: 'italic' }}>No planets</span>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {selectedD9House && (
              <div>
                <h4 style={{ 
                  marginTop: 0,
                  color: '#667eea',
                  borderBottom: '2px solid #667eea',
                  paddingBottom: '0.5rem'
                }}>
                  {d9HouseQualities[selectedD9House] ? (
                    <span dangerouslySetInnerHTML={{ __html: d9HouseQualities[selectedD9House].title }} />
                  ) : (
                    `D9 ${selectedD9House}th House`
                  )}
                </h4>
                {d9HouseQualities[selectedD9House] ? (
                  <>
                    <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                      {d9HouseQualities[selectedD9House].description}
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                      {d9HouseQualities[selectedD9House].keyPoints.map((point, idx) => (
                        <li key={idx} dangerouslySetInnerHTML={{ __html: point }} />
                      ))}
                    </ul>
                  </>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>
                    Click on houses 1, 5, 9, or 10 for detailed D9 Navmansha meanings.
                  </p>
                )}
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '6px' }}>
                  <strong>Planets in this house:</strong>
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {d9Planets.filter(p => p.house === selectedD9House).map(p => {
                      const d1Planet = d1Planets.find(dp => dp.name === p.name)
                      return (
                        <span key={p.name} style={{
                          padding: '0.25rem 0.75rem',
                          background: '#667eea',
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}>
                          {p.name}
                          {p.vargottam && ' (Vargottam)'}
                          {d1Planet && ` (from D1 H${d1Planet.house})`}
                        </span>
                      )
                    })}
                    {d9Planets.filter(p => p.house === selectedD9House).length === 0 && (
                      <span style={{ color: '#666', fontStyle: 'italic' }}>No planets</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <button
              onClick={() => {
                setSelectedD1House(null)
                setSelectedD9House(null)
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
