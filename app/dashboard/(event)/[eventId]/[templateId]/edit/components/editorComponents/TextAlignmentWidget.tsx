import {
  EditorWidgetType,
  PropertyDataType,
  PropertyEditorConfig,
} from '@/core/types';
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
} from '@ant-design/icons';
import { Radio, RadioChangeEvent } from 'antd';
import React, { useState } from 'react';

interface TextAlignmentWidgetProps {
  config: PropertyEditorConfig;
  value: string | undefined | null;
  onChange: (newValue: string) => void;
}

const TextAlignmentWidget = ({
  config,
  value,
  onChange,
}: TextAlignmentWidgetProps) => {
  const [textAlignment, setTextAlignment] = useState(value);

  const handleElementAlignChange = (e: RadioChangeEvent) => {
    const newAlignment = e.target.value;
    setTextAlignment(newAlignment);
    onChange(newAlignment);
  };

  if (
    config.widgetType !== EditorWidgetType.TextAlignment ||
    config.dataType !== PropertyDataType.String
  ) {
    console.error('Invalid config for PositionEditorWidget:', config);
    return <div>Error: Incompatible Widget</div>;
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
      <Radio.Group
        size="middle"
        buttonStyle="solid"
        className="button-group-period-filter"
        value={textAlignment}
        onChange={handleElementAlignChange}
      >
        <Radio.Button value="start" title="Aliniere la stânga">
          <AlignLeftOutlined />
        </Radio.Button>
        <Radio.Button value="center" title="Aliniere la centru">
          <AlignCenterOutlined />
        </Radio.Button>
        <Radio.Button value="end" title="Aliniere la dreapta">
          <AlignRightOutlined />
        </Radio.Button>
      </Radio.Group>
    </div>
  );
};

export default TextAlignmentWidget;
