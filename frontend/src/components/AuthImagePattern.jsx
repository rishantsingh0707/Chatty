import React, { useEffect, useState } from 'react';

const AuthImagePattern = ({
  boxWidth = '',
  boxHeight = '',
  boxColor = '',
  gridCols = 3,
  gap = '',
  borderRadius = 'rounded-lg',
  title = '',
  subtitle = ''
}) => {
  const [glowingBox, setGlowingBox] = useState(null);
  const totalBoxes = gridCols * gridCols;

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * totalBoxes);
    setGlowingBox(randomIndex);

    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * totalBoxes);
      setGlowingBox(newIndex);
    }, 1000);

    return () => clearInterval(interval);
  }, [totalBoxes]);

  const colors = [
    'bg-[#3ABEF9]',  
    'bg-[#6D72FF]',  
    'bg-[#FF4FA3]',  
    'bg-[#00E5D4]', 
    'bg-[#3CF37B]', 
    'bg-[#FFCF3F]', 
    'bg-[#FF5B5B]', 
    'bg-[#8878FF]', 
    'bg-[#FF8A3D]'  
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        gap,
        width: 'fit-content'
      }}
    >
      {[...Array(totalBoxes)].map((_, i) => (
        <div
          key={i}
          className={`${colors[i % colors.length]} ${borderRadius} transition-all duration-300 ${glowingBox === i ? 'shadow-lg shadow-current' : ''
            }`}
          style={{
            width: boxWidth,
            height: boxHeight,
            filter: glowingBox === i ? 'brightness(1.3)' : 'brightness(1)',
            boxShadow: glowingBox === i ? `0 0 30px ${window.getComputedStyle(document.documentElement).getPropertyValue('--color-glow')}` : 'none'
          }}
        />

      ))}
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-base-content/60">{subtitle}</p>
    </div>
  );
};

export default AuthImagePattern;
