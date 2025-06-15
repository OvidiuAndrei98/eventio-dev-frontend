import React from 'react';
import { TemplateSection, ElementType, Template } from '../../../core/types';
import TextElement from '../templateElements/TextElement';
import ImageElement from '../templateElements/ImageElement';
import { BREAKPOINTS, mergeResponsiveProperties } from '../constants';
import RsvpElement from '../templateElements/RsvpElement';
import BlobsElement from '../templateElements/BlobsElement';
import ContainerElement from '../templateElements/ContainerElement';
import LocationsElement from '../templateElements/LocationsElement';
import GifElement from '../templateElements/GifElement';
import CountdownElement from '../templateElements/CountdownElement';

const elementComponentMap = {
  [ElementType.Text]: TextElement,
  [ElementType.Image]: ImageElement,
  [ElementType.RSVP_ELEMENT]: RsvpElement,
  [ElementType.Blob]: BlobsElement,
  [ElementType.Container]: ContainerElement,
  [ElementType.locationsElement]: LocationsElement,
  [ElementType.GifElement]: GifElement,
  [ElementType.Countdown]: CountdownElement,

  // Adaugă aici alte tipuri de elemente care pot apărea în secțiuni
};

interface SectionRendererProps {
  eventId: string;
  userId: string;
  sectionData: TemplateSection;
  activeBreakpoint: keyof typeof BREAKPOINTS | 'desktop';
  templateData: Template;
  previewMode?: boolean;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({
  eventId,
  userId,
  sectionData,
  activeBreakpoint,
  templateData,
  previewMode,
}) => {
  const finalElementProps = mergeResponsiveProperties<TemplateSection>(
    {
      id: sectionData.id,
      type: ElementType.Section,
      position: sectionData.position,
      name: sectionData.name,
      disabled: sectionData.disabled,
      style: sectionData.style,
      elements: sectionData.elements,
    },
    sectionData.responsive,
    activeBreakpoint
  ) as TemplateSection;

  const sectionStyle: React.CSSProperties = {
    ...finalElementProps.style,
    backgroundAttachment: 'unset',
    backgroundColor: 'transparent',
    width: '100%',
    maxWidth: '1200px',
    minHeight: '100px',
    position: 'relative' as const,
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 8px 8px 8px',
    zIndex: 2,
  };

  const sectionWrapperStyle: React.CSSProperties = {
    display: 'flex',
    overflowX: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'relative' as const,
    backgroundColor: finalElementProps.style.backgroundColor as string,
    backgroundPosition: 'center',
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
    <div style={sectionWrapperStyle} className="w-full mx-auto">
      <div
        id={sectionData.id}
        style={sectionStyle}
        className={`${sectionData.disabled ? '!hidden' : '!flex'}`}
      >
        {validElements.map((element) => {
          const ComponentToRender =
            elementComponentMap[
              element.type as keyof typeof elementComponentMap
            ];

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
                  eventId={eventId}
                  userId={userId}
                  eventAditionalQuestions={
                    templateData.settings.eventAditionalQuestions
                  }
                />
              );
            case ElementType.Blob:
              return (
                <ComponentToRender
                  key={element.id}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...(element as any)}
                  activeBreakpoint={activeBreakpoint}
                  previewMode={previewMode}
                />
              );
            case ElementType.Container:
              return (
                <ComponentToRender
                  key={element.id}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...(element as any)}
                  activeBreakpoint={activeBreakpoint}
                />
              );
            case ElementType.locationsElement:
              return (
                <ComponentToRender
                  key={element.id}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...(element as any)}
                  activeBreakpoint={activeBreakpoint}
                  eventLocation={templateData.settings.eventLocation}
                  eventAditionalLocations={
                    templateData.settings.aditionalLocations
                  }
                  eventDate={templateData.eventDate}
                />
              );
            case ElementType.GifElement:
              return (
                <ComponentToRender
                  key={element.id}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...(element as any)}
                  activeBreakpoint={activeBreakpoint}
                />
              );
            case ElementType.Countdown:
              return (
                <ComponentToRender
                  key={element.id}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...(element as any)}
                  activeBreakpoint={activeBreakpoint}
                  target={templateData.eventDate}
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
    </div>
  );
};

export default SectionRenderer;
