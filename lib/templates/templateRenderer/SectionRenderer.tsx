// components/SectionRenderer.tsx
import React from 'react';
import { TemplateSection, ElementType } from '../../../core/types'; // Asigură-te că calea e corectă
import TextElement from '../templateElements/TextElement';
import ImageElement from '../templateElements/ImageElement';

// Mapare între tipurile de elemente din JSON și componentele React corespunzătoare
// Notă: Această mapare este pentru ELEMENTELE DIN INTERIORUL SECȚIUNILOR
const elementComponentMap = {
  [ElementType.Text]: TextElement,
  [ElementType.Image]: ImageElement,
  // Adaugă aici alte tipuri de elemente care pot apărea în secțiuni
};

interface SectionRendererProps {
  sectionData: TemplateSection & {
    position: { x: number; y: number };
    size?: { width: number; height: number };
  }; // Presupunem position și size pe secțiune
  // Adaugă prop-uri suplimentare dacă SectionRenderer are nevoie de ceva de la părinte
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ sectionData }) => {
  const sectionStyle: React.CSSProperties = {
    // Poziționează secțiunea absolut față de containerul principal (InvitationRenderer)
    width: sectionData.size ? `${sectionData.size.width}px` : 'auto', // Poate avea dimensiune fixă sau automată
    height: sectionData.size ? `${sectionData.size.height}px` : 'auto',
    ...(sectionData.style as React.CSSProperties), // Aplică stilurile secțiunii (background, border, zIndex etc.)
    // IMPORTANT: Setează position: 'relative' pe containerul secțiunii
    position: 'relative' as const, // <-- Elementele copiii absolute se vor poziționa relativ la acest div
  };

  // Filtrează elementele pentru a folosi doar cele suportate de maparea curentă
  const validElements = sectionData.elements.filter(
    (el) => elementComponentMap[el.type as 'text' | 'image'] // Adaugă tipurile suportate aici
  );

  return (
    <div id={sectionData.id} style={sectionStyle}>
      {validElements
        // Sortarea după z-index este importantă pentru a asigura randarea corectă a straturilor ÎN CADRUL secțiunii
        .sort(
          (a, b) =>
            ((a.style?.zIndex as number) || 0) -
            ((b.style?.zIndex as number) || 0)
        )
        .map((element) => {
          const ComponentToRender =
            elementComponentMap[element.type as 'image' | 'text']; // Adaugă tipurile suportate aici

          // Randăm componenta corespunzătoare, transmițându-i toate proprietățile elementului din JSON
          // TypeScript Trick: Folosim o aserțiune de tip pentru a transmite props-urile corecte
          switch (element.type) {
            case ElementType.Text:
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return <ComponentToRender {...(element as any)} />;
            case ElementType.Image:
              return (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <ComponentToRender {...(element as any)} />
              );
            // Adaugă alte cazuri aici pentru alte tipuri de elemente suportate în secțiuni
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
