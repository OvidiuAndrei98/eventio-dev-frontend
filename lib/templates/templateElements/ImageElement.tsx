import {
  ElementType,
  ImageTemplateElement,
  TemplateElement,
} from '@/core/types';
import React from 'react';
import { BREAKPOINTS, mergeResponsiveProperties } from '../constants';

const ImageElement = ({
  id,
  backgroundImage,
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
}: ImageTemplateElement & {
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

  const finalElementProps = mergeResponsiveProperties<ImageTemplateElement>(
    {
      backgroundImage: backgroundImage,
      id: id,
      type: ElementType.Image,
      position: position,
      name: name,
      disabled: disabled,
      style: style,
    },
    responsive,
    activeBreakpoint
  ) as ImageTemplateElement;

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
    backgroundRepeat: finalElementProps.backgroundImage ? 'no-repeat' : 'usent',
    backgroundSize: finalElementProps.backgroundImage ? 'cover' : 'usnet',
    backgroundImage: finalElementProps.backgroundImage
      ? `linear-gradient( ${finalElementProps.backgroundImage.opacity}, ${finalElementProps.backgroundImage.opacity} ), url('${finalElementProps.backgroundImage.url}')`
      : 'unset',
    ...finalElementProps.style,
    borderRadius: finalElementProps.style.borderRadius + '%',
  };

  const elementStyle = {
    position: 'absolute' as const,
    ...baseStyle,
  };

  return (
    <div
      id={id}
      style={elementStyle}
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
    </div>
  );
};

export default ImageElement;
