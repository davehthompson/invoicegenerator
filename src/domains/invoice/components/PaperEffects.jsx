// src/components/PaperEffects.jsx
import React from 'react';

const PaperEffects = ({ effects = [] }) => {
  // SVG filter definitions for realistic paper effects
  const filterDefs = `
    <svg width="0" height="0">
      <filter id="paper-crumple">
        <!-- Base wrinkle texture -->
        <feTurbulence 
          type="turbulence" 
          baseFrequency="0.03" 
          numOctaves="5" 
          seed="${Math.random() * 100}"
          result="wrinkles"
        />
        
        <!-- Large folds -->
        <feTurbulence 
          type="fractalNoise" 
          baseFrequency="0.01" 
          numOctaves="3" 
          seed="${Math.random() * 100}"
          result="largeFolds"
        />
        
        <!-- Combine and enhance displacements -->
        <feDisplacementMap 
          in="SourceGraphic" 
          in2="wrinkles" 
          scale="15" 
          xChannelSelector="R" 
          yChannelSelector="G" 
          result="displacement1"
        />
        <feDisplacementMap 
          in="displacement1" 
          in2="largeFolds" 
          scale="20" 
          xChannelSelector="R" 
          yChannelSelector="B"
        />

        <!-- Add depth through shadows -->
        <feDiffuseLighting 
          in="wrinkles" 
          lightingColor="white" 
          surfaceScale="2" 
          result="paperTexture"
        >
          <feDistantLight azimuth="45" elevation="60" />
        </feDiffuseLighting>

        <!-- Enhance contrast of wrinkles -->
        <feColorMatrix
          type="matrix"
          in="paperTexture"
          values="1 0 0 0 0
                 0 1 0 0 0
                 0 0 1 0 0
                 0 0 0 2 -0.5"
          result="enhancedTexture"
        />
      </filter>

      <!-- Additional filter for deep creases -->
      <filter id="paper-creases">
        <feTurbulence 
          type="fractalNoise" 
          baseFrequency="0.05" 
          numOctaves="1" 
          seed="${Math.random() * 100}"
          result="creases"
        />
        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0
                 0 1 0 0 0
                 0 0 1 0 0
                 0 0 0 5 -1"
          result="darkCreases"
        />
      </filter>
    </svg>
  `;

  // Generate random fold lines
  const generateFoldLines = () => {
    const lines = [];
    const numLines = Math.floor(Math.random() * 3) + 2; // 2-4 major fold lines

    for (let i = 0; i < numLines; i++) {
      lines.push({
        id: `fold-${i}`,
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(${Math.random() * 360}deg, 
            transparent, 
            rgba(0,0,0,${0.1 + Math.random() * 0.1}) ${45 + Math.random() * 10}%, 
            transparent
          )`,
          transform: `rotate(${Math.random() * 360}deg)`,
        }
      });
    }

    return lines;
  };

  // Generate coffee stains with irregular shapes
  const generateStains = () => {
    const numStains = Math.floor(Math.random() * 3) + 2;
    const stains = [];

    for (let i = 0; i < numStains; i++) {
      const left = Math.random() * 70 + 10;
      const top = Math.random() * 70 + 10;
      const numCircles = Math.floor(Math.random() * 3) + 3;
      const baseSize = Math.random() * 60 + 40;
      const baseRotation = Math.random() * 360;
      const baseOpacity = Math.random() * 0.1 + 0.05;

      for (let j = 0; j < numCircles; j++) {
        const sizeVariation = baseSize * (0.7 + Math.random() * 0.6);
        const offsetX = Math.random() * 20 - 10;
        const offsetY = Math.random() * 20 - 10;
        const rotation = baseRotation + (Math.random() * 30 - 15);
        const opacity = baseOpacity * (0.7 + Math.random() * 0.6);

        stains.push({
          id: `stain-${i}-${j}`,
          style: {
            left: `${left + (offsetX / baseSize) * 5}%`,
            top: `${top + (offsetY / baseSize) * 5}%`,
            width: `${sizeVariation}px`,
            height: `${sizeVariation}px`,
            transform: `rotate(${rotation}deg) scale(${0.8 + Math.random() * 0.4})`,
            backgroundColor: `rgba(${101 + Math.random() * 20}, ${67 + Math.random() * 10}, ${33 + Math.random() * 10}, ${opacity})`,
            borderRadius: '50%',
            position: 'absolute',
            mixBlendMode: 'multiply',
            boxShadow: `inset 0 0 ${Math.floor(sizeVariation/3)}px rgba(139, 69, 19, ${opacity * 2})`,
            filter: 'blur(1px)',
          }
        });

        // Add smaller detail circles for more realism
        if (Math.random() > 0.5) {
          const detailSize = sizeVariation * 0.3;
          stains.push({
            id: `stain-${i}-${j}-detail`,
            style: {
              left: `${left + (offsetX / baseSize) * 5 + Math.random() * 5 - 2.5}%`,
              top: `${top + (offsetY / baseSize) * 5 + Math.random() * 5 - 2.5}%`,
              width: `${detailSize}px`,
              height: `${detailSize}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
              backgroundColor: `rgba(${101 + Math.random() * 20}, ${67 + Math.random() * 10}, ${33 + Math.random() * 10}, ${opacity * 1.5})`,
              borderRadius: '50%',
              position: 'absolute',
              mixBlendMode: 'multiply',
              filter: 'blur(0.5px)',
            }
          });
        }
      }
    }

    return stains;
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Inject SVG filters */}
      <div dangerouslySetInnerHTML={{ __html: filterDefs }} />

      {/* Crumple effects */}
      {effects.includes('crumple') && (
        <>
          {/* Base crumple effect */}
          <div
            className="absolute inset-0 z-20"
            style={{
              filter: 'url(#paper-crumple)',
              mixBlendMode: 'multiply',
              opacity: 0.7,
            }}
          />

          {/* Deep creases overlay */}
          <div
            className="absolute inset-0 z-21"
            style={{
              filter: 'url(#paper-creases)',
              mixBlendMode: 'multiply',
              opacity: 0.3,
            }}
          />

          {/* Random fold lines */}
          <div className="absolute inset-0 z-22">
            {generateFoldLines().map((line) => (
              <div key={line.id} style={line.style} />
            ))}
          </div>

          {/* Shadow overlay for depth */}
          <div
            className="absolute inset-0 z-23"
            style={{
              boxShadow: 'inset 0 0 50px rgba(0,0,0,0.1)',
              mixBlendMode: 'multiply',
            }}
          />
        </>
      )}

      {/* Coffee stains */}
      {effects.includes('stains') && (
        <div className="absolute inset-0 z-30">
          {generateStains().map((stain) => (
            <div
              key={stain.id}
              style={stain.style}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const EffectControls = ({ activeEffects, onChange }) => {
  const handleChange = (effect) => {
    const newEffects = activeEffects.includes(effect)
      ? activeEffects.filter(e => e !== effect)
      : [...activeEffects, effect];
    onChange(newEffects);
  };

  return (
    <div className="flex gap-4 items-center">
      {['crumple', 'stains'].map(effect => (
        <label key={effect} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={activeEffects.includes(effect)}
            onChange={() => handleChange(effect)}
            className="w-4 h-4"
          />
          <span className="capitalize">{effect}</span>
        </label>
      ))}
    </div>
  );
};

export default PaperEffects;