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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import { uploadImageForTemplate } from '@/service/templates/uploadImageForTemplate';
import { removeImageForTemplate } from '@/service/templates/removeImageForTemplate';
import { isMobile } from 'react-device-detect';
import { useAuth } from '@/core/context/authContext';
import MobileElementsPopup from './components/mobileElementsPopup/MobileElementsPopup';
import MobilePropertiesPannel from './components/mobileElementsPopup/mobilePropertiesPannel/MobilePropertiesPannel';
import { SaveIcon } from 'lucide-react';

const EditPage = () => {
  const { templateId } = useParams<{
    templateId: string;
  }>();
  const user = useAuth().userDetails;
  const [template, setTemplate] = useState<Template>({} as Template);
  const [loading, setLoading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [templateUpdateLoading, setTemplateUpdateLoading] = useState(false);
  const [insertionIndex, setInsertionIndex] = useState<number | null>(null);
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);
  const [editViewMode, setEditViewMode] = useState<
    'mobile' | 'desktop' | 'tablet'
  >('mobile');

  // Reference to store initial images from the template
  const initialImagesRef = useRef<
    Record<string, { name: string; url: string; opacity: string } | undefined>
  >({});

  const [updatedBackgroundImages, setUpdatedBackgroundImages] = useState<
    Record<
      string,
      {
        newValue?: {
          name: string;
          opacity: string;
          url: string;
        };
      }
    >[]
  >([]); // To store updated background images for sections

  // Context to access the event instance
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

      // saves the initial images from the template to a ref
      const imagesMap: Record<
        string,
        { name: string; url: string; opacity: string } | undefined
      > = {};
      response.elements.forEach((el: TemplateSection) => {
        if (el.backgroundImage) {
          imagesMap[el.id] = {
            name: el.backgroundImage.name,
            url: el.backgroundImage.url,
            opacity: el.backgroundImage.opacity,
          };
        }
        // Dacă ai și secțiuni cu imagini, iterează și prin ele aici
        // Parcurge elementele din fiecare secțiune și adaugă imaginile de tip "image"
        if (el.elements && Array.isArray(el.elements)) {
          el.elements.forEach((childEl: TemplateElement) => {
            if (childEl.type === ElementType.Image && childEl.backgroundImage) {
              imagesMap[childEl.id] = {
                name: childEl.backgroundImage.name,
                url: childEl.backgroundImage.url,
                opacity: childEl.backgroundImage.opacity,
              };
            }
          });
        }
      });
      initialImagesRef.current = imagesMap;
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
      setTemplate((prevTemplate) => {
        // Do this only for the background image property
        if (propertyPath === 'backgroundImage') {
          // Set reference to the updated element id and bg image value
          // Avoid duplicate ids in updatedBackgroundImages
          setUpdatedBackgroundImages((prev) => {
            // Remove any previous entry for this id
            const filtered = prev.filter(
              (obj) =>
                !Object.prototype.hasOwnProperty.call(
                  obj,
                  selectedElementOrSectionId
                )
            );
            return [
              ...filtered,
              {
                [selectedElementOrSectionId]: {
                  newValue: newValue as {
                    name: string;
                    opacity: string;
                    url: string;
                  },
                },
              },
            ];
          });
        }

        // Call the helper for immutably updating the element
        // Pass the selected element's ID, the property path, the new value,
        // and the active breakpoint (if not 'default')
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
        // Do this only for the background image property
        if (propertyPath === 'backgroundImage') {
          // Set reference to the updated element id and bg image value
          // Avoid duplicate ids in updatedBackgroundImages
          setUpdatedBackgroundImages((prev) => {
            // Remove any previous entry for this id
            const filtered = prev.filter(
              (obj) =>
                !Object.prototype.hasOwnProperty.call(
                  obj,
                  selectedElementOrSectionId
                )
            );
            return [
              ...filtered,
              {
                [selectedElementOrSectionId]: {
                  newValue: newValue as {
                    name: string;
                    opacity: string;
                    url: string;
                  },
                },
              },
            ];
          });
        }

        // Call the helper for immutably updating the element
        // Pass the selected element's ID, the property path, the new value,
        // and the active breakpoint (if not 'default')
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
    if (!user || !templateId) {
      toast.error('Nu esti autentificat sau nu este un template valid');
      return;
    }

    setTemplateUpdateLoading(true);
    try {
      let updatedTemplate = { ...template };

      for (const imageUpdateObj of updatedBackgroundImages) {
        for (const [itemId, update] of Object.entries(imageUpdateObj)) {
          if (
            initialImagesRef.current &&
            initialImagesRef.current[itemId] &&
            typeof initialImagesRef.current[itemId]?.name === 'string'
          ) {
            await removeImageForTemplate(
              user,
              templateId,
              initialImagesRef.current[itemId]!.name
            );
            const selectedElementType = selectedItemData.type;

            // Decide daca actualizezi un element sau o sectiune
            if (
              selectedElementType !== ElementType.Section &&
              selectedElementType !== ElementType.RSVP_SECTION &&
              selectedElementType !== ElementType.LocationsSection
            ) {
              updatedTemplate = updateElementPropertyInTemplate(
                updatedTemplate,
                itemId,
                'backgroundImage',
                null,
                false,
                editViewMode
              );
            } else {
              updatedTemplate = updateSectionPropertyInTemplate(
                updatedTemplate,
                itemId,
                'backgroundImage',
                null,
                false,
                editViewMode
              );
            }
          }

          if (update.newValue) {
            const storageUrl = await uploadImageForTemplate(
              update.newValue.url,
              user,
              templateId,
              update.newValue.name
            );
            const selectedElementType = selectedItemData.type;
            // Decide daca actualizezi un element sau o sectiune
            if (
              selectedElementType !== ElementType.Section &&
              selectedElementType !== ElementType.RSVP_SECTION &&
              selectedElementType !== ElementType.LocationsSection
            ) {
              // Update local copy, nu state-ul React!
              updatedTemplate = updateElementPropertyInTemplate(
                updatedTemplate,
                itemId,
                'backgroundImage',
                {
                  url: storageUrl,
                  name: update.newValue?.name,
                  opacity: update.newValue?.opacity,
                },
                false,
                editViewMode
              );
            } else {
              updatedTemplate = updateSectionPropertyInTemplate(
                updatedTemplate,
                itemId,
                'backgroundImage',
                {
                  url: storageUrl,
                  name: update.newValue?.name,
                  opacity: update.newValue?.opacity,
                },
                false,
                editViewMode
              );
            }
          }
        }
      }

      await updateTemplate(templateId, updatedTemplate.elements);
      setTemplate(updatedTemplate);
      // Reset the updatedBackgroundImages after successful update
      setUpdatedBackgroundImages([]);
      // await fetchTemplate();
      setTemplateUpdateLoading(false);
      toast.success('Template-ul a fost actualizat');
    } catch (error) {
      setTemplateUpdateLoading(false);
      toast.error('Eroare la actualizarea template-ului');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-[#F1F5F9]">
        <span className="loader"></span>
      </div>
    );
  }

  return isMobile ? (
    <MobileEditor
      invitationData={template}
      selectedElementId={selectedItemId}
      handleSectionSelect={handleSectionSelect}
      handleTemplateDragAndDrop={handleTemplateDragAndDrop}
      handleAddElement={handleAddElement}
      handleDeleteElement={handleDeleteElement}
      handleDeleteSectionClick={handleDeleteSectionClick}
      handleSelectSectionType={handleSelectSectionType}
      handleToggleVisibility={handleToggleVisibility}
      selectedItemData={selectedItemData}
      setTemplate={setTemplate}
      template={template}
      openPopoverIndex={openPopoverIndex}
      handlePopoverOpenChange={handlePopoverOpenChange}
      handleAddSectionClick={handleAddSectionClick}
      handlePropertyChanged={handlePropertyChanged}
      handleTemplateUpdate={handleTemplateUpdate}
    />
  ) : !template ? (
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
              <Radio.Button value="mobile">Telefon</Radio.Button>
              <Radio.Button value="tablet">Tableta</Radio.Button>
              <Radio.Button value="desktop">Desktop</Radio.Button>
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
            />
          </div>
        </div>
        <div className="p-2"></div>
      </div>
    </>
  );
};

export default EditPage;

interface MobileEditorProps {
  invitationData: Template;
  selectedElementId: string;
  handleSectionSelect: (element: TemplateElement) => void;
  handleTemplateDragAndDrop: (
    elementId: string,
    position: FlexiblePosition
  ) => void;
  handleAddElement: (newElement: TemplateElement, sectionId: string) => void;
  handleDeleteElement: (sectionId: string, elementId: string) => void;
  handleDeleteSectionClick: (sectionId: string) => void;
  handleSelectSectionType: (
    elementType: ElementType,
    sectionName: string
  ) => void;
  handleToggleVisibility: (sectionId: string, elementId?: string) => void;
  selectedItemData: TemplateElement;
  setTemplate: React.Dispatch<React.SetStateAction<Template>>;
  template: Template;
  openPopoverIndex: number | null;
  handlePopoverOpenChange: (newOpenState: boolean) => void;
  handleAddSectionClick: (index: number) => void;
  handlePropertyChanged: (
    propertyPath: string,
    newValue: unknown,
    propIsResponsive: boolean
  ) => void;
  handleTemplateUpdate: () => void;
}

const MobileEditor = ({
  invitationData,
  selectedElementId,
  handleSectionSelect,
  handleTemplateDragAndDrop,
  handleAddElement,
  handleDeleteElement,
  handleDeleteSectionClick,
  handleSelectSectionType,
  handleToggleVisibility,
  selectedItemData,
  setTemplate,
  template,
  openPopoverIndex,
  handlePopoverOpenChange,
  handleAddSectionClick,
  handlePropertyChanged,
  handleTemplateUpdate,
}: MobileEditorProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedElement, setSelectedElement] = useState<
    TemplateElement | undefined
  >();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [editViewMode, setEditViewMode] = useState<
    'mobile' | 'desktop' | 'tablet'
  >('mobile');
  const [availableBreakpoints, setAvailableBreakpoints] = useState<
    ('mobile' | 'desktop' | 'tablet')[]
  >([]);

  useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth;
      if (width <= 600) {
        setAvailableBreakpoints(['mobile']);
        setEditViewMode('mobile');
      } else if (width <= 900) {
        setAvailableBreakpoints(['mobile', 'tablet']);
        setEditViewMode('mobile');
      }
    };

    updateBreakpoints();
    window.addEventListener('resize', updateBreakpoints);
    return () => window.removeEventListener('resize', updateBreakpoints);
  }, []);

  const showTablet = availableBreakpoints.includes('tablet');

  useEffect(() => {
    setSelectedElement(selectedItemData);
  }, [selectedItemData]);

  return (
    <div className="relative h-full overflow-hidden">
      <Button
        shape="circle"
        size="large"
        className="!absolute !right-4 !top-2 !bg-white/60 !text-[var(--primary-color)] !backdrop-blur-xl !shadow-lg !border border-gray-200 z-10 rounded-full flex items-center gap-2"
        icon={<SaveIcon />}
        onClick={handleTemplateUpdate}
      />
      <div
        className={`h-full overflow-auto ${
          editViewMode === 'mobile'
            ? 'w-[367px] mx-auto'
            : editViewMode === 'tablet'
            ? 'w-[700px] mx-auto'
            : 'max-w-[900px] min-w-[800px] ml-[calc(-23vw_+_50%)]'
        }`}
      >
        <TemplateRenderer
          invitationData={invitationData}
          selectedElementId={selectedElementId}
          editMode={true}
          onSelect={(el) => {
            handleSectionSelect(el);
            setSelectedElement(el);
            if (!isDragging) {
              setPopoverOpen(true);
            }
          }}
          activeBreakpointValue={editViewMode}
          handleTemplateDragAndDrop={handleTemplateDragAndDrop}
          onDrag={(dragging: boolean) => {
            setIsDragging(dragging);
            setSelectedElement(undefined);
          }}
        />
      </div>
      <div className="fixed bottom-4 right-4 z-[100] bg-transparent">
        <MobileElementsPopup
          handleAddElement={handleAddElement}
          handleDeleteElement={handleDeleteElement}
          handleDeleteSectionClick={handleDeleteSectionClick}
          handleSectionSelect={handleSectionSelect}
          handleSelectSectionType={handleSelectSectionType}
          handleToggleVisibility={handleToggleVisibility}
          setTemplate={setTemplate}
          template={template}
          openPopoverIndex={openPopoverIndex}
          handlePopoverOpenChange={handlePopoverOpenChange}
          handleAddSectionClick={handleAddSectionClick}
        />
      </div>
      <MobilePropertiesPannel
        orientation={showTablet ? 'right' : 'bottom'}
        open={popoverOpen && !!selectedElement && !isDragging}
        onClose={() => setPopoverOpen(false)}
        selectedElement={selectedElement}
        activeBreakpoint="mobile"
        handlePropertyChanged={handlePropertyChanged}
      />
      <div className="absolute left-1/2 bottom-4 transform -translate-x-1/2 bg-white/60 backdrop-blur-md rounded-xl shadow-lg flex justify-center items-center border border-gray-200 z-50">
        <div
          className="absolute top-0 left-0 h-full z-0 transition-all duration-500"
          style={{
            width: showTablet ? '50%' : '100%',
            transform:
              editViewMode === 'mobile'
                ? 'translateX(0%)'
                : editViewMode === 'tablet'
                ? 'translateX(100%)'
                : 'translateX(0%)',
            background:
              editViewMode === 'mobile' || editViewMode === 'tablet'
                ? 'rgba(255,255,255,0.4)'
                : 'transparent',
            borderRadius: '0.75rem',
            boxShadow:
              editViewMode === 'mobile' || editViewMode === 'tablet'
                ? '0 2px 8px rgba(0,0,0,0.08)'
                : 'none',
            border:
              editViewMode === 'mobile' || editViewMode === 'tablet'
                ? '1px solid rgb(244, 187, 241)'
                : 'none',
            pointerEvents: 'none',
          }}
        />
        <div
          className={`font-semibold cursor-pointer px-8 py-2 transition-all duration-200 relative z-10 ${
            editViewMode === 'mobile'
              ? 'text-[var(--primary-color)]'
              : 'text-gray-700 hover:bg-white/30 hover:backdrop-blur-md hover:rounded-xl'
          }`}
          onClick={() => setEditViewMode('mobile')}
        >
          Mobil
        </div>
        {showTablet && (
          <div
            className={`font-semibold cursor-pointer px-8 py-2 transition-all duration-200 relative z-10 ${
              editViewMode === 'tablet'
                ? 'text-[var(--primary-color)]'
                : 'text-gray-700 hover:bg-white/30 hover:backdrop-blur-md hover:rounded-xl'
            }`}
            onClick={() => setEditViewMode('tablet')}
          >
            Tableta
          </div>
        )}
      </div>
    </div>
  );
};
