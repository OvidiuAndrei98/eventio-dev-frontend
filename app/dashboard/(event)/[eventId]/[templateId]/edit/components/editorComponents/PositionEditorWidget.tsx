/* eslint-disable */

import React, { useState, useEffect, useMemo, useRef } from 'react';

import {
  PropertyEditorConfig,
  EditorWidgetType,
  PropertyDataType,
  FlexiblePosition,
} from '@/core/types';
import { Radio, RadioChangeEvent } from 'antd';
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  DragOutlined,
} from '@ant-design/icons';

interface PositionEditorWidgetProps {
  config: PropertyEditorConfig;
  version: number;
  value: FlexiblePosition | undefined | null;
  onChange: (newValue: FlexiblePosition) => void;
}

const MIN_PERCENT = 0;
const MAX_PERCENT = 100;
const DEBOUNCE_DELAY = 500; // Manual debounce duration

// Helper to map a data value (number, undefined, null) to the internal string representation.
// '0' will now be displayed as '0'. Only undefined/null map to empty string.
const dataValueToInternalString = (val: number | undefined | null): string => {
  if (val === undefined || val === null) {
    return ''; // Undefined or null in data -> empty string in input
  }
  return val.toString(); // Numbers (including 0) -> their string representation
};

// Helper to map an internal string ("" or numeric string) to the value for data (undefined or number).
// Empty string maps to undefined. '0' (string) maps to 0 (number).
const internalStringToDataValue = (
  str: string,
  min: number,
  max: number
): number | undefined => {
  if (str === '') {
    return undefined; // Empty string in input -> undefined in data
  }
  const num = parseFloat(str);
  if (isNaN(num)) {
    return undefined; // Invalid input -> undefined in data
  }
  return Math.max(min, Math.min(max, num)); // Clamp valid numbers
};

const PositionEditorWidget: React.FC<PositionEditorWidgetProps> = ({
  config,
  version,
  value,
  onChange,
}) => {
  // Ensure a safe starting object for data
  const safeValue = useMemo<FlexiblePosition>(() => {
    return value && value.elementAlignment
      ? value
      : { elementAlignment: 'auto' };
  }, [value, version]);

  // Internal state for the RAW STRING values currently in the input fields.
  const [top, setTop] = useState<string>(
    dataValueToInternalString(safeValue.top)
  );

  const [left, setLeft] = useState<string>(
    dataValueToInternalString(safeValue.left)
  );
  const [bottom, setBottom] = useState<string>(
    dataValueToInternalString(safeValue.bottom)
  );

  const [right, setRight] = useState<string>(
    dataValueToInternalString(safeValue.right)
  );

  const [elementAlignment, setElementAlignment] = useState(
    safeValue.elementAlignment || 'auto'
  );

  // Refs to store debounce timer IDs for each input
  const topTimerRef = useRef<NodeJS.Timeout | null>(null);
  const leftTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bottomTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rightTimerRef = useRef<NodeJS.Timeout | null>(null);

  // State to track which input is focused (for display logic)
  const [focusedInput, setFocusedInput] = useState<
    keyof FlexiblePosition | null
  >(null);

  const min = config.min !== undefined ? config.min : MIN_PERCENT;
  const max = config.max !== undefined ? config.max : MAX_PERCENT;

  // Ref to hold the latest internal string values for use in callbacks
  const latestStateRef = useRef<{
    top: string;
    left: string;
    bottom: string;
    right: string;
  }>({ top: '', left: '', bottom: '', right: '' });

  // Effect to keep latestStateRef updated with the latest state values
  useEffect(() => {
    latestStateRef.current = { top, left, bottom, right };
  }, [top, left, bottom, right]); // Update every time an internal state changes

  // Synchronize internal state with parent `value` prop and clear timers on change
  useEffect(() => {
    // Clear all pending timers to prevent old data from triggering onChange for a new element
    clearTimeout(topTimerRef.current as NodeJS.Timeout | undefined);
    clearTimeout(leftTimerRef.current as NodeJS.Timeout | undefined);
    clearTimeout(bottomTimerRef.current as NodeJS.Timeout | undefined);
    clearTimeout(rightTimerRef.current as NodeJS.Timeout | undefined);

    // Synchronize internal input states with the parent's value
    const newTopStr = dataValueToInternalString(safeValue.top);
    const newLeftStr = dataValueToInternalString(safeValue.left);
    const newBottomStr = dataValueToInternalString(safeValue.bottom);
    const newRightStr = dataValueToInternalString(safeValue.right);

    setTop(newTopStr);
    setLeft(newLeftStr);
    setBottom(newBottomStr);
    setRight(newRightStr);
    setElementAlignment(safeValue.elementAlignment); // Sync alignment as well

    // Reset focus state and timer refs when the element changes
    setFocusedInput(null);
    topTimerRef.current = null;
    leftTimerRef.current = null;
    bottomTimerRef.current = null;
    rightTimerRef.current = null;

    // Cleanup function: clears timers when component unmounts or before effect re-runs
    return () => {
      clearTimeout(topTimerRef.current as NodeJS.Timeout | undefined);
      clearTimeout(leftTimerRef.current as NodeJS.Timeout | undefined);
      clearTimeout(bottomTimerRef.current as NodeJS.Timeout | undefined);
      clearTimeout(rightTimerRef.current as NodeJS.Timeout | undefined);
    };
  }, [safeValue]); // Dependency on safeValue. This effect runs when the selected element changes.

  // Helper to handle input changes (updates internal state AND starts/resets the debounce timer)
  const handleInputChangeAndDebounce =
    (
      prop: keyof FlexiblePosition,
      setter: React.Dispatch<React.SetStateAction<string>>,
      timerRef: React.MutableRefObject<NodeJS.Timeout | null>
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const stringValue = event.target.value;
      setter(stringValue); // Update internal string state immediately

      // Clear the old timer
      clearTimeout(timerRef.current as NodeJS.Timeout | undefined);

      timerRef.current = setTimeout(() => {
        // Get the most recent internal strings from latestStateRef
        const {
          top: latestTop,
          left: latestLeft,
          bottom: latestBottom,
          right: latestRight,
        } = latestStateRef.current;

        const newPosition: FlexiblePosition = {
          elementAlignment: elementAlignment, // Include current elementAlignment
        };

        // Convert each string to the value for data
        const newDataTop = internalStringToDataValue(latestTop, min, max);
        if (newDataTop !== undefined) newPosition.top = newDataTop;

        const newDataLeft = internalStringToDataValue(latestLeft, min, max);
        if (newDataLeft !== undefined) newPosition.left = newDataLeft;

        const newDataBottom = internalStringToDataValue(latestBottom, min, max);
        if (newDataBottom !== undefined) newPosition.bottom = newDataBottom;

        const newDataRight = internalStringToDataValue(latestRight, min, max);
        if (newDataRight !== undefined) newPosition.right = newDataRight;

        // Clean up undefined values for consistent JSON.stringify comparison
        if (newPosition.top === undefined) {
          delete newPosition.top;
        }
        if (newPosition.left === undefined) {
          delete newPosition.left;
        }
        if (newPosition.bottom === undefined) {
          delete newPosition.bottom;
        }
        if (newPosition.right === undefined) {
          delete newPosition.right;
        }

        // Compare the calculated new object with the current parent prop value (safeValue)
        const currentJson = JSON.stringify(safeValue);
        const newJson = JSON.stringify(newPosition);

        // Call onChange ONLY if the data is different
        if (currentJson !== newJson) {
          onChange(newPosition);
        }

        // Clear the timer ref after it has fired
        timerRef.current = null;
      }, DEBOUNCE_DELAY); // Debounce delay
    };

  // Handler for the onFocus event (sets the focused state)
  const handleFocus = (prop: keyof FlexiblePosition) => () => {
    setFocusedInput(prop);
  };

  // Handler for the onBlur event (clears the focused state and processes immediately)
  const handleBlur =
    (
      prop: keyof FlexiblePosition,
      timerRef: React.MutableRefObject<NodeJS.Timeout | null>
    ) =>
    () => {
      // If there's a pending timer, clear it and process immediately
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        // Replicate the logic from the debounce callback to process the latest state
        const {
          top: latestTop,
          left: latestLeft,
          bottom: latestBottom,
          right: latestRight,
        } = latestStateRef.current;

        const newPosition: FlexiblePosition = {
          elementAlignment: elementAlignment,
        };
        const newDataTop = internalStringToDataValue(latestTop, min, max);
        if (newDataTop !== undefined) newPosition.top = newDataTop;

        const newDataLeft = internalStringToDataValue(latestLeft, min, max);
        if (newDataLeft !== undefined) newPosition.left = newDataLeft;

        const newDataBottom = internalStringToDataValue(latestBottom, min, max);
        if (newDataBottom !== undefined) newPosition.bottom = newDataBottom;

        const newDataRight = internalStringToDataValue(latestRight, min, max);
        if (newDataRight !== undefined) newPosition.right = newDataRight;

        // Clean up undefined values
        if (newPosition.top === undefined) {
          delete newPosition.top;
        }
        if (newPosition.left === undefined) {
          delete newPosition.left;
        }
        // Clean up undefined values
        if (newPosition.bottom === undefined) {
          delete newPosition.bottom;
        }
        if (newPosition.right === undefined) {
          delete newPosition.right;
        }

        const currentJson = JSON.stringify(safeValue);
        const newJson = JSON.stringify(newPosition);

        if (currentJson !== newJson) {
          onChange(newPosition);
        }
        timerRef.current = null; // Clear the timer ref AFTER execution
      }

      // Logic to revert to the initial value on blur if input is empty/invalid
      const latestInternalStringValue = getInternalStringValue(prop);
      const convertedDataValue = internalStringToDataValue(
        latestInternalStringValue,
        min,
        max
      );

      if (convertedDataValue === undefined) {
        // If input is empty or invalid (not a valid number)
        const setter = getSetter(prop);
        let valueToRevertTo: number | undefined;

        // Define a default if safeValue.x or safeValue.y is undefined
        const DEFAULT_TOP_ON_CLEAR = 0;
        const DEFAULT_LEFT_ON_CLEAR = 0;
        const DEFAULT_BOTTOM_ON_CLEAR = 0;
        const DEFAULT_RIGHT_ON_CLEAR = 0;

        if (prop === 'top') {
          // Revert to safeValue.y if it exists, otherwise use DEFAULT_Y_ON_CLEAR
          valueToRevertTo =
            safeValue.top !== undefined ? safeValue.top : DEFAULT_TOP_ON_CLEAR;
        } else if (prop === 'left') {
          // Revert to safeValue.x if it exists, otherwise use DEFAULT_X_ON_CLEAR
          valueToRevertTo =
            safeValue.left !== undefined
              ? safeValue.left
              : DEFAULT_LEFT_ON_CLEAR;
        } else if (prop === 'bottom') {
          // Revert to safeValue.x if it exists, otherwise use DEFAULT_X_ON_CLEAR
          valueToRevertTo =
            safeValue.bottom !== undefined
              ? safeValue.bottom
              : DEFAULT_BOTTOM_ON_CLEAR;
        } else if (prop === 'right') {
          // Revert to safeValue.x if it exists, otherwise use DEFAULT_X_ON_CLEAR
          valueToRevertTo =
            safeValue.right !== undefined
              ? safeValue.right
              : DEFAULT_RIGHT_ON_CLEAR;
        }

        setter(dataValueToInternalString(valueToRevertTo));
      }

      setFocusedInput(null); // Clear focused state
    };

  // Helper to get the correct internal state setter
  const getSetter = (
    prop: keyof FlexiblePosition
  ): React.Dispatch<React.SetStateAction<string>> => {
    switch (prop) {
      case 'top':
        return setTop;
      case 'left':
        return setLeft;
      case 'bottom':
        return setBottom;
      case 'right':
        return setRight;
      default:
        return setTop; // Should not happen
    }
  };

  // Helper to get the current internal string value
  const getInternalStringValue = (prop: keyof FlexiblePosition): string => {
    switch (prop) {
      case 'top':
        return top;
      case 'left':
        return left;
      case 'bottom':
        return bottom;
      case 'right':
        return right;
      default:
        return '';
    }
  };

  // Handler for elementAlignment radio group change
  const handleElementAlignChange = (e: RadioChangeEvent) => {
    const newAlignment = e.target.value;

    // Create the new PositionValue object based on current state and new alignment
    const newPosition: FlexiblePosition = {
      elementAlignment: newAlignment,
      top: internalStringToDataValue(latestStateRef.current.top, min, max),
      left: internalStringToDataValue(latestStateRef.current.left, min, max),
      bottom: internalStringToDataValue(
        latestStateRef.current.bottom,
        min,
        max
      ),
      right: internalStringToDataValue(latestStateRef.current.right, min, max),
    };

    // Clean up undefined values before comparing/calling onChange
    if (newPosition.top === undefined) {
      delete newPosition.top;
    }
    if (newPosition.left === undefined) {
      delete newPosition.left;
    }
    if (newPosition.bottom === undefined) {
      delete newPosition.bottom;
    }
    if (newPosition.right === undefined) {
      delete newPosition.right;
    }

    setElementAlignment(newAlignment); // Update the alignment state for UI re-render

    // Call onChange ONLY if the resulting data has changed
    const currentJson = JSON.stringify(safeValue);
    const newJson = JSON.stringify(newPosition);

    if (currentJson !== newJson) {
      onChange(newPosition);
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

  if (
    config.widgetType !== EditorWidgetType.PositionInput ||
    config.dataType !== PropertyDataType.Object
  ) {
    console.error('Invalid config for PositionEditorWidget:', config);
    return <div>Error: Incompatible Widget</div>;
  }

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
      <Radio.Group
        size="middle"
        buttonStyle="solid"
        className="button-group-period-filter"
        value={elementAlignment}
        onChange={handleElementAlignChange}
      >
        <Radio.Button value="auto" title="Poziționare manuală">
          <DragOutlined />
        </Radio.Button>
        <Radio.Button value="self-start" title="Aliniere la stânga">
          <AlignLeftOutlined />
        </Radio.Button>
        <Radio.Button value="center" title="Aliniere la centru">
          <AlignCenterOutlined />
        </Radio.Button>
        <Radio.Button value="self-end" title="Aliniere la dreapta">
          <AlignRightOutlined />
        </Radio.Button>
      </Radio.Group>
      <div style={gridContainerStyle}>
        <div
          style={{ ...inputGroupStyle, gridRow: '1 / 2', gridColumn: '2 / 3' }}
        >
          <label style={labelStyle}>Sus (%)</label>
          <input
            type="text"
            value={top}
            onChange={handleInputChangeAndDebounce('top', setTop, topTimerRef)}
            onBlur={handleBlur('top', topTimerRef)}
            onFocus={handleFocus('top')}
            style={inputStyle}
            title="Poziția față de marginea de sus (%)"
          />
        </div>
        <div
          style={{ ...inputGroupStyle, gridRow: '2 / 3', gridColumn: '1 / 2' }}
        >
          <label style={labelStyle}>Stânga (%)</label>
          <input
            className="disabled:bg-gray-100 disabled:text-gray-400"
            type="text"
            value={left}
            onChange={handleInputChangeAndDebounce(
              'left',
              setLeft,
              leftTimerRef
            )}
            onBlur={handleBlur('left', leftTimerRef)}
            onFocus={handleFocus('left')}
            style={inputStyle}
            title="Poziția față de marginea din stânga (%) (Valoare salvată, aplicată doar la poziționare manuală)"
            disabled={elementAlignment !== 'auto'}
          />
        </div>
        <div style={centerBoxStyle}>Poziție</div>
        <div
          style={{ ...inputGroupStyle, gridRow: '3 / 3', gridColumn: '2 / 3' }}
        >
          <label style={labelStyle}>Jos (%)</label>
          <input
            className="disabled:bg-gray-100 disabled:text-gray-400"
            type="text"
            value={bottom}
            onChange={handleInputChangeAndDebounce(
              'bottom',
              setBottom,
              bottomTimerRef
            )}
            onBlur={handleBlur('bottom', bottomTimerRef)}
            onFocus={handleFocus('bottom')}
            style={inputStyle}
            title="Poziția față de marginea de jos (%)"
          />
        </div>
        <div
          style={{ ...inputGroupStyle, gridRow: '2 / 3', gridColumn: '3 / 3' }}
        >
          <label style={labelStyle}>Dreapta (%)</label>
          <input
            className="disabled:bg-gray-100 disabled:text-gray-400"
            type="text"
            value={right}
            onChange={handleInputChangeAndDebounce(
              'right',
              setRight,
              rightTimerRef
            )}
            onBlur={handleBlur('right', rightTimerRef)}
            onFocus={handleFocus('right')}
            style={inputStyle}
            title="Poziția față de marginea din dreapta (%)"
            disabled={elementAlignment !== 'auto'}
          />
        </div>
      </div>
    </div>
  );
};

export default PositionEditorWidget;
