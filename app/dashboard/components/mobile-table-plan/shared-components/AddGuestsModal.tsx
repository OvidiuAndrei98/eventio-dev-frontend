import React, { useEffect } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { Guest } from '@/core/types';
import { toast } from 'sonner';

const AddGuestsModal = ({
  eventId,
  userId,
  open,
  addGuestsService,
  refreshGuestList,
  setAddGuestsModalOpen,
}: {
  eventId: string;
  userId: string;
  open: boolean;
  addGuestsService: (
    eventId: string,
    userId: string,
    guests: Guest[]
  ) => Promise<void>;
  refreshGuestList: () => Promise<void>;
  setAddGuestsModalOpen: (open: boolean) => void;
}) => {
  const [guestsList, setGuestsList] = React.useState<
    { name: string; id: string }[]
  >([]);
  const [guestAddLoading, setGuestAddLoading] = React.useState(false);

  useEffect(() => {
    setGuestsList([{ name: '', id: crypto.randomUUID() }]);
  }, []);

  const [form] = Form.useForm();

  const handleFinish = async () => {
    setGuestAddLoading(true);
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
      setGuestAddLoading(false);
      form.resetFields();
      setGuestsList([{ name: '', id: crypto.randomUUID() }]);
      setAddGuestsModalOpen(false);
      toast.success('Invitații au fost adăugați cu succes!');
    } catch (error) {}
  };

  return (
    <Modal
      open={open}
      footer={null}
      closeIcon={null}
      centered
      rootClassName="mobiele-add-guests-modal"
    >
      <div className="flex flex-col items-center justify-center w-full p-2 gap-2 overflow-hidden">
        <Button type="dashed" className="w-full">
          Importa din Excel
        </Button>
        <span>Sau</span>
        <div className="w-full max-h-[calc(100svh-400px)] overflow-y-auto scrollbar-thin">
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
            setGuestsList([
              ...guestsList,
              { name: '', id: crypto.randomUUID() },
            ]);
          }}
        >
          Adaugă alt invitat
        </Button>
        <div className="flex flex-row justify-between w-full px-4 gap-2 bg-white">
          <Button
            type="default"
            disabled={guestAddLoading}
            onClick={() => setAddGuestsModalOpen(false)}
          >
            Anulează
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={guestAddLoading}
          >
            Adaugă
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddGuestsModal;
