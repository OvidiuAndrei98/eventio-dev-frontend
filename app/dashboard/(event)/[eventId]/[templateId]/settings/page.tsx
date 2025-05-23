'use client';

import React, { use, useEffect, useState } from 'react';
import ColorEditorWidget from '../edit/components/editorComponents/ColorEditorWidget';
import { EditorWidgetType, PropertyDataType, Template } from '@/core/types';
import { getTemplateSettings } from '@/service/templates/getTemplateSettings';
import { Button, Switch } from 'antd';
import { updateTemplateSettings } from '@/service/templates/updateTemplateSettings';
import { toast } from 'sonner';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { updateEventActiveStatus } from '@/service/event/updateEventActiveStatus';
import { useEventContext } from '@/core/context/EventContext';

const SettingsPage = ({
  params,
}: {
  params: Promise<{ eventId: string; templateId: string }>;
}) => {
  const { eventId, templateId } = use(params);
  const { eventInstance, setEventInstance } = useEventContext();
  const [templateSettings, setTemplateSettings] = useState<
    Template['settings']
  >({} as Template['settings']);
  const [eventActiveProp, setEventActiveProp] = useState<boolean>();

  const queryTemplateSettings = async () => {
    const templateSettingsData = await getTemplateSettings(eventId, templateId);
    setTemplateSettings(templateSettingsData);
  };

  useEffect(() => {
    if (eventInstance) {
      setEventActiveProp(eventInstance.eventActive);
      queryTemplateSettings();
    }
  }, [eventId, templateId]);

  const onSettingsChange = (propertyName: string, newValue: unknown) => {
    setTemplateSettings((prevValue) => {
      return { ...prevValue, [propertyName]: newValue };
    });
  };

  const handleUpdateTemplateSettings = async () => {
    try {
      await updateTemplateSettings(templateId, templateSettings);
      if (eventInstance?.eventActive !== eventActiveProp) {
        await updateEventActiveStatus(eventActiveProp ?? false, eventId);
        if (eventInstance) {
          setEventInstance({
            ...eventInstance,
            eventId: eventInstance.eventId,
            eventActive: eventActiveProp ?? false,
            userId: eventInstance.userId,
          });
        }
      }
      toast.success('Setari actualizate cu succes');
    } catch (error) {
      console.log(error);
      toast.error('Eroare la actualizarea setarilor');
    }
  };
  return (
    <div className="bg-[#F6F6F6] h-full p-4">
      <div className="w-full flex items-center justify-end mb-4">
        <Button type="primary" onClick={() => handleUpdateTemplateSettings()}>
          Salveaza
        </Button>
      </div>
      <div className="bg-white p-2 rounded-md">
        <h1 className="text-xl font-semibold mb-2">Setari generale</h1>
        <div className="flex flex-col gap-2">
          <div className="inline-flex flex-col gap-[5px]">
            <span className="text-[#333333] text-[14px] font-bold">
              Invitatie activa:
            </span>
            <Switch
              value={eventActiveProp}
              onChange={(value) => setEventActiveProp(value)}
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
                templateSettings.backgroundColor as string | undefined | null
              }
              onChange={(newValue) =>
                onSettingsChange('backgroundColor', newValue)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
