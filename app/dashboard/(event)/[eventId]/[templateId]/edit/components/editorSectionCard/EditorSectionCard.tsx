import { TemplateElement, TemplateSection } from '@/core/types';
import { DeleteOutlined } from '@ant-design/icons';
import { ChevronRight, EyeIcon, TextIcon } from 'lucide-react';
import React from 'react';

export interface EditorSectionCardProps {
  section: TemplateSection;
  isSelected: boolean;
  selectedItemId: string;
  onSelect: (element: TemplateElement) => void;
}

const EditorSectionCard = ({
  section,
  isSelected,
  selectedItemId,
  onSelect,
}: EditorSectionCardProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Folosim useEffect pentru a sincroniza starea locală 'isOpen' cu prop-ul 'isSelected'
  React.useEffect(() => {
    // Dacă acest card devine selectat (fie prin click direct, fie din canvas),
    // setăm starea locală 'isOpen' pe true.
    if (isSelected) {
      setIsOpen(true);
    }
    // NOTĂ: Dacă vrei ca cardul să se închidă automat când devine NE-SELECTAT,
    // poți adăuga un 'else { setIsOpen(false); }' aici.
    // Cerința ta actuală este doar să se deschidă când este selectat.
  }, [isSelected]); // Dependența: rulează efectul ori de câte ori se schimbă 'isSelected'

  // Această funcție notifică părintele că acest card a fost selectat.
  // NU mai setează direct starea 'isOpen', deoarece useEffect face asta acum.
  const handleCardClick = (element: TemplateElement) => {
    // Presupunem că section.id este disponibil și este un string
    onSelect(element); // Notifică părintele (acesta va actualiza 'isSelected' pentru acest card)
  };

  // Handler-ul pentru click-ul pe săgeată, care toggle-uie DOAR starea locală 'isOpen'
  // Acest click funcționează independent de starea de selecție, permițând închiderea manuală chiar dacă e selectat.
  const handleChevronClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Oprește propagarea către div-ul părinte (card)
    setIsOpen(!isOpen);
  };

  // Handler-uri pentru iconițele de control (ștergere, ochi)
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Oprește propagarea către card
    // Aici adaugi logica pentru ștergere (probabil apelând o funcție din prop)
    console.log('Delete clicked for section:', section.name);
  };

  const handleEyeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Oprește propagarea către card
    // Aici adaugi logica pentru vizibilitate (probabil apelând o funcție din prop)
    console.log('Eye clicked for section:', section.name);
  };

  return (
    <>
      <div
        className={`template-editor-section-card flex items-center gap-1 w-full p-1 rounded hover:bg-gray-100 cursor-pointer text-sm text-gray-700 ${
          isSelected && section.id === selectedItemId ? 'bg-gray-200' : ''
        }`}
        onClick={() => handleCardClick(section)} // Click pe card notifică părintele
      >
        <div className="flex items-center gap-1">
          {/* Ambele Chevron folosesc handleChevronClick */}
          {isOpen ? (
            <ChevronRight
              onClick={handleChevronClick}
              size={12}
              className="hover:bg-gray-200 h-[24px] w-[24px] rounded-sm p-1 cursor-pointer rotate-90 z-2"
            />
          ) : (
            <ChevronRight
              onClick={handleChevronClick}
              size={12}
              className="hover:bg-gray-200 h-[24px] w-[24px] rounded-sm p-1 cursor-pointer z-2"
            />
          )}
          <span className="font-semibold">{section.name}</span>
        </div>
        <div className="template-editor-section-controls flex items-center gap-1 ml-auto justify-center">
          <DeleteOutlined
            size={14}
            className="hover:bg-gray-200 h-[24px] w-[24px] rounded-sm p-1 cursor-pointer  z-2"
            onClick={handleDeleteClick} // Adaugă handler specific
          />
          <EyeIcon
            size={16}
            className="hover:bg-gray-200 h-[24px] w-[24px] rounded-sm p-1 cursor-pointer z-2"
            onClick={handleEyeClick} // Adaugă handler specific
          />
        </div>
      </div>

      {/* Conținutul extensibil, afișat doar dacă isOpen este true */}
      {isOpen && (
        <div className="template-editor-section-content flex flex-col gap-1 w-full">
          {section.elements.map((element) => (
            <div
              onClick={() => handleCardClick(element)}
              key={element.id} // Folosește un key unic pentru elemente
              // Adaugă eventual un handler onClick și aici dacă elementele sunt interactive
              className={`flex items-center gap-2 hover:bg-gray-100 p-1 rounded cursor-pointer w-[calc(100%-20px)] ml-[20px] ${
                isSelected && selectedItemId === element.id ? 'bg-gray-200' : ''
              }`}
            >
              <TextIcon size={14} />{' '}
              {/* Sau altă iconiță bazată pe element.type */}
              <span className="text-sm text-gray-700 font-[600]">
                {element.name} {/* Afișează tipul elementului */}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default EditorSectionCard;
