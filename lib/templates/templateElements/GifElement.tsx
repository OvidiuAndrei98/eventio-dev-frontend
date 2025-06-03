import React from 'react';

interface GifElementProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

const GifElement: React.FC<GifElementProps> = ({
  src,
  alt = 'GIF',
  width = '100%',
  height = 'auto',
  className,
}) => (
  <img
    src={src}
    alt={alt}
    width={width}
    height={height}
    className={className}
    style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
    loading="lazy"
  />
);

export default GifElement;
