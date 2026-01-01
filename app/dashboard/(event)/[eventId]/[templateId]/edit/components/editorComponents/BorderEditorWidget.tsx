import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  EditorWidgetType,
  PropertyDataType,
  PropertyEditorConfig,
} from '@/core/types';
import {
  BorderBottomOutlined,
  BorderLeftOutlined,
  BorderOuterOutlined,
  BorderRightOutlined,
  BorderTopOutlined,
  DashOutlined,
  LineOutlined,
} from '@ant-design/icons';
import { ColorPicker, Radio, RadioChangeEvent } from 'antd';
import { AggregationColor } from 'antd/es/color-picker/color';
import Input from 'antd/es/input/Input';
import React, { useEffect, useState, useCallback } from 'react';

interface BorderEditorWidgetProps {
  config: PropertyEditorConfig;
  value: { size: string; color: string; sides: string } | undefined | null;
  onChange: (newValue: { size: string; color: string; sides: string }) => void;
}

const BorderEditorWidget = ({
  config,
  value,
  onChange,
}: BorderEditorWidgetProps) => {
  const [selectedBorderPositions, setSelectedBordersPositions] = useState<
    string[]
  >([]);
  const [borderStyle, setBorderStyle] = useState<'solid' | 'dashed'>('solid');
  const [borderSize, setBorderSize] = useState<string>('1px');
  const [borderColor, setBorderColor] = useState<string>('#1677ff');

  // Helper function to construct the 'sides' string based on current states
  const getSidesString = useCallback(
    (positions: string[], style: 'solid' | 'dashed'): string => {
      const sidesMap = {
        top: 'none',
        right: 'none',
        bottom: 'none',
        left: 'none',
      };

      if (positions.includes('all')) {
        sidesMap.top = style;
        sidesMap.right = style;
        sidesMap.bottom = style;
        sidesMap.left = style;
      } else {
        if (positions.includes('top')) sidesMap.top = style;
        if (positions.includes('right')) sidesMap.right = style;
        if (positions.includes('bottom')) sidesMap.bottom = style;
        if (positions.includes('left')) sidesMap.left = style;
      }
      return `${sidesMap.top} ${sidesMap.right} ${sidesMap.bottom} ${sidesMap.left}`;
    },
    []
  );

  // Function to trigger onChange with the consolidated current state
  const triggerChange = useCallback(
    (
      newPositions: string[],
      newStyle: 'solid' | 'dashed',
      newSize: string,
      newColor: string
    ) => {
      const sides = getSidesString(newPositions, newStyle);
      onChange({
        size: newSize,
        color: newColor,
        sides: sides,
      });
    },
    [onChange, getSidesString]
  );

  // Effect to initialize state from the 'value' prop
  useEffect(() => {
    if (value) {
      setBorderSize(value.size);
      setBorderColor(value.color);

      const sidesArray = value.sides.split(' ');
      if (sidesArray.length === 4) {
        const [top, right, bottom, left] = sidesArray;
        const positions: string[] = [];
        if (top !== 'none') positions.push('top');
        if (right !== 'none') positions.push('right');
        if (bottom !== 'none') positions.push('bottom');
        if (left !== 'none') positions.push('left');

        if (
          positions.length === 4 &&
          top === right &&
          right === bottom &&
          bottom === left &&
          top !== 'none'
        ) {
          setSelectedBordersPositions(['all']);
          setBorderStyle(top as 'solid' | 'dashed');
        } else {
          setSelectedBordersPositions(positions);
          // Assuming all active borders have the same style, pick the first one
          const activeStyle = [top, right, bottom, left].find(
            (s) => s !== 'none'
          );
          if (activeStyle) setBorderStyle(activeStyle as 'solid' | 'dashed');
        }
      } else {
        // If value.sides is not a valid format, assume inactive
        setSelectedBordersPositions([]);
        setBorderStyle('solid');
      }
    } else {
      // If value is undefined or null, reset to default inactive state
      setSelectedBordersPositions([]);
      setBorderStyle('solid');
      setBorderSize('1px');
      setBorderColor('#1677ff');
    }
  }, [value]);

  // Handler for border position changes
  const handleBordersChange = (values: string[]) => {
    let newPositions = values;

    if (values.includes('all') && !selectedBorderPositions.includes('all')) {
      newPositions = ['all'];
    } else if (values.includes('all') && values.length > 1) {
      newPositions = ['all'];
    } else if (
      !values.includes('all') &&
      selectedBorderPositions.includes('all')
    ) {
      newPositions = [];
    }

    setSelectedBordersPositions(newPositions);
    // Pass the NEW positions, but current (latest) values for others
    triggerChange(newPositions, borderStyle, borderSize, borderColor);
  };

  // Handler for border style changes
  const handleBorderStyleChange = (e: RadioChangeEvent) => {
    const style = (e.target as HTMLInputElement).value as 'solid' | 'dashed';
    setBorderStyle(style);
    // Pass the NEW style, but current (latest) values for others
    triggerChange(selectedBorderPositions, style, borderSize, borderColor);
  };

  // Handler for border size changes
  const handleBorderSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = e.target.value;
    setBorderSize(size);
    // Pass the NEW size, but current (latest) values for others
    triggerChange(selectedBorderPositions, borderStyle, size, borderColor);
  };

  // Handler for border color changes
  const handleBorderColorChange = (color: AggregationColor) => {
    const hexColor = typeof color === 'string' ? color : color.toHexString();
    setBorderColor(hexColor);
    // Pass the NEW color, but current (latest) values for others
    triggerChange(selectedBorderPositions, borderStyle, borderSize, hexColor);
  };

  if (
    config.widgetType !== EditorWidgetType.BorderEditor ||
    config.dataType !== PropertyDataType.Object
  ) {
    console.error('Configurație invalidă pentru BorderEditorWidget:', config);
    return <div>Eroare: Widget incompatibil</div>;
  }
  return (
    <div className="mb-[10px]">
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
      <div className="flex justify-center mb-2">
        <ToggleGroup
          size="sm"
          onValueChange={handleBordersChange}
          type="multiple"
          className='grid grid-cols-3 grid-rows-3 gap-2 w-24 h-24" role="group"'
          value={selectedBorderPositions} // Controlled component
        >
          <ToggleGroupItem
            value="top"
            aria-label="top"
            tabIndex={0}
            className={`col-start-2 row-start-1 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-100 ${
              selectedBorderPositions?.includes('top') ||
              selectedBorderPositions?.includes('all')
                ? 'bg-gray-200'
                : ''
            }`}
          >
            <BorderTopOutlined />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="left"
            className={`col-start-1 row-start-2 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-100 ${
              selectedBorderPositions?.includes('left') ||
              selectedBorderPositions?.includes('all')
                ? 'bg-gray-200'
                : ''
            }`}
          >
            <BorderLeftOutlined />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="all"
            className={`col-start-2 row-start-2 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-100 ${
              selectedBorderPositions?.includes('all') ? 'bg-gray-200' : ''
            }`}
          >
            <BorderOuterOutlined />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="right"
            className={`col-start-3 row-start-2 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-100 ${
              selectedBorderPositions?.includes('right') ||
              selectedBorderPositions?.includes('all')
                ? 'bg-gray-200'
                : ''
            }`}
          >
            <BorderRightOutlined />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="bottom"
            className={`col-start-2 row-start-3 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-10 ${
              selectedBorderPositions?.includes('bottom') ||
              selectedBorderPositions?.includes('all')
                ? 'bg-gray-200'
                : ''
            }`}
          >
            <BorderBottomOutlined />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex gap-2 p-1 ring-1 ring-gray-300 rounded-md">
        <Input
          className="border-editor-input"
          size="small"
          value={borderSize}
          onChange={handleBorderSizeChange}
          disabled={selectedBorderPositions.length === 0}
        />
        <Radio.Group
          size="middle"
          buttonStyle="solid"
          className="button-group-period-filter"
          value={borderStyle}
          onChange={handleBorderStyleChange}
          disabled={selectedBorderPositions.length === 0}
        >
          <Radio.Button value="solid">
            <LineOutlined />
          </Radio.Button>
          <Radio.Button value="dashed">
            <DashOutlined />
          </Radio.Button>
        </Radio.Group>
        <ColorPicker
          value={borderColor}
          onChange={handleBorderColorChange}
          size="middle"
          disabled={selectedBorderPositions.length === 0}
          getPopupContainer={(trigger) =>
            trigger.parentElement || document.body
          }
        />
      </div>
    </div>
  );
};

export default BorderEditorWidget;
