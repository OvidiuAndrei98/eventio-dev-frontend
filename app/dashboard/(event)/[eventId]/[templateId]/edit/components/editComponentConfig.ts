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
};
