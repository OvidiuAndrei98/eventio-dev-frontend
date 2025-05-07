import { TemplateElement, TemplateSection } from '@/core/types';
import { DeleteOutlined } from '@ant-design/icons';
import { ChevronRight, EyeIcon, TextIcon } from 'lucide-react';
import React from 'react';

export interface EditorSectionCardProps {
  section: TemplateSection;
  isSelected: boolean;
  onSelect: (section: TemplateElement) => void;
}

const EditorSectionCard = ({
  section,
  isSelected,
  onSelect,
}: EditorSectionCardProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Using useEffect to synchronize the local state 'isOpen' with the 'isSelected' prop
  React.useEffect(() => {
    // If this card becomes selected (either by direct click or from the canvas),
    // we set the local state 'isOpen' to true.
    if (isSelected) {
      setIsOpen(true);
    }
  }, [isSelected]);

  // Această funcție doar notifică părintele că acest card a fost selectat
  const handleCardClick = () => {
    onSelect(section);
    setIsOpen(true);
  };

  // Handler-ul pentru click-ul pe săgeată, care doar toggle-uie starea locală 'isOpen'
  const handleChevronClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div
        className={`template-editor-section-card flex items-center gap-1 w-full p-1 rounded hover:bg-gray-100 cursor-pointer text-sm text-gray-700 ${
          isSelected ? 'bg-gray-200' : ''
        }`}
        onClick={handleCardClick}
      >
        <div className="flex items-center gap-1">
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
            className="hover:bg-gray-200 h-[24px] w-[24px] rounded-sm p-1 cursor-pointer  z-2"
          />
          <EyeIcon
            size={16}
            className="hover:bg-gray-200 h-[24px] w-[24px] rounded-sm p-1 cursor-pointer z-2"
          />
        </div>
      </div>
      {isOpen && (
        <div className="template-editor-section-content flex flex-col gap-1 w-full">
          {section.elements.map((element) => (
            <div
              key={element.id}
              className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded cursor-pointer w-[calc(100%-20px)] ml-[20px]"
            >
              <TextIcon size={14} />
              <span className="text-sm text-gray-700 font-[600]">
                {element.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default EditorSectionCard;
