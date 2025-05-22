import React, { useEffect, useRef, useState } from 'react';
import SectionRenderer from './SectionRenderer';
import { Template, TemplateElement, TemplateSection } from '@/core/types';
import { BREAKPOINTS, getBreakpointName } from '../constants';
import EditSectionRenderer from './EditSectionRenderer';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { getNestedValue } from '@/app/dashboard/(event)/[eventId]/[templateId]/edit/utils/objectUtils';
import { DragEventData } from '@/app/dashboard/(event)/[eventId]/tables/page';

interface TemplateRendererProps {
  invitationData: Template;
  selectedElementId?: string;
  editMode?: boolean;
  onSelect?: (section: TemplateElement) => void;
  activeBreakpointValue?: string;
  handleTemplateDragAndDrop?: (
    elementId: string,
    position: {
      x: number;
      y: number;
      elementAlignment: 'auto' | 'self-start' | 'center' | 'self-end';
    }
  ) => void;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  invitationData,
  selectedElementId,
  editMode = false,
  onSelect,
  activeBreakpointValue,
  handleTemplateDragAndDrop,
}) => {
  // if (!invitationData || !invitationData.elements) {
  //   return <div>Nu s-au găsit date pentru invitație.</div>;
  // }

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeBreakpoint, setActiveBreakpoint] = useState<
    keyof typeof BREAKPOINTS | 'desktop'
  >((activeBreakpointValue as 'mobile' | 'tablet' | 'desktop') ?? 'desktop');
  const { settings, elements: sections } = invitationData;
  const backgroundColor = settings?.backgroundColor || '#ffffff';

  const [activeElementData, setActiveElementData] = useState<{
    modifiers: [];
  } | null>(null);

  // Used to prevent drag event to fire on a normal click
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    setActiveBreakpoint(
      activeBreakpointValue as 'mobile' | 'tablet' | 'desktop'
    );
    if (!editMode) {
      const updateContainerWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setActiveBreakpoint(getBreakpointName(width));
        }
      };

      updateContainerWidth();
      window.addEventListener('resize', updateContainerWidth);

      return () => {
        window.removeEventListener('resize', updateContainerWidth);
      };
    }
  }, [activeBreakpointValue]);

  const invitationAreaStyle: React.CSSProperties = {
    maxWidth: `100%`,
    height: `calc(100% - 72px);%`,
    backgroundColor: backgroundColor,
    margin: '0 auto',
    position: 'relative',
    overflowY: 'auto',
  };

  const getPropertyValue = (
    data: TemplateElement,
    defaultPropertyPath: string,
    activeBreakpoint: 'desktop' | 'tablet' | 'mobile',
    isPropertyResponsive: boolean
  ): unknown => {
    if (!data || !defaultPropertyPath) {
      return undefined;
    }

    if (activeBreakpoint !== 'desktop' && isPropertyResponsive) {
      const responsivePath = `responsive.${activeBreakpoint}.${defaultPropertyPath}`;

      const responsiveValue = getNestedValue(data, responsivePath);

      if (responsiveValue !== undefined) {
        return responsiveValue;
      }
    }

    const defaultValue = getNestedValue(data, defaultPropertyPath);

    return defaultValue;
  };

  const handleDragStart = (e: DragStartEvent) => {
    const { active } = e;
    const activeData = active.data.current as DragEventData;
    if (!activeData) {
      return;
    }
    setActiveElementData(activeData);
  };

  const handleDragEnd = (e: DragEndEvent, section: TemplateSection) => {
    const canvasElement: HTMLElement = document.querySelector(
      '#' + section.id
    ) as HTMLElement;

    const movedElementIndex = section.elements.findIndex(
      (x) => x.id === e.active.id
    );

    if (movedElementIndex !== -1) {
      const currentElement = section.elements[movedElementIndex];

      const currentValue = getPropertyValue(
        currentElement,
        'position',
        activeBreakpoint,
        true
      );

      let newX =
        ((currentValue as { x: number }).x ?? 0) +
        (e.delta.x / canvasElement.offsetWidth) * 100;
      let newY =
        ((currentValue as { y: number }).y ?? 0) +
        (e.delta.y / canvasElement.offsetHeight) * 100;

      // Limitează valorile pentru a se asigura că rămân în limitele 0-100%.
      newX = Number(Math.max(0, Math.min(100, newX)).toFixed(1));
      newY = Number(Math.max(0, Math.min(100, newY)).toFixed(1));

      handleTemplateDragAndDrop &&
        handleTemplateDragAndDrop(e.active.id as string, {
          x: newX,
          y: newY,
          elementAlignment: (
            currentValue as {
              elementAlignment: 'auto' | 'self-start' | 'center' | 'self-end';
            }
          ).elementAlignment,
        });
    } else {
      console.warn(
        `Elementul cu ID ${e.active?.id} nu a fost găsit pentru mutare.`
      );
    }
  };

  return (
    <div ref={containerRef} style={invitationAreaStyle}>
      {sections?.map((section) => {
        return editMode && onSelect && selectedElementId ? (
          <DndContext
            sensors={sensors}
            modifiers={
              activeElementData
                ? activeElementData.modifiers
                : [restrictToParentElement]
            }
            onDragStart={handleDragStart}
            onDragEnd={(e) => handleDragEnd(e, section)}
          >
            <EditSectionRenderer
              key={section.id}
              sectionData={section}
              activeBreakpoint={activeBreakpoint}
              selectedElementId={selectedElementId}
              isSelected={selectedElementId === section.id}
              onSelect={onSelect}
            />
          </DndContext>
        ) : (
          <SectionRenderer
            key={section.id}
            sectionData={section}
            activeBreakpoint={activeBreakpoint}
            eventId={invitationData.eventId}
            userId={invitationData.userId}
          />
        );
      })}
    </div>
  );
};

export default TemplateRenderer;
