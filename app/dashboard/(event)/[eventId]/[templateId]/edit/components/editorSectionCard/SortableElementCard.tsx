import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { TemplateElement, TemplateSection } from '@/core/types';
import { EyeIcon, EyeOffIcon, ImageIcon, TextIcon } from 'lucide-react';
import { DeleteOutlined } from '@ant-design/icons';

interface SortableElementCardProps {
  isSelected: boolean;
  element: TemplateElement;
  selectedItemId: string | null;
  handleCardClick: (item: TemplateSection | TemplateElement) => void;
  handleDeleteElementClick: (e: React.MouseEvent, elementId: string) => void;
  handleToggleElementVisibilityClick: (
    e: React.MouseEvent,
    elementId: string
  ) => void;
}

const SortableElementCard = ({
  isSelected,
  element,
  selectedItemId,
  handleCardClick,
  handleDeleteElementClick,
  handleToggleElementVisibilityClick,
}: SortableElementCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: element.id ?? '' });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
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
            onClick={(e) => handleToggleElementVisibilityClick(e, element.id)}
          />
        ) : (
          <EyeIcon
            size={14}
            className="hover:bg-gray-200 h-[20px] w-[20px] rounded-sm p-1 cursor-pointer z-2"
            onClick={(e) => handleToggleElementVisibilityClick(e, element.id)}
          />
        )}
      </div>
    </div>
  );
};

export default SortableElementCard;
