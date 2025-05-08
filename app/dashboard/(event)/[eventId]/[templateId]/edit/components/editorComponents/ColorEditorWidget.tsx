// editor/widgets/ColorEditorWidget.tsx
import React from 'react';
// Importă tipurile de configurare a editorului. Ajustează calea de import dacă este necesar.
import {
  PropertyEditorConfig,
  EditorWidgetType,
  PropertyDataType,
} from '@/core/types';

interface ColorEditorWidgetProps {
  /** Configurația specifică a proprietății pentru acest widget. */
  config: PropertyEditorConfig;
  /** Valoarea curentă a culorii (string, ex: '#RRGGBB', 'rgba(...)', 'red'). Poate fi undefined sau null. */
  value: string | undefined | null;
  /** Callback apelat când culoarea se schimbă. Noua culoare (de obicei #RRGGBB) este pasată ca string. */
  onChange: (newValue: string) => void;
}

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
  // Verificăm dacă configurația este potrivită pentru acest widget
  if (
    config.widgetType !== EditorWidgetType.ColorPicker ||
    config.dataType !== PropertyDataType.Color
  ) {
    console.error('Configurație invalidă pentru ColorEditorWidget:', config);
    return <div>Eroare: Widget incompatibil</div>;
  }

  // Handler pentru evenimentul de schimbare a input-ului
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hexColor = event.target.value; // Input type="color" returneaza intotdeauna formatul HEX (#RRGGBB)
    onChange(hexColor); // Pasăm noua valoare HEX prin callback
  };

  // Manageriem valoarea afișată în input. Input-ul type="color" necesită un string HEX valid.
  // Dacă valoarea stocată (`value`) nu este un string HEX valid sau este undefined/null,
  // setăm o valoare HEX default (ex: negru #000000) pentru a evita erori în input.
  // Nota: Aceasta nu înseamnă că valoarea stocată trebuie să fie HEX, doar valoarea dată input-ului HTML.
  const isValueValidHex =
    value && typeof value === 'string' && value.match(/^#([0-9A-F]{3}){1,2}$/i);
  const displayValue = isValueValidHex ? value : '#000000'; // Folosim valoarea stocată dacă e HEX valid, altfel negru default

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
        type="color" // Specificăm tipul input-ului ca color picker
        value={displayValue} // Legăm valoarea input-ului (formatată ca HEX valid pentru afișare)
        onChange={handleInputChange} // Legăm handler-ul de evenimentul onChange
        style={{
          width: '40px', // O lățime potrivită pentru selector
          height: '30px',
          padding: '0', // Padding 0 pentru a maximiza zona de culoare
          border: 'none', // Fara bordura default
          borderRadius: '4px', // Colțuri rotunjite
          cursor: 'pointer', // Schimba cursorul pentru a indica interactivitatea
          backgroundColor: 'transparent', // Fundal transparent
          // Styling specific browser (poate necesita prefixe sau ::-webkit-color-swatch)
        }}
      />
      {/* Opțional: Afișează valoarea culorii (cea stocată original, nu doar HEX) alături */}
      <span style={{ marginLeft: '10px', fontSize: '14px', color: '#555' }}>
        {value}
      </span>

      {/* Într-un editor real, pentru mai mult control (ex: RGBA, palete custom),
          ai folosi o librărie de color picker dedicată din React. */}
    </div>
  );
};

export default ColorEditorWidget;
