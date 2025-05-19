/* eslint-disable */

import { ElementType, TemplateElement, TemplateSection } from '@/core/types';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
  ChevronRight,
  EyeIcon,
  TextIcon,
  ImageIcon,
  EyeOffIcon,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import AddSectionModal from '../addSectionModal/AddSectionModal';
import { availableElementTypes } from '../../utils/editorUtils';
import { defaultElements } from '@/lib/templates/defaultTemplateElements/defaultTemplateElements';

export interface EditorSectionCardProps {
  section: TemplateSection;
  isSelected: boolean;
  selectedItemId: string | null;
  onSelect: (item: TemplateElement) => void;
  onDeleteSection?: (sectionId: string) => void;
  onDeleteElement?: (elementId: string, sectionId: string) => void;
  onToggleVisibility?: (
    sectionId: string,
    elementId: string | undefined
  ) => void;
  onAddElement: (newElement: TemplateElement, sectionId: string) => void;
}

const EditorSectionCard = ({
  section,
  isSelected,
  selectedItemId,
  onSelect,
  onDeleteSection,
  onDeleteElement,
  onToggleVisibility,
  onAddElement,
}: EditorSectionCardProps) => {
  // Starea locala pentru a controla daca sectiunea este extinsa (deschisa) in panoul lateral
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  // Folosim useEffect pentru a sincroniza starea locală 'isOpen' cu starea de selectie
  // Daca sectiunea insasi e selectata SAU un element din ea e selectat, extindem sectiunea.
  React.useEffect(() => {
    if (
      (isSelected && selectedItemId === section.id) || // Sectiunea este selectata
      section.elements.some((el) => el.id === selectedItemId) // Un element din sectiune este selectat
    ) {
      setIsOpen(true);
    }
    // Daca vrei ca sectiunea sa se restranga automat cand NU mai este selectata,
    // poti adauga un 'else { setIsOpen(false); }' aici.
  }, [isSelected, selectedItemId, section.id, section.elements]);

  // Helper pentru a obtine iconita in functie de tipul elementului (presupune ca TemplateElement are un camp 'type')
  const getElementIcon = (element: TemplateElement) => {
    switch (element.type) {
      case 'text':
        return <TextIcon size={14} />;
      case 'image':
        return <ImageIcon size={14} />;
      // Adauga cazuri pentru alte tipuri de elemente pe masura ce le adaugi in aplicatie
      default:
        return <TextIcon size={14} />; // Iconita default pentru tipuri necunoscute
    }
  };

  // Handler-ul pentru click-ul pe cardul sectiunii SAU elementului.
  // Notifica parintele despre item-ul selectat (sectiune sau element).
  const handleCardClick = (item: TemplateSection | TemplateElement) => {
    onSelect(item);
  };

  // Handler-ul pentru click-ul pe săgeată, toggle-uie DOAR starea locală 'isOpen'
  // Permite userului sa inchida/deschida manual sectiunea, independent de selectie.
  const handleChevronClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Oprește propagarea către div-ul părinte (card), altfel s-ar selecta si sectiunea
    setIsOpen(!isOpen);
  };

  const handleDeleteSectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteSection) {
      onDeleteSection(section.id);
    }
  };

  const handleToggleSectionVisibilityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleVisibility) {
      onToggleVisibility(section.id, undefined);
    }
  };

  const handleDeleteElementClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (onDeleteElement) {
      onDeleteElement(elementId, section.id);
    }
  };

  const handleToggleElementVisibilityClick = (
    e: React.MouseEvent,
    elementId: string
  ) => {
    e.stopPropagation();
    if (onToggleVisibility) {
      // Apelam handler-ul parintelui.
      onToggleVisibility(section.id, elementId); // Pasam ID element si false
    }
  };

  const handleAddSectionClick = useCallback(() => {
    setIsPopoverOpen(true);
  }, [isPopoverOpen]);

  const handlePopoverOpenChange = useCallback((newOpenState: boolean) => {
    if (!newOpenState) {
      setIsPopoverOpen(false);
    }
  }, []);

  const handleSelectElementType = useCallback(
    (
      elementType: Exclude<
        ElementType,
        ElementType.Section | ElementType.RSVP_SECTION
      >,
      elementName: string,
      section: TemplateSection
    ) => {
      const newElement: TemplateElement =
        defaultElements[elementType](elementName);

      onAddElement(newElement, section.id);

      setIsPopoverOpen(false);
    },
    [isPopoverOpen, section]
  );

  return (
    <>
      <div
        className={`template-editor-section-card flex items-center gap-1 w-full p-1 rounded hover:bg-gray-100 cursor-pointer text-sm text-gray-700 ${
          isSelected && section.id === selectedItemId ? 'bg-gray-200' : ''
        }`}
        onClick={() => handleCardClick(section)}
      >
        <div className="flex items-center gap-1">
          <ChevronRight
            onClick={handleChevronClick}
            size={12}
            className={`hover:bg-gray-200 h-[24px] w-[24px] rounded-sm p-1 cursor-pointer z-2 transition-transform duration-200 ${
              isOpen ? 'rotate-90' : ''
            }`}
          />
          <span className="font-semibold truncate">{section.name}</span>{' '}
        </div>

        <div className="template-editor-section-controls flex items-center gap-1 ml-auto justify-center">
          <DeleteOutlined
            size={14}
            className="hover:bg-gray-200 h-[24px] w-[24px] rounded-sm p-1 cursor-pointer z-2"
            onClick={handleDeleteSectionClick}
          />
          {section.disabled ? (
            <EyeOffIcon
              size={16}
              className="hover:bg-gray-200 h-[24px] w-[24px] rounded-sm p-1 cursor-pointer z-2"
              onClick={handleToggleSectionVisibilityClick}
            />
          ) : (
            <EyeIcon
              size={16}
              className="hover:bg-gray-200 h-[24px] w-[24px] rounded-sm p-1 cursor-pointer z-2"
              onClick={handleToggleSectionVisibilityClick}
            />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="template-editor-section-content flex flex-col w-full pl-5 pt-2">
          {section.elements.map((element) => (
            <div
              key={element.id}
              onClick={() => handleCardClick(element)}
              className={`template-editor-element-card flex items-center gap-2 hover:bg-gray-100 p-[4px] rounded cursor-pointer w-full text-gray-700 ${
                isSelected && selectedItemId === element.id ? 'bg-gray-200' : ''
              }`}
            >
              {getElementIcon(element)}
              <span className="text-sm font-[600] truncate">
                {element.name || element.type}
              </span>
              <div className="template-editor-section-controls flex items-center gap-1 ml-auto justify-center">
                <DeleteOutlined
                  size={12}
                  className="hover:bg-gray-200 h-[20px] w-[20px] rounded-sm p-1 cursor-pointer z-2"
                  onClick={(e) => handleDeleteElementClick(e, element.id)}
                />
                {element.disabled ? (
                  <EyeOffIcon
                    size={14}
                    className="hover:bg-gray-200 h-[20px] w-[20px] rounded-sm p-1 cursor-pointer z-2"
                    onClick={(e) =>
                      handleToggleElementVisibilityClick(e, element.id)
                    }
                  />
                ) : (
                  <EyeIcon
                    size={14}
                    className="hover:bg-gray-200 h-[20px] w-[20px] rounded-sm p-1 cursor-pointer z-2"
                    onClick={(e) =>
                      handleToggleElementVisibilityClick(e, element.id)
                    }
                  />
                )}
              </div>
            </div>
          ))}
          <AddSectionModal
            placeholder="Cauta elemente"
            open={isPopoverOpen}
            availableSectionTypes={availableElementTypes.filter((el) =>
              el.availableFor.includes(section.type)
            )}
            onSelectType={(elementType, elementName) =>
              handleSelectElementType(
                elementType as Exclude<
                  ElementType,
                  ElementType.Section | ElementType.RSVP_SECTION
                >,
                elementName,
                section
              )
            }
            onClose={handlePopoverOpenChange}
          >
            <div
              onClick={handleAddSectionClick}
              className={`template-editor-element-card flex items-center gap-2 hover:bg-gray-100 p-[4px] rounded cursor-pointer w-full text-[#cb93d9]`}
            >
              <PlusCircleOutlined />
              <span className="text-sm font-[600] truncate">
                Adauga element
              </span>
            </div>
          </AddSectionModal>
        </div>
      )}
    </>
  );
};

export default EditorSectionCard;
