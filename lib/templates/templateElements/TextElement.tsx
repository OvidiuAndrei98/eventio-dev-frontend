import {
  ElementType,
  TemplateElement,
  TextTemplateElement,
} from '@/core/types';
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
  isSelected,
  selectedElementId,
  onSelect,
}: TextTemplateElement & {
  activeBreakpoint: keyof typeof BREAKPOINTS | 'desktop';
  selectedElementId?: string;
  isSelected?: boolean;
  onSelect?: (element: TemplateElement) => void;
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

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
  ) as TemplateElement;

  const baseStyle: React.CSSProperties = {
    top:
      finalElementProps.position.top !== 0 &&
      finalElementProps.position.top !== undefined
        ? `${finalElementProps.position.top}%`
        : 'auto', // Explicit 'auto' or 'unset' if undefined
    right:
      finalElementProps.position.right !== 0 &&
      finalElementProps.position.right !== undefined
        ? `${finalElementProps.position.right}%`
        : 'auto',
    bottom:
      finalElementProps.position.bottom !== 0 &&
      finalElementProps.position.bottom !== undefined
        ? `${finalElementProps.position.bottom}%`
        : 'auto',
    left:
      finalElementProps.position.left !== 0 &&
      finalElementProps.position.left !== undefined
        ? `${finalElementProps.position.left}%`
        : 'auto',
    ...finalElementProps.style,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  };

  const elementStyle = {
    position: 'absolute' as const,
    ...baseStyle,
  };

  return (
    <div
      className={`${
        isSelected && selectedElementId === id
          ? '!border-2 !border-[#CB93D9]'
          : ''
      } 
    ${!isSelected && isHovered ? '!border-1 !border-[#CB93D9]' : ''} border-1
    border-[transparent] z-3 p-2`}
      id={id}
      style={elementStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        if (id) {
          e.preventDefault();
          e.stopPropagation();
          onSelect && onSelect(finalElementProps);
        }
      }}
    >
      {isSelected && selectedElementId === id && (
        <div className="absolute top-0 left-0 bg-[#CB93D9] text-white p-1 rounded-[0_0_8px_0] z-10 text-sm">
          {name}
        </div>
      )}
      {!isSelected && isHovered && (
        <div className="absolute top-0 left-0 bg-[#CB93D9] text-white p-1 rounded-[0_0_8px_0] z-10 text-sm">
          {name}
        </div>
      )}
      {isHovered && (
        <div className="absolute top-0 left-0 bottom-0 right-0 !bg-purple-100/20 transition-colors duration-200"></div>
      )}
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
