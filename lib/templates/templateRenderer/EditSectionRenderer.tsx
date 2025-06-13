import React from 'react';
import {
  TemplateSection,
  ElementType,
  TemplateElement,
  Template,
} from '../../../core/types';
import TextElement from '../templateElements/TextElement';
import ImageElement from '../templateElements/ImageElement';
import { BREAKPOINTS, mergeResponsiveProperties } from '../constants';
import RsvpElement from '../templateElements/RsvpElement';
import BlobsElement from '../templateElements/BlobsElement';
import ContainerElement from '../templateElements/ContainerElement';
import DragOverlayGuidelines from '@/app/dashboard/(event)/[eventId]/[templateId]/edit/components/DragOverlayGuidelines';
import { Guideline } from '@/app/dashboard/(event)/[eventId]/[templateId]/edit/utils/canvasUtils/guidelineCalculations';
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

interface EditSectionRendererProps {
  sectionData: TemplateSection;
  templateData: Template;
  activeBreakpoint: keyof typeof BREAKPOINTS | 'desktop';
  selectedElementId: string;
  isSelected?: boolean;
  onSelect: (section: TemplateElement) => void;
  currentGuidelines: Guideline[];
}

const EditSectionRenderer: React.FC<EditSectionRendererProps> = ({
  sectionData,
  templateData,
  activeBreakpoint,
  selectedElementId,
  isSelected,
  onSelect,
  currentGuidelines,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const sectionStyle = mergeResponsiveProperties(
    {
      backgroundImage: sectionData.backgroundImage,
      id: sectionData.id,
      type:
        ElementType.Section ||
        ElementType.RSVP_SECTION ||
        ElementType.LocationsSection,
      position: sectionData.position,
      name: sectionData.name,
      disabled: sectionData.disabled,
      style: sectionData.style,
    },
    sectionData.responsive,
    activeBreakpoint
  ) as TemplateElement;

  const finalSectionStyle = {
    ...sectionStyle.style,
    width: '100%',
    minHeight: '100px',
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px',
    zIndex: 2,
    backgroundPosition: 'center',
    backgroundRepeat: sectionData.backgroundImage ? 'no-repeat' : 'usent',
    backgroundSize: sectionData.backgroundImage ? 'cover' : 'usnet',
    backgroundImage: sectionData.backgroundImage
      ? `linear-gradient( ${sectionData.backgroundImage.opacity}, ${sectionData.backgroundImage.opacity} ), url('${sectionData.backgroundImage.url}')`
      : 'unset',
  } as React.CSSProperties;

  const validElements = sectionData.elements.filter(
    (el) => elementComponentMap[el.type as keyof typeof elementComponentMap]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const canvasElement = document.querySelector(
    '#' + sectionData.id
  ) as HTMLElement;

  const canvasRect = canvasElement
    ? canvasElement.getBoundingClientRect()
    : null;

  return (
    <div
      id={sectionData.id}
      style={{ ...finalSectionStyle }}
      className={`${
        isSelected && selectedElementId === sectionData.id
          ? '!border-2 !border-[#CB93D9]'
          : ''
      } 
      ${!isSelected && isHovered ? '!border-1 !border-[#CB93D9]' : ''} border-1
      border-[transparent] ${sectionData.disabled && 'opacity-[0.5]'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        if (sectionData.id) {
          onSelect(sectionData);
        }
      }}
    >
      {isSelected && selectedElementId === sectionData.id && (
        <div className="absolute top-0 left-0 bg-[#CB93D9] text-white p-1 rounded-[0_0_8px_0] z-10 text-sm">
          {sectionData.name}
        </div>
      )}
      {!isSelected && isHovered && (
        <div className="absolute top-0 left-0 bg-[#CB93D9] text-white p-1 rounded-[0_0_8px_0] z-10 text-sm">
          {sectionData.name}
        </div>
      )}
      {isHovered && (
        <div className="absolute top-0 left-0 bottom-0 right-0 !bg-purple-100/20 transition-colors duration-200"></div>
      )}
      {validElements.map((element) => {
        const ComponentToRender =
          elementComponentMap[element.type as keyof typeof elementComponentMap];
        switch (element.type) {
          case ElementType.Text:
            return (
              <ComponentToRender
                selectedElementId={selectedElementId}
                isSelected={selectedElementId === element.id}
                onSelect={onSelect}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(element as any)}
                activeBreakpoint={activeBreakpoint}
                editMode={true}
              />
            );
          case ElementType.Image:
            return (
              <ComponentToRender
                selectedElementId={selectedElementId}
                isSelected={selectedElementId === element.id}
                key={element.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(element as any)}
                onSelect={onSelect}
                activeBreakpoint={activeBreakpoint}
                editMode={true}
              />
            );
          case ElementType.RSVP_ELEMENT:
            return (
              <ComponentToRender
                selectedElementId={selectedElementId}
                isSelected={selectedElementId === element.id}
                key={element.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(element as any)}
                activeBreakpoint={activeBreakpoint}
                eventId={''}
                onSelect={onSelect}
                editMode={true}
                eventAditionalQuestions={
                  templateData.settings.eventAditionalQuestions
                }
              />
            );
          case ElementType.Blob:
            return (
              <ComponentToRender
                selectedElementId={selectedElementId}
                isSelected={selectedElementId === element.id}
                key={element.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(element as any)}
                onSelect={onSelect}
                activeBreakpoint={activeBreakpoint}
                editMode={true}
              />
            );
          case ElementType.Container:
            return (
              <ComponentToRender
                selectedElementId={selectedElementId}
                isSelected={selectedElementId === element.id}
                key={element.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(element as any)}
                onSelect={onSelect}
                activeBreakpoint={activeBreakpoint}
                editMode={true}
              />
            );

          case ElementType.locationsElement:
            return (
              <ComponentToRender
                selectedElementId={selectedElementId}
                isSelected={selectedElementId === element.id}
                key={element.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(element as any)}
                onSelect={onSelect}
                activeBreakpoint={activeBreakpoint}
                editMode={true}
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
                selectedElementId={selectedElementId}
                isSelected={selectedElementId === element.id}
                key={element.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(element as any)}
                onSelect={onSelect}
                activeBreakpoint={activeBreakpoint}
                editMode={true}
              />
            );
          case ElementType.Countdown:
            return (
              <ComponentToRender
                selectedElementId={selectedElementId}
                isSelected={selectedElementId === element.id}
                key={element.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(element as any)}
                onSelect={onSelect}
                activeBreakpoint={activeBreakpoint}
                editMode={true}
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
      {canvasRect && <DragOverlayGuidelines guidelines={currentGuidelines} />}
    </div>
  );
};

export default EditSectionRenderer;
