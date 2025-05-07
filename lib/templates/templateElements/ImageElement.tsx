import { ImageTemplateElement } from '@/core/types';
// import Image from 'next/image';
import React from 'react';

const ImageElement = ({ id, url, position, style }: ImageTemplateElement) => {
  const elementStyle = {
    position: 'relative' as const,
    top: `${position.y}%`,
    left: `${position.x}%`,
    width: `${style?.width ?? 100}px`,
    height: `${style?.height ?? 100}px`,
    ...style,
  };

  return (
    <img
      id={id}
      src={url} // url
      alt={`Element ${id}`}
      style={elementStyle}
      width={(style?.width as number) ?? 100}
      height={(style?.height as number) ?? 100}
    />
  );
};

export default ImageElement;
