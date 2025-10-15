import React, { useEffect, useRef, useState } from 'react';
import SectionRenderer from './SectionRenderer';
import {
  FlexiblePosition,
  Template,
  TemplateElement,
  TemplateSection,
} from '@/core/types';
import { BREAKPOINTS, getBreakpointName } from '../constants';
import EditSectionRenderer from './EditSectionRenderer';
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { getNestedValue } from '@/app/dashboard/(event)/[eventId]/[templateId]/edit/utils/objectUtils';
import { DragEventData } from '@/app/dashboard/(event)/[eventId]/tables/page';
import {
  Guideline,
  calculateGuidelines,
} from '@/app/dashboard/(event)/[eventId]/[templateId]/edit/utils/canvasUtils/guidelineCalculations';

interface TemplateRendererProps {
  invitationData: Template;
  selectedElementId?: string;
  editMode?: boolean;
  onSelect?: (section: TemplateElement) => void;
  activeBreakpointValue?: string;
  previewMode?: boolean;
  handleTemplateDragAndDrop?: (
    elementId: string,
    position: FlexiblePosition
  ) => void;
  onDrag?: (isDragging: boolean) => void;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  invitationData,
  selectedElementId,
  editMode = false,
  onSelect,
  activeBreakpointValue,
  previewMode,
  handleTemplateDragAndDrop,
  onDrag,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeBreakpoint, setActiveBreakpoint] = useState<
    keyof typeof BREAKPOINTS | 'desktop'
  >((activeBreakpointValue as 'mobile' | 'tablet' | 'desktop') ?? 'desktop');
  const { settings, elements: sections } = invitationData;
  const backgroundColor = settings?.backgroundColor || '#ffffff';
  const [activeSection, setActiveSection] = useState<TemplateSection | null>();
  const [currentGuidelines, setCurrentGuidelines] = useState<Guideline[]>([]);

  const [activeElementData, setActiveElementData] = useState<{
    modifiers: [];
  } | null>(null);

  // Used to prevent drag event to fire on a normal click and support touch devices
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const touchSensor =
    typeof window !== 'undefined' && 'ontouchstart' in window
      ? useSensor(require('@dnd-kit/core').TouchSensor, {
          activationConstraint: {
            distance: 5,
          },
        })
      : null;

  const sensors = useSensors(
    mouseSensor,
    ...(touchSensor ? [touchSensor] : [])
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
    // height: `calc(100% - 72px);`,
    backgroundColor: backgroundColor,
    margin: '0 auto',
    position: 'relative',
    overflowY: 'auto',
    height: '100%',
    scrollbarWidth: 'thin',
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

  const handleDragStart = (e: DragStartEvent, section: TemplateSection) => {
    const { active } = e;
    const activeData = active.data.current as DragEventData;
    if (!activeData) {
      return;
    }
    setActiveElementData(activeData);
    setActiveSection(section);
    onDrag?.(true);
  };

  const handleDragMove = (e: DragMoveEvent) => {
    // Calculăm și actualizăm liniile de ghidaj la fiecare mișcare
    if (e.active && e.active.rect.current?.translated && activeSection) {
      const canvasElement: HTMLElement = document.querySelector(
        '#' + activeSection.id
      ) as HTMLElement;

      if (canvasElement) {
        const draggedRect = e.active.rect.current.translated;
        const containerRect = canvasElement.getBoundingClientRect();

        // Preluăm toate elementele vizibile pentru a calcula alinierea cu ele
        // Este esențial ca ID-urile elementelor din `section.elements` să corespundă
        // cu ID-urile DOM pentru a putea prelua getBoundingClientRect().
        setCurrentGuidelines(
          calculateGuidelines(
            draggedRect,
            containerRect,
            activeSection.elements,
            e.active.id as string
          )
        );
      }
    }
  };

  const handleDragEnd = (e: DragEndEvent, section: TemplateSection) => {
    setCurrentGuidelines([]);
    const canvasElement: HTMLElement = document.querySelector(
      '#' + section.id
    ) as HTMLElement;

    if (!canvasElement) {
      console.warn(`Elementul canvas cu ID ${section.id} nu a fost găsit.`);
      return;
    }

    const movedElementIndex = section.elements.findIndex(
      (x) => x.id === e.active.id
    );

    if (movedElementIndex === -1) {
      console.warn(
        `Elementul cu ID ${e.active?.id} nu a fost găsit pentru mutare.`
      );
      return;
    }

    const currentElement = section.elements[movedElementIndex];
    // Preluăm poziția curentă pentru breakpoint-ul activ (pentru a păstra elementAlignment)
    const currentPosition = getPropertyValue(
      currentElement,
      'position',
      activeBreakpoint, // <-- activeBreakpoint (din editor)
      true
    ) as FlexiblePosition;

    const elementRect = e.active.rect.current?.translated;
    if (!elementRect) {
      console.error(
        'Dimensiunile elementului tras nu au putut fi determinate.'
      );
      return;
    }

    const canvasRect = canvasElement.getBoundingClientRect();

    // Coordonatele elementului relativ la părinte, ÎN PIXELI
    let newX_px = elementRect.left - canvasRect.left;
    let newY_px = elementRect.top - canvasRect.top;
    const elementWidth_px = elementRect.width;
    const elementHeight_px = elementRect.height;
    const parentWidth_px = canvasRect.width;
    const parentHeight_px = canvasRect.height;

    // Restricționează valorile în pixeli pentru a rămâne în limitele containerului
    newX_px = Math.max(0, Math.min(parentWidth_px - elementWidth_px, newX_px));
    newY_px = Math.max(
      0,
      Math.min(parentHeight_px - elementHeight_px, newY_px)
    );

    // Toleranța în procente. Definește cât de aproape trebuie să fie de margine
    // pentru a fi considerat "lipit" de acea margine (și să seteze valoarea la 0%).
    const tolerancePercent = 1; // 1% din lățimea/înălțimea părinte

    const finalPosition: FlexiblePosition = {
      elementAlignment: currentPosition?.elementAlignment || 'auto', // Păstrează alinierea existentă
    };

    // Calculul distanțelor în procente
    const newX_percent = (newX_px / parentWidth_px) * 100;
    const newY_percent = (newY_px / parentHeight_px) * 100;

    // Calculăm distanța de la marginea dreaptă a elementului până la marginea dreaptă a containerului
    const distanceFromRight_percent =
      100 - (newX_percent + (elementWidth_px / parentWidth_px) * 100);
    // Calculăm distanța de la marginea de jos a elementului până la marginea de jos a containerului
    const distanceFromBottom_percent =
      100 - (newY_percent + (elementHeight_px / parentHeight_px) * 100);

    // Decizia pe axa X (stânga vs. dreapta)
    // Verificăm dacă elementul este "lipit" de marginea stângă (within tolerancePercent from 0)
    if (newX_percent <= tolerancePercent) {
      finalPosition.left = 0; // Lipit de stânga
      delete finalPosition.right; // Asigurăm că nu avem ambele proprietăți
    }
    // Verificăm dacă elementul este "lipit" de marginea dreaptă (within tolerancePercent from 0)
    else if (distanceFromRight_percent <= tolerancePercent) {
      finalPosition.right = 0; // Lipit de dreapta
      delete finalPosition.left; // Asigurăm că nu avem ambele proprietăți
    }
    // Dacă nu este lipit de nicio margine, decidem care ancoră este mai "naturală"
    else {
      // Dacă distanța de la stânga e mai mică decât distanța de la dreapta
      if (newX_percent < distanceFromRight_percent) {
        finalPosition.left = parseFloat(newX_percent.toFixed(2));
        delete finalPosition.right;
      }
      // Dacă distanța de la dreapta e mai mică decât distanța de la stânga
      else {
        finalPosition.right = parseFloat(distanceFromRight_percent.toFixed(2));
        delete finalPosition.left;
      }
    }

    // Decizia pe axa Y (sus vs. jos)
    // Verificăm dacă elementul este "lipit" de marginea de sus (within tolerancePercent from 0)
    if (newY_percent <= tolerancePercent) {
      finalPosition.top = 0; // Lipit de sus
      delete finalPosition.bottom;
    }
    // Verificăm dacă elementul este "lipit" de marginea de jos (within tolerancePercent from 0)
    else if (distanceFromBottom_percent <= tolerancePercent) {
      finalPosition.bottom = 0; // Lipit de jos
      delete finalPosition.top;
    }
    // Dacă nu este lipit de nicio margine, decidem care ancoră este mai "naturală"
    else {
      // Dacă distanța de la sus e mai mică decât distanța de la jos
      if (newY_percent < distanceFromBottom_percent) {
        finalPosition.top = parseFloat(newY_percent.toFixed(2));
        delete finalPosition.bottom;
      }
      // Dacă distanța de la jos e mai mică decât distanța de la sus
      else {
        finalPosition.bottom = parseFloat(
          distanceFromBottom_percent.toFixed(2)
        );
        delete finalPosition.top;
      }
    }

    onDrag?.(false);

    // Salvarea dimensiunilor (width/height) NU se face aici,

    handleTemplateDragAndDrop &&
      handleTemplateDragAndDrop(e.active.id as string, finalPosition);
  };

  if (!invitationData || !invitationData.elements) {
    return <div>Nu s-au găsit date pentru invitație.</div>;
  }

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
            onDragCancel={() => {
              setActiveElementData(null);
              setCurrentGuidelines([]);
            }}
            onDragStart={(e) => handleDragStart(e, section)}
            onDragEnd={(e) => handleDragEnd(e, section)}
            onDragMove={(e) => handleDragMove(e)}
          >
            <EditSectionRenderer
              key={section.id}
              templateData={invitationData}
              sectionData={section}
              activeBreakpoint={activeBreakpoint}
              selectedElementId={selectedElementId}
              isSelected={selectedElementId === section.id}
              onSelect={onSelect}
              currentGuidelines={currentGuidelines}
            />
          </DndContext>
        ) : (
          <SectionRenderer
            key={section.id}
            templateData={invitationData}
            sectionData={section}
            activeBreakpoint={activeBreakpoint}
            eventId={invitationData.eventId}
            userId={invitationData.userId}
            previewMode={previewMode}
            //de adaugat isActive pt ferificare in link daca e activa
          />
        );
      })}
    </div>
  );
};

export default TemplateRenderer;
