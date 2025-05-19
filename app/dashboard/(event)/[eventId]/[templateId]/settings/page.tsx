'use client';

import React, { use, useEffect, useState } from 'react';
import ColorEditorWidget from '../edit/components/editorComponents/ColorEditorWidget';
import { EditorWidgetType, PropertyDataType, Template } from '@/core/types';
import { getTemplateSettings } from '@/service/templates/getTemplateSettings';
import { Button } from 'antd';
import { updateTemplateSettings } from '@/service/templates/updateTemplateSettings';
import { toast } from 'sonner';

const SettingsPage = ({
  params,
}: {
  params: Promise<{ eventId: string; templateId: string }>;
}) => {
  const { eventId, templateId } = use(params);
  const [tempalteSettings, setTemplateSettings] = useState<
    Template['settings']
  >({} as Template['settings']);

  const queryTemplateSettings = async () => {
    const tempalteSettingsData = await getTemplateSettings(eventId, templateId);
    setTemplateSettings(tempalteSettingsData);
  };

  useEffect(() => {
    queryTemplateSettings();
  }, [eventId, templateId]);

  const onSettingsChange = (propertyName: string, newValue: unknown) => {
    setTemplateSettings((prevValue) => {
      return { ...prevValue, [propertyName]: newValue };
    });
  };

  const handleUpdateTemplateSettings = async () => {
    try {
      await updateTemplateSettings(templateId, tempalteSettings);
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
        <div>
          <div className="max-w-[100px]">
            <ColorEditorWidget
              config={{
                label: 'Culoare Fundal',
                dataType: PropertyDataType.Color,
                widgetType: EditorWidgetType.ColorPicker,
                responsive: false,
              }}
              value={
                tempalteSettings.backgroundColor as string | undefined | null
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
