import React from 'react';
import {
  PropertyEditorConfig,
  EditorWidgetType,
  PropertyDataType,
} from '@/core/types';

interface InputEditorWidgetProps {
  config: PropertyEditorConfig;
  value: string | undefined | null;
  onChange: (newValue: string) => void;
}

const InputEditorWidget: React.FC<InputEditorWidgetProps> = ({
  config,
  value,
  onChange,
}) => {
  if (
    config.widgetType !== EditorWidgetType.TextInput ||
    config.dataType !== PropertyDataType.String
  ) {
    console.error('Configurație invalidă pentru InputEditorWidget:', config);
    return <div>Eroare: Widget incompatibil</div>;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const stringValue = event.target.value;
    onChange(stringValue);
  };

  const displayValue = value === undefined || value === null ? '' : value;

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
      <input
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box',
          fontSize: '14px',
        }}
      />
    </div>
  );
};

export default InputEditorWidget;
