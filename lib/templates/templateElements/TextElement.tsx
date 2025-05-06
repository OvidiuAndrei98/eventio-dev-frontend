import { TextTemplateElement } from '@/core/types';
import React from 'react';

const TextElement = ({ id, content, position, style }: TextTemplateElement) => {
  const elementStyle = {
    position: 'absolute' as const,
    top: `${position.y}%`,
    left: `${position.x}%`,
    ...style,
  };

  return (
    <div id={id} style={elementStyle}>
      {content.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < content.split('\n').length - 1 && <br />}{' '}
        </React.Fragment>
      ))}
    </div>
  );
};

export default TextElement;
