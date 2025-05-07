import { ElementType, TextTemplateElement } from '@/core/types';
import React from 'react';
import { BREAKPOINTS, mergeResponsiveProperties } from '../constants';

const TextElement = ({
  id,
  content,
  position,
  style,
  name,
  responsive,
  activeBreakpoint,
}: TextTemplateElement & {
  activeBreakpoint: keyof typeof BREAKPOINTS | 'desktop';
}) => {
  const finalElementProps = mergeResponsiveProperties<TextTemplateElement>(
    {
      id: id,
      type: ElementType.Text,
      content: content,
      position: position,
      name: name,
      style: style,
    },
    responsive,
    activeBreakpoint
  );

  const baseStyle: React.CSSProperties = {
    top: `${finalElementProps.position.y}%`,
    left: `${finalElementProps.position.x}%`,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  };

  const elementStyle = {
    position: 'absolute' as const,
    ...baseStyle,
    fontSize: `clamp(14px, ${style.fontSize}vw, 42px)`,
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
