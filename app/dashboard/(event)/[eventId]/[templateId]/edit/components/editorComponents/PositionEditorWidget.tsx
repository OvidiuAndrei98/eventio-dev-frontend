import React, { useState, useEffect, useMemo, useRef } from 'react';

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
const DEBOUNCE_DELAY = 500; // Manual debounce duration

// Helper to map a data value (number, undefined, null, 0) to the internal string representation ("" for auto display)
const dataValueToInternalString = (val: number | undefined | null): string => {
  return val === undefined || val === null || val === 0 ? '' : val.toString();
};

// Helper to map an internal string ("" or numeric string) to the value for data (undefined or number)
const internalStringToDataValue = (
  str: string,
  min: number,
  max: number
): number | undefined => {
  if (str === '' || str === '0') {
    return undefined;
  }
  const num = parseFloat(str);
  if (isNaN(num)) {
    return undefined; // Invalid input maps to undefined data
  }
  return Math.max(min, Math.min(max, num)); // Clamp valid numbers
};

const PositionEditorWidget: React.FC<PositionEditorWidgetProps> = ({
  config,
  value,
  onChange,
}) => {
  if (
    config.widgetType !== EditorWidgetType.PositionInput ||
    config.dataType !== PropertyDataType.Object
  ) {
    console.error('Invalid config for PositionEditorWidget:', config); // Translated console log
    return <div>Error: Incompatible Widget</div>; // Translated error message
  }

  // Ensure a safe starting object for data
  // useMemo helps stabilize the safeValue reference if only internal properties change
  const safeValue = useMemo(() => value || {}, [value]);

  // Internal state for the RAW STRING values currently in the input fields.
  const [top, setTop] = useState<string>(
    dataValueToInternalString(safeValue.top)
  );
  const [right, setRight] = useState<string>(
    dataValueToInternalString(safeValue.right)
  );
  const [bottom, setBottom] = useState<string>(
    dataValueToInternalString(safeValue.bottom)
  );
  const [left, setLeft] = useState<string>(
    dataValueToInternalString(safeValue.left)
  );

  // Refs to store debounce timer IDs for each input
  const topTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rightTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bottomTimerRef = useRef<NodeJS.Timeout | null>(null);
  const leftTimerRef = useRef<NodeJS.Timeout | null>(null);

  // State to track which input is focused (for display logic)
  const [focusedInput, setFocusedInput] = useState<keyof PositionValue | null>(
    null
  );

  // Ref to prevent triggering onChange on initial render (if needed inside timer callbacks)
  // It's better to rely on safeValue comparison to prevent initial calls.

  const min = config.min !== undefined ? config.min : MIN_PERCENT;
  const max = config.max !== undefined ? config.max : MAX_PERCENT;

  // Helper function to get the latest internal string value (needed inside timer callbacks)
  // Use a reference to the current state
  const latestStateRef = useRef<{
    top: string;
    right: string;
    bottom: string;
    left: string;
  }>({ top: '', right: '', bottom: '', left: '' });

  // Effect to keep latestStateRef updated with the latest state values
  useEffect(() => {
    latestStateRef.current = { top, right, bottom, left };
  }, [top, right, bottom, left]); // Update every time an internal state changes

  // This effect runs on mount, when 'safeValue' changes (selecting another element), and on unmount.
  useEffect(() => {
    console.log('[PositionWidget Sync/Cleanup Effect] Running...', {
      safeValue,
      focusedInput,
    }); // Log runs

    // --- WHEN safeValue CHANGES OR ON UNMOUNT: CLEAR ALL PENDING TIMERS ---
    // This prevents a timer from the old element from triggering after a new element is selected.
    clearTimeout(topTimerRef.current as NodeJS.Timeout | undefined);
    clearTimeout(rightTimerRef.current as NodeJS.Timeout | undefined);
    clearTimeout(bottomTimerRef.current as NodeJS.Timeout | undefined);
    clearTimeout(leftTimerRef.current as NodeJS.Timeout | undefined);

    // This synchronization happens whenever the selected element changes (value/safeValue)
    // Regardless of whether the input was focused or not.
    console.log(
      '[PositionWidget Sync/Cleanup Effect] Syncing internal state from parent value:',
      safeValue
    );
    setTop(dataValueToInternalString(safeValue.top));
    setRight(dataValueToInternalString(safeValue.right));
    setBottom(dataValueToInternalString(safeValue.bottom));
    setLeft(dataValueToInternalString(safeValue.left));

    // Reset focus state and timer refs to null when the element changes
    setFocusedInput(null);
    topTimerRef.current = null;
    rightTimerRef.current = null;
    bottomTimerRef.current = null;
    leftTimerRef.current = null;

    // The cleanup function returned runs on unmount OR before the effect runs again (on safeValue change)
    // We ensure timers are cleared before the effect re-executes as well.
    return () => {
      clearTimeout(topTimerRef.current as NodeJS.Timeout | undefined);
      clearTimeout(rightTimerRef.current as NodeJS.Timeout | undefined);
      clearTimeout(bottomTimerRef.current as NodeJS.Timeout | undefined);
      clearTimeout(leftTimerRef.current as NodeJS.Timeout | undefined);
    };
  }, [safeValue]); // Dependency on safeValue. This effect runs when the selected element changes.

  // Helper to get the value that should be DISPLAYED in the input.
  const getDisplayValue = (internalStringValue: string): string => {
    return internalStringValue === '' ? 'auto' : internalStringValue;
  };

  // Helper to handle input changes (updates internal state AND starts/resets the debounce timer)
  const handleInputChangeAndDebounce =
    (
      prop: keyof PositionValue,
      setter: React.Dispatch<React.SetStateAction<string>>,
      timerRef: React.MutableRefObject<NodeJS.Timeout | null>
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const stringValue = event.target.value;
      setter(stringValue); // Update internal string state immediately

      // --- CLEAR THE OLD TIMER ---
      clearTimeout(timerRef.current as NodeJS.Timeout | undefined);

      // Create the callback inside the handler to capture stringValue and other relevant values
      // But to build the complete newPosition, we need *all* four internal strings *at the moment the timer fires*.
      // We use latestStateRef for that.
      timerRef.current = setTimeout(() => {
        console.log(
          `[PositionWidget Debounce Timeout] Timer fired for ${prop}. Processing value: "${stringValue}"`
        ); // Log timer fire

        // Logic to parse, validate, build newPosition, and call onChange
        // Get the most recent internal strings from latestStateRef
        const {
          top: latestTop,
          right: latestRight,
          bottom: latestBottom,
          left: latestLeft,
        } = latestStateRef.current;

        const newPosition: PositionValue = {};
        // Convert each string (from the latest ones) to the value for data
        const newDataTop = internalStringToDataValue(latestTop, min, max);
        if (newDataTop !== undefined) newPosition.top = newDataTop;
        const newDataRight = internalStringToDataValue(latestRight, min, max);
        if (newDataRight !== undefined) newPosition.right = newDataRight;
        const newDataBottom = internalStringToDataValue(latestBottom, min, max);
        if (newDataBottom !== undefined) newPosition.bottom = newDataBottom;
        const newDataLeft = internalStringToDataValue(latestLeft, min, max);
        if (newDataLeft !== undefined) newPosition.left = newDataLeft;

        // Compare the calculated new object with the current parent prop value (safeValue)
        // This prevents calling onChange if, for example, the user types 10, then deletes 0, then re-types 0.
        // Or if safeValue has updated in the meantime for another reason (e.g., another breakpoint).
        const currentJson = JSON.stringify(safeValue);
        const newJson = JSON.stringify(newPosition);

        // Call onChange ONLY if the data is different
        if (currentJson !== newJson) {
          onChange(newPosition);
        } else {
        }

        // Clear the timer ref after it has fired
        timerRef.current = null;
      }, DEBOUNCE_DELAY); // Debounce delay
    };

  // Handler for the onFocus event (sets the focused state)
  const handleFocus = (prop: keyof PositionValue) => () => {
    setFocusedInput(prop); // Set focused state on the current input
    // Due to the binding "value={focusedInput === prop ? stringIntern : ...}",
    // the input will display the RAW internal string when focused.
  };

  // Handler for the onBlur event (clears the focused state and optionally executes debounce immediately)
  const handleBlur =
    (
      prop: keyof PositionValue,
      timerRef: React.MutableRefObject<NodeJS.Timeout | null>
    ) =>
    () => {
      console.log('[PositionWidget Blur] Input blurred:', prop); // Log blur

      // This provides immediate feedback on blur if the user has finished typing.
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        // Replicate the logic from the debounce callback
        const {
          top: latestTop,
          right: latestRight,
          bottom: latestBottom,
          left: latestLeft,
        } = latestStateRef.current; // Use the latest states

        const newPosition: PositionValue = {};
        const newDataTop = internalStringToDataValue(latestTop, min, max);
        if (newDataTop !== undefined) newPosition.top = newDataTop;
        const newDataRight = internalStringToDataValue(latestRight, min, max);
        if (newDataRight !== undefined) newPosition.right = newDataRight;
        const newDataBottom = internalStringToDataValue(latestBottom, min, max);
        if (newDataBottom !== undefined) newPosition.bottom = newDataBottom;
        const newDataLeft = internalStringToDataValue(latestLeft, min, max);
        if (newDataLeft !== undefined) newPosition.left = newDataLeft;

        const currentJson = JSON.stringify(safeValue);
        const newJson = JSON.stringify(newPosition);

        if (currentJson !== newJson) {
          onChange(newPosition);
        }

        // Clear the timer ref AFTER execution
        timerRef.current = null;
      } else {
        // If there was no pending timer (e.g., user didn't type, just clicked in and out),
        // perform immediate visual cleanup for invalid strings if any.
        const internalStringValue = getInternalStringValue(prop);
        const num = parseFloat(internalStringValue);
        if (internalStringValue !== '' && isNaN(num)) {
          const setter = getSetter(prop);
          setter('');
          // The debounce effect would have handled this anyway, but we do a quicker visual reset.
        }
      }

      setFocusedInput(null); // Clear focused state.
    };

  // Helper to get the correct internal state setter
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

  // Helper to get the current internal string value (used in handleBlur and timer callback replication)
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
        return '';
    }
  };

  // >>> STYLES <<< (Remain the same)
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
        <div
          style={{ ...inputGroupStyle, gridRow: '1 / 2', gridColumn: '2 / 3' }}
        >
          <label style={labelStyle}>Sus (%)</label>
          <input
            type="text"
            // BINDING: Display raw internal string WHEN FOCUSED, otherwise derived value ("auto" or number)
            value={focusedInput === 'top' ? top : getDisplayValue(top)}
            onChange={handleInputChangeAndDebounce('top', setTop, topTimerRef)}
            onBlur={handleBlur('top', topTimerRef)}
            onFocus={handleFocus('top')}
            style={inputStyle}
            title="Poziția față de marginea de sus (%) (Lăsați gol sau introduceți 0 pentru auto)"
          />
        </div>
        <div
          style={{ ...inputGroupStyle, gridRow: '2 / 3', gridColumn: '1 / 2' }}
        >
          <label style={labelStyle}>Stanga (%)</label>
          <input
            type="text"
            value={focusedInput === 'left' ? left : getDisplayValue(left)}
            onChange={handleInputChangeAndDebounce(
              'left',
              setLeft,
              leftTimerRef
            )}
            onBlur={handleBlur('left', leftTimerRef)}
            onFocus={handleFocus('left')}
            style={inputStyle}
            title="Poziția față de marginea din stanga (%) (Lăsați gol sau introduceți 0 pentru auto)"
          />
        </div>
        <div style={centerBoxStyle}>Pozitie</div>
        <div
          style={{ ...inputGroupStyle, gridRow: '2 / 3', gridColumn: '3 / 4' }}
        >
          <label style={labelStyle}>dreapta (%)</label>
          <input
            type="text"
            value={focusedInput === 'right' ? right : getDisplayValue(right)}
            onChange={handleInputChangeAndDebounce(
              'right',
              setRight,
              rightTimerRef
            )}
            onBlur={handleBlur('right', rightTimerRef)}
            onFocus={handleFocus('right')}
            style={inputStyle}
            title="Poziția față de marginea din dreapta (%) (Lăsați gol sau introduceți 0 pentru auto)"
          />
        </div>
        <div
          style={{ ...inputGroupStyle, gridRow: '3 / 4', gridColumn: '2 / 3' }}
        >
          <label style={labelStyle}>jos (%)</label>
          <input
            type="text"
            value={focusedInput === 'bottom' ? bottom : getDisplayValue(bottom)}
            onChange={handleInputChangeAndDebounce(
              'bottom',
              setBottom,
              bottomTimerRef
            )}
            onBlur={handleBlur('bottom', bottomTimerRef)}
            onFocus={handleFocus('bottom')}
            style={inputStyle}
            title="Poziția față de marginea de jos (%) (Lăsați gol sau introduceți 0 pentru auto)"
          />
        </div>
      </div>
    </div>
  );
};

export default PositionEditorWidget;
