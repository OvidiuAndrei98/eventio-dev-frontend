// components/InvitationRenderer.tsx
import React from 'react';
import SectionRenderer from './SectionRenderer';
import { Template, TemplateSection } from '@/core/types';

interface InvitationRendererProps {
  invitationData: Template; // Primește întregul obiect template
}

const InvitationRenderer: React.FC<InvitationRendererProps> = ({
  invitationData,
}) => {
  if (!invitationData || !invitationData.elements) {
    return <div>Nu s-au găsit date pentru invitație.</div>;
  }

  const { settings, elements: sections } = invitationData; // Redenumim 'elements' în 'sections' pentru claritate
  const backgroundColor = settings?.backgroundColor || '#ffffff';

  const invitationAreaStyle: React.CSSProperties = {
    width: `100%`,
    height: `100%`,
    backgroundColor: backgroundColor,
    position: 'relative', // Containerul principal este relative
    overflow: 'hidden', // Ascunde conținutul care depășește marginile paginii
    // Adaugă alte stiluri pentru invitație (margine, umbră etc.)
  };

  return (
    <div style={invitationAreaStyle}>
      {sections
        // Sortarea secțiunilor după z-index (presupunând că stilul secțiunii include zIndex)
        .sort(
          (a, b) =>
            ((a.style?.zIndex as number) || 0) -
            ((b.style?.zIndex as number) || 0)
        )
        // Randăm fiecare secțiune
        .map((section) => {
          // Verificăm dacă secțiunea are proprietățile de poziționare necesare (presupunerea noastră)
          // În aplicația reală, asigură-te că datele din Firebase le au
          const sectionWithPosition = section as TemplateSection & {
            position: { x: number; y: number };
            size?: { width: number; height: number };
          };

          if (!sectionWithPosition.position) {
            console.warn(`Section ${section.id} is missing position property.`);
            return null; // Nu randa secțiunea dacă nu are poziție
          }

          return (
            <SectionRenderer
              key={section.id} // Cheia este crucială pentru listele React
              sectionData={sectionWithPosition} // Transmite datele secțiunii către SectionRenderer
            />
          );
        })}
    </div>
  );
};

export default InvitationRenderer;
