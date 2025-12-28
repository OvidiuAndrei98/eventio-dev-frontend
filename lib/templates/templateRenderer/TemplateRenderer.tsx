import React, { useEffect, useRef, useState } from 'react';
import SectionRenderer from './SectionRenderer';
import {
  FlexiblePosition,
  Template,
  TemplateElement,
  TemplateSection,
} from '@/core/types';
import EditSectionRenderer from './EditSectionRenderer';
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import {
  Guideline,
  calculateGuidelines,
} from '@/app/dashboard/(event)/[eventId]/[templateId]/edit/utils/canvasUtils/guidelineCalculations';
import { DragEventData } from '@/app/dashboard/components/TablePlanRenderer';

interface TemplateRendererProps {
  invitationData: Template;
  selectedElementId?: string;
  editMode?: boolean;
  onSelect?: (section: TemplateElement) => void;
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
  previewMode,
  handleTemplateDragAndDrop,
  onDrag,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const backgroundImageUrl =
    'https://img.freepik.com/free-photo/white-paper-texture_1194-5416.jpg';

  const { settings, elements: sections } = invitationData;
  const backgroundColor = settings?.backgroundColor || '#ffffff';

  const [activeSection, setActiveSection] = useState<TemplateSection | null>();
  const [currentGuidelines, setCurrentGuidelines] = useState<Guideline[]>([]);
  const [activeElementData, setActiveElementData] =
    useState<DragEventData | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 5, delay: 100 },
    })
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isLargerThanMobile = windowWidth > 450;

  const phoneFrameStyle: React.CSSProperties = {
    width: editMode && windowWidth < 450 ? '95%' : '100%',
    maxWidth: isLargerThanMobile ? '430px' : 'none',
    height: editMode ? '95%' : isLargerThanMobile ? '932px' : '100vh',
    maxHeight: editMode && isLargerThanMobile ? '932px' : 'none',

    // Culoarea invitației tale
    backgroundColor: backgroundColor,

    position: 'relative',
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollbarWidth: 'none',

    border: isLargerThanMobile ? '10px solid #2d3436' : 'none',
    borderRadius: isLargerThanMobile ? '40px' : '0px',
    boxShadow: isLargerThanMobile
      ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      : 'none',

    zIndex: 10,
    margin: '0 auto',
    transition: 'all 0.3s ease',
  };

  const handleDragStart = (e: DragStartEvent, section: TemplateSection) => {
    const activeData = e.active.data.current as DragEventData;
    if (!activeData) return;
    setActiveElementData(activeData);
    setActiveSection(section);
    onDrag?.(true);
  };

  const handleDragMove = (e: DragMoveEvent) => {
    if (e.active && e.active.rect.current?.translated && activeSection) {
      const canvasElement = document.querySelector(
        '#' + activeSection.id
      ) as HTMLElement;
      if (canvasElement) {
        setCurrentGuidelines(
          calculateGuidelines(
            e.active.rect.current.translated,
            canvasElement.getBoundingClientRect(),
            activeSection.elements,
            e.active.id as string
          )
        );
      }
    }
  };

  const handleDragEnd = (e: DragEndEvent, section: TemplateSection) => {
    setCurrentGuidelines([]);
    const canvasElement = document.querySelector(
      '#' + section.id
    ) as HTMLElement;
    if (!canvasElement) return;
    const canvasRect = canvasElement.getBoundingClientRect();
    const elementRect = e.active.rect.current?.translated;
    if (!elementRect) return;

    const newX = parseFloat(
      (((elementRect.left - canvasRect.left) / canvasRect.width) * 100).toFixed(
        2
      )
    );
    const newY = parseFloat(
      (((elementRect.top - canvasRect.top) / canvasRect.height) * 100).toFixed(
        2
      )
    );

    onDrag?.(false);
    handleTemplateDragAndDrop?.(e.active.id as string, {
      left: newX,
      top: newY,
      elementAlignment: 'auto',
    });
  };

  return (
    <div
      style={{
        position: editMode ? 'relative' : 'fixed',
        top: 0,
        left: 0,
        width: editMode ? '100%' : '100vw',
        height: editMode ? '100%' : '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: editMode ? 'transparent' : '#f5f5f5',
        overflow: editMode ? 'visible' : 'hidden',
        zIndex: editMode ? 1 : 1000,
      }}
    >
      <style>{`
        .phone-inner-container::-webkit-scrollbar { display: none; }
        .phone-inner-container { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* STRAT FUNDAL IMAGINE (DOAR LIVE) */}
      {!editMode && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1,
          }}
        />
      )}

      {/* OVERLAY PENTRU SOFT LIGHT (DOAR LIVE) */}
      {!editMode && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
            backdropFilter: 'blur(2px)',
            zIndex: 2,
          }}
        />
      )}

      <div
        ref={containerRef}
        style={phoneFrameStyle}
        className="phone-inner-container"
      >
        {sections?.map((section) =>
          editMode && onSelect && selectedElementId ? (
            <DndContext
              key={section.id}
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
                templateData={invitationData}
                sectionData={section}
                activeBreakpoint="mobile"
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
              activeBreakpoint="mobile"
              eventId={invitationData.eventId}
              userId={invitationData.userId}
              previewMode={previewMode}
            />
          )
        )}
      </div>
    </div>
  );
};

export default TemplateRenderer;
