/* eslint-disable */

import { ElementType, TemplateElement, TemplateSection } from '@/core/types';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { ChevronRight, EyeIcon, EyeOffIcon } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import AddSectionModal from '../addSectionModal/AddSectionModal';
import { availableElementTypes } from '../../utils/editorUtils';
import { defaultElements } from '@/lib/templates/defaultTemplateElements/defaultTemplateElements';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import SortableElementCard from './SortableElementCard';
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';

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
  onPositionChanged: (elements: TemplateElement[]) => void;
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
  onPositionChanged,
}: EditorSectionCardProps) => {
  // Starea locala pentru a controla daca sectiunea este extinsa (deschisa) in panoul lateral
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const [items, setItems] = useState(section.elements);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    setItems(section.elements);
  }, [section]);

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
        defaultElements[elementType as keyof typeof defaultElements](
          elementName
        );

      onAddElement(newElement, section.id);

      setIsPopoverOpen(false);
    },
    [isPopoverOpen, section]
  );

  function handleDragEndSortable(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((el) => el.id == active.id);
      const newIndex = over ? items.findIndex((el) => el.id == over.id) : -1;
      const newElementsList = arrayMove(items, oldIndex, newIndex);
      setItems(newElementsList);
      onPositionChanged(newElementsList);
    }
  }

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
          <DndContext
            sensors={sensors}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEndSortable}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              {section.elements.map((element) => (
                <SortableElementCard
                  element={element}
                  handleCardClick={handleCardClick}
                  handleDeleteElementClick={handleDeleteElementClick}
                  handleToggleElementVisibilityClick={
                    handleToggleElementVisibilityClick
                  }
                  isSelected={isSelected}
                  selectedItemId={selectedItemId}
                  key={element.id}
                />
              ))}
            </SortableContext>
          </DndContext>
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
