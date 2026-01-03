import React, { useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { Guest } from '@/core/types';
import { toast } from 'sonner';
import { PLANYVITE_EVENT_PLAN_FEATURES } from '@/lib/planyviteEventPlanTiers';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const AddGuestsModal = ({
  eventId,
  userId,
  open,
  addGuestsService,
  refreshGuestList,
  setAddGuestsModalOpen,
  eventGuests,
  eventPlan,
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
  eventGuests: Guest[];
  eventPlan: keyof typeof PLANYVITE_EVENT_PLAN_FEATURES;
}) => {
  const [guestsList, setGuestsList] = React.useState<
    { firstName: string; lastName: string; id: string }[]
  >([]);
  const [guestAddLoading, setGuestAddLoading] = React.useState(false);

  useEffect(() => {
    setGuestsList([{ firstName: '', lastName: '', id: crypto.randomUUID() }]);
  }, []);

  const [form] = Form.useForm();

  const handleFinish = async () => {
    setGuestAddLoading(true);
    const finalGuestsList: Guest[] = [];
    guestsList.forEach((guest) => {
      if (guest.firstName.trim() !== '' && guest.lastName.trim() !== '') {
        finalGuestsList.push({
          guestId: crypto.randomUUID(),
          submissionId: crypto.randomUUID(),
          fullName: `${guest.firstName} ${guest.lastName}`,
          firstName: guest.firstName.trim(),
          lastName: guest.lastName.trim(),
          primaryContactPhone: '-',
          dietaryRestrictions: '',
          totalGuests: 1,
          isAttending: true,
          eventId: eventId,
          tableId: null,
          date: new Date().getTime(),
          isPrimaryContact: true,
        });
      }
    });

    try {
      if (
        eventGuests.length + finalGuestsList.length >
        PLANYVITE_EVENT_PLAN_FEATURES[eventPlan].maxGuests
      ) {
        toast.error(
          `Nu poți adăuga mai mulți invitați. Limita pentru planul tău este de ${PLANYVITE_EVENT_PLAN_FEATURES[eventPlan].maxGuests} invitați.`
        );
        throw new Error('Guest limit exceeded for the current plan.');
      } else {
        await addGuestsService(eventId, userId, finalGuestsList);
        await refreshGuestList();
        setGuestAddLoading(false);
        form.resetFields();
        setGuestsList([
          { firstName: '', lastName: '', id: crypto.randomUUID() },
        ]);
        setAddGuestsModalOpen(false);
        toast.success('Invitații au fost adăugați cu succes!');
      }
    } catch (error) {
      setGuestAddLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setAddGuestsModalOpen} modal>
      <DialogContent className="mobiele-add-guests-modal h-[95dvh] overflow-hidden p-0 pt-6">
        <div className="w-full grid grid-cols-1 grid-rows-[1fr_auto_auto] items-start justify-items-center p-4 overflow-hidden h-full gap-2">
          {/* <div className="row-start-1 w-full flex flex-col items-center gap-2">
            <Button type="dashed" className="w-full">
              Importa din Excel
            </Button>
          </div> */}
          <div className="row-start-1 row-end-2 w-full overflow-hidden h-full">
            <div className="w-full h-full min-h-0 overflow-y-auto scrollbar-thin pr-2">
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
                            {
                              required: true,
                              message: 'Prenumele este necesar',
                            },
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
                          rules={[
                            { required: true, message: 'Numele este necesar' },
                          ]}
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
                            setGuestsList(
                              guestsList.filter((_, i) => i !== index)
                            );
                          }}
                          className={`${
                            index === 0 ? 'mt-[22px]' : 'mt-0'
                          } py-4`}
                        >
                          Șterge
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </Form>
            </div>
          </div>

          <div className="row-start-2 w-full flex items-center">
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
          </div>

          <div className="row-start-3 w-full flex flex-row justify-between gap-2 bg-white">
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
              Adaugă {guestsList.length} Invitat(ți)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddGuestsModal;
