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
import { Button } from 'antd';
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
import { HelpCircle, SaveIcon } from 'lucide-react';
import { addErrorLog } from '@/service/logs/addErrorLog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { editorGuideStepsDesktop } from '@/lib/tour/stepts';
import { TourWrapper } from '@/components/tour/TourWrapper';

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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editViewMode, setEditViewMode] = useState<
    'mobile' | 'desktop' | 'tablet'
  >('mobile');
  const [isTourRunning, setIsTourRunning] = useState(false);

  // Reference to store initial images from the template
  const initialImagesRef = useRef<
    Record<string, { name: string; url: string; opacity: string } | undefined>
  >({});

  const [updatedBackgroundImages, setUpdatedBackgroundImages] = useState<
    Record<
      string,
      {
        newValue?: {
          imageUpdated: boolean;
          name: string;
          opacity: string;
          url: string;
        } | null;
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

  const handleAddSectionClick = useCallback(
    (index: number) => {
      if (openPopoverIndex === index) {
        setOpenPopoverIndex(null);
        setInsertionIndex(null);
      } else {
        setOpenPopoverIndex(index);
        setInsertionIndex(index);
      }
      setHasUnsavedChanges(true);
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
      setHasUnsavedChanges(true);
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
      setHasUnsavedChanges(true);
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
      setHasUnsavedChanges(true);
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
      setHasUnsavedChanges(true);
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
          // Only track changes when the url actually changed OR when the background was removed (null)
          const newBg = newValue as {
            name: string;
            opacity: string;
            url: string;
          } | null;

          const newUrl = newBg?.url ?? null;

          // Always update the tracking object, but mark imageUpdated only when the url actually changed
          const imageUpdated =
            (typeof newUrl === 'string' && newUrl.startsWith('data:')) ||
            newUrl === null;

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
                  newValue:
                    newBg === null
                      ? null
                      : {
                          imageUpdated,
                          name: newBg.name,
                          opacity: newBg.opacity,
                          url: newBg.url,
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
          // Only track changes when the url actually changed OR when the background was removed (null)
          const newBg = newValue as {
            name: string;
            opacity: string;
            url: string;
          } | null;

          const newUrl = newBg?.url ?? null;

          // Always update the tracking object, but mark imageUpdated only when the url actually changed
          const imageUpdated =
            (typeof newUrl === 'string' && newUrl.startsWith('data:')) ||
            newUrl === null;

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
                  newValue:
                    newBg === null
                      ? null
                      : {
                          imageUpdated,
                          name: newBg.name,
                          opacity: newBg.opacity,
                          url: newBg.url,
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
    setHasUnsavedChanges(true);
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
        // iterate keys to avoid casting Object.entries to an incompatible tuple type
        for (const itemId of Object.keys(imageUpdateObj)) {
          const entry = imageUpdateObj[itemId];
          const newValue = entry?.newValue ?? null;

          // If nothing changed (no removal and no imageUpdated) skip
          const isRemoval = newValue === null;
          const isImageUpdated = !!newValue && !!newValue.imageUpdated;

          if (!isRemoval && !isImageUpdated) continue;

          // If there was an initial stored image for this item and we are removing or replacing it -> delete it
          const initialImage = initialImagesRef.current?.[itemId];
          if (initialImage && (isRemoval || isImageUpdated)) {
            await removeImageForTemplate(user, templateId, initialImage.name);
          }

          // Find the actual item in the current updatedTemplate to decide if it's a section or element
          const targetItem = findItemInTemplateById(updatedTemplate, itemId);
          const isSection =
            targetItem &&
            (targetItem.type === ElementType.Section ||
              targetItem.type === ElementType.RSVP_SECTION ||
              targetItem.type === ElementType.LocationsSection);

          // Handle removal: set backgroundImage to null
          if (isRemoval) {
            if (isSection) {
              updatedTemplate = updateSectionPropertyInTemplate(
                updatedTemplate,
                itemId,
                'backgroundImage',
                null,
                false,
                editViewMode
              );
            } else {
              updatedTemplate = updateElementPropertyInTemplate(
                updatedTemplate,
                itemId,
                'backgroundImage',
                null,
                false,
                editViewMode
              );
            }
            continue;
          }

          // Handle new image upload only when imageUpdated is true
          if (isImageUpdated && newValue?.url) {
            const storageUrl = await uploadImageForTemplate(
              newValue.url,
              user,
              templateId,
              newValue.name!
            );

            const bgObj = {
              url: storageUrl,
              name: newValue.name!,
              opacity: newValue.opacity!,
            };

            if (isSection) {
              updatedTemplate = updateSectionPropertyInTemplate(
                updatedTemplate,
                itemId,
                'backgroundImage',
                bgObj,
                false,
                editViewMode
              );
            } else {
              updatedTemplate = updateElementPropertyInTemplate(
                updatedTemplate,
                itemId,
                'backgroundImage',
                bgObj,
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
      // Reset unsaved changes flag
      setHasUnsavedChanges(false);
      toast.success('Template-ul a fost actualizat');
    } catch (error) {
      await addErrorLog(user.userId, {
        errorType: 'Template Update Error',
        error: error instanceof Error ? error.message : String(error),
      });
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

      setHasUnsavedChanges(true);

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

    setHasUnsavedChanges(true);
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
      hasUnsavedChanges={hasUnsavedChanges}
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
          {/* <div className="flex gap-2">
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
          </div> */}
          <div className="flex items-center justify-center gap-2">
            <Button
              type="default"
              size="middle"
              icon={<HelpCircle />}
              onClick={() => setIsTourRunning(true)}
            />

            <Button type="default" size="middle">
              <Link
                href={`${eventInstance?.eventInvitationLink}/preview`}
                target="_blank"
              >
                Vezi invitatia
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative inline-flex items-center">
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40px] h-[20px] rounded-md pointer-events-none"
                  style={{
                    // stronger visible glow using the --primary-color CSS variable
                    boxShadow:
                      '0 10px 8px rgba(0,0,0,0.12), 0 0 3px 6px var(--primary-color)',
                    background: 'transparent',
                    zIndex: 0,
                    // use Tailwind's keyframes name but override timing to slow it down
                    animationName: hasUnsavedChanges ? 'ping' : 'none',
                    animationDuration: hasUnsavedChanges ? '1s' : '0s',
                    animationIterationCount: hasUnsavedChanges
                      ? 'infinite'
                      : '0',
                    animationTimingFunction: 'cubic-bezier(.4,0,.6,1)',
                    opacity: hasUnsavedChanges ? 1 : 0,
                  }}
                />
                <Button
                  loading={templateUpdateLoading}
                  type="primary"
                  size="middle"
                  onClick={handleTemplateUpdate}
                  className="relative z-10 editor-step-7-desktop"
                >
                  Salveaza
                </Button>
              </div>

              {hasUnsavedChanges && (
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xl text-red-600 font-medium cursor-default">
                        !
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Aveti modificari nesalvate</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="relative w-full h-[calc(100dvh-142px)] bg-[#F1F5F9] p-2 grid grid-cols-[250px_1fr_210px] gap-2">
          <div className="bg-white shadow rounded p-4 flex flex-col items-center overflow-y-auto editor-step-1-desktop">
            <AddSectionModal
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
                  open={openPopoverIndex === index + 1}
                  availableSectionTypes={availableSectionTypes}
                  onSelectType={handleSelectSectionType}
                  onClose={handlePopoverOpenChange}
                >
                  <div
                    className="group relative h-[6px] flex items-center justify-center cursor-pointer w-full editor-step-4-desktop"
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
          <div className={`overflow-y-auto h-full`}>
            <TemplateRenderer
              invitationData={template}
              selectedElementId={selectedItemId}
              editMode={true}
              onSelect={handleSectionSelect}
              handleTemplateDragAndDrop={handleTemplateDragAndDrop}
            />
          </div>
          <div className="overflow-y-auto overflow-x-visible settings-panel p-4 bg-white rounded shadow h-full editor-step-5-desktop">
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
      <TourWrapper
        tourId="editorGuideDesktop"
        steps={editorGuideStepsDesktop}
        forceRun={isTourRunning}
        onTourEnd={() => setIsTourRunning(false)}
      />
    </>
  );
};

export default EditPage;

interface MobileEditorProps {
  hasUnsavedChanges: boolean;
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
  hasUnsavedChanges,
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
  const [availableBreakpoints, setAvailableBreakpoints] = useState<
    ('mobile' | 'desktop' | 'tablet')[]
  >([]);

  useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth;
      if (width <= 600) {
        setAvailableBreakpoints(['mobile']);
      } else if (width <= 900) {
        setAvailableBreakpoints(['mobile', 'tablet']);
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
      <div className="relative inline-flex items-center !absolute !right-4 !top-2 z-10">
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[20px] h-[20px] rounded-full pointer-events-none"
          style={{
            // stronger visible glow using the --primary-color CSS variable
            boxShadow:
              '0 10px 8px rgba(0,0,0,0.12), 0 0 3px 8px var(--primary-color)',
            background: 'transparent',
            zIndex: 0,
            // use Tailwind's keyframes name but override timing to slow it down
            animationName: hasUnsavedChanges ? 'ping' : 'none',
            animationDuration: hasUnsavedChanges ? '1s' : '0s',
            animationIterationCount: hasUnsavedChanges ? 'infinite' : '0',
            animationTimingFunction: 'cubic-bezier(.4,0,.6,1)',
            opacity: hasUnsavedChanges ? 1 : 0,
          }}
        />
        <Button
          shape="circle"
          size="large"
          className="!bg-white/60 !text-[var(--primary-color)] !backdrop-blur-xl !shadow-lg !border border-gray-200 rounded-full flex items-center gap-2 relative z-10"
          icon={<SaveIcon />}
          onClick={handleTemplateUpdate}
          style={{
            boxShadow:
              '0 10px 8px rgba(0,0,0,0.12), 0 0 3px 6px var(--primary-color)',
            transformOrigin: 'center',
          }}
        />
      </div>

      <div className={`h-full overflow-auto`}>
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
    </div>
  );
};
