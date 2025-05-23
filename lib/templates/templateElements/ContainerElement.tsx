// elements/ContainerElement.js
import {
  ContainerTemplateElement,
  ElementType,
  TemplateElement,
} from '@/core/types';
import React from 'react';
import { BREAKPOINTS, mergeResponsiveProperties } from '../constants';
import { useDraggable } from '@dnd-kit/core';
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';

const ContainerElement = ({
  id,
  position,
  style,
  name,
  borderStyles,
  disabled,
  responsive,
  activeBreakpoint,
  isSelected,
  selectedElementId,
  onSelect,
  editMode,
}: ContainerTemplateElement & {
  activeBreakpoint: keyof typeof BREAKPOINTS | 'desktop';
  selectedElementId?: string;
  isSelected?: boolean;
  onSelect?: (element: TemplateElement) => void;
  editMode?: boolean;
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const finalElementProps = mergeResponsiveProperties<ContainerTemplateElement>(
    {
      id: id,
      type: ElementType.Container,
      position: position,
      name: name,
      borderStyles: borderStyles,
      disabled: disabled,
      style: style,
    },
    responsive,
    activeBreakpoint
  ) as ContainerTemplateElement;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      name: name,
      id: id,
      modifiers:
        finalElementProps.position.elementAlignment !== 'auto'
          ? [restrictToParentElement, restrictToVerticalAxis]
          : [restrictToParentElement],
    },
  });

  const baseStyle: React.CSSProperties = {
    ...finalElementProps.style,
    top: `${finalElementProps.position.y ?? 0}%`,

    left:
      finalElementProps.position.elementAlignment !== 'auto'
        ? 'auto'
        : `${finalElementProps.position.x}%`,
        backgroundColor: finalElementProps.style
    borderStyle: `${finalElementProps.borderStyles.sides}`,
    borderWidth: `${finalElementProps.borderStyles.size}px`,
    borderColor: `${finalElementProps.borderStyles.color}`,
    alignSelf: finalElementProps.position.elementAlignment,
  };

  const elementStyle = {
    position: 'absolute' as const,
    ...baseStyle,
  };

  return (
    <div
      id={id}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={` ${
        editMode && isSelected && selectedElementId === id
          ? '!border-2 !border-[#CB93D9]'
          : ''
      } 
  ${
    editMode && !isSelected && isHovered ? '!border-1 !border-[#CB93D9]' : ''
  } :  border-1
  border-[transparent] z-3 p-2 ${
    editMode
      ? disabled
        ? 'opacity-[0.5]'
        : 'opacity-[1]'
      : disabled
      ? 'hidden'
      : 'block'
  }`}
      style={{
        ...elementStyle,
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
      onMouseEnter={editMode ? () => handleMouseEnter() : undefined}
      onMouseLeave={editMode ? () => handleMouseLeave() : undefined}
      onClick={
        editMode
          ? (e) => {
              if (id) {
                e.preventDefault();
                e.stopPropagation();
                onSelect && onSelect(finalElementProps);
              }
            }
          : undefined
      }
    >
      {editMode && (
        <>
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
        </>
      )}
      {/* Elementele din interior (text RSVP etc) vor fi randate de InvitationRenderer peste acest div */}
    </div>
  );
};

export default ContainerElement;
