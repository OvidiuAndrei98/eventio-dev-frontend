// editor/widgets/PositionEditorWidget.tsx (MODIFICAT: Auto on blur, Raw on focus)
import React, { useState, useEffect, useMemo } from 'react';
import {
  PropertyEditorConfig,
  EditorWidgetType,
  PropertyDataType,
} from '@/core/types';

interface PositionValue {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

interface PositionEditorWidgetProps {
  config: PropertyEditorConfig;
  value: PositionValue | undefined | null;
  onChange: (newValue: PositionValue) => void;
}

const MIN_PERCENT = 0;
const MAX_PERCENT = 100;
const DEFAULT_STEP = 0.1; // Still use step in config, even if not used by buttons

// Helper to map a data number (or undefined/null) to the internal string representation ("" for auto)
const dataValueToString = (val: number | undefined | null): string => {
  return val === undefined || val === null || val === 0 ? '' : val.toString();
};

/**
 * Widget editor for position (position: { top?, right?, bottom?, left? })
 * with direct numeric input for each side.
 * UI has 4 inputs arranged directionally.
 * **Behavior:**
 * - Input displays raw number while focused.
 * - Input displays "auto" when not focused IF the data value is undefined, null, or 0.
 * - Typing 0 or clearing input sets the property to undefined (ignored by CSS) on BLUR.
 * - Typing a non-zero number sets the property to that number on BLUR.
 * - Invalid input on BLUR resets to "auto" (undefined data).
 */
const PositionEditorWidget: React.FC<PositionEditorWidgetProps> = ({
  config,
  value,
  onChange,
}) => {
  if (
    config.widgetType !== EditorWidgetType.PositionInput ||
    config.dataType !== PropertyDataType.Object
  ) {
    console.error('Configurație invalidă pentru PositionEditorWidget:', config);
    return <div>Eroare: Widget incompatibil</div>;
  }

  const safeValue = value || {};

  // Internal state for the RAW STRING values currently in the input fields.
  const [top, setTop] = useState<string>(dataValueToString(safeValue.top));
  const [right, setRight] = useState<string>(
    dataValueToString(safeValue.right)
  );
  const [bottom, setBottom] = useState<string>(
    dataValueToString(safeValue.bottom)
  );
  const [left, setLeft] = useState<string>(dataValueToString(safeValue.left));

  // State to track which input is currently focused
  const [focusedInput, setFocusedInput] = useState<keyof PositionValue | null>(
    null
  );

  // Sync internal state when the parent's 'value' prop changes, BUT NOT WHILE AN INPUT IS FOCUSED
  useEffect(() => {
    if (focusedInput === null) {
      // Only sync from parent if no input in THIS widget is focused
      setTop(dataValueToString(safeValue.top));
      setRight(dataValueToString(safeValue.right));
      setBottom(dataValueToString(safeValue.bottom));
      setLeft(dataValueToString(safeValue.left));
    }
    // If focusedInput is not null, the internal state is controlled by typing,
    // and will be synced to the data model on blur.
  }, [
    safeValue.top,
    safeValue.right,
    safeValue.bottom,
    safeValue.left,
    focusedInput,
  ]); // Add focusedInput as dependency

  const min = config.min !== undefined ? config.min : MIN_PERCENT;
  const max = config.max !== undefined ? config.max : MAX_PERCENT;
  const step = config.step ?? 0.1;

  const clampValue = (val: number): number => {
    return Math.max(min, Math.min(max, val));
  };

  // Helper to handle input changes (updates internal string state, NOT data model)
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value); // Update internal string state immediately
      // Data model update happens on BLUR
    };

  // Helper to handle blur event (parses input, clamps, and updates data model via onChange)
  const handleBlur =
    (prop: keyof PositionValue, internalStringValue: string) => () => {
      setFocusedInput(null); // Clear focused state

      let newValue: PositionValue;
      const numberValue = parseFloat(internalStringValue);

      if (
        internalStringValue === '' ||
        internalStringValue === '0' ||
        isNaN(numberValue)
      ) {
        // <<< If empty, "0", or invalid number on blur
        // Set property to undefined in data model
        newValue = { ...safeValue };
        delete newValue[prop];
        // Also reset the internal string state to "" to display "auto" next render
        switch (prop) {
          case 'top':
            setTop('');
            break;
          case 'right':
            setRight('');
            break;
          case 'bottom':
            setBottom('');
            break;
          case 'left':
            setLeft('');
            break;
        }
      } else {
        // If valid non-zero number on blur
        const clampedValue = clampValue(numberValue);
        newValue = {
          ...safeValue,
          [prop]: clampedValue, // Set property to the clamped number
        };
        // Ensure internal string state matches the clamped value for consistency
        switch (prop) {
          case 'top':
            setTop(clampedValue.toString());
            break;
          case 'right':
            setRight(clampedValue.toString());
            break;
          case 'bottom':
            setBottom(clampedValue.toString());
            break;
          case 'left':
            setLeft(clampedValue.toString());
            break;
        }
      }

      // Call onChange with the new position object
      onChange(newValue);
    };

  // Helper to handle focus event
  const handleFocus = (prop: keyof PositionValue) => () => {
    setFocusedInput(prop); // Set focused state
    // When focused, the input value will be the raw internal string state.
    // If the internal state was "" (displaying "auto"), it will show "".
  };

  // Derived display value for the input fields based on internal state and focus
  // Displays "auto" when NOT focused AND internal state is ""
  const getDisplayValue = (
    prop: keyof PositionValue,
    internalStringValue: string
  ): string => {
    // While focused, always display the raw internal string
    if (focusedInput === prop) {
      return internalStringValue;
    }
    // When not focused, display "auto" if the internal string is empty, otherwise display the string
    return internalStringValue === '' ? 'auto' : internalStringValue;
  };

  // Get the correct internal state setter based on the property name
  const getSetter = (
    prop: keyof PositionValue
  ): React.Dispatch<React.SetStateAction<string>> => {
    switch (prop) {
      case 'top':
        return setTop;
      case 'right':
        return setRight;
      case 'bottom':
        return setBottom;
      case 'left':
        return setLeft;
      default:
        return setTop; // Should not happen
    }
  };

  // Get the current internal string state based on the property name
  const getInternalStringValue = (prop: keyof PositionValue): string => {
    switch (prop) {
      case 'top':
        return top;
      case 'right':
        return right;
      case 'bottom':
        return bottom;
      case 'left':
        return left;
      default:
        return ''; // Should not happen
    }
  };

  // >>> STILURI <<< (remains the same)
  const gridContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gridTemplateRows: '1fr auto 1fr',
    gap: '5px',
    alignItems: 'center',
    justifyItems: 'center',
    margin: '10px auto',
  };

  const inputGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '35px',
  };

  const inputStyle: React.CSSProperties = {
    width: '50px',
    padding: '4px 3px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '11px',
    textAlign: 'center',
    WebkitAppearance: 'none',
    MozAppearance: 'textfield',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '9px',
    fontWeight: 'bold',
    color: '#555',
    marginBottom: '1px',
  };

  const centerBoxStyle: React.CSSProperties = {
    gridRow: '2 / 3',
    gridColumn: '2 / 3',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#555',
    minWidth: '50px',
    minHeight: '50px',
    borderRadius: '4px',
  };

  return (
    <div>
      <label
        style={{
          display: 'block',
          marginBottom: '10px',
          fontWeight: 'bold',
          fontSize: '14px',
          color: '#333',
        }}
      >
        {config.label}:
      </label>

      <div style={gridContainerStyle}>
        {/* Top Input */}
        <div
          style={{ ...inputGroupStyle, gridRow: '1 / 2', gridColumn: '2 / 3' }}
        >
          {/* Top-Middle */}
          <label style={labelStyle}>Top (%)</label>
          <input
            type="text" // Use type="text"
            value={getDisplayValue('top', top)} // Use the derived display value based on internal state and focus
            onChange={handleInputChange(setTop)} // Update internal state on change
            onBlur={handleBlur('top', top)} // Update data model on blur
            onFocus={handleFocus('top')} // Handle focus gain
            style={inputStyle}
            title="Poziție de la margine Superioară (%) (Lasă gol pentru auto)" // Update tooltip
          />
        </div>

        {/* Left Input */}
        <div
          style={{ ...inputGroupStyle, gridRow: '2 / 3', gridColumn: '1 / 2' }}
        >
          {/* Middle-Left */}
          <label style={labelStyle}>Left (%)</label>
          <input
            type="text" // Use type="text"
            value={getDisplayValue('left', left)}
            onChange={handleInputChange(setLeft)}
            onBlur={handleBlur('left', left)}
            onFocus={handleFocus('left')}
            style={inputStyle}
            title="Poziție de la margine Stângă (%) (Lasă gol pentru auto)" // Update tooltip
          />
        </div>

        {/* Center Placeholder */}
        <div style={centerBoxStyle}>Poziție</div>

        {/* Right Input */}
        <div
          style={{ ...inputGroupStyle, gridRow: '2 / 3', gridColumn: '3 / 4' }}
        >
          {/* Middle-Right */}
          <label style={labelStyle}>Right (%)</label>
          <input
            type="text" // Use type="text"
            value={getDisplayValue('right', right)}
            onChange={handleInputChange(setRight)}
            onBlur={handleBlur('right', right)}
            onFocus={handleFocus('right')}
            style={inputStyle}
            title="Poziție de la margine Dreaptă (%) (Lasă gol pentru auto)" // Update tooltip
          />
        </div>

        {/* Bottom Input */}
        <div
          style={{ ...inputGroupStyle, gridRow: '3 / 4', gridColumn: '2 / 3' }}
        >
          {/* Bottom-Middle */}
          <label style={labelStyle}>Bottom (%)</label>
          <input
            type="text" // Use type="text"
            value={getDisplayValue('bottom', bottom)}
            onChange={handleInputChange(setBottom)}
            onBlur={handleBlur('bottom', bottom)}
            onFocus={handleFocus('bottom')}
            style={inputStyle}
            title="Poziție de la margine Inferioară (%) (Lasă gol pentru auto)" // Update tooltip
          />
        </div>
      </div>
    </div>
  );
};

export default PositionEditorWidget;
