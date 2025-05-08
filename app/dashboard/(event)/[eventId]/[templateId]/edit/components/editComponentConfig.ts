import {
  EditorConfigSet,
  EditorWidgetType,
  PropertyDataType,
} from '@/core/types';

export const componentsConfig: { [elementType: string]: EditorConfigSet } = {
  section: {
    name: {
      label: 'Nume Secțiune',
      dataType: PropertyDataType.String,
      widgetType: EditorWidgetType.TextInput,
    },
    'style.height': {
      label: 'Înălțime Secțiune (px)',
      dataType: PropertyDataType.Number,
      widgetType: EditorWidgetType.NumberInput,
      min: 0,
      step: 1,
    },
    'style.backgroundColor': {
      label: 'Culoare Fundal',
      dataType: PropertyDataType.Color,
      widgetType: EditorWidgetType.ColorPicker,
    },
  },
  text: {
    name: {
      label: 'Nume Element',
      dataType: PropertyDataType.String,
      widgetType: EditorWidgetType.TextInput,
    },
    content: {
      label: 'Introdu textul',
      dataType: PropertyDataType.String,
      widgetType: EditorWidgetType.TextInput,
    },
    'style.fontSize': {
      label: 'Dimensiune text',
      dataType: PropertyDataType.Number,
      widgetType: EditorWidgetType.NumberInput,
    },
    'style.color': {
      label: 'Culoare text',
      dataType: PropertyDataType.Color,
      widgetType: EditorWidgetType.ColorPicker,
    },
    position: {
      label: 'Poziție Element (%)',
      dataType: PropertyDataType.Object,
      widgetType: EditorWidgetType.PositionInput,
      min: 0,
      max: 100,
      step: 1,
    },
  },
};
