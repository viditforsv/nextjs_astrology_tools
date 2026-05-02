import React, { useState } from 'react'

interface NavtaraChakraData {
  chakra: string
  significance: string
  nakshatra1: string
  nakshatra2: string
  nakshatra3: string
  mahaDasha: string
  dashaPeriod: number
  isNegative?: boolean
  isVeryNegative?: boolean
}

const nakshatras = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
]

const navtaraChakras: Omit<NavtaraChakraData, 'nakshatra1' | 'nakshatra2' | 'nakshatra3'>[] = [
  {
    chakra: 'Janma',
    significance: 'Good time to start any important work',
    mahaDasha: 'Mars',
    dashaPeriod: 7,
  },
  {
    chakra: 'Sampat',
    significance: 'Good time to start something related to Money',
    mahaDasha: 'Rahu',
    dashaPeriod: 18,
  },
  {
    chakra: 'Vipat',
    significance: 'No travel. No Risk',
    mahaDasha: 'Jupiter',
    dashaPeriod: 16,
    isNegative: true,
  },
  {
    chakra: 'Kshema',
    significance: 'Good Time To Start Health Related activities',
    mahaDasha: 'Saturn',
    dashaPeriod: 19,
  },
  {
    chakra: 'Pratyaari',
    significance: 'Avoid anything New thing. Avoid Taking Risks',
    mahaDasha: 'Mercury',
    dashaPeriod: 17,
    isNegative: true,
  },
  {
    chakra: 'Sadhana',
    significance: 'Good Time To Start Meditation, Sadhana, Spiritual',
    mahaDasha: 'Ketu',
    dashaPeriod: 7,
  },
  {
    chakra: 'Naidhana',
    significance: 'Don\'t start any new work. Don\'t Take Risk',
    mahaDasha: 'Venus',
    dashaPeriod: 20,
    isVeryNegative: true,
  },
  {
    chakra: 'Mitra',
    significance: 'Good To start new thing.',
    mahaDasha: 'Sun',
    dashaPeriod: 6,
  },
  {
    chakra: 'Param Mitra',
    significance: 'Good To start new thing.',
    mahaDasha: 'Moon',
    dashaPeriod: 10,
  },
]

export default function NavtaraChakra() {
  const [selectedNakshatra, setSelectedNakshatra] = useState<string>('')

  const generateChakraData = (startIndex: number): NavtaraChakraData[] => {
    return navtaraChakras.map((chakra, index) => {
      // Each row has nakshatras that are 9 positions apart
      const n1Index = (startIndex + index) % 27
      const n2Index = (startIndex + index + 9) % 27
      const n3Index = (startIndex + index + 18) % 27

      return {
        ...chakra,
        nakshatra1: nakshatras[n1Index],
        nakshatra2: nakshatras[n2Index],
        nakshatra3: nakshatras[n3Index],
      }
    })
  }

  const chakraData = selectedNakshatra
    ? generateChakraData(nakshatras.indexOf(selectedNakshatra))
    : []

  const totalDashaPeriod = chakraData.reduce((sum, chakra) => sum + chakra.dashaPeriod, 0)

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="nakshatra-select"
          style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            fontSize: '16px',
          }}
        >
          Select Birth Nakshatra:
        </label>
        <select
          id="nakshatra-select"
          value={selectedNakshatra}
          onChange={(e) => setSelectedNakshatra(e.target.value)}
          style={{
            padding: '10px 15px',
            fontSize: '16px',
            borderRadius: '6px',
            border: '1px solid var(--nextra-border)',
            backgroundColor: 'var(--nextra-bg)',
            color: 'var(--nextra-text)',
            minWidth: '250px',
            cursor: 'pointer',
          }}
        >
          <option value="">-- Select Nakshatra --</option>
          {nakshatras.map((nakshatra, index) => (
            <option key={nakshatra} value={nakshatra}>
              {index + 1} | {nakshatra}
            </option>
          ))}
        </select>
      </div>

      {selectedNakshatra && (
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
              border: '1px solid var(--nextra-border)',
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: '12px 8px',
                    textAlign: 'left',
                    borderBottom: '2px solid var(--nextra-border)',
                    fontWeight: '600',
                    backgroundColor: 'var(--nextra-bg)',
                  }}
                >
                  Sr.No.
                </th>
                <th
                  style={{
                    padding: '12px 8px',
                    textAlign: 'left',
                    borderBottom: '2px solid var(--nextra-border)',
                    fontWeight: '600',
                    backgroundColor: 'var(--nextra-bg)',
                  }}
                >
                  Navtara Chakra
                </th>
                <th
                  style={{
                    padding: '12px 8px',
                    textAlign: 'left',
                    borderBottom: '2px solid var(--nextra-border)',
                    fontWeight: '600',
                    backgroundColor: 'var(--nextra-bg)',
                  }}
                >
                  Significant
                </th>
                <th
                  style={{
                    padding: '12px 8px',
                    textAlign: 'left',
                    borderBottom: '2px solid var(--nextra-border)',
                    fontWeight: '600',
                    backgroundColor: 'var(--nextra-bg)',
                  }}
                >
                  Nakshatra 1
                </th>
                <th
                  style={{
                    padding: '12px 8px',
                    textAlign: 'left',
                    borderBottom: '2px solid var(--nextra-border)',
                    fontWeight: '600',
                    backgroundColor: 'var(--nextra-bg)',
                  }}
                >
                  Nakshatra 2
                </th>
                <th
                  style={{
                    padding: '12px 8px',
                    textAlign: 'left',
                    borderBottom: '2px solid var(--nextra-border)',
                    fontWeight: '600',
                    backgroundColor: 'var(--nextra-bg)',
                  }}
                >
                  Nakshatra 3
                </th>
                <th
                  style={{
                    padding: '12px 8px',
                    textAlign: 'left',
                    borderBottom: '2px solid var(--nextra-border)',
                    fontWeight: '600',
                    backgroundColor: 'var(--nextra-bg)',
                  }}
                >
                  Maha Dasha
                </th>
                <th
                  style={{
                    padding: '12px 8px',
                    textAlign: 'left',
                    borderBottom: '2px solid var(--nextra-border)',
                    fontWeight: '600',
                    backgroundColor: 'var(--nextra-bg)',
                  }}
                >
                  Dasha Period
                </th>
              </tr>
            </thead>
            <tbody>
              {chakraData.map((chakra, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: '1px solid var(--nextra-border)',
                    backgroundColor:
                      chakra.isVeryNegative
                        ? 'rgba(239, 68, 68, 0.1)'
                        : chakra.isNegative
                        ? 'rgba(234, 179, 8, 0.1)'
                        : 'transparent',
                  }}
                >
                  <td style={{ padding: '10px 8px', fontWeight: '500' }}>{index + 1}</td>
                  <td style={{ padding: '10px 8px', fontWeight: '500' }}>
                    {chakra.chakra}
                    {index === 0 && ' (Very Good)'}
                    {index === 8 && ' (Very Good)'}
                  </td>
                  <td style={{ padding: '10px 8px' }}>{chakra.significance}</td>
                  <td style={{ padding: '10px 8px' }}>{chakra.nakshatra1}</td>
                  <td style={{ padding: '10px 8px' }}>{chakra.nakshatra2}</td>
                  <td style={{ padding: '10px 8px' }}>{chakra.nakshatra3}</td>
                  <td style={{ padding: '10px 8px' }}>{chakra.mahaDasha}</td>
                  <td style={{ padding: '10px 8px', fontWeight: '500' }}>
                    {chakra.dashaPeriod}
                  </td>
                </tr>
              ))}
              <tr
                style={{
                  borderTop: '2px solid var(--nextra-border)',
                  fontWeight: '600',
                  backgroundColor: 'var(--nextra-bg)',
                }}
              >
                <td colSpan={7} style={{ padding: '10px 8px', textAlign: 'right' }}>
                  Total
                </td>
                <td style={{ padding: '10px 8px' }}>{totalDashaPeriod}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

