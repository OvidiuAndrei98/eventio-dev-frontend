import React from 'react';
import {
  PropertyEditorConfig,
  EditorWidgetType,
  PropertyDataType,
} from '@/core/types';

interface TextareaEditorElementProps {
  config: PropertyEditorConfig;
  value: string | undefined | null;
  onChange: (newValue: string) => void;
}

const TextareaEditorElement: React.FC<TextareaEditorElementProps> = ({
  config,
  value,
  onChange,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const stringValue = event.target.value;
    onChange(stringValue);
  };

  const displayValue = value === undefined || value === null ? '' : value;

  if (
    config.widgetType !== EditorWidgetType.TextArea ||
    config.dataType !== PropertyDataType.String
  ) {
    console.error(
      'Configurație invalidă pentru TextareaEditorElement:',
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
      <textarea
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

export default TextareaEditorElement;
