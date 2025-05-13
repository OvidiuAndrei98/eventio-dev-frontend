import React from 'react';
import {
  PropertyEditorConfig,
  EditorWidgetType,
  PropertyDataType,
} from '@/core/types';

interface InputEditorWidgetProps {
  /** Configurația specifică a proprietății pentru acest widget. */
  config: PropertyEditorConfig;
  /** Valoarea curentă a proprietății (string). Poate fi undefined sau null dacă nu este setată. */
  value: string | undefined | null;
  /** Callback apelat când valoarea se schimbă. Noul text este pasat ca string. */
  onChange: (newValue: string) => void;
}

/**
 * Widget editor pentru input text simplu bazat pe PropertyEditorConfig.
 * Renderază o etichetă și un input de tip text.
 */
const InputEditorWidget: React.FC<InputEditorWidgetProps> = ({
  config,
  value,
  onChange,
}) => {
  // Verificăm dacă configurația este potrivită pentru acest widget
  if (
    config.widgetType !== EditorWidgetType.TextInput ||
    config.dataType !== PropertyDataType.String
  ) {
    console.error('Configurație invalidă pentru InputEditorWidget:', config);
    // Renderizăm un mesaj de eroare sau o componentă fallback dacă configurația nu este validă
    return <div>Eroare: Widget incompatibil</div>;
  }

  // Handler pentru evenimentul de schimbare a input-ului
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const stringValue = event.target.value;
    // Apelăm callback-ul onChange cu noua valoare din input
    onChange(stringValue);
  };

  // Controlăm valoarea afișată în input. Afișăm un string gol dacă valoarea este undefined sau null.
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
        {config.label}: {/* Afișează eticheta proprietății din config */}
      </label>
      <input
        type="text" // Specificăm tipul input-ului ca text
        value={displayValue} // Legăm valoarea input-ului de prop-ul 'value'
        onChange={handleInputChange} // Legăm handler-ul de evenimentul onChange
        // Proprietățile specifice altor widget-uri (min, max, step, options, unitOptions) nu se aplică aici și nu sunt pasate
        style={{
          width: '100%', // Input-ul ocupă toată lățimea disponibilă în containerul său
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box', // Include padding și border în lățimea totală a elementului
          fontSize: '14px', // Setează mărimea fontului pentru o lizibilitate mai bună în input
        }}
      />
    </div>
  );
};

export default InputEditorWidget;
