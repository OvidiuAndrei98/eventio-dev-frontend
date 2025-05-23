import React from 'react';
import { TemplateSection, ElementType } from '../../../core/types';
import TextElement from '../templateElements/TextElement';
import ImageElement from '../templateElements/ImageElement';
import { BREAKPOINTS } from '../constants';
import RsvpElement from '../templateElements/RsvpElement';
import BlobsElement from '../templateElements/BlobsElement';
import ContainerElement from '../templateElements/ContainerElement';

const elementComponentMap = {
  [ElementType.Text]: TextElement,
  [ElementType.Image]: ImageElement,
  [ElementType.RSVP_ELEMENT]: RsvpElement,
  [ElementType.Blob]: BlobsElement,
  [ElementType.Container]: ContainerElement,

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
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 8px 8px 8px',
    zIndex: 2,
    backgroundRepeat: sectionData.backgroundImage ? 'no-repeat' : 'usent',
    backgroundSize: sectionData.backgroundImage ? 'cover' : 'usnet',
    backgroundImage: sectionData.backgroundImage
      ? `linear-gradient( ${sectionData.backgroundImage.opacity}, ${sectionData.backgroundImage.opacity} ), url('${sectionData.backgroundImage.url}')`
      : 'unset',
  };

  const validElements = sectionData.elements.filter(
    (el) => elementComponentMap[el.type as 'text' | 'image']
  );

  return (
    <div
      id={sectionData.id}
      style={sectionStyle}
      className={`${sectionData.disabled ? '!hidden' : '!flex'}`}
    >
      {validElements.map((element) => {
        const ComponentToRender =
          elementComponentMap[element.type as keyof typeof elementComponentMap];

        switch (element.type) {
          case ElementType.Text:
            return (
              <ComponentToRender
                key={element.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(element as any)}
                activeBreakpoint={activeBreakpoint}
              />
            );
          case ElementType.Image:
            return (
              <ComponentToRender
                key={element.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(element as any)}
                activeBreakpoint={activeBreakpoint}
              />
            );
          case ElementType.RSVP_ELEMENT:
            return (
              <ComponentToRender
                key={element.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(element as any)}
                activeBreakpoint={activeBreakpoint}
                editMode={true}
                eventId={eventId}
                userId={userId}
              />
            );
          case ElementType.Blob:
            return (
              <ComponentToRender
                key={element.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(element as any)}
                activeBreakpoint={activeBreakpoint}
              />
            );
          case ElementType.Container:
            return (
              <ComponentToRender
                key={element.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(element as any)}
                activeBreakpoint={activeBreakpoint}
                editMode={true}
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
