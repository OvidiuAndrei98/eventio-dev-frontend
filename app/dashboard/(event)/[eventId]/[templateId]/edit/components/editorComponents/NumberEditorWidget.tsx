// editor/widgets/NumberEditorWidget.tsx
import React from 'react';
import {
  PropertyEditorConfig,
  EditorWidgetType,
  PropertyDataType,
} from '@/core/types'; // Ajustează calea de import

interface NumberEditorWidgetProps {
  /** Configurația specifică a proprietății pentru acest widget. */
  config: PropertyEditorConfig;
  /** Valoarea curentă a proprietății din datele invitației. */
  value: number | undefined | null; // Acceptă și undefined/null dacă proprietatea lipsește inițial
  /** Callback apelat când valoarea se schimbă. */
  onChange: (newValue: number | undefined | null) => void;
}

/**
 * Widget editor pentru input numeric bazat pe PropertyEditorConfig.
 * Renderază o etichetă și un input de tip number.
 */
const NumberEditorWidget: React.FC<NumberEditorWidgetProps> = ({
  config,
  value,
  onChange,
}) => {
  // Verificare simplă a compatibilității configurației
  if (
    config.widgetType !== EditorWidgetType.NumberInput ||
    config.dataType !== PropertyDataType.Number
  ) {
    console.error('Configurație invalidă pentru NumberEditorWidget:', config);
    // Afisează un mesaj de eroare sau o componentă fallback
    return <div>Eroare: Widget incompatibil</div>;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const stringValue = event.target.value;

    if (stringValue === '') {
      // Dacă input-ul este gol, considerăm valoarea ca undefined/null (depinde cum vrei să o stochezi)
      // Undefined sau null ar putea însemna "folosește valoarea default" sau "proprietatea lipsește"
      onChange(undefined); // sau null, depinde de modelul tau de date
    } else {
      // Convertim string-ul la un număr. parseFloat permite numere cu zecimale.
      const numberValue = parseFloat(stringValue);

      // Verificăm dacă conversia a fost reușită (nu este NaN - Not a Number)
      if (!isNaN(numberValue)) {
        // Apelăm callback-ul onChange cu noua valoare numerică
        onChange(numberValue);
      }
      // Nu facem nimic dacă input-ul conține text ne-numeric (browserul deja restricționează intr-un input type="number",
      // dar aceasta este o siguranță suplimentară)
    }
  };

  // Manageriem afișarea valorii în input: afișăm '' pentru undefined/null
  const displayValue =
    value === undefined || value === null || isNaN(value) ? '' : value;

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
        {config.label}: {/* Folosim eticheta din config */}
      </label>
      <input
        type="number" // Tipul input-ului
        value={displayValue} // Valoarea afișată
        onChange={handleInputChange} // Handler-ul pentru schimbare
        // Setăm atributele min, max, step dacă sunt definite în config
        min={config.min}
        step={config.step}
        style={{
          width: '100%', // Ocupă lățimea disponibilă în containerul său
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box', // Include padding și border în lățimea totală
          fontSize: '14px', // Mărimea fontului pentru input
        }}
      />
      {/* Dacă proprietatea are unități (ex: % pentru poziție/mărime),
          eticheta deja arată asta (ex: "Poziție Orizontală (%)").
          Pentru widget-ul UnitInput, ar trebui să adaugi aici un dropdown separat pentru unitate. */}
    </div>
  );
};

export default NumberEditorWidget;
