import React, { useState } from 'react'
import Link from 'next/link'

interface SortableTableProps {
  headers: string[]
  data: (string | number)[][]
  linkColumn?: number
  linkPrefix?: string
}

type SortDirection = 'asc' | 'desc' | null

export default function SortableTable({ headers, data, linkColumn, linkPrefix }: SortableTableProps) {
  const [sortColumn, setSortColumn] = useState<number | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const handleSort = (columnIndex: number) => {
    let newDirection: SortDirection = 'asc'
    
    if (sortColumn === columnIndex) {
      if (sortDirection === 'asc') {
        newDirection = 'desc'
      } else if (sortDirection === 'desc') {
        newDirection = null
      }
    }
    
    setSortColumn(newDirection === null ? null : columnIndex)
    setSortDirection(newDirection)
  }

  const sortedData = React.useMemo(() => {
    if (sortColumn === null || sortDirection === null) {
      return data
    }

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]

      // Handle numeric sorting for first column (number)
      if (sortColumn === 0) {
        const aNum = typeof aVal === 'number' ? aVal : parseInt(aVal as string)
        const bNum = typeof bVal === 'number' ? bVal : parseInt(bVal as string)
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum
      }

      // String sorting for other columns
      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      
      if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1
      if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortColumn, sortDirection])

  const getSortIcon = (columnIndex: number) => {
    if (sortColumn !== columnIndex) {
      return <span style={{ opacity: 0.3, marginLeft: '4px' }}>⇅</span>
    }
    if (sortDirection === 'asc') {
      return <span style={{ marginLeft: '4px' }}>↑</span>
    }
    return <span style={{ marginLeft: '4px' }}>↓</span>
  }

  const formatLinkPath = (value: string | number) => {
    return String(value).toLowerCase().replace(/\s+/g, '-')
  }

  return (
    <div style={{ overflowX: 'auto', margin: '20px 0' }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        fontSize: '14px'
      }}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                onClick={() => handleSort(index)}
                style={{
                  padding: '12px 8px',
                  textAlign: 'left',
                  borderBottom: '2px solid var(--nextra-border)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  fontWeight: '600',
                  backgroundColor: 'var(--nextra-bg)',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--nextra-primary-hue)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--nextra-bg)'
                }}
              >
                {header}
                {getSortIcon(index)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr 
              key={rowIndex}
              style={{
                borderBottom: '1px solid var(--nextra-border)',
              }}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  style={{
                    padding: '10px 8px',
                  }}
                >
                  {linkColumn === cellIndex && linkPrefix ? (
                    <Link 
                      href={`${linkPrefix}${formatLinkPath(cell)}`}
                      style={{
                        color: 'var(--nextra-primary-color)',
                        textDecoration: 'none',
                        fontWeight: '500',
                      }}
                    >
                      {cell}
                    </Link>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ 
        fontSize: '12px', 
        color: 'var(--nextra-gray)', 
        marginTop: '8px',
        fontStyle: 'italic'
      }}>
        Click column headers to sort ⇅ {linkColumn !== undefined && ' | Click nakshatra names to view details'}
      </p>
    </div>
  )
}
