'use client'

import { useState } from 'react'

interface CollapsibleTranslationProps {
  children: React.ReactNode
  label?: string
}

export function CollapsibleTranslation({ children, label = 'Translation' }: CollapsibleTranslationProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div style={{ margin: '1rem 0' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '0.9rem',
          borderRadius: '6px',
          border: '1px solid var(--nextra-border-color, #e5e7eb)',
          background: 'var(--nextra-bg, #ffffff)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--nextra-text-color, #111827)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--nextra-bg-hover, #f9fafb)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--nextra-bg, #ffffff)'
        }}
      >
        <span style={{ fontSize: '0.75rem' }}>{isOpen ? '▼' : '▶'}</span>
        <span>{isOpen ? 'Hide' : 'Show'} {label}</span>
      </button>
      {isOpen && (
        <div style={{ 
          marginTop: '0.75rem',
          padding: '1rem',
          background: 'var(--nextra-bg, #f9fafb)',
          borderRadius: '6px',
          border: '1px solid var(--nextra-border-color, #e5e7eb)'
        }}>
          {children}
        </div>
      )}
    </div>
  )
}
