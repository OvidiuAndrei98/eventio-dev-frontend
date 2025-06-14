import React from 'react';
import {
  PropertyEditorConfig,
  EditorWidgetType,
  PropertyDataType,
} from '@/core/types';
import { Checkbox } from 'antd';

interface ScrollableBackgroundWidgetProps {
  /** Configurația specifică a proprietății pentru acest widget. */
  config: PropertyEditorConfig;
  /** Valoarea curentă a culorii (string, ex: '#RRGGBB', 'rgba(...)', 'red'). Poate fi undefined sau null. */
  value: string | undefined | null;
  /** Callback apelat când culoarea se schimbă. Noua culoare (de obicei #RRGGBB) este pasată ca string. */
  onChange: (newValue: string) => void;
}

/**
 * Widget editor pentru a porni backgorund ul animat.
 */
const ScrollableBackgroundWidget: React.FC<ScrollableBackgroundWidgetProps> = ({
  config,
  value,
  onChange,
}) => {
  if (
    config.widgetType !== EditorWidgetType.ScrollableBackground ||
    config.dataType !== PropertyDataType.String
  ) {
    console.error(
      'Configurație invalidă pentru ScrollableBackgroundWidget:',
      config
    );
    return <div>Eroare: Widget incompatibil</div>;
  }

  return (
    <div style={{ marginBottom: '10px' }}>
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
      <Checkbox
        style={{ marginBottom: '10px' }}
        checked={value === 'fixed'}
        onChange={(e) => {
          if (e.target.checked) {
            onChange('fixed');
          } else {
            onChange('scroll');
          }
        }}
      />
    </div>
  );
};

export default ScrollableBackgroundWidget;
