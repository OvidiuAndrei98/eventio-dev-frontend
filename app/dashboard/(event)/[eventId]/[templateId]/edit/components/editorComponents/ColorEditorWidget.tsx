import React from 'react';
import {
  PropertyEditorConfig,
  EditorWidgetType,
  PropertyDataType,
} from '@/core/types';
import { ColorPicker, ColorPickerProps, GetProp } from 'antd';

interface ColorEditorWidgetProps {
  /** Configurația specifică a proprietății pentru acest widget. */
  config: PropertyEditorConfig;
  /** Valoarea curentă a culorii (string, ex: '#RRGGBB', 'rgba(...)', 'red'). Poate fi undefined sau null. */
  value: string | undefined | null;
  /** Callback apelat când culoarea se schimbă. Noua culoare (de obicei #RRGGBB) este pasată ca string. */
  onChange: (newValue: string) => void;
}

type Color = GetProp<ColorPickerProps, 'value'>;

/**
 * Widget editor pentru selectarea culorii bazat pe PropertyEditorConfig.
 * Utilizează input HTML basic type="color".
 * Notă: Input-ul HTML type="color" suportă doar formatul HEX (#RRGGBB).
 * Dacă folosești culori RGBA sau nume de culori (ex: 'red') în datele tale,
 * vei avea nevoie de o librărie de color picker mai avansată.
 */
const ColorEditorWidget: React.FC<ColorEditorWidgetProps> = ({
  config,
  value,
  onChange,
}) => {
  if (
    config.widgetType !== EditorWidgetType.ColorPicker ||
    config.dataType !== PropertyDataType.Color
  ) {
    console.error('Configurație invalidă pentru ColorEditorWidget:', config);
    return <div>Eroare: Widget incompatibil</div>;
  }

  const handleInputChange = (color: Color) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange((color as any).toHexString());
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <ColorPicker
        format="hex"
        value={value}
        onChange={handleInputChange}
        showText
        className="w-full justify-start"
      />
    </div>
  );
};

export default ColorEditorWidget;
