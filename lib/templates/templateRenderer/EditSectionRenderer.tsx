import React from 'react';
import {
  TemplateSection,
  ElementType,
  TemplateElement,
} from '../../../core/types';
import TextElement from '../templateElements/TextElement';
import ImageElement from '../templateElements/ImageElement';
import { BREAKPOINTS } from '../constants';

const elementComponentMap = {
  [ElementType.Text]: TextElement,
  [ElementType.Image]: ImageElement,
  // Adaugă aici alte tipuri de elemente care pot apărea în secțiuni
};

interface EditSectionRendererProps {
  sectionData: TemplateSection;
  activeBreakpoint: keyof typeof BREAKPOINTS | 'desktop';
  isSelected?: boolean;
  onSelect: (section: TemplateElement) => void;
}

const EditSectionRenderer: React.FC<EditSectionRendererProps> = ({
  sectionData,
  activeBreakpoint,
  isSelected,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const sectionStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '300px',
    ...(sectionData.style as React.CSSProperties),
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 0px 8px 8px;',
    zIndex: 2,
  };

  const validElements = sectionData.elements.filter(
    (el) => elementComponentMap[el.type as 'text' | 'image']
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      id={sectionData.id}
      style={sectionStyle}
      className={`${isSelected ? '!border-2 !border-[#CB93D9]' : ''} 
      ${!isSelected && isHovered ? '!border-1 !border-[#CB93D9]' : ''} border-1
      border-[transparent]`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        // De schimbat in id-ul sectiunii
        if (sectionData.name) {
          onSelect(sectionData);
        }
      }}
    >
      {isSelected && (
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
          elementComponentMap[element.type as 'image' | 'text'];

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

export default EditSectionRenderer;
