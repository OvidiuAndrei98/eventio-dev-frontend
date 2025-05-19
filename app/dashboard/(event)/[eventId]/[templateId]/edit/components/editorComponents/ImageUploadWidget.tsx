'use client';

import React, { useEffect, useState } from 'react';
import {
  PropertyEditorConfig,
  EditorWidgetType,
  PropertyDataType,
} from '@/core/types';
import {
  Button,
  ColorPicker,
  GetProp,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { toast } from 'sonner';
import { Color } from 'antd/es/color-picker';
import { firebaseAuth } from '@/lib/firebase/firebaseConfig';
import { uploadImageForTemplate } from '@/service/templates/uploadImageForTemplate';
import { removeImageForTemplate } from '@/service/templates/removeImageForTemplate';
import { useAuth } from '@/core/AuthenticationBoundary';
import { UploadFileStatus } from 'antd/es/upload/interface';

interface backgroundImageProps {
  name: string;
  opacity: string;
  url: string;
}

interface ImageUploadWidgetProps {
  /** Configurația specifică a proprietății pentru acest widget. */
  config: PropertyEditorConfig;
  /** Valoarea curentă a proprietății (string). Poate fi undefined sau null dacă nu este setată. */
  value: backgroundImageProps;
  /** Current template id */
  templateId: string;
  /** Callback apelat când valoarea se schimbă. Noul text este pasat ca string. */
  onChange: (newValue: backgroundImageProps | null) => void;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    toast.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    toast.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

/**
 * Widget editor pentru input text simplu bazat pe PropertyEditorConfig.
 * Renderază o etichetă și un input de tip text.
 */
const ImageUploadWidget: React.FC<ImageUploadWidgetProps> = ({
  config,
  value,
  templateId,
  onChange,
}) => {
  const user = useAuth().userDetails;
  const [uploadObject, setUploadObject] = useState<UploadFile | undefined>();
  const [backgoundImageFields, setBackgroundImageFields] =
    useState<backgroundImageProps>({
      name: '',
      opacity: 'rgba(0,0,0,0)',
      url: '',
    });

  useEffect(() => {
    if (value) {
      setBackgroundImageFields(value);
      const upladObject = {
        uid: '1',
        name: value.name,
        url: value.url,
        thumbUrl: value.url,
        status: 'done' as UploadFileStatus,
        type: 'image/png',
      };
      setUploadObject(upladObject);
    } else {
      setUploadObject(undefined);
      setBackgroundImageFields({ name: '', opacity: 'rgba(0,0,0,0)', url: '' });
    }
  }, [value]);

  const handleChange: UploadProps['onChange'] = async (info) => {
    if (info.file.status === 'uploading') {
      setUploadObject(info.file);
      return;
    }
    if (info.file.status === 'error') {
      setUploadObject(info.file);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, async (url) => {
        if (user) {
          try {
            const storageUrl = await uploadImageForTemplate(
              url,
              user,
              templateId,
              info.file.name
            );
            if (storageUrl) {
              setBackgroundImageFields((prevData) => {
                // De verificat
                onChange({
                  ...prevData,
                  url: storageUrl,
                  name: info.file.name,
                });
                return { ...prevData, url: storageUrl, name: info.file.name };
              });
            }
          } catch (error) {
            toast.error('A aparut o eroare la incarcarea imaginii');
          }
          setUploadObject(info.file);
        }
      });
    }
    if (info.file.status === 'removed') {
      if (firebaseAuth.currentUser) {
        try {
          await removeImageForTemplate(
            firebaseAuth.currentUser,
            templateId,
            info.file.name
          );

          setBackgroundImageFields({ opacity: '', url: '', name: '' });
          setUploadObject(undefined);
          onChange(null);
        } catch (error) {
          toast.error('A aparut o eroare la stergerea imaginii');
        }
      }
    }
  };

  const handleInputChange = (color: Color) => {
    const updatedData = {
      ...backgoundImageFields,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      opacity: (color as any).toRgbString(),
    };
    setBackgroundImageFields(updatedData);
    onChange(updatedData);
  };

  if (
    config.widgetType !== EditorWidgetType.ImageUpload ||
    config.dataType !== PropertyDataType.Object
  ) {
    console.error('Configurație invalidă pentru ImageUploadWidget:', config);
    // Renderizăm un mesaj de eroare sau o componentă fallback dacă configurația nu este validă
    return <div>Eroare: Widget incompatibil</div>;
  }

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
      <Upload
        maxCount={1}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        listType="picture"
        fileList={uploadObject ? [uploadObject] : []}
      >
        <Button type="primary" icon={<UploadOutlined />} className="!w-[100%]">
          Upload
        </Button>
      </Upload>
      {uploadObject && uploadObject.status == 'done' ? (
        <ColorPicker
          format="rgb"
          value={value?.opacity}
          onChange={handleInputChange}
          showText
          className="w-full justify-start mt-[10px]"
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default ImageUploadWidget;
