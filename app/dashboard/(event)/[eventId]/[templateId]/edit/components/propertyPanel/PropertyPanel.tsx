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
import TextareaEditorElement from '../editorComponents/TextareaEditorElement';
import TextAlignmentWidget from '../editorComponents/TextAlignmentWidget';
import FontWeightEditorWidget from '../editorComponents/FontWeightEditorWidget';
import FontSelectorWidget from '../editorComponents/FontSelectorWidget';
import StrokeEditorWidget from '../editorComponents/StrokeEditorWidget';
import GifSelectorWidget from '../editorComponents/GifSelectorWidget';
import ScrollableBackgroundWidget from '../editorComponents/ScrollableBackgroundWidget';

export interface PropertyPanelProps {
  selectedElement: TemplateElement;
  activeBreakpoint: 'desktop' | 'tablet' | 'mobile';
  handlePropertyChanged: (
    propertyPath: string,
    newValue: unknown,
    propIsResponsive: boolean
  ) => void;
}

const PropertyPanel = ({
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
          case EditorWidgetType.TextArea:
            return (
              <TextareaEditorElement
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
          case EditorWidgetType.TextAlignment:
            return (
              <TextAlignmentWidget
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
          case EditorWidgetType.FontWeight:
            return (
              <FontWeightEditorWidget
                key={propertyPath}
                config={config}
                value={currentValue as string | undefined}
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
                        top?: number;
                        left?: number;
                        bottom?: number;
                        right?: number;
                        elementAlignment:
                          | 'auto'
                          | 'self-start'
                          | 'center'
                          | 'self-end';
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
          case EditorWidgetType.FontFamily:
            return (
              <FontSelectorWidget
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
          case EditorWidgetType.StrokeEditor:
            return (
              <StrokeEditorWidget
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
          case EditorWidgetType.GifSelector:
            return (
              <GifSelectorWidget
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
          case EditorWidgetType.ScrollableBackground:
            return (
              <ScrollableBackgroundWidget
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
