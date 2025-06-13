'use client';

import React, { useEffect, useState } from 'react';
import ColorEditorWidget from '../edit/components/editorComponents/ColorEditorWidget';
import {
  EditorWidgetType,
  EventLocation,
  EventQuestions,
  PropertyDataType,
  Template,
} from '@/core/types';
import { getTemplateSettings } from '@/service/templates/getTemplateSettings';
import {
  Button,
  Card,
  Form,
  GetProp,
  Input,
  Modal,
  Popover,
  Switch,
  Tag,
  UploadProps,
} from 'antd';
import { updateTemplateSettings } from '@/service/templates/updateTemplateSettings';
import { toast } from 'sonner';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { useEventContext } from '@/core/context/EventContext';
import AutocompleteMapsInput from '@/components/autocompleteMapsInput/AutocompleteMapsInput';
import { updateEventActiveStatus } from '@/service/event/updateEventActiveStatus';
import { removeImageForTemplate } from '@/service/templates/removeImageForTemplate';
import { useAuth } from '@/core/AuthenticationBoundary';
import { useParams } from 'next/navigation';
import { uploadImageForTemplate } from '@/service/templates/uploadImageForTemplate';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(img);
  });
};

const SettingsPage = () => {
  const { eventId, templateId } = useParams<{
    eventId: string;
    templateId: string;
  }>();
  const { eventInstance } = useEventContext();
  const [aditionalQuestionsForm] = Form.useForm();
  const [teplateSaveLoading, setTemplateSaveLoading] = useState(false);
  const [templateSettings, setTemplateSettings] = useState<
    Template['settings']
  >({} as Template['settings']);
  const [templateSettingsLoading, setTemplateSettingsLoading] = useState(true);
  const [newEvemtLocationPopoverOpen, setNewEventLocationPopoverOpen] =
    useState<boolean>(false);

  const [editLocationModalOpen, setEditLocationModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<EventLocation>(
    {} as EventLocation
  );

  const [deletedLocations, setDeletedLocations] = useState<EventLocation[]>([]);

  const [editedEvemtLocation, setEditedEventLocation] = useState<{
    location: EventLocation;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    file: any;
    oldFileName?: string;
  } | null>(null);

  const [editedAditionalLocations, setEditedAditionalLocations] = useState<
    | {
        location: EventLocation;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        file: any;
        oldFileName?: string;
      }[]
    | null
  >(null);

  const user = useAuth().userDetails;

  const queryTemplateSettings = async () => {
    const templateSettingsData = await getTemplateSettings(eventId, templateId);
    setTemplateSettings(templateSettingsData);
    setTemplateSettingsLoading(false);
  };

  useEffect(() => {
    if (eventInstance) {
      queryTemplateSettings();
    }
  }, [eventId, templateId]);

  const onSettingsChange = (propertyName: string, newValue: unknown) => {
    setTemplateSettings((prevValue) => {
      return { ...prevValue, [propertyName]: newValue };
    });
  };

  const uploadLocationImage = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    file: any,
    oldFilename?: string
  ): Promise<{ url: string; name: string } | undefined> => {
    if (!file) return undefined;

    if (file?.status === 'done') {
      if (file.originFileObj && user) {
        try {
          let newImageOject: { url: string; name: string } | undefined;
          const url = await getBase64(file.originFileObj as FileType);

          // Generate a unique file name based on the current time
          const now = new Date();
          const min = now.getMinutes().toString().padStart(2, '0');
          const sec = now.getSeconds().toString().padStart(2, '0');
          const fileName = `${min}${sec}_${file.name}`;

          const storageUrl = await uploadImageForTemplate(
            url,
            user,
            templateId,
            fileName
          );
          if (storageUrl) {
            newImageOject = {
              url: storageUrl,
              name: fileName,
            };
          }
          if (oldFilename) {
            await removeImageForTemplate(user, templateId, oldFilename);
          }
          return newImageOject;
        } catch (error) {
          toast.error('A aparut o eroare la incarcarea imaginii');
        }
      }
    }
    if (file?.status === 'removed') {
      if (user) {
        try {
          if (oldFilename) {
            // If the file was removed, we need to delete the old image
            await removeImageForTemplate(user, templateId, oldFilename);
          }
        } catch (error) {
          toast.error('A aparut o eroare la stergerea imaginii');
        }
      }
      return undefined;
    }
    return undefined;
  };

  // Used to update template settings after the use press the save button
  const handleUpdateTemplateSettings = async () => {
    try {
      if (eventInstance) {
        setTemplateSaveLoading(true);
        // Update event status
        if (eventInstance?.eventActive !== templateSettings.eventActive) {
          await updateEventActiveStatus(
            templateSettings.eventActive ?? false,
            eventId
          );
        }

        // Update questions
        const evQuestions = transformAditionQuestionToEventFormat();
        const evQuestionsCopy = { ...templateSettings };
        // Add the new questions to the existing event settings
        evQuestionsCopy.eventAditionalQuestions = evQuestions;

        deletedLocations.forEach(async (loc) => {
          try {
            if (loc.locationImage) {
              await removeImageForTemplate(
                user,
                templateId,
                loc.locationImage.name
              );
            }
          } catch (error) {
            throw new Error(
              'A aparut o eroare la stergerea locatiei:' + loc.name
            );
          }
        });

        // Update the main event location image if it was edited
        if (editedEvemtLocation?.file) {
          // If the edited location is the main event location, update it
          if (
            editedEvemtLocation.location.locationId ===
            templateSettings.eventLocation?.locationId
          ) {
            evQuestionsCopy.eventLocation.locationImage =
              await uploadLocationImage(
                editedEvemtLocation.file,
                editedEvemtLocation.oldFileName
              );
          }
        }

        // Update the aditional locations images if they were edited
        if (editedAditionalLocations) {
          const aditionalLocations: EventLocation[] =
            templateSettings.aditionalLocations ?? [];
          await Promise.all(
            editedAditionalLocations.map(async (editedLocation) => {
              const existingLocationIndex = aditionalLocations.findIndex(
                (loc) => loc.locationId === editedLocation.location.locationId
              );
              const locationImage = await uploadLocationImage(
                editedLocation.file,
                editedLocation.oldFileName
              );
              if (existingLocationIndex !== -1) {
                // Update existing location
                aditionalLocations[existingLocationIndex] = {
                  ...aditionalLocations[existingLocationIndex],
                  ...editedLocation.location,
                  locationImage,
                };
              } else {
                // Add new location
                aditionalLocations.push({
                  ...editedLocation.location,
                  locationImage,
                });
              }
            })
          );
          evQuestionsCopy.aditionalLocations = aditionalLocations;
        }

        // Clear edited locations after saving
        setEditedEventLocation(null);
        setEditedAditionalLocations([]);

        // Update template settings
        await updateTemplateSettings(templateId, evQuestionsCopy);
      }
      setTemplateSaveLoading(false);
      toast.success('Setari actualizate cu succes');
    } catch (error) {
      setTemplateSaveLoading(false);
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('A aparut o eroare la actualizarea setarilor');
      }
    }
  };

  const transformAditionQuestionToEventFormat = (): EventQuestions[] => {
    const values = aditionalQuestionsForm.getFieldsValue();
    const eventQuestions: EventQuestions[] = [];
    if (values.items) {
      values.items.forEach(
        (i: { qName: string; qAnswers?: { value: string }[] }) => {
          const qAnswers = i.qAnswers?.filter((qa) => qa?.value) ?? [];
          if (qAnswers.length <= 0) {
            throw new Error(
              'Exista intrebari fara raspunsuri, lista nu au fost actualizata'
            );
          }
          if (i.qName.trim() === '') {
            throw new Error(
              'Exista intrebari necompletate, lista nu au fost actualizata'
            );
          }
          const eventQuestion = {
            qName: i.qName,
            qAnswers: qAnswers,
          };
          eventQuestions.push(eventQuestion);
        }
      );
    }
    return eventQuestions;
  };

  const handleAddAditionalEventLocation = async (
    location: EventLocation,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    file: any,
    oldFilename?: string
  ) => {
    const existingEventAdiotionalLocations =
      (templateSettings?.aditionalLocations as EventLocation[]) ?? [];

    const existingLocationIndex =
      existingEventAdiotionalLocations.findIndex(
        (loc) => loc.locationId === location.locationId
      ) ?? -1;

    let updatedLocations: EventLocation[];
    if (existingLocationIndex !== -1) {
      // Update existing location
      updatedLocations = [...existingEventAdiotionalLocations];
      updatedLocations[existingLocationIndex] = location;
    } else {
      // Add new location
      updatedLocations = [...existingEventAdiotionalLocations, location];
    }

    setEditedAditionalLocations((prevData) => {
      const newEntry = {
        location: location,
        file: file.originFileObj ? file : undefined,
        oldFileName: oldFilename,
      };
      if (prevData) {
        // Replace if locationId exists, else add new
        const index = prevData.findIndex(
          (item) => item.location.locationId === location.locationId
        );
        if (index !== -1) {
          const updated = [...prevData];
          updated[index] = newEntry;
          return updated;
        } else {
          return [...prevData, newEntry];
        }
      }
      return [newEntry];
    });

    onSettingsChange('aditionalLocations', updatedLocations);

    setEditLocationModalOpen(false);
  };

  const handleUpdatePrincipalEventLocation = async (
    location: EventLocation,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    file: any,
    oldFilename?: string
  ) => {
    // Check if the image was already uploaded, if it has the FileObject it means it was uploaded
    // and the file will remain the same, so we send undefined to the update function
    setEditedEventLocation({
      location,
      file: file.originFileObj ? file : undefined,
      oldFileName: oldFilename,
    });
    onSettingsChange('eventLocation', location);

    setEditLocationModalOpen(false);
  };

  const handleDeleteAditionalLocation = async (locationId: string) => {
    const existingEventAdiotionalLocations =
      (templateSettings?.aditionalLocations as EventLocation[]) ?? [];

    const locationToBeRemoved = existingEventAdiotionalLocations.find(
      (loc) => loc.locationId == locationId
    );
    if (locationToBeRemoved) {
      setDeletedLocations((prevData) => {
        return [...prevData, locationToBeRemoved];
      });
    }

    onSettingsChange(
      'aditionalLocations',
      existingEventAdiotionalLocations.filter(
        (loc) => loc.locationId !== locationId
      )
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLocationUpdate = (
    loc: EventLocation,
    file: any,
    oldFileName?: string
  ) => {
    if (!eventInstance) {
      toast.error('Nu exista un eveniment selectat pentru a actualiza locatia');
      return;
    }
    if (loc.locationId === eventInstance.eventLocation.locationId) {
      handleUpdatePrincipalEventLocation(loc, file, oldFileName);
    } else {
      handleAddAditionalEventLocation(loc, file, oldFileName);
    }
    setNewEventLocationPopoverOpen(false);
  };

  return templateSettingsLoading ? (
    <span className="loader"></span>
  ) : (
    <div className="bg-[#F6F6F6] h-full p-4 flex flex-col overflow-y-auto">
      <div className="w-full flex items-center justify-end mb-4 col-span-full row-start-1">
        <Button
          loading={teplateSaveLoading}
          type="primary"
          onClick={() => handleUpdateTemplateSettings()}
        >
          Salveaza
        </Button>
      </div>
      <div className="row flex flex-col w-full gap-4 md:!flex-row">
        <div className="w-full flex flex-col gap-4">
          <div className="bg-white p-2 rounded-md flex-1 shadow-sm">
            <h1 className="text-xl font-semibold mb-2">Setari generale</h1>
            <div className="flex flex-col gap-2">
              <div className="inline-flex flex-col gap-[5px]">
                <span className="text-[#333333] text-[14px] font-bold">
                  Invitatie activa:
                </span>
                <Switch
                  value={templateSettings.eventActive}
                  onChange={(value) => onSettingsChange('eventActive', value)}
                  className="max-w-[40px]"
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  defaultChecked
                />
              </div>
              <div className="max-w-[100px]">
                <ColorEditorWidget
                  config={{
                    label: 'Culoare Fundal',
                    dataType: PropertyDataType.Color,
                    widgetType: EditorWidgetType.ColorPicker,
                    responsive: false,
                  }}
                  value={
                    templateSettings.backgroundColor as
                      | string
                      | undefined
                      | null
                  }
                  onChange={(newValue) =>
                    onSettingsChange('backgroundColor', newValue)
                  }
                />
              </div>
            </div>
          </div>
          <div className="bg-white p-2 rounded-md flex-1 shadow-sm flex flex-col">
            <h1 className="text-xl font-semibold mb-2">
              Întrebările invitației
            </h1>
            <Form
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              form={aditionalQuestionsForm}
              name="aditionalQuestionsForm"
              autoComplete="off"
              initialValues={{
                items: templateSettings?.eventAditionalQuestions ?? [],
              }}
            >
              <Form.List name="items">
                {(fields, { add, remove }) => (
                  <div
                    style={{
                      display: 'flex',
                      rowGap: 12,
                      flexDirection: 'column',
                    }}
                  >
                    {fields.map((field) => (
                      <Card
                        className="max-w-[600px]"
                        size="small"
                        title={`Intrebare ${field.name + 1}`}
                        key={field.key}
                        extra={
                          <CloseOutlined
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        }
                      >
                        <Form.Item
                          label="Intrebare"
                          name={[field.name, 'qName']}
                        >
                          <Input />
                        </Form.Item>

                        {/* Nest Form.List */}
                        <Form.Item label="Raspunsuri">
                          <Form.List name={[field.name, 'qAnswers']}>
                            {(subFields, subOpt) => (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  rowGap: 16,
                                }}
                              >
                                {subFields.map((subField, index) => (
                                  <div className="flex gap-2 mr-6" key={index}>
                                    <Form.Item
                                      noStyle
                                      name={[subField.name, 'value']}
                                    >
                                      <Input placeholder="Raspuns" />
                                    </Form.Item>
                                    <CloseOutlined
                                      onClick={() => {
                                        subOpt.remove(subField.name);
                                      }}
                                    />
                                  </div>
                                ))}
                                <Button
                                  type="dashed"
                                  onClick={() => subOpt.add()}
                                  block
                                >
                                  + Adauga raspuns
                                </Button>
                              </div>
                            )}
                          </Form.List>
                        </Form.Item>
                      </Card>
                    ))}
                    <Tag
                      className="!text-wrap font-normal !text-[14px] !py-2 rounded-md !max-w-[700px] !opacity-[0.7]"
                      icon={<QuestionCircleOutlined />}
                      bordered={false}
                      color="purple"
                    >
                      Adaugă întrebarile tale aici iar invitații vor raspunde la
                      acestea atunci când vor confirma invitația ta. Exemplu:
                      <ul className="list-disc list-inside ml-4">
                        <li>
                          Doresti cazare?
                          <ul className="list-disc list-inside ml-6">
                            <li>Da</li>
                            <li>Nu</li>
                          </ul>
                        </li>
                      </ul>
                    </Tag>
                    <Button type="dashed" onClick={() => add()} block>
                      + Adauga intrebare
                    </Button>
                  </div>
                )}
              </Form.List>
            </Form>
          </div>
        </div>
        <div className="w-full">
          <div className="bg-white p-2 rounded-md flex-1 shadow-sm">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold mb-2">Setari locatie</h1>
              <Popover
                destroyTooltipOnHide={true}
                placement="bottomLeft"
                rootClassName="!z-[1]"
                content={
                  <div className="flex flex-col gap-2">
                    <span className="text-gray-700 text-lg font-semibold">
                      Adauga o locatie pentru eveniment
                    </span>
                    <AutocompleteMapsInput
                      onLocationSelect={(loc, file) => {
                        handleAddAditionalEventLocation(loc, file);
                        setNewEventLocationPopoverOpen(false);
                      }}
                    />
                    <Button
                      onClick={() => setNewEventLocationPopoverOpen(false)}
                      className="!absolute left-[10px] bottom-[12px] w-[100px]"
                    >
                      Anuleaza
                    </Button>
                  </div>
                }
                trigger="click"
                open={newEvemtLocationPopoverOpen}
              >
                <Button
                  type="text"
                  icon={<PlusCircleOutlined />}
                  className="!text-[#CB93D9] mb-2"
                  onClick={() =>
                    setNewEventLocationPopoverOpen(!newEvemtLocationPopoverOpen)
                  }
                >
                  Adauga locatie
                </Button>
              </Popover>
            </div>
            <Tag
              className="!text-wrap font-normal !text-[14px] !py-2 !mb-2 rounded-md !opacity-[0.7]"
              icon={<QuestionCircleOutlined />}
              bordered={false}
              color="purple"
            >
              Adauga locatiile tale aici, iar acestea vor aparea pe invitatie in
              sectiunea de locatii.
            </Tag>
            <div className="flex flex-col gap-2">
              {templateSettings?.eventLocation && (
                <div className="rounded p-3 flex flex-row items-center gap-4 max-w-[400px] hover:shadow-md hover:bg-[#fcf2ff] transition-shadow duration-200 group">
                  <span className="text-red-500 mr-2 flex-shrink-0 shadow-sm bg-gray-50 w-16 h-16 flex items-center justify-center rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                    </svg>
                  </span>
                  <div className="flex flex-col">
                    <div className="font-semibold text-base">
                      {templateSettings.eventLocation.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {templateSettings.eventLocation.formatted_address}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <Button
                      className="md:opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditingLocation(templateSettings.eventLocation);
                        setEditLocationModalOpen(true);
                      }}
                    />
                  </div>
                </div>
              )}
              {templateSettings?.aditionalLocations?.map((loc) => (
                <div
                  className="rounded p-3 flex flex-row items-center gap-4 max-w-[400px] hover:shadow-md hover:bg-[#fcf2ff] transition-shadow duration-200 group"
                  key={loc.locationId}
                >
                  <span className="text-red-500 mr-2 flex-shrink-0 shadow-sm bg-gray-50 w-16 h-16 flex items-center justify-center rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                    </svg>
                  </span>
                  <div className="flex flex-col">
                    <div className="font-semibold text-base">{loc.name}</div>
                    <div className="text-sm text-gray-600">
                      {loc.formatted_address}
                    </div>
                  </div>
                  <div className="ml-auto flex">
                    <Button
                      className="md:opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditingLocation(loc);
                        setEditLocationModalOpen(true);
                      }}
                    />
                    <Button
                      className="md:opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() =>
                        handleDeleteAditionalLocation(loc.locationId)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Editeaza locatia"
        centered
        open={editLocationModalOpen}
        footer={false}
        destroyOnClose
        onCancel={() => setEditLocationModalOpen(false)}
      >
        <AutocompleteMapsInput
          onLocationSelect={handleLocationUpdate}
          editingLocation={editingLocation}
          templateId={templateId}
          user={user}
        />
      </Modal>
    </div>
  );
};

export default SettingsPage;
