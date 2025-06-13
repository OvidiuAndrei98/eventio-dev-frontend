import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { libs } from '@/lib/utils';
import { useJsApiLoader } from '@react-google-maps/api';
import { EventLocation, User } from '@/core/types';
import { Button, Form, GetProp, Upload, UploadProps } from 'antd';
import { Input as AntInput } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { toast } from 'sonner';
import { UploadFile, UploadFileStatus } from 'antd/es/upload/interface';
import ImgCrop from 'antd-img-crop';

interface AutocompleteMapsInputProps {
  onLocationSelect: (
    location: EventLocation,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    file: any,
    oldFileName?: string
  ) => void;
  editingLocation?: EventLocation;
  user?: User;
  templateId?: string;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const AutocompleteMapsInput = ({
  onLocationSelect,
  editingLocation,
}: AutocompleteMapsInputProps) => {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
    libraries: libs,
    region: 'ro',
    language: 'ro',
  });
  const [selectedPlace, setSelectedPlace] = useState<EventLocation | null>(
    null
  );
  const [saveTriggeredFlag, setSaveTriggeredFlag] = useState(false);

  const [imageObject, setImageObject] = useState<UploadFile | undefined>();

  const autocompleteRef = React.useRef<HTMLInputElement>(null);

  const [form] = useForm();

  useEffect(() => {
    if (isLoaded) {
      if (autocompleteRef.current) {
        const newAutocomplete = new google.maps.places.Autocomplete(
          autocompleteRef.current,
          {
            fields: ['formatted_address', 'name', 'geometry'],
            componentRestrictions: {
              country: ['ro'], // Restrict to Romania
            },
          }
        );
        setAutocomplete(newAutocomplete);
      }
    }
  }, [isLoaded]);

  useEffect(() => {
    if (autocomplete) {
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.geometry) {
          setSaveTriggeredFlag(false);
          setSelectedPlace((prevData) => {
            return {
              ...prevData,
              formatted_address: place.formatted_address || '',
              name: place.name || '',
              location: {
                lat: place.geometry?.location?.lat().toString() || '',
                long: place.geometry?.location?.lng().toString() || '',
              },
              locationId: prevData?.locationId ?? '',
            };
          });
        }
      });
    }
  }, [autocomplete]);

  useEffect(() => {
    if (editingLocation) {
      setSelectedPlace(editingLocation);
      const editingImageObject = {
        uid: '1',
        name: editingLocation.locationImage?.name ?? '',
        url: editingLocation.locationImage?.url,
        thumbUrl: editingLocation.locationImage?.url,
        status: 'done' as UploadFileStatus,
        type: 'image/png',
      };
      form.setFieldsValue({
        locationTitle: editingLocation.title,
        locationStartTime: editingLocation.locationStartTime,
        locationPhoto: {
          file: editingImageObject,
        },
      });
      setImageObject(editingImageObject);
    }
  }, [editingLocation]);

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      toast.error('You can only upload JPG/PNG file!');
    }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      toast.error('Image must be smaller than 10MB!');
    }
    // if (!isLt2M) {
    //   toast.error('Image must smaller than 2MB!');
    // }
    return isJpgOrPng && isLt10M;
  };

  const onSaveLocation = () => {
    form.submit();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = async (values: any) => {
    setSaveTriggeredFlag(true);
    if (selectedPlace) {
      const eventLocationCopy = { ...selectedPlace };

      eventLocationCopy.title = values.locationTitle;
      eventLocationCopy.locationStartTime = values.locationStartTime;

      const now = new Date();
      const hour = now.getHours().toString().padStart(2, '0');
      const min = now.getMinutes().toString().padStart(2, '0');
      const fileName = `${values.locationPhoto.file.name}_${hour}${min}`;

      const oldFileName = eventLocationCopy?.locationImage?.name;

      eventLocationCopy.locationImage = {
        name: fileName,
        url: values.locationPhoto.file.thumbUrl,
      };

      if (!editingLocation) {
        eventLocationCopy.locationId = crypto.randomUUID();
      }

      onLocationSelect(
        eventLocationCopy,
        values.locationPhoto.file,
        oldFileName
      );
      setSaveTriggeredFlag(false);
    }
  };

  const handleChange: UploadProps['onChange'] = async (info) => {
    form.setFieldValue('locationPhoto', {
      file: info.file,
    });
    if (info.file.status === 'uploading') {
      setImageObject(info.file);
      return;
    }
    if (info.file.status === 'error') {
      setImageObject(info.file);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setImageObject(info.file);
    }
    if (info.file.status === 'removed') {
      setImageObject(undefined);
    }
  };

  return (
    <div className="flex flex-col">
      <p className="text-xs text-gray-500 mb-2">
        Incepe sa scrii pentru a cauta o locatie
      </p>
      <Input
        defaultValue={editingLocation?.name}
        placeholder="Cauta locatie"
        ref={autocompleteRef}
        className="focus:outline-[#B46ACA] focus:border-[#B46ACA] hover:border-[#B46ACA] my-2 focus:outline-[#B46ACA]"
      />
      {!selectedPlace && saveTriggeredFlag && (
        <p className="text-sm text-[red] mb-2">Selecteaza o locatie valida</p>
      )}
      <Form
        form={form}
        autoFocus={false}
        name="addAditionalLocation"
        onFinish={handleFormSubmit}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="Titlu locatie"
          name="locationTitle"
          rules={[
            {
              required: true,
              message: 'Titlul este obligatoriu.',
            },
          ]}
        >
          <AntInput placeholder="Ex: Petrecerea" />
        </Form.Item>
        <Form.Item
          label="Ora"
          name="locationStartTime"
          rules={[
            {
              required: true,
              message: 'Ora este obligatorie.',
            },
          ]}
        >
          <AntInput
            placeholder="Ex: 12:00"
            pattern={'^([0-1]?d|2[0-3])(?::([0-5]?d))?$'}
          />
        </Form.Item>
        <Form.Item label="Fotografie" name="locationPhoto">
          <ImgCrop rotationSlider aspectSlider={true} fillColor="transparent">
            <Upload
              name="locationPhoto"
              listType="picture"
              onChange={handleChange}
              beforeUpload={beforeUpload}
              fileList={imageObject ? [imageObject] : []}
            >
              <Button icon={<UploadOutlined />}>Adauga imagine</Button>
            </Upload>
          </ImgCrop>
        </Form.Item>
      </Form>
      <Button type="primary" onClick={onSaveLocation} className="self-end">
        Salveaza
      </Button>
    </div>
  );
};

export default AutocompleteMapsInput;
