'use client';

import MapsAutoComplete from '@/components/mapsAutoComplete/MapsAutoComplete';
import { useAuth } from '@/core/AuthenticationBoundary';
import { EventInstance, EventLocation } from '@/core/types';
import { defaultTemplates } from '@/lib/templates/templates';
import { createEvent } from '@/service/event/createEvent';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Calendar,
  Form,
  FormInstance,
  FormProps,
  Input,
  InputNumber,
  Steps,
  Tag,
} from 'antd';
import { useRouter } from 'next/navigation';
import React, { use, useState } from 'react';
import { toast } from 'sonner';

const NewInvitationPage = ({
  params,
}: {
  params: Promise<{ eventType: string; templateId: string }>;
}) => {
  const router = useRouter();
  const { eventType, templateId } = use(params);
  const user = useAuth();
  const [current, setCurrent] = useState(0);
  const [eventDateForm] = Form.useForm();
  const [selectedEventType, setSelectedEventType] = useState<string>(eventType);
  const [newEventDate, setNewEventDate] = useState<{
    eventName: string;
    guestsCount: string;
    eventDate: string;
  }>(eventDateForm.getFieldsValue());
  const [newEventLocation, setNewEventLocation] = useState<EventLocation>(
    {} as EventLocation
  );

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
        <MapsAutoComplete
          onLocationSelect={(location) => setNewEventLocation(location)}
        />
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
    if (!newEventLocation.location) {
      toast.error('Te rugam sa selectezi o locatie valida');
      return;
    }
    const selectedTemplate = defaultTemplates.find(
      (template) =>
        template.templateId === templateId && template.type === eventType
    );

    if (!selectedTemplate) {
      console.error('Template not found');
      toast.error('A aparut o eroare la crearea invitatiei');
      return;
    }

    const eventName = newEventDate.eventName;
    const eventDateString = newEventDate.eventDate;
    const eventId = crypto.randomUUID();
    const newTemplateId = crypto.randomUUID();
    const eventData: EventInstance = {
      eventGuestCount: parseInt(newEventDate.guestsCount, 10),
      eventLocation: newEventLocation,
      eventName: eventName,
      eventDate: eventDateString,
      eventType: selectedEventType,
      templateId: newTemplateId,
      eventActive: false,
      eventPlan: 'basic',
      eventInvitationLink: `/invitation/i/${newTemplateId}/${eventName}`,
      eventId: eventId,
      userId: user.userDetails.userId,
      eventTemplateThumbnailUrl: selectedTemplate.thumbnailUrl,
      eventTableOrganization: {
        elements: [],
      },
    };
    await createEvent(eventData, user.userDetails.userId, selectedTemplate);
    router.push(`/dashboard/${eventId}`);
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
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Previous
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button
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
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => onFinish()}>
              Done
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
