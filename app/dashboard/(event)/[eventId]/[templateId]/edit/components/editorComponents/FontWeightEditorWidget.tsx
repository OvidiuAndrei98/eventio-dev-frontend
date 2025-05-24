import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  EditorWidgetType,
  PropertyDataType,
  PropertyEditorConfig,
} from '@/core/types';
import React from 'react';

interface FontWeightEditorWidgetProps {
  config: PropertyEditorConfig;
  value: string | undefined;
  onChange: (newValue: string) => void;
}

const FontWeightEditorWidget = ({
  config,
  value,
  onChange,
}: FontWeightEditorWidgetProps) => {
  if (
    config.widgetType !== EditorWidgetType.FontWeight ||
    config.dataType !== PropertyDataType.String
  ) {
    console.error(
      'Configurație invalidă pentru FontWeightEditorWidget:',
      config
    );
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
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full border-[#ccc]">
          <SelectValue placeholder="Grosime text" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="300">Subtire</SelectItem>
            <SelectItem value="500">Normal</SelectItem>
            <SelectItem value="700">Bold</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FontWeightEditorWidget;
