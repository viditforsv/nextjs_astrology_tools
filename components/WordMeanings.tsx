'use client'

import { useState } from 'react'

interface WordMeaningsProps {
  children: React.ReactNode
}

export function WordMeanings({ children }: WordMeaningsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="word-meanings-wrapper" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="word-meanings-btn"
        style={{
          padding: '6px 12px',
          fontSize: '0.875rem',
          fontWeight: '500',
          backgroundColor: 'transparent',
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          color: 'inherit',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f3f4f6'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        {isOpen ? '▼' : '▶'} Words
      </button>
      {isOpen && (
        <div 
          className="word-meanings-content"
          style={{
            marginTop: '0.75rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
