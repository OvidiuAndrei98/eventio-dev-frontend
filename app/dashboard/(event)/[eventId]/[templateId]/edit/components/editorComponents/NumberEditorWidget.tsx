// editor/widgets/NumberEditorWidget.tsx
import React, { useState, useEffect } from 'react'; // No need for useRef for the debounced function with useDebouncedCallback
import { useDebouncedCallback } from 'use-debounce'; // <--- Import the hook

// Import types
import {
  PropertyEditorConfig,
  EditorWidgetType,
  PropertyDataType,
} from '@/core/types';

interface NumberEditorWidgetProps {
  /** Configurația specifică a proprietății pentru acest widget. */
  config: PropertyEditorConfig;
  version: number;
  value:
    | number
    | undefined
    | null /** Callback apelat când valoarea se schimbă (după debounce). */; // Prop from parent (source of truth)
  onChange: (
    newValue: number | undefined | null
  ) => void /** Optional: Delay-ul pentru debounce în milisecunde. */; // Parent's handler
  debounceDelay?: number; // Prop optional for delay // Add activeBreakpoint as prop for logging
  activeBreakpoint?: string;
}

/**
 * Widget editor for number input, using useDebouncedCallback for debounce.
 */
const NumberEditorWidget: React.FC<NumberEditorWidgetProps> = ({
  config,
  version,
  value, // Number value (or null/undefined) from parent
  onChange, // Parent's handler (updates global number state)
  debounceDelay = 300, // Default debounce delay
}) => {
  // Config validation
  if (
    config.widgetType !== EditorWidgetType.NumberInput ||
    config.dataType !== PropertyDataType.Number
  ) {
    console.error('Invalid config for NumberEditorWidget:', config);
    return <div>Error: Incompatible widget</div>;
  } // --- LOCAL STATE for the input value (controlled) --- // This state holds the local value for immediate responsiveness while global state update is debounced. // Managed as number | undefined.

  const [localValue, setLocalValue] = useState<number | undefined>(
    value === undefined ||
      value === null ||
      (typeof value === 'number' && isNaN(value as number))
      ? undefined // Convert undefined/null/NaN from prop to undefined for local state
      : value // Use valid number value from prop
  );

  // --- Use useDebouncedCallback hook ---
  // This hook handles the debouncing logic internally, returning a stable debounced function.
  const debouncedOnChange = useDebouncedCallback(
    // The callback to be debounced. This calls the parent's onChange handler.
    (newValue: number | undefined | null) => {
      onChange(newValue); // <-- Call the actual parent handler HERE
    },
    debounceDelay // The debounce delay
  ); // useDebouncedCallback manages its own dependencies (the callback and delay) and cleanup. // --- useEffect for syncing prop value to local state --- // This effect is essential to keep the local state (number | undefined) in sync // with the 'value' prop (number | undefined | null) received from the parent (the source of truth). // It runs when the 'value' prop changes.

  useEffect(() => {
    // Calculate the desired local state value (number | undefined) based on the prop value.
    const newValueForLocalState: number | undefined =
      value === undefined ||
      value === null ||
      (typeof value === 'number' && isNaN(value as number))
        ? undefined
        : value;

    // Sync local state DOAR if the new calculated value is different from the current state.
    // Use Object.is for robust comparison.
    if (!Object.is(localValue, newValueForLocalState)) {
      setLocalValue(newValueForLocalState); // Update local state (number | undefined)
    }

    // --- Cleanup function for this effect ---
    // This runs when the effect re-executes (when 'value' changes) or on unmount.
    // Note: This specific cleanup does NOT need to cancel the debounce timer,
    // as useDebouncedCallback handles its own cleanup internally.
    return () => {
      // Any cleanup specific to the *syncing process* goes here, but not debounce cancellation.
    }; // --- DEPENDENCIES FOR SYNC EFFECT --- // This effect depends STRICTLY on the 'value' prop. // useDebouncedCallback manages its own internal dependencies and cleanup, so it's not needed here.
  }, [value, version]); // DEPENDENCIES: ONLY 'value'. // handleInputChange - updates local state (number | undefined) and calls the debounced function

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const stringValue = event.target.value; // Value from input is ALWAYS a string

    // Convert stringValue from input to the desired format for local state AND for parent (number | undefined).
    let valueForStateAndParent: number | undefined;
    if (stringValue === '') {
      valueForStateAndParent = undefined; // Empty string from input maps to undefined
    } else {
      const parsedValue = parseFloat(stringValue);
      // If parsing fails, the result (NaN) becomes undefined. Otherwise, it's the parsed number.
      valueForStateAndParent = isNaN(parsedValue) ? undefined : parsedValue;
    }

    setLocalValue(valueForStateAndParent);

    debouncedOnChange(valueForStateAndParent); // Call the debounced function
  }; // --- displayValue: Convert local state (number | undefined) to string for the DOM input value prop --- // The 'value' prop of a controlled DOM input must be a string or number. undefined/null do not work directly. // We convert undefined to an empty string ('') to visually represent an empty input.

  const displayValue =
    localValue === undefined ||
    localValue === null ||
    (typeof localValue === 'number' && isNaN(localValue))
      ? ''
      : String(localValue);
  // Log the displayed value (displayValue) and the internal local state (localValue) for debugging

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
      <input // The input type is always 'number' for this widget
        type="number"
        value={displayValue} // Input is controlled by displayValue (string)
        onChange={handleInputChange} // Local handler // Apply specific attributes (min, max, step) from config
        min={config.min}
        step={config.step}
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

export default NumberEditorWidget;
// Make sure to export the correct component (NumberEditorWidget or TextInputEditorWidget)
