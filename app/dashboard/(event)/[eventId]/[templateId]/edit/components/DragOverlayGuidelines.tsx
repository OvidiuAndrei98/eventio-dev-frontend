import React from 'react';
import { Guideline } from '../utils/canvasUtils/guidelineCalculations';

interface DragOverlayGuidelinesProps {
  guidelines: Guideline[];
}

const DragOverlayGuidelines: React.FC<DragOverlayGuidelinesProps> = ({
  guidelines,
}) => {
  if (!guidelines || guidelines.length === 0) {
    return null;
  }

  // Stilul de bază pentru linii
  const lineStyle: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: '#cb00ff', // Culoarea liniilor
    zIndex: 9999, // Asigură că liniile sunt deasupra tuturor
    pointerEvents: 'none', // Asigură că liniile nu interferează cu evenimentele mouse-ului
  };

  return (
    <>
      {guidelines.map((line) => (
        <div
          key={line.id}
          style={{
            ...lineStyle,
            // Poziționăm liniile absolut față de viewport (sau față de un container fixed/absolute)
            // Dacă containerRect este al canvas-ului, atunci liniile sunt relative la canvas.
            // Presupunem că acest component este un copil direct al canvas-ului sau este poziționat fix.
            // Pentru a fi poziționate relativ la canvas, trebuie să scădem top/left al canvas-ului.
            left: line.type === 'vertical' ? line.position : 0,
            top: line.type === 'horizontal' ? line.position : 0,
            // Grosimea liniei 1px pentru vizibilitate
            width: line.type === 'vertical' ? 1 : '100%',
            height: line.type === 'horizontal' ? 1 : '100%',
            transform:
              line.type === 'vertical'
                ? `translateX(-50%)`
                : `translateY(-50%)`, // Centrare vizuală
          }}
        />
      ))}
    </>
  );
};

export default DragOverlayGuidelines;
