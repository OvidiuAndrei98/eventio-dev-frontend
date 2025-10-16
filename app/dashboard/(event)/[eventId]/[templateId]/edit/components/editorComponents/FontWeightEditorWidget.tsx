import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  EditorWidgetType,
  PropertyDataType,
  PropertyEditorConfig,
} from '@/core/types';
import React, { useEffect } from 'react';

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
  const [fontWeight, setFontWeight] = React.useState<string | undefined>(value);

  useEffect(() => {
    if (value != undefined && value !== fontWeight) {
      setFontWeight(value);
    }
  }, [value, fontWeight]);

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
    <div className="mb-[10px] z-99999">
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
      <Select value={fontWeight} onValueChange={onChange}>
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
