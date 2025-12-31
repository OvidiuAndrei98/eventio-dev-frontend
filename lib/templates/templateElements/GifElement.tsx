import { ElementType, GifTemplateElement, TemplateElement } from '@/core/types';
import React, { useEffect, useRef, useState } from 'react';
import { BREAKPOINTS, mergeResponsiveProperties } from '../constants';
import { useDraggable } from '@dnd-kit/core';
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import Image from 'next/image';

/**
 * GifElement component renders a draggable GIF element with responsive properties.
 * It supports hover effects and selection in edit mode.
 *
 * @param {GifTemplateElement} props - The properties for the GIF element.
 * @returns {JSX.Element} The rendered GIF element.
 */
const GifElement = ({
  id,
  position,
  style,
  name,
  disabled,
  responsive,
  activeBreakpoint,
  gifUrl,
  isSelected,
  selectedElementId,
  onSelect,
  editMode,
}: GifTemplateElement & {
  activeBreakpoint: keyof typeof BREAKPOINTS | 'desktop';
  selectedElementId?: string;
  isSelected?: boolean;
  onSelect?: (element: TemplateElement) => void;
  editMode?: boolean;
}) => {
  // Merge responsive properties for the current breakpoint
  const finalElementProps = mergeResponsiveProperties<GifTemplateElement>(
    {
      id: id,
      type: ElementType.GifElement,
      position: position,
      gifUrl: gifUrl,
      name: name,
      disabled: disabled,
      style: style,
    },
    responsive,
    activeBreakpoint
  ) as GifTemplateElement;

  // Track hover state for UI feedback
  const [isHovered, setIsHovered] = useState(false);

  const [gifSrc, setGifSrc] = useState(finalElementProps.gifUrl);
  const imgRef = useRef<HTMLImageElement>(null);

  // Handlers for mouse enter/leave to update hover state
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    setGifSrc(finalElementProps.gifUrl);
  }, [finalElementProps.gifUrl]);

  useEffect(() => {
    let lastY = window.scrollY;
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Only trigger if scrolling down and element is entering view from below
          const bounding = entry.boundingClientRect;
          const isScrollingDown = window.scrollY > lastY;
          lastY = window.scrollY;

          // Trigger a bit before fully in view (rootMargin)
          if (
            entry.isIntersecting &&
            isScrollingDown &&
            bounding.top > 0 // only when entering from below
          ) {
            setGifSrc(`${finalElementProps.gifUrl}?t=${Date.now()}`);
          }
        });
      },
      {
        threshold: 0.1, // start earlier
        rootMargin: '100px 0px 0px 0px', // 100px before entering viewport
      }
    );
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    return () => {
      if (imgRef.current) observer.unobserve(imgRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalElementProps.gifUrl]);

  // Setup drag-and-drop with dnd-kit
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
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

  // Compose base style for the gif element
  const baseStyle: React.CSSProperties = {
    ...finalElementProps.style,
    alignSelf: finalElementProps.position.elementAlignment,
  };

  // Compose absolute positioning and merge with base style
  const elementStyle = {
    position: 'absolute' as const,
    ...baseStyle,
  };

  // Style for the gif image itself
  const imageStyle: React.CSSProperties = {
    width: `${finalElementProps.style.width}px`,
    objectFit: 'cover',
  };

  // Handle positioning for 'auto' and manual alignments
  if (finalElementProps.position.elementAlignment === 'auto') {
    if (finalElementProps.position.left !== undefined) {
      elementStyle.left = `${finalElementProps.position.left}%`;
      elementStyle.right = 'auto'; // Ensure only one is set
    } else if (finalElementProps.position.right !== undefined) {
      elementStyle.right = `${finalElementProps.position.right}%`;
      elementStyle.left = 'auto';
    } else {
      // Fallback if neither left nor right is defined
      elementStyle.left = '0%';
      elementStyle.right = 'auto';
    }

    if (finalElementProps.position.top !== undefined) {
      elementStyle.top = `${finalElementProps.position.top}%`;
      elementStyle.bottom = 'auto';
    } else if (finalElementProps.position.bottom !== undefined) {
      elementStyle.bottom = `${finalElementProps.position.bottom}%`;
      elementStyle.top = 'auto';
    } else {
      // Fallback for vertical position
      elementStyle.top = '0%';
      elementStyle.bottom = 'auto';
    }
  } else {
    // For non-auto alignment, reset left/right and set top/bottom if present
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
      id={id}
      style={{
        ...elementStyle,
        // Apply drag transform if dragging
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        touchAction: isDragging ? 'none' : 'auto',
      }}
      className={` ${
        // Show thick border if selected in edit mode
        editMode && isSelected && selectedElementId === id
          ? '!border-2 !border-[#CB93D9]'
          : ''
      } 
    ${
      // Show thin border on hover in edit mode
      editMode && !isSelected && isHovered ? '!border-1 !border-[#CB93D9]' : ''
    } :  border-1
    border-[transparent] z-3 p-2 ${
      // Handle opacity and visibility based on edit mode and disabled state
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
      {/* Show label above element when selected or hovered in edit mode */}
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
      {/* Render the gif image */}
      <Image
        ref={imgRef}
        src={gifSrc}
        style={{ ...imageStyle }}
        alt="gif-image"
        width={100}
        height={100}
      />
    </div>
  );
};

export default GifElement;
