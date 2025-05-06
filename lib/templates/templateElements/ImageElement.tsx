import { ImageTemplateElement } from '@/core/types';
// import Image from 'next/image';
import React from 'react';

const ImageElement = ({
  id,
  url,
  position,
  size,
  style,
}: ImageTemplateElement) => {
  const elementStyle = {
    position: 'absolute' as const,
    top: `${position.y}%`,
    left: `${position.x}%`,
    width: `${size?.width ?? 100}px`,
    height: `${size?.height ?? 100}px`,
    ...style,
  };

  return (
    <img
      id={id}
      src={url} // url
      alt={`Element ${id}`}
      style={elementStyle}
      width={size?.width ?? 100}
      height={size?.height ?? 100}
    />
  );
};

export default ImageElement;
