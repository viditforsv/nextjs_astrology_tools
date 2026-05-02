import React from 'react';

export type RashiName = 
  | 'mesha' | 'vrishabha' | 'mithuna' | 'karka' | 'simha' | 'kanya'
  | 'tula' | 'vrishchika' | 'dhanu' | 'makara' | 'kumbha' | 'meena';

interface RashiIconProps {
  rashi: RashiName;
  size?: number;
  className?: string;
}

const RashiIcons: Record<RashiName, React.ReactNode | null> = {
  mesha: null,
  vrishabha: null,
  mithuna: null,
  karka: null,
  simha: null,
  kanya: null,
  tula: null,
  vrishchika: null,
  dhanu: null,
  makara: null,
  // Kumbha (Water Bearer) - Hieroglyphic icon
  kumbha: (
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontSize="18"
      fill="currentColor"
      style={{ fontFamily: 'serif' }}
    >
      𓀆𓎹
    </text>
  ),
  meena: null,
};

export const RashiIcon: React.FC<RashiIconProps> = ({ 
  rashi, 
  size = 20, 
  className = '' 
}) => {
  const icon = RashiIcons[rashi];
  if (!icon) {
    return null;
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {icon}
    </svg>
  );
};

// Helper function to get emoji fallback (for backward compatibility)
export const getRashiEmoji = (rashi: RashiName): string => {
  const emojiMap: Record<RashiName, string> = {
    mesha: '🐏',
    vrishabha: '🐂',
    mithuna: '👥',
    karka: '🦀',
    simha: '🦁',
    kanya: '👧',
    tula: '⚖️',
    vrishchika: '🦂',
    dhanu: '🏹',
    makara: '🐐',
    kumbha: '🪣',
    meena: '🐟',
  };
  return emojiMap[rashi];
};

