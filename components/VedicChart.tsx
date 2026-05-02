import React, { useMemo } from 'react'

interface Planet {
  name: string
  house: number
  vakri?: boolean  // Retrograde
  combust?: boolean  // Combust
  vargottam?: boolean  // Vargottam
}

interface VedicChartProps {
  planets?: Planet[]
  showLabels?: boolean
  size?: number
  crossHouses?: number[]
  checkHouses?: number[]
  houseNumbers?: { [house: number]: number }
  onHouseClick?: (houseNumber: number) => void
  highlightedHouse?: number
  houseRashis?: { [house: number]: number } // Rashi number (1-12) for each house
  onPlanetDrop?: (planetName: string, houseNumber: number) => void
}

// Theme configuration
const theme = {
  planetColor: '#162E56',
  labelColor: '#2A4D7A',
  crossColor: '#B00020',
  checkColor: '#008000',
  strokeColor: '#000000',
  houseStrokeWidth: 2,
  lineStrokeWidth: 1.5,
  houseBorderColor: '#d1d5db', // Light gray for house boundaries
  houseBorderWidth: 1,
}

// Planet symbols mapping with Hindi names
const planetSymbols: { [key: string]: string } = {
  'Sun': 'सू',
  'Moon': 'चं',
  'Mars': 'मं',
  'Mercury': 'बु',
  'Jupiter': 'गु',
  'Venus': 'शु',
  'Saturn': 'श',
  'Rahu': 'रा',
  'Ketu': 'के',
}

// Planet full names (for tooltips/accessibility)
const planetNames: { [key: string]: string } = {
  'Sun': 'सूर्य',
  'Moon': 'चंद्र',
  'Mars': 'मंगल',
  'Mercury': 'बुध',
  'Jupiter': 'गुरु',
  'Venus': 'शुक्र',
  'Saturn': 'शनि',
  'Rahu': 'राहु',
  'Ketu': 'केतु',
}

// Geometry computation helper
function computeGeometry(size: number) {
  const squareSize = size * 0.67
  const center = squareSize / 2
  const midpoint = squareSize / 4
  return { squareSize, center, midpoint }
}

// Generate North Indian style houses
function generateNorthIndianHouses(center: number, midpoint: number, squareSize: number) {
  return [
    { 
      points: `${center},${center} ${center+midpoint},${center-midpoint} ${center},0 ${center-midpoint},${center-midpoint}`, 
      label: "1", 
      center: { x: center, y: center * 0.4 } 
    },
    { 
      points: `0,0 ${center-midpoint},${center-midpoint} ${center},0`, 
      label: "2", 
      center: { x: center * 0.5, y: center * 0.2 } 
    },
    { 
      points: `0,0 ${center-midpoint},${center-midpoint} 0,${center}`, 
      label: "3", 
      center: { x: center * 0.15, y: center * 0.5 } 
    },
    { 
      points: `0,${center} ${center-midpoint},${center-midpoint} ${center},${center} ${center-midpoint},${center+midpoint}`, 
      label: "4", 
      center: { x: center * 0.5, y: center } 
    },
    { 
      points: `0,${center} ${center-midpoint},${center+midpoint} 0,${squareSize}`, 
      label: "5", 
      center: { x: center * 0.15, y: center * 1.5 } 
    },
    { 
      points: `0,${squareSize} ${center-midpoint},${center+midpoint} ${center},${squareSize}`, 
      label: "6", 
      center: { x: center * 0.5, y: center * 1.8 } 
    },
    { 
      points: `${center-midpoint},${center+midpoint} ${center},${center} ${center+midpoint},${center+midpoint} ${center},${squareSize}`, 
      label: "7", 
      center: { x: center, y: center * 1.5 } 
    },
    { 
      points: `${center},${squareSize} ${center+midpoint},${center+midpoint} ${squareSize},${squareSize}`, 
      label: "8", 
      center: { x: center * 1.5, y: center * 1.8 } 
    },
    { 
      points: `${center+midpoint},${center+midpoint} ${squareSize},${center} ${squareSize},${squareSize}`, 
      label: "9", 
      center: { x: center * 1.85, y: center * 1.5 } 
    },
    { 
      points: `${center+midpoint},${center-midpoint} ${center},${center} ${center+midpoint},${center+midpoint} ${squareSize},${center}`, 
      label: "10", 
      center: { x: center * 1.5, y: center } 
    },
    { 
      points: `${center+midpoint},${center-midpoint} ${squareSize},${center} ${squareSize},0`, 
      label: "11", 
      center: { x: center * 1.85, y: center * 0.5 } 
    },
    { 
      points: `${squareSize},0 ${center+midpoint},${center-midpoint} ${center},0`, 
      label: "12", 
      center: { x: center * 1.5, y: center * 0.2 } 
    },
  ]
}

// Normalize planet data - apply astrological rules
function normalizePlanet(planet: Planet): Planet {
  const normalized = { ...planet }
  
  // Rahu and Ketu are always vakri (retrograde)
  if (planet.name === 'Rahu' || planet.name === 'Ketu') {
    normalized.vakri = true
  }
  
  // Sun and Moon are never combust (luminaries cannot be combust)
  if (planet.name === 'Sun' || planet.name === 'Moon') {
    normalized.combust = false
  }
  
  return normalized
}

// Calculate planet positions with smart layout
function calculatePlanetPositions(
  planetsByHouse: { [house: number]: Planet[] },
  houses: ReturnType<typeof generateNorthIndianHouses>,
  houseNumbers: { [house: number]: number },
  houseRashis: { [house: number]: number },
  showLabels: boolean
) {
  const positions: Array<{ planet: Planet; x: number; y: number; houseNum: number }> = []

  Object.entries(planetsByHouse).forEach(([houseStr, housePlanets]) => {
    const houseNum = parseInt(houseStr)
    const houseIndex = houseNum - 1
    const houseCenter = houses[houseIndex]?.center
    if (!houseCenter) return

    const planetCount = housePlanets.length
    const hasHouseNumber = houseNumbers[houseNum] !== undefined
    const hasRashi = houseRashis[houseNum] !== undefined
    // rashi label sits at houseCenter.y - 18 (see render). Push planets below.
    const rashiPushY = hasRashi ? 18 : 0
    const baseY = houseCenter.y + (showLabels ? 18 : 0) + rashiPushY

    if (planetCount === 1) {
      // Single planet — keep horizontal offset only when a house number badge is shown
      const offsetX = hasHouseNumber ? -14 : 0
      const offsetY = hasHouseNumber ? -10 : 0
      positions.push({
        planet: normalizePlanet(housePlanets[0]),
        x: houseCenter.x + offsetX,
        y: baseY + offsetY,
        houseNum
      })
    } else if (planetCount <= 4) {
      // 2-4 planets: horizontal layout
      const horizontalSpacing = 26
      const startOffsetX = -(planetCount - 1) * horizontalSpacing / 2
      const offsetY = hasHouseNumber ? -12 : 0

      housePlanets.forEach((planet, planetIndex) => {
        positions.push({
          planet: normalizePlanet(planet),
          x: houseCenter.x + startOffsetX + (planetIndex * horizontalSpacing),
          y: baseY + offsetY,
          houseNum
        })
      })
    } else {
      // 5+ planets: radial/stacked layout for crowded houses
      const radius = Math.min(planetCount * 3, 25)
      const angleStep = (2 * Math.PI) / planetCount

      housePlanets.forEach((planet, planetIndex) => {
        const angle = planetIndex * angleStep
        const offsetX = Math.cos(angle) * radius
        const offsetY = Math.sin(angle) * radius
        positions.push({
          planet: normalizePlanet(planet),
          x: houseCenter.x + offsetX,
          y: baseY + offsetY,
          houseNum
        })
      })
    }
  })

  return positions
}

export default function VedicChart({ 
  planets = [], 
  showLabels = false,
  size = 300,
  crossHouses = [],
  checkHouses = [],
  houseNumbers = {},
  onHouseClick,
  highlightedHouse,
  houseRashis = {},
  onPlanetDrop
}: VedicChartProps) {
  // Memoize geometry calculations
  const geometry = useMemo(() => computeGeometry(size), [size])
  const { squareSize, center, midpoint } = geometry

  // Memoize house definitions
  const houses = useMemo(
    () => generateNorthIndianHouses(center, midpoint, squareSize),
    [center, midpoint, squareSize]
  )

  // Memoize planet grouping
  const planetsByHouse = useMemo(() => {
    const map: { [house: number]: Planet[] } = {}
    planets.forEach(planet => {
      (map[planet.house] ||= []).push(planet)
    })
    return map
  }, [planets])

  // Memoize planet positions
  const planetPositions = useMemo(
    () => calculatePlanetPositions(planetsByHouse, houses, houseNumbers, houseRashis, showLabels),
    [planetsByHouse, houses, houseNumbers, houseRashis, showLabels]
  )

  // Memoize house number positions
  const houseNumberPositions = useMemo(() => {
    return Object.entries(houseNumbers).map(([houseStr, number]) => {
      const houseNum = parseInt(houseStr)
      const houseIndex = houseNum - 1
      const houseCenter = houses[houseIndex]?.center
      if (!houseCenter) return null

      const housePlanets = planets.filter(p => p.house === houseNum)
      const planetCount = housePlanets.length
      
      let offsetX = 0
      let offsetY = 0
      
      if (planetCount > 0) {
        if (planetCount === 1) {
          offsetX = 12
          offsetY = -8
        } else if (planetCount <= 4) {
          offsetX = (planetCount - 1) * 10 + 15
          offsetY = -10
        } else {
          // For radial layout, place number below
          offsetX = 0
          offsetY = 15
        }
      }
      
      return {
        houseNum,
        number,
        x: houseCenter.x + offsetX,
        y: houseCenter.y + (showLabels ? 15 : 0) + offsetY
      }
    }).filter(Boolean) as Array<{ houseNum: number; number: number; x: number; y: number }>
  }, [houseNumbers, houses, planets, showLabels])

  // Helper function to check if point is in polygon
  const isPointInPolygon = (x: number, y: number, points: number[][]): boolean => {
    let inside = false
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const xi = points[i][0], yi = points[i][1]
      const xj = points[j][0], yj = points[j][1]
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
      if (intersect) inside = !inside
    }
    return inside
  }

  const handleSvgDrop = (e: React.DragEvent<SVGSVGElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const planetName = e.dataTransfer.getData('planet') || e.dataTransfer.getData('text/plain')
    if (planetName && onPlanetDrop) {
      // Get mouse position relative to SVG
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      // Scale coordinates to viewBox coordinates
      const scale = squareSize / size
      const viewBoxX = x * scale
      const viewBoxY = y * scale
      
      // Find which house contains this point
      for (let i = 0; i < houses.length; i++) {
        const house = houses[i]
        const points = house.points.split(' ').map(p => p.split(',').map(Number))
        if (isPointInPolygon(viewBoxX, viewBoxY, points)) {
          onPlanetDrop(planetName, i + 1)
          return
        }
      }
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${squareSize} ${squareSize}`}
        style={{ maxWidth: '100%', height: 'auto' }}
        onDrop={handleSvgDrop}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        {/* Draw houses */}
        {houses.map((house, index) => {
          const houseNumber = index + 1
          const isHighlighted = highlightedHouse === houseNumber
          const isClickable = !!onHouseClick
          
          return (
          <g key={index}>
            <polygon
              points={house.points}
                fill={isHighlighted ? 'rgba(102, 126, 234, 0.2)' : 'none'}
                stroke={isHighlighted ? '#667eea' : theme.houseBorderColor}
                strokeWidth={isHighlighted ? 2 : theme.houseBorderWidth}
                style={{
                  cursor: (isClickable || onPlanetDrop) ? 'pointer' : 'default',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => onHouseClick?.(houseNumber)}
                onDrop={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const planetName = e.dataTransfer.getData('planet')
                  if (planetName && onPlanetDrop) {
                    onPlanetDrop(planetName, houseNumber)
                  }
                  // Reset visual state
                  e.currentTarget.setAttribute('fill', isHighlighted ? 'rgba(102, 126, 234, 0.2)' : 'none')
                  e.currentTarget.setAttribute('stroke', isHighlighted ? '#667eea' : theme.houseBorderColor)
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (onPlanetDrop) {
                    e.currentTarget.setAttribute('fill', 'rgba(102, 126, 234, 0.25)')
                    e.currentTarget.setAttribute('stroke', '#667eea')
                    e.currentTarget.setAttribute('stroke-width', '2')
                  }
                }}
                onDragEnter={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (onPlanetDrop) {
                    e.currentTarget.setAttribute('fill', 'rgba(102, 126, 234, 0.25)')
                    e.currentTarget.setAttribute('stroke', '#667eea')
                  }
                }}
                onDragLeave={(e) => {
                  if (onPlanetDrop) {
                    e.currentTarget.setAttribute('fill', isHighlighted ? 'rgba(102, 126, 234, 0.2)' : 'none')
                    e.currentTarget.setAttribute('stroke', isHighlighted ? '#667eea' : theme.houseBorderColor)
                    e.currentTarget.setAttribute('stroke-width', isHighlighted ? '2' : theme.houseBorderWidth.toString())
                  }
                }}
                onMouseEnter={(e) => {
                  if (isClickable && !onPlanetDrop) {
                    e.currentTarget.setAttribute('fill', 'rgba(102, 126, 234, 0.1)')
                    if (!isHighlighted) {
                      e.currentTarget.setAttribute('stroke', '#667eea')
                      e.currentTarget.setAttribute('stroke-width', '1.5')
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (isClickable && !isHighlighted && !onPlanetDrop) {
                    e.currentTarget.setAttribute('fill', 'none')
                    e.currentTarget.setAttribute('stroke', theme.houseBorderColor)
                    e.currentTarget.setAttribute('stroke-width', theme.houseBorderWidth.toString())
                  }
                }}
              />
              {showLabels && !houseRashis[houseNumber] && (
              <text
                x={house.center.x}
                y={house.center.y}
                fontSize="16"
                textAnchor="middle"
                  fill={isHighlighted ? theme.planetColor : theme.labelColor}
                  fontWeight={isHighlighted ? 'bold' : 'normal'}
                  style={{ cursor: isClickable ? 'pointer' : 'default', pointerEvents: 'none' }}
              >
                भाव {house.label}
              </text>
            )}
              {houseRashis[houseNumber] && (
                <text
                  x={house.center.x}
                  y={house.center.y - (planetsByHouse[houseNumber]?.length ? 18 : 0)}
                  fontSize="18"
                  textAnchor="middle"
                  fill={isHighlighted ? theme.planetColor : theme.labelColor}
                  fontWeight="bold"
                  style={{ cursor: isClickable ? 'pointer' : 'default', pointerEvents: 'none' }}
                >
                  {houseRashis[houseNumber]}
                </text>
              )}
            </g>
          )
        })}

        {/* Draw outer square */}
        <rect
          x="0"
          y="0"
          width={squareSize}
          height={squareSize}
          stroke={theme.strokeColor}
          fill="none"
          strokeWidth={theme.houseStrokeWidth}
        />

        {/* Draw diagonals */}
        <line
          x1="0"
          y1={squareSize}
          x2={squareSize}
          y2="0"
          stroke={theme.strokeColor}
          strokeWidth={theme.lineStrokeWidth}
        />
        <line
          x1={squareSize}
          y1={squareSize}
          x2="0"
          y2="0"
          stroke={theme.strokeColor}
          strokeWidth={theme.lineStrokeWidth}
        />

        {/* Draw inner square (midpoint connections) */}
        <line
          x1={center}
          y1={squareSize}
          x2={squareSize}
          y2={center}
          stroke={theme.strokeColor}
          strokeWidth={theme.lineStrokeWidth}
        />
        <line
          x1={squareSize}
          y1={center}
          x2={center}
          y2="0"
          stroke={theme.strokeColor}
          strokeWidth={theme.lineStrokeWidth}
        />
        <line
          x1={center}
          y1="0"
          x2="0"
          y2={center}
          stroke={theme.strokeColor}
          strokeWidth={theme.lineStrokeWidth}
        />
        <line
          x1="0"
          y1={center}
          x2={center}
          y2={squareSize}
          stroke={theme.strokeColor}
          strokeWidth={theme.lineStrokeWidth}
        />

        {/* Draw intersection point markers (no labels) */}
        {/* Center point O */}
        <circle cx={center} cy={center} r="3" fill={theme.strokeColor} />

        {/* Corner points: A, B, C, D */}
        <circle cx="0" cy={squareSize} r="3" fill={theme.strokeColor} />
        <circle cx={squareSize} cy={squareSize} r="3" fill={theme.strokeColor} />
        <circle cx={squareSize} cy="0" r="3" fill={theme.strokeColor} />
        <circle cx="0" cy="0" r="3" fill={theme.strokeColor} />

        {/* Midpoint points: A', B', C', D' */}
        <circle cx={center} cy={squareSize} r="3" fill={theme.strokeColor} />
        <circle cx={squareSize} cy={center} r="3" fill={theme.strokeColor} />
        <circle cx={center} cy="0" r="3" fill={theme.strokeColor} />
        <circle cx="0" cy={center} r="3" fill={theme.strokeColor} />

        {/* Inner intersection points: P, Q, R, S */}
        <circle cx={center - midpoint} cy={center - midpoint} r="3" fill={theme.strokeColor} />
        <circle cx={center + midpoint} cy={center - midpoint} r="3" fill={theme.strokeColor} />
        <circle cx={center + midpoint} cy={center + midpoint} r="3" fill={theme.strokeColor} />
        <circle cx={center - midpoint} cy={center + midpoint} r="3" fill={theme.strokeColor} />

        {/* Draw planets */}
        {planetPositions.map(({ planet, x, y, houseNum }, index) => {
          const planetSymbol = planetSymbols[planet.name] || planet.name
          const hasVakri = planet.vakri
          const hasCombust = planet.combust
          const hasVargottam = planet.vargottam
          
          // Build superscript symbols string
          let superscriptSymbols = ''
          if (hasVakri) superscriptSymbols += '*'
          if (hasCombust) superscriptSymbols += '^'
          if (hasVargottam) superscriptSymbols += '□'
          
          return (
            <g key={`planet-${houseNum}-${index}`}>
              <text
                x={x}
                y={y}
                fontSize="22"
                fontWeight="bold"
                textAnchor="middle"
                fill={theme.planetColor}
              >
                {planetSymbol}
                {superscriptSymbols && (
                  <tspan
                    fontSize="14"
                    baselineShift="0.4em"
                    fill={theme.planetColor}
                  >
                    {superscriptSymbols}
                  </tspan>
                )}
              </text>
            </g>
          )
        })}

        {/* Draw numbers in houses */}
        {houseNumberPositions.map(({ houseNum, number, x, y }) => (
          <text
            key={`number-${houseNum}`}
            x={x}
            y={y}
            fontSize="18"
            fontWeight="bold"
            textAnchor="middle"
            fill={theme.labelColor}
          >
            {number}
          </text>
        ))}

        {/* Draw crosses in specified houses */}
        {crossHouses.map((houseNum) => {
          const houseIndex = houseNum - 1
          const houseCenter = houses[houseIndex]?.center
          if (!houseCenter) return null

          const crossSize = 8
          return (
            <g key={`cross-${houseNum}`}>
              <line
                x1={houseCenter.x - crossSize}
                y1={houseCenter.y - crossSize}
                x2={houseCenter.x + crossSize}
                y2={houseCenter.y + crossSize}
                stroke={theme.crossColor}
                strokeWidth="2"
              />
              <line
                x1={houseCenter.x - crossSize}
                y1={houseCenter.y + crossSize}
                x2={houseCenter.x + crossSize}
                y2={houseCenter.y - crossSize}
                stroke={theme.crossColor}
                strokeWidth="2"
              />
            </g>
          )
        })}

        {/* Draw check marks in specified houses */}
        {checkHouses.map((houseNum) => {
          const houseIndex = houseNum - 1
          const houseCenter = houses[houseIndex]?.center
          if (!houseCenter) return null

          const checkSize = 8
          return (
            <g key={`check-${houseNum}`}>
              <path
                d={`M ${houseCenter.x - checkSize} ${houseCenter.y} L ${houseCenter.x - checkSize * 0.3} ${houseCenter.y + checkSize * 0.7} L ${houseCenter.x + checkSize} ${houseCenter.y - checkSize * 0.7}`}
                stroke={theme.checkColor}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
