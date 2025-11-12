import React from 'react';

// SVG filters for color blindness simulation and correction
export const ColorBlindnessFilters: React.FC = () => {
  return (
    <svg
      style={{ position: 'absolute', width: 0, height: 0 }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Protanopia (Red-blind) Filter */}
        <filter id="protanopia-filter">
          <feColorMatrix
            type="matrix"
            values="0.567 0.433 0     0 0
                    0.558 0.442 0     0 0
                    0     0.242 0.758 0 0
                    0     0     0     1 0"
          />
        </filter>
        
        {/* Deuteranopia (Green-blind) Filter */}
        <filter id="deuteranopia-filter">
          <feColorMatrix
            type="matrix"
            values="0.625 0.375 0     0 0
                    0.7   0.3   0     0 0
                    0     0.3   0.7   0 0
                    0     0     0     1 0"
          />
        </filter>
        
        {/* Tritanopia (Blue-blind) Filter */}
        <filter id="tritanopia-filter">
          <feColorMatrix
            type="matrix"
            values="0.95  0.05  0     0 0
                    0     0.433 0.567 0 0
                    0     0.475 0.525 0 0
                    0     0     0     1 0"
          />
        </filter>
        
        {/* Achromatopsia (Complete color blindness) Filter */}
        <filter id="achromatopsia-filter">
          <feColorMatrix
            type="matrix"
            values="0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0     0     0     1 0"
          />
        </filter>
        
        {/* High Contrast Filter */}
        <filter id="high-contrast-filter">
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0 .5 1"/>
          </feComponentTransfer>
        </filter>
        
        {/* Enhanced Contrast Filter */}
        <filter id="enhanced-contrast-filter">
          <feComponentTransfer>
            <feFuncR type="gamma" amplitude="1.5" exponent="0.8"/>
            <feFuncG type="gamma" amplitude="1.5" exponent="0.8"/>
            <feFuncB type="gamma" amplitude="1.5" exponent="0.8"/>
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
};

// Component to apply color blindness filters
interface ColorBlindnessSimulatorProps {
  filter: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
  children: React.ReactNode;
}

export const ColorBlindnessSimulator: React.FC<ColorBlindnessSimulatorProps> = ({
  filter,
  children
}) => {
  const filterMap = {
    none: '',
    protanopia: 'url(#protanopia-filter)',
    deuteranopia: 'url(#deuteranopia-filter)',
    tritanopia: 'url(#tritanopia-filter)',
    achromatopsia: 'url(#achromatopsia-filter)'
  };

  return (
    <div
      style={{
        filter: filterMap[filter],
        transition: 'filter 0.3s ease'
      }}
    >
      {children}
    </div>
  );
};