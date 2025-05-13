'use client';

import { useAuth } from '@/core/AuthenticationBoundary';
import { EventInstance } from '@/core/types';
import { defaultTemplates } from '@/lib/templates/templates';
import { createEvent } from '@/service/event/createEvent';
import { Button, DatePicker, Form, FormProps, Input } from 'antd';
import { useRouter } from 'next/navigation';
import React, { use } from 'react';
import { toast } from 'sonner';

type FieldType = {
  eventName: string;
  eventDate: Date;
};

const NewInvitationPage = ({
  params,
}: {
  params: Promise<{ eventType: string; templateId: string }>;
}) => {
  const router = useRouter();
  const { eventType, templateId } = use(params);
  const user = useAuth();

  const onFinish: FormProps<FieldType>['onFinish'] = async (
    values: FieldType
  ) => {
    const selectedTemplate = defaultTemplates.find(
      (template) =>
        template.templateId === templateId && template.type === eventType
    );

    if (!selectedTemplate) {
      console.error('Template not found');
      toast.error('A aparut o eroare la crearea invitatiei');
      return;
    }

    const { eventName, eventDate } = values;
    const eventDateString = eventDate?.toISOString() ?? '';
    const eventId = crypto.randomUUID();
    const newTemplateId = crypto.randomUUID();
    const eventData: EventInstance = {
      eventName,
      invitationActive: false,
      eventDate: eventDateString,
      eventType,
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

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo: Parameters<
      NonNullable<FormProps<FieldType>['onFinishFailed']>
    >[0]
  ) => {
    console.error('Failed creating event', errorInfo);
  };

  return (
    <div className="bg-[#F1F5F9] w-full h-[100dvh]">
      <div className="bg-white flex flex-col items-center justify-center mx-[auto] max-w-[500px] gap-4">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-xl font-semibold">Informatii generale</h1>
          <span className="text-sm text-center text-gray-500 font-semibold">
            Primul pas este sa stabilim cateva detalii esentiale despre
            invitatia ta
          </span>
        </div>
        <Form
          layout="vertical"
          name="event-creation-form"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Nume eveniment"
            name="eventName"
            rules={[{ required: true, message: 'Numele este obligatoriu' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Data eveniment"
            name="eventDate"
            rules={[{ required: true, message: 'Data este obligatorie' }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Creeaza invitatie
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default NewInvitationPage;
