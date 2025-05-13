import React from 'react';
import { TemplateSection, ElementType } from '../../../core/types';
import TextElement from '../templateElements/TextElement';
import ImageElement from '../templateElements/ImageElement';
import { BREAKPOINTS } from '../constants';
import RsvpElement from '../templateElements/RsvpElement';

const elementComponentMap = {
  [ElementType.Text]: TextElement,
  [ElementType.Image]: ImageElement,
  [ElementType.RSVP_ELEMENT]: RsvpElement,
  // Adaugă aici alte tipuri de elemente care pot apărea în secțiuni
};

interface SectionRendererProps {
  eventId: string;
  userId: string;
  sectionData: TemplateSection;
  activeBreakpoint: keyof typeof BREAKPOINTS | 'desktop';
}

const SectionRenderer: React.FC<SectionRendererProps> = ({
  eventId,
  userId,
  sectionData,
  activeBreakpoint,
}) => {
  const sectionStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '300px',
    ...(sectionData.style as React.CSSProperties),
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 8px 8px 8px',
    zIndex: 2,
  };

  const validElements = sectionData.elements.filter(
    (el) => elementComponentMap[el.type as 'text' | 'image']
  );

  return (
    <div id={sectionData.id} style={sectionStyle}>
      {validElements.map((element) => {
        const ComponentToRender =
          elementComponentMap[element.type as keyof typeof elementComponentMap];

        switch (element.type) {
          case ElementType.Text:
            return (
              <ComponentToRender
                key={element.id}
                {...(element as any)}
                activeBreakpoint={activeBreakpoint}
              />
            );
          case ElementType.Image:
            return (
              <ComponentToRender
                key={element.id}
                {...(element as any)}
                activeBreakpoint={activeBreakpoint}
              />
            );
          case ElementType.RSVP_ELEMENT:
            return (
              <ComponentToRender
                key={element.id}
                {...(element as any)}
                activeBreakpoint={activeBreakpoint}
                editMode={true}
                eventId={eventId}
                userId={userId}
              />
            );
          default:
            console.warn(
              `Unsupported element type inside section: ${element.type}`,
              element
            );
            return null;
        }
      })}
    </div>
  );
};

export default SectionRenderer;
