'use client';

import MapsAutoComplete from '@/components/mapsAutoComplete/MapsAutoComplete';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/core/context/authContext';
import { EventInstance, EventLocation, EventPlan } from '@/core/types';
import { defaultTemplates } from '@/lib/templates/templates';
import { createEvent } from '@/service/event/createEvent';
import { uploadImageForTemplate } from '@/service/templates/uploadImageForTemplate';
import { QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Calendar,
  Form,
  FormInstance,
  FormProps,
  GetProp,
  Input,
  InputNumber,
  Steps,
  Tag,
  Upload,
  UploadProps,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import { useForm } from 'antd/es/form/Form';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const NewInvitationPage = () => {
  const router = useRouter();
  const { eventType, templateId } = useParams<{
    eventType: string;
    templateId: string;
  }>();
  const user = useAuth();
  const [current, setCurrent] = useState(0);
  const [eventDateForm] = Form.useForm();
  const [selectedEventType, setSelectedEventType] = useState<string>(eventType);
  const [form] = useForm();
  const [newEventDate, setNewEventDate] = useState<{
    eventName: string;
    guestsCount: string;
    eventDate: string;
  }>(eventDateForm.getFieldsValue());
  const [newEventLocation, setNewEventLocation] = useState<EventLocation>(
    {} as EventLocation
  );

  const [isEventSaving, setIsEventSaving] = useState(false);

  let afterImageUploaded: Promise<void>;

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      toast.error('You can only upload JPG/PNG file!');
    }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      toast.error('Image must be smaller than 10MB!');
    }
    // if (!isLt2M) {
    //   toast.error('Image must smaller than 2MB!');
    // }
    return isJpgOrPng && isLt10M;
  };

  const onSelectEventTypeAction = (eventType: string) => {
    setSelectedEventType(eventType);
    next();
  };

  const onSelectEventDateAction = (eventDate: {
    eventName: string;
    guestsCount: string;
    eventDate: string;
  }) => {
    setNewEventDate(eventDate);
    next();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = async (values: any) => {
    if (isEventSaving) {
      return;
    }
    setIsEventSaving(true);

    if (!newEventLocation.location) {
      toast.error('Te rugam sa selectezi o locatie valida');
      setIsEventSaving(false);
      return;
    }
    const selectedTemplate = defaultTemplates.find(
      (template) =>
        template.templateId === templateId && template.type === eventType
    );

    if (!selectedTemplate) {
      toast.error('A aparut o eroare la crearea invitatiei');
      setIsEventSaving(false);
      return;
    }

    if (!user.userDetails) {
      toast.error('A aparut o eroare la crearea invitatiei');
      setIsEventSaving(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let imageWasUploaded: () => void = () => {};
    afterImageUploaded = new Promise((r) => (imageWasUploaded = r));

    const eventId = crypto.randomUUID();
    const newTemplateId = crypto.randomUUID();
    const newEventLocationCopy = { ...newEventLocation };

    if (values.locationPhoto?.file) {
      if (values.locationPhoto.file.status === 'error') {
        imageWasUploaded();
        return;
      }
      if (values.locationPhoto.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(
          values.locationPhoto.file.originFileObj as FileType,
          async (url) => {
            if (user.userDetails) {
              try {
                const storageUrl = await uploadImageForTemplate(
                  url,
                  user.userDetails,
                  newTemplateId,
                  values.locationPhoto.file.name
                );
                if (storageUrl) {
                  newEventLocationCopy.locationImage = {
                    name: values.locationPhoto.file.name,
                    url: storageUrl,
                  };
                }
              } catch (error) {
                toast.error('A aparut o eroare la incarcarea imaginii');
              }
            }
            imageWasUploaded();
          }
        );
      }

      if (values.locationPhoto.file.status === 'removed') {
        imageWasUploaded();
      }
    } else {
      // If no image is uploaded, we resolve the promise immediately
      imageWasUploaded();
    }

    await afterImageUploaded;

    newEventLocationCopy.title = values.locationTitle;
    newEventLocationCopy.locationStartTime = values.locationStartTime;

    newEventLocationCopy.locationId = crypto.randomUUID();

    const eventName = newEventDate.eventName;
    const eventDateString = newEventDate.eventDate;

    selectedTemplate.settings.eventLocation = newEventLocationCopy;
    selectedTemplate.eventDate = eventDateString;
    selectedTemplate.settings.eventActive = false;

    const eventData: EventInstance = {
      eventGuestCount: parseInt(newEventDate.guestsCount, 10),
      eventLocation: newEventLocationCopy,
      eventName: eventName,
      eventDate: eventDateString,
      eventType: selectedEventType,
      templateId: newTemplateId,
      eventActive: false,
      eventPlan: EventPlan.basic,
      eventInvitationLink: `/invitation/i/${newTemplateId}/${eventName}`,
      eventId: eventId,
      userId: user.userDetails?.userId,
      eventTemplateThumbnailUrl: selectedTemplate.thumbnailUrl,
      eventTableOrganization: {
        elements: [],
      },
      guests: [],
      // TODO Not used in the new invitation flow, to be removed in feature releases
      adiotionalLocations: [],
      eventAditionalQuestions: [],
    };

    try {
      await createEvent(eventData, user.userDetails.userId, selectedTemplate);
    } catch (error) {
      toast.error('A aparut o eroare la crearea invitatiei');
      console.error('Error creating event:', error);
      return;
    } finally {
      setIsEventSaving(false);
    }

    router.push(`/dashboard/${eventId}`);
  };

  const steps = [
    {
      title: 'Tip eveniment',
      content: (
        <SelectEventType
          onSelectEventTypeAction={onSelectEventTypeAction}
          eventType={selectedEventType}
        />
      ),
    },
    {
      title: 'Date eveniment',
      content: (
        <SelectEventDate
          onSelectEventDateAction={onSelectEventDateAction}
          form={eventDateForm}
        />
      ),
    },
    {
      title: 'Locatie eveniment',
      content: (
        <div className="flex flex-col gap-4 mt-2 sm:flex-row">
          <MapsAutoComplete
            onLocationSelect={(location) => setNewEventLocation(location)}
          />
          <Form
            className="flex-1 md:max-w-[210px]"
            form={form}
            autoFocus={false}
            name="addAditionalLocation"
            onFinish={handleFormSubmit}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Titlu locatie"
              name="locationTitle"
              rules={[
                {
                  required: true,
                  message: 'Titlul este obligatoriu.',
                },
              ]}
            >
              <Input placeholder="Ex: Petrecerea" className="!w-full" />
            </Form.Item>
            <Form.Item
              label="Ora eveniment"
              name="locationStartTime"
              rules={[
                {
                  required: true,
                  message: 'Ora este obligatorie.',
                },
              ]}
            >
              <Input
                placeholder="Ex: 12:00"
                pattern={'^([0-1]?d|2[0-3])(?::([0-5]?d))?$'}
              />
            </Form.Item>
            <Form.Item label="Fotografie" name="locationPhoto">
              <ImgCrop
                rotationSlider
                aspectSlider={true}
                fillColor="transparent"
              >
                <Upload
                  name="locationPhoto"
                  listType="picture"
                  beforeUpload={beforeUpload}
                  onChange={(info) => {
                    form.setFieldsValue({
                      locationPhoto: {
                        file: info.file,
                      },
                    });
                  }}
                >
                  <Button icon={<UploadOutlined />}>Adauga imagine</Button>
                </Upload>
              </ImgCrop>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onFinish = async () => {
    form.submit();
  };

  return (
    <div className="bg-[#F1F5F9] w-full h-full min-h-screen">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center my-2">
          <h1 className="text-xl font-semibold">Adauga un eveniment</h1>
        </div>
        <Steps current={current} items={items} type="navigation" />
        <div>{steps[current].content}</div>
        <div className="mt-[24px] flex justify-between gap-2">
          {current > 0 && (
            <Button onClick={() => prev()} size="large" className="!px-4">
              Inapoi
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button
              size="large"
              className="self-end"
              type="primary"
              onClick={() => {
                if (current === 1) {
                  eventDateForm.submit();
                }
                if (!eventDateForm.getFieldsError().length) {
                  next();
                }
              }}
            >
              Inainte
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => onFinish()}
              size="large"
              disabled={isEventSaving}
            >
              {isEventSaving && <Spinner />}
              Finalizare
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewInvitationPage;

function SelectEventType({
  eventType,
  onSelectEventTypeAction,
}: {
  eventType: string;
  onSelectEventTypeAction: (eventType: string) => void;
}) {
  const eventTypes = [
    { value: 'wedding', label: 'Nunta' },
    { value: 'religiousWedding', label: 'Cununie' },
    { value: 'bapthism', label: 'Botez' },
    { value: 'banquet', label: 'Majorat' },
    { value: 'aniversary', label: 'Aniversare' },
    { value: 'corporate', label: 'Corporate' },
  ];

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold my-2">
        Selectează tipul de eveniment
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {eventTypes.map((type) => (
          <div
            key={type.value}
            className={`w-full p-4 border border-gray-400 rounded-lg cursor-pointer hover:bg-[#f6eff7] hover:border-[#edd7f4] transition-colors duration-200 text-center ${
              eventType === type.value ? '!border-[#CB93D9]' : ''
            }`}
            onClick={() => onSelectEventTypeAction(type.value)}
          >
            {type.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function SelectEventDate({
  form,
  onSelectEventDateAction,
}: {
  form: FormInstance;
  onSelectEventDateAction: (eventDate: {
    eventName: string;
    guestsCount: string;
    eventDate: string;
  }) => void;
}) {
  const onFinish: FormProps<{
    eventName: string;
    guestsCount: string;
    eventDate: Date;
  }>['onFinish'] = (values) => {
    const { eventDate, guestsCount, eventName } = values;
    if (!eventDate || !guestsCount) {
      toast.error('Te rugam sa completezi toate campurile');
      return;
    }
    onSelectEventDateAction({
      eventName,
      eventDate: eventDate.toISOString(),
      guestsCount,
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold my-2">Datele evenimentului</h2>
      <Form
        form={form}
        layout="vertical"
        name="event-date-form"
        onFinish={onFinish}
        autoComplete="off"
      >
        <div className="w-full grid grid-cols md:grid-cols-2 gap-4">
          <Form.Item
            name="eventDate"
            rules={[{ required: true, message: 'Data este obligatorie' }]}
          >
            <Calendar
              disabledDate={(current) => {
                return (
                  current &&
                  current.valueOf() < Date.now() - 24 * 60 * 60 * 1000 // Disable past dates excluding today
                );
              }}
              fullscreen={false}
              mode="month"
              className="shadow-sm"
            />
          </Form.Item>
          <div className="flex flex-col">
            <Form.Item
              label="Nume Eveniment"
              name="eventName"
              rules={[
                {
                  required: true,
                  message: 'Numele evenimentului este obligatoriu',
                },
              ]}
              className="w-full !mb-2"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Numar invitati"
              name="guestsCount"
              rules={[
                {
                  required: true,
                  message: 'Numarul de persoane este obligatoriu',
                },
              ]}
              className="w-full !mb-2"
            >
              <InputNumber className="!w-full" />
            </Form.Item>
            <Tag
              color="magenta"
              icon={<QuestionCircleOutlined />}
              bordered={false}
              className="w-full !text-wrap"
            >
              Numărul aproximativ de persoane te ajută la statistici precise ale
              evenimentului tău.
            </Tag>
          </div>
        </div>
      </Form>
    </div>
  );
}
