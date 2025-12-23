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
    { firstName: string; lastName: string; id: string }[]
  >([]);

  useEffect(() => {
    setGuestsList([{ firstName: '', lastName: '', id: crypto.randomUUID() }]);
  }, []);

  const [form] = Form.useForm();

  const handleFinish = async () => {
    const finalGuestsList: Guest[] = [];
    guestsList.forEach((guest) => {
      const fullName =
        `${guest.firstName.trim()} ${guest.lastName.trim()}`.trim();
      if (fullName !== '') {
        finalGuestsList.push({
          guestId: crypto.randomUUID(),
          submissionId: crypto.randomUUID(),
          firstName: guest.firstName.trim(),
          lastName: guest.lastName.trim(),
          fullName: fullName,
          primaryContactPhone: '-',
          dietaryRestrictions: '',
          isAttending: true,
          totalGuests: 1,
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
      setGuestsList([{ firstName: '', lastName: '', id: crypto.randomUUID() }]);
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
            <div key={guest.id} className="flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <div className="flex flex-row gap-2 w-full">
                  <Form.Item
                    label={index === 0 ? 'Prenume' : ''}
                    name={`${guest.id}-firstName`}
                    required
                    className="w-full"
                    rules={[
                      { required: true, message: 'Prenumele este necesar' },
                    ]}
                  >
                    <Input
                      placeholder="Prenume"
                      value={guest.firstName}
                      onChange={(e) => {
                        const newGuestsList = [...guestsList];
                        newGuestsList[index].firstName = e.target.value;
                        setGuestsList(newGuestsList);
                      }}
                      className="w-full"
                    />
                  </Form.Item>
                  <Form.Item
                    label={index === 0 ? 'Nume' : ''}
                    name={`${guest.id}-lastName`}
                    required
                    className="w-full"
                    rules={[{ required: true, message: 'Numele este necesar' }]}
                  >
                    <Input
                      placeholder="Nume"
                      value={guest.lastName}
                      onChange={(e) => {
                        const newGuestsList = [...guestsList];
                        newGuestsList[index].lastName = e.target.value;
                        setGuestsList(newGuestsList);
                      }}
                      className="w-full"
                    />
                  </Form.Item>
                </div>
                {guestsList.length > 1 && (
                  <Button
                    type="default"
                    danger
                    onClick={() => {
                      setGuestsList(guestsList.filter((_, i) => i !== index));
                    }}
                    className={`${index === 0 ? 'mt-[22px]' : 'mt-0'}`}
                  >
                    Șterge
                  </Button>
                )}
              </div>
            </div>
          ))}
        </Form>
      </div>
      <Button
        className="w-full"
        type="dashed"
        onClick={() => {
          setGuestsList([
            ...guestsList,
            { firstName: '', lastName: '', id: crypto.randomUUID() },
          ]);
        }}
      >
        Adaugă alt invitat
      </Button>
      <div className="flex flex-row justify-between w-full px-4 gap-2 bg-white">
        <Button type="default">Anulează</Button>
        <Button type="primary" onClick={() => form.submit()}>
          Adaugă {guestsList.length} Invitat(ți)
        </Button>
      </div>
    </div>
  );
};

export default AddGuestsFloatingMenu;
