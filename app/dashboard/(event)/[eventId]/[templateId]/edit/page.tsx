'use client';
/* eslint-disable */
import {
  ElementType,
  FlexiblePosition,
  Template,
  TemplateElement,
  TemplateSection,
} from '@/core/types';
import TemplateRenderer from '@/lib/templates/templateRenderer/TemplateRenderer';
import { queryTemplateById } from '@/service/templates/queryTemplateById';
import { Button, Radio, RadioChangeEvent } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import '../styles.css';
import EditorSectionCard from './components/editorSectionCard/EditorSectionCard';
import PropertyPanel from './components/propertyPanel/PropertyPanel';
import {
  updateElementPropertyInTemplate,
  updateSectionPropertyInTemplate,
} from './utils/templateUpdates';
import { findItemInTemplateById } from './utils/templateHandler';
import { updateTemplate } from '@/service/templates/updateTemplate';
import { toast } from 'sonner';
import AddSectionModal from './components/addSectionModal/AddSectionModal';
import { availableSectionTypes } from './utils/editorUtils';
import { PlusCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useEventContext } from '@/core/context/EventContext';
import { defaultElements } from '@/lib/templates/defaultTemplateElements/defaultTemplateElements';
import { useParams } from 'next/navigation';

const EditPage = () => {
  const { templateId } = useParams<{
    templateId: string;
  }>();
  const [template, setTemplate] = useState<Template>({} as Template);
  const [loading, setLoading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [templateUpdateLoading, setTemplateUpdateLoading] = useState(false);
  const [insertionIndex, setInsertionIndex] = useState<number | null>(null);
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);
  const [editViewMode, setEditViewMode] = useState<
    'mobile' | 'desktop' | 'tablet'
  >('mobile');
  const { eventInstance } = useEventContext();

  const selectedItemData: TemplateElement = useMemo(() => {
    if (!template || !selectedItemId) return {} as TemplateElement;
    // Use an efficient helper function to find the item (element or section)
    const foundItem = findItemInTemplateById(template, selectedItemId);
    if (foundItem) {
      return foundItem;
    }
    return (
      findItemInTemplateById(template, selectedItemId) ?? template.elements[0]
    );
  }, [template, selectedItemId]);

  const fetchTemplate = async () => {
    try {
      const response = await queryTemplateById(templateId);
      setTemplate(response);
      setSelectedItemId(response.elements[0].id);
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  const onEditViewChange = (e: RadioChangeEvent) => {
    setEditViewMode(e.target.value);
  };

  const handleAddSectionClick = useCallback(
    (index: number) => {
      if (openPopoverIndex === index) {
        setOpenPopoverIndex(null);
        setInsertionIndex(null);
      } else {
        setOpenPopoverIndex(index);
        setInsertionIndex(index);
      }
    },
    [openPopoverIndex]
  );

  const handlePopoverOpenChange = useCallback((newOpenState: boolean) => {
    if (!newOpenState) {
      setOpenPopoverIndex(null);
      setInsertionIndex(null);
    }
  }, []);

  const handleAddElement = useCallback(
    (element: TemplateElement, sectionId: string) => {
      setTemplate((prevTemplate) => {
        if (!prevTemplate || !Array.isArray(prevTemplate.elements)) {
          console.error('handleAddElement: Invalid previous template state.');
          return prevTemplate;
        }

        const updatedSections = prevTemplate.elements.map((section) => {
          const isTargetSection =
            section?.id === sectionId && Array.isArray(section?.elements);

          if (isTargetSection) {
            const updatedElements = [...section.elements, element];

            return {
              ...(section as TemplateSection),
              elements: updatedElements,
            };
          }

          return section;
        });

        return {
          ...prevTemplate,
          elements: updatedSections,
        };
      });
    },
    [template, insertionIndex, setTemplate]
  );

  const handleDeleteSectionClick = useCallback(
    (sectionId: string) => {
      setTemplate((prevTemplate) => {
        if (!prevTemplate || !Array.isArray(prevTemplate.elements)) {
          console.error(
            'handleDeleteSectionClick: Invalid previous template state.'
          );
          return prevTemplate;
        }

        const updatedSections = prevTemplate.elements.filter((section) => {
          return section.id !== sectionId;
        });

        if (sectionId === selectedItemId) {
          selectedItemData;
        }

        return {
          ...prevTemplate,
          elements: updatedSections,
        };
      });
    },
    [template, setTemplate]
  );

  const handleDeleteElement = useCallback(
    (elementId: string, sectionId: string) => {
      setTemplate((prevTemplate) => {
        if (!prevTemplate || !Array.isArray(prevTemplate.elements)) {
          console.error(
            'handleDeleteElement: Invalid previous template state.'
          );
          return prevTemplate;
        }

        const updatedSections = prevTemplate.elements.map((section) => {
          const isTargetSection =
            section?.id === sectionId && Array.isArray(section?.elements);

          if (isTargetSection) {
            const updatedElements = section.elements.filter(
              (el) => el.id !== elementId
            );

            return {
              ...(section as TemplateSection),
              elements: updatedElements,
            };
          }

          return section;
        });

        return {
          ...prevTemplate,
          elements: updatedSections,
        };
      });
    },
    [template, insertionIndex, setTemplate]
  );

  const handleToggleVisibility = useCallback(
    (sectionId: string, elementId: string | undefined) => {
      setTemplate((prevTemplate) => {
        if (!prevTemplate || !Array.isArray(prevTemplate.elements)) {
          console.error(
            'handleSectionVisibility: Invalid previous template state.'
          );
          return prevTemplate;
        }

        const updatedSections = prevTemplate.elements.map((section) => {
          const isTargetSection =
            section?.id === sectionId && Array.isArray(section?.elements);

          if (isTargetSection) {
            if (elementId) {
              const updatedElements = section.elements.map((el) => {
                const isTargetElement = el?.id === elementId;
                if (isTargetElement) {
                  return {
                    ...(el as TemplateElement),
                    disabled: !el.disabled,
                  };
                }
                return el;
              });
              return {
                ...(section as TemplateSection),
                elements: updatedElements,
              };
            }

            return {
              ...(section as TemplateSection),
              elements: section.elements,
              disabled: !section.disabled,
            };
          }

          return section;
        });

        return {
          ...prevTemplate,
          elements: updatedSections,
        };
      });
    },
    [template, setTemplate]
  );

  const handleSelectSectionType = useCallback(
    (elementType: ElementType, sectionName: string) => {
      if (insertionIndex === null || insertionIndex === undefined) {
        console.error(
          'handleSelectSectionType: ERROR: Insertion index is null or undefined. Cannot add section.'
        );
        setOpenPopoverIndex(null);
        setInsertionIndex(null);
        return;
      }

      const newSection: TemplateElement =
        defaultElements[elementType as keyof typeof defaultElements](
          sectionName
        );

      const currentSections = template.elements;

      const updatedSections = [
        ...currentSections.slice(0, insertionIndex),
        newSection,
        ...currentSections.slice(insertionIndex),
      ];

      setTemplate((prevTemplate) => ({
        ...prevTemplate,
        elements: updatedSections as TemplateSection[],
      }));

      setOpenPopoverIndex(null); // Inchide Popover-ul specific (setand indexul activ la null)
      setInsertionIndex(null); // Reseteaza indexul de inserare
    },
    [template, insertionIndex, setTemplate]
  );

  const handlePropertyChanged = (
    propertyPath: string,
    newValue: unknown,
    propIsResponsive: boolean
  ) => {
    const selectedElementOrSectionId = selectedItemData.id;
    const selectedElementType = selectedItemData.type;

    // Decide daca actualizezi un element sau o sectiune
    if (
      selectedElementType !== ElementType.Section &&
      selectedElementType !== ElementType.RSVP_SECTION &&
      selectedElementType !== ElementType.LocationsSection
    ) {
      // Este un element (Text, Image etc.)
      setTemplate((prevTemplate) => {
        // Apelam helper-ul pentru actualizarea imutabila a elementului
        // Trecem ID-ul elementului selectat, calea proprietatii, noua valoare
        // si breakpoint-ul activ (daca nu e 'default')

        const updatedTemplate = updateElementPropertyInTemplate(
          prevTemplate,
          selectedElementOrSectionId,
          propertyPath,
          newValue,
          propIsResponsive,
          editViewMode
        );

        return updatedTemplate;
      });
    } else {
      setTemplate((prevTemplate) => {
        const updatedTemplate = updateSectionPropertyInTemplate(
          prevTemplate,
          selectedElementOrSectionId,
          propertyPath,
          newValue,
          propIsResponsive,
          editViewMode
        );
        return updatedTemplate;
      });
    }
  };

  const handleSectionSelect = (element: TemplateElement) => {
    setSelectedItemId(element.id);
  };

  const handleTemplateUpdate = async () => {
    try {
      setTemplateUpdateLoading(true);
      await updateTemplate(templateId, template.elements);
      setTemplateUpdateLoading(false);
      toast.success('Template-ul a fost actualizat');
    } catch (error) {
      setTemplateUpdateLoading(false);
      toast.success('Eroare la actualizarea template-ului');
    }
  };

  const handleTemplateDragAndDrop = (
    elementId: string,
    position: FlexiblePosition
  ) => {
    setTemplate((prevTemplate) => {
      // Apelam helper-ul pentru actualizarea imutabila a elementului
      // Trecem ID-ul elementului selectat, calea proprietatii, noua valoare
      // si breakpoint-ul activ (daca nu e 'default')
      const updatedTemplate = updateElementPropertyInTemplate(
        prevTemplate,
        elementId,
        'position',
        position,
        true,
        editViewMode
      );

      return updatedTemplate;
    });
  };

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

  return loading || !template ? (
    <div className="flex items-center justify-center w-full h-screen bg-[#F1F5F9]">
      <span className="loader"></span>
    </div>
  ) : (
    <>
      <div className="flex flex-col items-center justify-center w-full h-screen bg-[#F1F5F9]">
        <div className="editor-controls flex items-center justify-between w-full p-4  border-dashed border-b-1 border-gray-300 shadow">
          <div></div>
          <div className="flex gap-2">
            <Radio.Group
              size="middle"
              buttonStyle="solid"
              className="button-group-period-filter"
              value={editViewMode}
              onChange={onEditViewChange}
            >
              <Radio.Button value="desktop">Desktop</Radio.Button>
              <Radio.Button value="tablet">Tableta</Radio.Button>
              <Radio.Button value="mobile">Telefon</Radio.Button>
            </Radio.Group>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button type="default" size="middle">
              <Link
                href={`${eventInstance?.eventInvitationLink}/preview`}
                target="_blank"
              >
                Vezi invitatia
              </Link>
            </Button>
            <Button
              loading={templateUpdateLoading}
              type="primary"
              size="middle"
              onClick={handleTemplateUpdate}
            >
              Salveaza
            </Button>
          </div>
        </div>
        <div className="relative w-full h-[calc(100dvh-142px)] bg-[#F1F5F9] p-2 grid grid-cols-[250px_1fr_210px] gap-2">
          <div className="bg-white shadow rounded p-4 flex flex-col items-center overflow-y-auto">
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
                <EditorSectionCard
                  onPositionChanged={(elements: TemplateElement[]) =>
                    handleElementPositionUpdate(elements, section.id)
                  }
                  onAddElement={handleAddElement}
                  onDeleteElement={handleDeleteElement}
                  onDeleteSection={handleDeleteSectionClick}
                  onToggleVisibility={handleToggleVisibility}
                  section={section}
                  key={section.id + index}
                  selectedItemId={selectedItemId}
                  onSelect={handleSectionSelect}
                  isSelected={selectedItemData.id === selectedItemId}
                />
                <AddSectionModal
                  placeholder="Cauta sectiuni"
                  open={openPopoverIndex === index + 1}
                  availableSectionTypes={availableSectionTypes}
                  onSelectType={handleSelectSectionType}
                  onClose={handlePopoverOpenChange}
                >
                  <div
                    className="group relative h-[6px] flex items-center justify-center cursor-pointer w-full"
                    onClick={() => handleAddSectionClick(index + 1)}
                  >
                    <div className="absolute left-0 right-0 h-px bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center top-1/2 transform -translate-y-1/2"></div>
                    <button className="absolute invisible group-hover:visible bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      +
                    </button>
                    <span className="absolute top-[-35px] px-2 py-1 bg-white text-gray-500 text-xs font-semibold rounded shadow-[0_3px_10px_rgb(0,0,0,0.2)] invisible group-hover:visible whitespace-nowrap">
                      Adauga sectiune
                    </span>
                  </div>
                </AddSectionModal>
              </React.Fragment>
            ))}
          </div>
          <div
            className={`overflow-y-auto h-full ${
              editViewMode === 'mobile'
                ? 'w-[367px] mx-auto'
                : editViewMode === 'tablet'
                ? 'w-[700px] mx-auto'
                : 'max-w-[900px] min-w-[800px] ml-[calc(-23vw_+_50%)]'
            }`}
          >
            <TemplateRenderer
              invitationData={template}
              selectedElementId={selectedItemId}
              editMode={true}
              onSelect={handleSectionSelect}
              activeBreakpointValue={editViewMode}
              handleTemplateDragAndDrop={handleTemplateDragAndDrop}
            />
          </div>
          <div className="overflow-y-auto settings-panel p-4 bg-white rounded shadow h-full">
            <h2 className="text-lg font-semibold mb-4">
              {selectedItemData?.name}
            </h2>
            <PropertyPanel
              activeBreakpoint={editViewMode}
              selectedElement={selectedItemData}
              handlePropertyChanged={handlePropertyChanged}
              templateId={templateId}
            />
          </div>
        </div>
        <div className="p-2"></div>
      </div>
    </>
  );
};

export default EditPage;
