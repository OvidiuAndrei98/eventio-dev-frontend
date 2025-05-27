import {
  ElementType,
  TemplateElement,
  TextTemplateElement,
} from '@/core/types';
import React from 'react';
import { BREAKPOINTS, mergeResponsiveProperties } from '../constants';
import { useDraggable } from '@dnd-kit/core';
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';

const TextElement = ({
  id,
  content,
  position,
  style,
  name,
  disabled,
  responsive,
  activeBreakpoint,
  isSelected,
  selectedElementId,
  onSelect,
  editMode,
}: TextTemplateElement & {
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

  const finalElementProps = mergeResponsiveProperties<TextTemplateElement>(
    {
      id: id,
      type: ElementType.Text,
      content: content,
      position: position,
      name: name,
      disabled: disabled,
      style: style,
    },
    responsive,
    activeBreakpoint
  ) as TemplateElement;

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
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    alignSelf: finalElementProps.position.elementAlignment,
    width: `${finalElementProps.style.width}%`,
  };

  const elementStyle = {
    position: 'absolute' as const,
    ...baseStyle,
  };

  if (finalElementProps.position.elementAlignment === 'auto') {
    if (finalElementProps.position.left !== undefined) {
      elementStyle.left = `${finalElementProps.position.left}%`;
      elementStyle.right = 'auto'; // Asigură-te că nu ai ambele setate
    } else if (finalElementProps.position.right !== undefined) {
      elementStyle.right = `${finalElementProps.position.right}%`;
      elementStyle.left = 'auto';
    } else {
      // Fallback dacă nici left, nici right nu sunt definite (ar trebui să ai cel puțin left)
      elementStyle.left = '0%'; // Sau o poziție default
      elementStyle.right = 'auto';
    }

    if (finalElementProps.position.top !== undefined) {
      elementStyle.top = `${finalElementProps.position.top}%`;
      elementStyle.bottom = 'auto';
    } else if (finalElementProps.position.bottom !== undefined) {
      elementStyle.bottom = `${finalElementProps.position.bottom}%`;
      elementStyle.top = 'auto';
    } else {
      // Fallback
      elementStyle.top = '0%';
      elementStyle.bottom = 'auto';
    }
  } else {
    elementStyle.left = 'auto';
    elementStyle.right = 'auto';
    if (finalElementProps.position.top !== undefined) {
      elementStyle.top = `${finalElementProps.position.top}%`;
    }
    if (finalElementProps.position.bottom !== undefined) {
      elementStyle.bottom = `${finalElementProps.position.bottom}%`;
    }
  }

  return (
    <div
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
      id={id}
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
            <div className="absolute top-[-23px] left-[-2px] bg-[#CB93D9] text-nowrap text-white p-[3px] rounded-[4px_4px_4px_0] z-10 text-xs">
              {name}
            </div>
          )}
          {!isSelected && isHovered && (
            <div className="absolute top-[-23px] left-[-2px] bg-[#CB93D9] text-nowrap text-white p-[3px] rounded-[4px_4px_4px_0] z-10 text-xs">
              {name}
            </div>
          )}
          {isHovered && (
            <div className="absolute top-0 left-0 bottom-0 right-0 !bg-purple-100/20 transition-colors duration-200"></div>
          )}
        </>
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
