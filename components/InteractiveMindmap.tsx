'use client'

import { useState } from 'react'

interface MindmapNode {
  id: string
  label: string
  children?: MindmapNode[]
}

interface MindmapItemProps {
  node: MindmapNode
  level?: number
}

function MindmapItem({ node, level = 0 }: MindmapItemProps) {
  const [isOpen, setIsOpen] = useState(level < 2) // Open first 2 levels by default
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className={`mindmap-item mindmap-level-${level}`} style={{ marginLeft: `${level * 20}px` }}>
      <div className="mindmap-node">
        {hasChildren ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mindmap-toggle"
            aria-expanded={isOpen}
          >
            <span className="mindmap-icon">{isOpen ? '▼' : '▶'}</span>
            <span className="mindmap-label">{node.label}</span>
          </button>
        ) : (
          <div className="mindmap-leaf">
            <span className="mindmap-label">{node.label}</span>
          </div>
        )}
      </div>
      {hasChildren && isOpen && (
        <div className="mindmap-children">
          {node.children!.map((child) => (
            <MindmapItem key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

interface InteractiveMindmapProps {
  data: MindmapNode[]
  title?: string
}

export default function InteractiveMindmap({ data, title }: InteractiveMindmapProps) {
  return (
    <div className="interactive-mindmap">
      {title && <h3 className="mindmap-title">{title}</h3>}
      <div className="mindmap-container">
        {data.map((node) => (
          <MindmapItem key={node.id} node={node} />
        ))}
      </div>
      <style jsx>{`
        .interactive-mindmap {
          margin: 2rem 0;
          padding: 1.5rem;
          background: var(--nextra-bg, #ffffff);
          border: 1px solid var(--nextra-border-color, #e5e7eb);
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .mindmap-title {
          margin: 0 0 1.5rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--nextra-text-color, #111827);
        }

        .mindmap-container {
          font-family: system-ui, -apple-system, sans-serif;
        }

        .mindmap-item {
          margin-bottom: 0.5rem;
        }

        .mindmap-node {
          display: flex;
          align-items: center;
        }

        .mindmap-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          padding: 0.5rem 0.75rem;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
          font-size: 0.95rem;
          color: var(--nextra-text-color, #111827);
        }

        .mindmap-toggle:hover {
          background-color: rgba(102, 126, 234, 0.1);
        }

        .mindmap-toggle:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }

        .mindmap-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          font-size: 0.75rem;
          color: #667eea;
          flex-shrink: 0;
          transition: transform 0.2s;
        }

        .mindmap-toggle[aria-expanded="true"] .mindmap-icon {
          transform: rotate(0deg);
        }

        .mindmap-label {
          color: var(--nextra-text-color, #111827);
          font-weight: 500;
        }

        .mindmap-level-0 .mindmap-label {
          font-weight: 600;
          font-size: 1rem;
        }

        .mindmap-level-1 .mindmap-label {
          font-weight: 500;
        }

        .mindmap-level-2 .mindmap-label,
        .mindmap-level-3 .mindmap-label {
          font-weight: 400;
        }

        .mindmap-leaf {
          padding: 0.5rem 0.75rem;
          padding-left: 2rem;
          font-size: 0.9rem;
          color: var(--nextra-text-color-2, #6b7280);
        }

        .mindmap-children {
          margin-top: 0.25rem;
          border-left: 2px solid var(--nextra-border-color, #e5e7eb);
          margin-left: 9px;
          padding-left: 0.5rem;
        }

        @media (prefers-color-scheme: dark) {
          .interactive-mindmap {
            background: var(--nextra-bg, #1a1a1a);
            border-color: var(--nextra-border-color, #333);
          }

          .mindmap-toggle:hover {
            background-color: var(--nextra-bg, #2a2a2a);
          }

          .mindmap-children {
            border-left-color: var(--nextra-border-color, #444);
          }
        }
      `}</style>
    </div>
  )
}
