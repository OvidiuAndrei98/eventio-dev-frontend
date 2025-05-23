import React from 'react';
import { EditorWidgetType, TemplateElement } from '@/core/types'; // Importă configurația și tipurile de widget-uri
import NumberEditorWidget from '../editorComponents/NumberEditorWidget';
import { componentsConfig } from '../editComponentConfig';
import InputEditorWidget from '../editorComponents/InputEditorWidget';
import ColorEditorWidget from '../editorComponents/ColorEditorWidget';
import PositionEditorWidget from '../editorComponents/PositionEditorWidget';
import { getNestedValue } from '../../utils/objectUtils';
import ImageUploadWidget from '../editorComponents/ImageUploadWidget';
import BlobSelectorWidget from '../editorComponents/BlobSelectorWidget';
import BorderEditorWidget from '../editorComponents/BorderEditorWidget';

export interface PropertyPanelProps {
  selectedElement: TemplateElement;
  templateId: string;
  activeBreakpoint: 'desktop' | 'tablet' | 'mobile';
  handlePropertyChanged: (
    propertyPath: string,
    newValue: unknown,
    propIsResponsive: boolean
  ) => void;
}

const PropertyPanel = ({
  templateId,
  selectedElement,
  activeBreakpoint,
  handlePropertyChanged,
}: PropertyPanelProps) => {
  const configSet = componentsConfig[selectedElement?.type];

  const getPropertyValue = (
    data: TemplateElement,
    defaultPropertyPath: string,
    activeBreakpoint: 'desktop' | 'tablet' | 'mobile',
    isPropertyResponsive: boolean
  ): unknown => {
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
    <div>
      {Object.entries(configSet).map(([propertyPath, config]) => {
        if (propertyPath === 'elements' || propertyPath === 'responsive')
          return null;

        const currentValue = getPropertyValue(
          selectedElement,
          propertyPath,
          activeBreakpoint,
          config.responsive
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
                version={Date.now()}
                config={config}
                value={
                  currentValue as
                    | {
                        y?: number;
                        elementAlignment?:
                          | 'auto'
                          | 'self-start'
                          | 'center'
                          | 'self-end';
                        x?: number;
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
          case EditorWidgetType.BlobSelector:
            return (
              <BlobSelectorWidget
                key={propertyPath}
                config={config}
                value={currentValue as string}
                onChange={(newValue) =>
                  handlePropertyChanged(
                    propertyPath,
                    newValue,
                    config.responsive
                  )
                }
              />
            );
          case EditorWidgetType.BorderEditor:
            return (
              <BorderEditorWidget
                key={propertyPath}
                config={config}
                value={
                  currentValue as {
                    size: string;
                    color: string;
                    sides: string;
                  }
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
          default:
            return (
              <div key={propertyPath}>
                Widget pentru {config.label} ({config.widgetType}) nu este
                implementat.
              </div>
            );
        }
      })}
    </div>
  );
};

export default PropertyPanel;
