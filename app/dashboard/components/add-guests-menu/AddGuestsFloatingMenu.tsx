import React, { useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { Guest } from '@/core/types';
import { toast } from 'sonner';

const AddGuestsFloatingMenu = ({
  eventId,
  userId,
  addGuestsService,
  refreshGuestList,
}: {
  eventId: string;
  userId: string;
  addGuestsService: (
    eventId: string,
    userId: string,
    guests: Guest[]
  ) => Promise<void>;
  refreshGuestList: () => Promise<void>;
}) => {
  const [guestsList, setGuestsList] = React.useState<
    { name: string; id: string }[]
  >([]);

  useEffect(() => {
    setGuestsList([{ name: '', id: crypto.randomUUID() }]);
  }, []);

  const [form] = Form.useForm();

  const handleFinish = async () => {
    const finalGuestsList: Guest[] = [];
    guestsList.forEach((guest) => {
      if (guest.name.trim() !== '') {
        finalGuestsList.push({
          guestId: crypto.randomUUID(),
          submissionId: crypto.randomUUID(),
          name: guest.name,
          primaryContactPhone: '-',
          dietaryRestrictions: '',
          isAttending: true,
          eventId: eventId,
          tableId: null,
          date: new Date().getTime(),
          isPrimaryContact: true,
        });
      }
    });

    try {
      await addGuestsService(eventId, userId, finalGuestsList);
      await refreshGuestList();
      form.resetFields();
      setGuestsList([{ name: '', id: crypto.randomUUID() }]);
      toast.success('Invitații au fost adăugați cu succes!');
    } catch (error) {}
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-2 gap-2 overflow-hidden">
      <Button type="dashed" className="w-full">
        Importa din Excel
      </Button>
      <span>Sau</span>
      <div className="w-full max-h-[250px] overflow-y-auto">
        <Form
          layout="vertical"
          className="w-full"
          form={form}
          onFinish={handleFinish}
        >
          {guestsList.map((guest, index) => (
            <div key={guest.id} className="flex items-center gap-2">
              <Form.Item
                label={`Invitat ${index + 1}`}
                name={guest.id}
                required
                className="w-full"
                rules={[{ required: true, message: 'Numele este necesar' }]}
              >
                <Input
                  placeholder={`Nume invitat ${index + 1}`}
                  value={guest.name}
                  onChange={(e) => {
                    const newGuestsList = [...guestsList];
                    newGuestsList[index].name = e.target.value;
                    setGuestsList(newGuestsList);
                  }}
                  className="w-full"
                />
              </Form.Item>
              {guestsList.length > 1 && (
                <Button
                  type="default"
                  danger
                  onClick={() => {
                    setGuestsList(guestsList.filter((_, i) => i !== index));
                  }}
                >
                  Șterge
                </Button>
              )}
            </div>
          ))}
        </Form>
      </div>
      <Button
        className="w-full"
        type="dashed"
        onClick={() => {
          setGuestsList([...guestsList, { name: '', id: crypto.randomUUID() }]);
        }}
      >
        Adaugă alt invitat
      </Button>
      <div className="flex flex-row justify-between w-full px-4 gap-2 bg-white">
        <Button type="default">Anulează</Button>
        <Button type="primary" onClick={() => form.submit()}>
          Adaugă
        </Button>
      </div>
    </div>
  );
};

export default AddGuestsFloatingMenu;
