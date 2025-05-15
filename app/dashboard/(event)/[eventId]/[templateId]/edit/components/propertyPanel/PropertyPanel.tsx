// editor/PropertyPanel.tsx (Exemplu Conceptual)
import React from 'react';
import { EditorWidgetType, TemplateElement } from '@/core/types'; // Importă configurația și tipurile de widget-uri
import NumberEditorWidget from '../editorComponents/NumberEditorWidget';
import { componentsConfig } from '../editComponentConfig';
import InputEditorWidget from '../editorComponents/InputEditorWidget';
import ColorEditorWidget from '../editorComponents/ColorEditorWidget';
import PositionEditorWidget from '../editorComponents/PositionEditorWidget';
import { getNestedValue } from '../../utils/objectUtils';
import ImageUploadWidget from '../editorComponents/ImageUploadWidget';

export interface PropertyPanelProps {
  selectedElement: TemplateElement;
  templateId: string;
  activeBreakpoint: 'desktop' | 'tablet' | 'mobile';
  handlePropertyChanged: (
    propertyPath: string,
    newValue: any,
    propIsResponsive: boolean
  ) => void;
}

const PropertyPanel = ({
  templateId,
  selectedElement,
  activeBreakpoint,
  handlePropertyChanged,
}: PropertyPanelProps) => {
  console.log('>>> RENDERING PropertyPanel <<<');
  console.log('PropertyPanel: Received selectedItemData:', selectedElement);
  const configSet = componentsConfig[selectedElement?.type];

  const getPropertyValue = (
    data: TemplateElement,
    defaultPropertyPath: string,
    activeBreakpoint: 'desktop' | 'tablet' | 'mobile',
    isPropertyResponsive: boolean
  ): any => {
    if (!data || !defaultPropertyPath) {
      return undefined;
    }

    if (activeBreakpoint !== 'desktop' && isPropertyResponsive) {
      const responsivePath = `responsive.${activeBreakpoint}.${defaultPropertyPath}`;

      const responsiveValue = getNestedValue(data, responsivePath);

      if (responsiveValue !== undefined) {
        return responsiveValue;
      }
    }

    const defaultValue = getNestedValue(data, defaultPropertyPath);

    return defaultValue;
  };

  if (!selectedElement?.id) {
    return <span>Niciun element selectat</span>;
  }

  if (!configSet) {
    return (
      <div>
        Nicio configurare editor găsită pentru tipul {selectedElement?.type}.
      </div>
    );
  }

  return (
    <div className="overflow-y-auto">
      {Object.entries(configSet).map(([propertyPath, config]) => {
        if (propertyPath === 'elements' || propertyPath === 'responsive')
          return null;
        console.log(
          `PropertyPanel: Mapping "${propertyPath}". Config ref:`,
          config
        ); // Log referinta config

        const currentValue = getPropertyValue(
          selectedElement,
          propertyPath,
          activeBreakpoint,
          config.responsive
        );

        console.log(
          `PropertyPanel: Mapping property "${propertyPath}". Passing value:`,
          currentValue
        );

        switch (config.widgetType) {
          case EditorWidgetType.NumberInput:
            return (
              <NumberEditorWidget
                version={Date.now()}
                key={propertyPath}
                config={config}
                value={currentValue as number | undefined | null}
                onChange={(newValue) =>
                  handlePropertyChanged(
                    propertyPath,
                    newValue,
                    config.responsive
                  )
                }
              />
            );
          case EditorWidgetType.TextInput:
            return (
              <InputEditorWidget
                key={propertyPath}
                config={config}
                value={currentValue as string | undefined | null}
                onChange={(newValue) =>
                  handlePropertyChanged(
                    propertyPath,
                    newValue,
                    config.responsive
                  )
                }
              />
            );
          case EditorWidgetType.ColorPicker:
            return (
              <ColorEditorWidget
                key={propertyPath}
                config={config}
                value={currentValue as string | undefined | null}
                onChange={(newValue) =>
                  handlePropertyChanged(
                    propertyPath,
                    newValue,
                    config.responsive
                  )
                }
              />
            );
          case EditorWidgetType.PositionInput:
            return (
              <PositionEditorWidget
                key={propertyPath}
                config={config}
                value={
                  currentValue as
                    | {
                        top?: number;
                        right?: number;
                        bottom?: number;
                        left?: number;
                      }
                    | undefined
                    | null
                }
                onChange={(newValue) =>
                  handlePropertyChanged(
                    propertyPath,
                    newValue,
                    config.responsive
                  )
                }
              />
            );
          case EditorWidgetType.ImageUpload:
            return (
              <ImageUploadWidget
                key={propertyPath}
                config={config}
                value={
                  currentValue as {
                    name: string;
                    opacity: string;
                    url: string;
                  }
                }
                templateId={templateId}
                onChange={(newValue) =>
                  handlePropertyChanged(
                    propertyPath,
                    newValue,
                    config.responsive
                  )
                }
              />
            );
          default:
            return (
              <div key={propertyPath}>
                Widget pentru "{config.label}" ({config.widgetType}) nu este
                implementat.
              </div>
            );
        }
      })}
    </div>
  );
};

export default PropertyPanel;
