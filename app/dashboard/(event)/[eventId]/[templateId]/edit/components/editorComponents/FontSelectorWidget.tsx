import { FontPicker } from '@/components/ui/font-picker';
import {
  EditorWidgetType,
  PropertyDataType,
  PropertyEditorConfig,
} from '@/core/types';
import React, { useEffect } from 'react';

interface FontSelectorWidgetWidgetProps {
  config: PropertyEditorConfig;
  value: string | undefined;
  onChange: (newValue: string) => void;
}

const FontSelectorWidget = ({
  config,
  value,
  onChange,
}: FontSelectorWidgetWidgetProps) => {
  const [font, setFont] = React.useState<string>(value ?? 'inherit');

  useEffect(() => {
    if (value != undefined && value !== font) {
      setFont(value);
    }
  }, [value, font]);

  if (
    config.widgetType !== EditorWidgetType.FontFamily ||
    config.dataType !== PropertyDataType.String
  ) {
    console.error('Configurație invalidă pentru FontSelectorWidget:', config);
    return <div>Eroare: Widget incompatibil</div>;
  }
  return (
    <div className="mb-[10px]">
      <label
        style={{
          display: 'block',
          marginBottom: '5px',
          fontWeight: 'bold',
          fontSize: '14px',
          color: '#333',
        }}
      >
        {config.label}:
      </label>
      <FontPicker
        width={160}
        className="border-[#cccccc]"
        onChange={(font) => {
          setFont(font);
          onChange(font);
        }}
        value={font}
      />
    </div>
  );
};

export default FontSelectorWidget;
