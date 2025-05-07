import React, { useEffect, useRef, useState } from 'react';
import SectionRenderer from './SectionRenderer';
import { Template } from '@/core/types';
import { BREAKPOINTS, getBreakpointName } from '../constants';
import EditSectionRenderer from './EditSectionRenderer';

interface TemplateRendererProps {
  invitationData: Template;
  selectedSectionId?: string;
  editMode?: boolean;
  onSelect?: (sectionId: string) => void;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  invitationData,
  selectedSectionId,
  editMode = false,
  onSelect,
}) => {
  // if (!invitationData || !invitationData.elements) {
  //   return <div>Nu s-au găsit date pentru invitație.</div>;
  // }

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeBreakpoint, setActiveBreakpoint] = useState<
    keyof typeof BREAKPOINTS | 'desktop'
  >('desktop');
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
  }, []);

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
      {sections.map((section) => {
        return editMode && onSelect ? (
          <EditSectionRenderer
            key={section.id}
            sectionData={section}
            activeBreakpoint={activeBreakpoint}
            isSelected={selectedSectionId === section.name}
            onSelect={onSelect}
          />
        ) : (
          <SectionRenderer
            key={section.id}
            sectionData={section}
            activeBreakpoint={activeBreakpoint}
          />
        );
      })}
    </div>
  );
};

export default TemplateRenderer;
