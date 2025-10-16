import {
  EditorWidgetType,
  PropertyDataType,
  PropertyEditorConfig,
} from '@/core/types';
import { ColorPicker, ColorPickerProps, GetProp, InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';

type Color = GetProp<ColorPickerProps, 'value'>;

interface StrokeEditorWidgetProps {
  config: PropertyEditorConfig;
  value: string | undefined; // e.g. "2 #ff0000"
  onChange: (newValue: string) => void;
}

// Helper to parse unified string value (e.g. "2 #ff0000")
function parseStrokeValue(value: string | undefined) {
  if (!value) return { width: 0, color: '#000000' };
  // Expecting width first, then color, separated by a space, e.g. "2 #ff0000"
  const match = value.match(/^(\d+)\s+(#[0-9a-fA-F]{6})$/);
  if (match) {
    return {
      width: Number(match[1]),
      color: match[2],
    };
  }
  // fallback
  return { width: 2, color: '#000000' };
}

// Helper to unify width and color into a string with a space
function unifyStrokeValue(width: number, color: string) {
  return `${width} ${color}`;
}

const StrokeEditorWidget = ({
  config,
  value,
  onChange,
}: StrokeEditorWidgetProps) => {
  const { width, color } = parseStrokeValue(value);

  const [strokeWidth, setStrokeWidth] = useState<number>(width);
  const [strokeColor, setStrokeColor] = useState<string>(color);

  // Keep local state in sync with prop changes
  useEffect(() => {
    setStrokeWidth(width);
    setStrokeColor(color);
  }, [width, color]);

  const handleColorChange = (colorValue: Color) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hex = (colorValue as any).toHexString();
    setStrokeColor(hex);
    onChange(unifyStrokeValue(strokeWidth, hex));
  };

  const handleWidthChange = (num: number | null) => {
    const widthValue = num ?? 0; // Default to 0 if null
    setStrokeWidth(widthValue);
    onChange(unifyStrokeValue(widthValue, strokeColor));
  };

  if (
    config.widgetType !== EditorWidgetType.StrokeEditor ||
    config.dataType !== PropertyDataType.String
  ) {
    console.error('Configurație invalidă pentru StrokeEditorWidget:', config);
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
      <div className="flex gap-2 items-center">
        <InputNumber
          min={config.min ?? 0}
          max={20}
          value={strokeWidth}
          onChange={handleWidthChange}
          style={{ width: 60 }}
          size="small"
          className="border-[#cccccc] justify-start"
        />
        <ColorPicker
          format="hex"
          size="small"
          value={strokeColor}
          onChange={handleColorChange}
          showText
          className="justify-start"
          style={{ width: 120 }}
          getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
        />
      </div>
    </div>
  );
};

export default StrokeEditorWidget;
