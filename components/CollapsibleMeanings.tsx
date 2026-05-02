'use client'

import { useState } from 'react'

interface CollapsibleMeaningsProps {
  shlokaNumber: number
  children: React.ReactNode
}

export function CollapsibleMeanings({ shlokaNumber, children }: CollapsibleMeaningsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="collapsible-meanings-wrapper">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`collapsible-meanings-btn ${isOpen ? 'is-open' : ''}`}
      >
        {isOpen ? '▼' : '▶'} {isOpen ? 'Hide' : 'Show'} Meanings (Shloka {shlokaNumber})
      </button>
      {isOpen && (
        <div className="collapsible-meanings-content">
          {children}
        </div>
      )}
    </div>
  )
}

