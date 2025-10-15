import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import AddSectionModal from '../addSectionModal/AddSectionModal';
import { ElementType, Template, TemplateElement } from '@/core/types';
import { availableSectionTypes } from '../../utils/editorUtils';
import MobileSectionCard from './mobileSectionCard/MobileSectionCard';

interface MobileElementsPopupProps {
  template: Template;
  handleSelectSectionType: (
    elementType: ElementType,
    sectionName: string
  ) => void;
  handleSectionSelect: (item: TemplateElement) => void;
  handleAddElement: (newElement: TemplateElement, sectionId: string) => void;
  handleDeleteElement: (sectionId: string, elementId: string) => void;
  handleDeleteSectionClick: (sectionId: string) => void;
  handleToggleVisibility: (sectionId: string) => void;
  setTemplate: React.Dispatch<React.SetStateAction<Template>>;
  openPopoverIndex: number | null;
  handlePopoverOpenChange: (newOpenState: boolean) => void;
  handleAddSectionClick: (index: number) => void;
}

const MobileElementsPopup: React.FC<MobileElementsPopupProps> = ({
  template,
  handleSelectSectionType,
  handleAddElement,
  handleDeleteElement,
  handleDeleteSectionClick,
  handleToggleVisibility,
  setTemplate,
  openPopoverIndex,
  handlePopoverOpenChange,
  handleAddSectionClick,
}) => {
  // Function used to update the template with the new elements order for in a section after the drag end event finshed
  const handleElementPositionUpdate = (
    elements: TemplateElement[],
    sectionId: string
  ) => {
    setTemplate((prevTemplate) => {
      const sectionIndex = prevTemplate.elements.findIndex(
        (section) => section.id === sectionId
      );
      const templateCopy = { ...prevTemplate };
      templateCopy.elements[sectionIndex].elements = elements;
      return templateCopy;
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {
          <Button
            shape="circle"
            icon={<PlusOutlined />}
            className="!bg-white/30 !text-[var(--primary-color)] !backdrop-blur-xl !shadow-lg !border border-gray-200"
            size="large"
          />
        }
      </DialogTrigger>

      <DialogContent className="w-[90vw] h-[85vh] grid grid-rows-[auto_1fr] gap-4 overflow-hidden">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl">Componente</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center overflow-y-auto">
          <AddSectionModal
            placeholder="Cauta sectiuni"
            open={openPopoverIndex === 0}
            availableSectionTypes={availableSectionTypes}
            onSelectType={handleSelectSectionType}
            onClose={handlePopoverOpenChange}
          >
            {!template.elements.length ? (
              <div
                onClick={() => handleAddSectionClick(0)}
                className={`template-editor-element-card flex items-center gap-2 hover:bg-gray-100 p-[4px] rounded cursor-pointer w-full text-blue-500`}
              >
                <PlusCircleOutlined />
                <span className="text-sm font-[600] truncate">
                  Adauga sectiune
                </span>
              </div>
            ) : (
              <div
                className="group relative h-[6px] flex items-center justify-center cursor-pointer w-full"
                onClick={() => handleAddSectionClick(0)}
              >
                <div className="absolute left-0 right-0 h-px bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center top-1/2 transform -translate-y-1/2"></div>
                <button className="absolute invisible group-hover:visible bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  +
                </button>
                <span className="absolute top-[15px] px-2 py-1 bg-white text-gray-500 text-xs font-semibold rounded shadow-[0_3px_10px_rgb(0,0,0,0.2)] invisible group-hover:visible whitespace-nowrap">
                  Adauga sectiune
                </span>
              </div>
            )}
          </AddSectionModal>
          {template.elements.map((section, index) => (
            <React.Fragment key={index}>
              <MobileSectionCard
                onPositionChanged={(elements: TemplateElement[]) =>
                  handleElementPositionUpdate(elements, section.id)
                }
                onAddElement={handleAddElement}
                onDeleteElement={handleDeleteElement}
                onDeleteSection={handleDeleteSectionClick}
                onToggleVisibility={handleToggleVisibility}
                section={section}
                key={section.id + index}
              />
              <AddSectionModal
                placeholder="Cauta sectiuni"
                open={openPopoverIndex === index + 1}
                availableSectionTypes={availableSectionTypes}
                onSelectType={handleSelectSectionType}
                onClose={handlePopoverOpenChange}
              >
                <div
                  className="group relative h-[6px] mt-[8px] flex items-center justify-center cursor-pointer w-full"
                  onClick={() => handleAddSectionClick(index + 1)}
                >
                  <div className="absolute left-0 right-0 h-px bg-blue-500 scale-x-100 transition-transform duration-300 origin-center top-1/2 transform -translate-y-1/2"></div>
                  <button className="absolute visible group-hover:visible bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold opacity-100 transition-opacity duration-200 z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    +
                  </button>
                </div>
              </AddSectionModal>
            </React.Fragment>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileElementsPopup;
