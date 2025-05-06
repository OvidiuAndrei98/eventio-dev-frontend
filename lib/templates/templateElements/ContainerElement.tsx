// elements/ContainerElement.js
import React from 'react';

export interface ContainerElementProps {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    [key: string]: string | number;
  };
}

const ContainerElement = ({
  id,
  position,
  size,
  style,
}: ContainerElementProps) => {
  const elementStyle = {
    position: 'relative' as const,
    top: `${position.y}px`,
    left: `${position.x}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    ...style, // Aplică stiluri din JSON (background, border, borderRadius etc.)
  };

  // Acest container randează doar div-ul său. Elementele copiii sunt
  // randate de componenta părinte (InvitationRenderer) peste acest container
  // pe baza pozițiilor lor absolute și a z-index-ului.
  return (
    <div id={id} style={elementStyle}>
      {/* Elementele din interior (text RSVP etc) vor fi randate de InvitationRenderer peste acest div */}
    </div>
  );
};

export default ContainerElement;
