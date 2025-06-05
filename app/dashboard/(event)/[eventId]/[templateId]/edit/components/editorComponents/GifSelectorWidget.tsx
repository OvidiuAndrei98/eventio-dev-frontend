import {
  EditorWidgetType,
  PropertyDataType,
  PropertyEditorConfig,
} from '@/core/types';
import React, { useEffect, useState } from 'react';

// Example GIFs. Replace with your own GIF URLs or import from a config.
const gifOptions = [
  { key: 'purpleFlowers', url: '/gifs/purple-blue-flower.gif' },
  { key: 'ourWedding', url: '/gifs/ourwedding_wh.gif' },
  { key: 'thnYou', url: '/gifs/thnyou_wh.gif' },
  { key: 'justMr', url: '/gifs/just_wh.gif' },
];

interface GifSelectorWidgetProps {
  config: PropertyEditorConfig;
  value: string | undefined | null;
  onChange: (newValue: string) => void;
}

const GifSelectorWidget = ({
  config,
  value,
  onChange,
}: GifSelectorWidgetProps) => {
  const [gifs, setGifs] = useState(gifOptions);

  useEffect(() => {
    setGifs(gifOptions);
  }, []);

  const handleInputChange = (gifUrl: string) => {
    onChange(gifUrl);
  };

  if (
    config.widgetType !== EditorWidgetType.GifSelector ||
    config.dataType !== PropertyDataType.String
  ) {
    console.error('Configurație invalidă pentru GifSelectorWidget:', config);
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
        {gifs.map((gif) => (
          <div
            onClick={() => handleInputChange(gif.url)}
            className={`flex items-center justify-center p-2 rounded-lg bg-gray-400 hover:bg-gray-500 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 ${
              value === gif.url && 'ring-1 ring-[#CB92D9]'
            }`}
            key={gif.key}
            style={{ cursor: 'pointer', minHeight: 60, maxWidth: 80 }}
          >
            <img
              src={gif.url}
              alt={gif.key}
              style={{ maxWidth: 48, maxHeight: 48, borderRadius: 8 }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default GifSelectorWidget;
