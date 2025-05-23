import {
  EditorWidgetType,
  PropertyDataType,
  PropertyEditorConfig,
} from '@/core/types';
import { templateBlobsFactory } from '@/lib/templateBlobs';
import React, { useEffect, useState } from 'react';

interface BlobSelectorWidgetProps {
  config: PropertyEditorConfig;
  value: string | undefined | null;
  onChange: (newValue: string) => void;
}

const BlobSelectorWidget = ({
  config,
  value,
  onChange,
}: BlobSelectorWidgetProps) => {
  const [blobsKeys, setBlobsKeys] = useState<string[]>([]);
  const blobs = templateBlobsFactory;

  useEffect(() => {
    setBlobsKeys(Object.keys(blobs));
  }, [blobs]);

  const handleInputChange = (value: string) => {
    onChange(value);
  };

  if (
    config.widgetType !== EditorWidgetType.BlobSelector ||
    config.dataType !== PropertyDataType.String
  ) {
    console.error('Configurație invalidă pentru BlobSelectorWidget:', config);
    return <div>Eroare: Widget incompatibil</div>;
  }
  return (
    <>
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
      <div className="grid grid-cols-[1fr_1fr] gap-2">
        {blobsKeys.map((blob) => (
          <div
            onClick={() => handleInputChange(blob)}
            className={`flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white ${
              value === blob && 'ring-1 ring-[#CB92D9]'
            }`}
            key={blob}
          >
            {blobs[blob as keyof typeof blobs]()}
          </div>
        ))}
      </div>
    </>
  );
};

export default BlobSelectorWidget;
