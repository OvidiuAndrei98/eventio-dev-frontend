import React, { useEffect, useRef, useState } from 'react';
import SectionRenderer from './SectionRenderer';
import { Template, TemplateElement } from '@/core/types';
import { BREAKPOINTS, getBreakpointName } from '../constants';
import EditSectionRenderer from './EditSectionRenderer';

interface TemplateRendererProps {
  invitationData: Template;
  slectedElementId?: string;
  editMode?: boolean;
  onSelect?: (section: TemplateElement) => void;
  activeBreakpointValue?: string;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  invitationData,
  slectedElementId,
  editMode = false,
  onSelect,
  activeBreakpointValue,
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

  useEffect(() => {
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
  }, [activeBreakpointValue]);

  const invitationAreaStyle: React.CSSProperties = {
    maxWidth: `100%`,
    height: `calc(100% - 72px);%`,
    backgroundColor: backgroundColor,
    margin: '0 auto',
    position: 'relative',
    overflowY: 'auto',
  };

  return (
    <div ref={containerRef} style={invitationAreaStyle}>
      {sections?.map((section) => {
        return editMode && onSelect && slectedElementId ? (
          <EditSectionRenderer
            key={section.id}
            sectionData={section}
            activeBreakpoint={activeBreakpoint}
            selectedElementId={slectedElementId}
            isSelected={slectedElementId === section.id}
            onSelect={onSelect}
          />
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
