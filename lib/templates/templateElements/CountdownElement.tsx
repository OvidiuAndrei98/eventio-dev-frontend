import {
  ElementType,
  TemplateElement,
  CountdownTemplateElement,
} from '@/core/types';
import React, { useEffect, useState } from 'react';
import { BREAKPOINTS, mergeResponsiveProperties } from '../constants';
import { useDraggable } from '@dnd-kit/core';
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import { loadFont } from '@/lib/fonts';

const CountdownElement = ({
  id,
  position,
  style,
  name,
  disabled,
  responsive,
  activeBreakpoint,
  isSelected,
  target,
  selectedElementId,
  onSelect,
  editMode,
}: CountdownTemplateElement & {
  activeBreakpoint: keyof typeof BREAKPOINTS | 'desktop';
  target: string;
  selectedElementId?: string;
  isSelected?: boolean;
  onSelect?: (element: TemplateElement) => void;
  editMode?: boolean;
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const finalElementProps = mergeResponsiveProperties<CountdownTemplateElement>(
    {
      id,
      type: ElementType.Countdown,
      position,
      name,
      disabled,
      style,
    },
    responsive,
    activeBreakpoint
  ) as CountdownTemplateElement;

  if (finalElementProps.style.fontFamily) {
    loadFont(finalElementProps.style.fontFamily as string);
  }

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      name,
      id,
      modifiers:
        finalElementProps.position.elementAlignment !== 'auto'
          ? [restrictToParentElement, restrictToVerticalAxis]
          : [restrictToParentElement],
    },
  });

  // Countdown logic
  // It takes a target date string and returns an object with days, hours, minutes, seconds, and a finished flag
  const pad = (n: number) => n.toString().padStart(2, '0');
  function getTimeLeft(target: string) {
    const now = new Date();
    const end = new Date(target);
    const diff = end.getTime() - now.getTime();
    if (diff <= 0)
      return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds, finished: false };
  }
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target));
  useEffect(() => {
    if (timeLeft.finished) return;
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, timeLeft.finished]);

  let textContentStyle: React.CSSProperties = {
    fontFamily: (finalElementProps.style.fontFamily as string) || 'inherit',
  };

  if (typeof finalElementProps.style.textShadow === 'string') {
    const [width, color] = finalElementProps.style.textShadow.split(' ');
    // Only set textShadow if width is not 0
    if (Number(width) > 0) {
      textContentStyle = {
        ...textContentStyle,
        textShadow: `0px 0px ${width}px ${color || 'transparent'}`,
      };
    } else {
      textContentStyle = {
        ...textContentStyle,
        textShadow: '0px 0px 0px transparent',
      };
    }
  }

  const baseStyle: React.CSSProperties = {
    ...finalElementProps.style,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    alignSelf: finalElementProps.position.elementAlignment,
    width: finalElementProps.style.width
      ? ` ${finalElementProps.style.width}%`
      : 'auto',
  };

  const elementStyle = {
    position: 'absolute' as const,
    ...baseStyle,
  };

  if (finalElementProps.position.elementAlignment === 'auto') {
    if (finalElementProps.position.left !== undefined) {
      elementStyle.left = `${finalElementProps.position.left}%`;
      elementStyle.right = 'auto';
    } else if (finalElementProps.position.right !== undefined) {
      elementStyle.right = `${finalElementProps.position.right}%`;
      elementStyle.left = 'auto';
    } else {
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

      {/* Countdown display */}

      <div className="flex flex-col items-center w-full">
        <div className="flex gap-4">
          {/* Numbers row */}
          <div className="flex gap-4">
            <span className="flex flex-col items-center">
              <span
                style={{
                  ...textContentStyle,
                  textAlign: 'center',
                }}
              >
                {pad(timeLeft.days)}
              </span>
              <span
                className="text-center"
                style={{
                  ...textContentStyle,
                  textAlign: 'center',
                  fontSize: textContentStyle.fontSize
                    ? `calc(${textContentStyle.fontSize} / 2)`
                    : '0.5em',
                }}
              >
                zile
              </span>
            </span>
            <span className="flex flex-col items-center">
              <span
                style={{
                  ...textContentStyle,
                  textAlign: 'center',
                }}
              >
                {pad(timeLeft.hours)}
              </span>
              <span
                className="text-center"
                style={{
                  ...textContentStyle,
                  textAlign: 'center',
                  fontSize: textContentStyle.fontSize
                    ? `calc(${textContentStyle.fontSize} / 2)`
                    : '0.5em',
                }}
              >
                ore
              </span>
            </span>
            <span className="flex flex-col items-center">
              <span
                style={{
                  ...textContentStyle,
                  textAlign: 'center',
                }}
              >
                {pad(timeLeft.minutes)}
              </span>
              <span
                className="text-center"
                style={{
                  ...textContentStyle,
                  textAlign: 'center',
                  fontSize: textContentStyle.fontSize
                    ? `calc(${textContentStyle.fontSize} / 2)`
                    : '0.5em',
                }}
              >
                minute
              </span>
            </span>
            <span className="flex flex-col items-center">
              <span
                style={{
                  ...textContentStyle,
                  textAlign: 'center',
                }}
              >
                {pad(timeLeft.seconds)}
              </span>
              <span
                className="text-center"
                style={{
                  ...textContentStyle,
                  textAlign: 'center',
                  fontSize: textContentStyle.fontSize
                    ? `calc(${textContentStyle.fontSize} / 2)`
                    : '0.5em',
                }}
              >
                secunde
              </span>
            </span>
          </div>
        </div>
        {timeLeft.finished && (
          <div className="mt-2 text-red-500 font-semibold">
            Evenimentul a început!
          </div>
        )}
      </div>
    </div>
  );
};

export default CountdownElement;
