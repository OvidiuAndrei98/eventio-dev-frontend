import { Guest } from '@/core/types';
import { addGuestToEvent } from '@/service/guest/addGuestToEvent';
import { Button, Form, Input } from 'antd';
import Modal from 'antd/es/modal/Modal';
import { useEffect } from 'react';
import { toast } from 'sonner';

export interface AddGuestFormProps {
  open: boolean;
  onOk: () => void;
  onClose: () => void;
  eventId: string;
  userId: string;
  canAddGuests: boolean;
  updateGuests?: (newGuest: Guest) => void;
}

interface AddGuestFormValues {
  firstName: string;
  lastName: string;
  dietaryRestrictions?: string;
}

/**
 * Form for adding a guest
 * @returns JSX.Element
 */
export function AddGuestForm({
  open,
  onOk,
  onClose,
  eventId,
  userId,
  canAddGuests,
  updateGuests,
}: AddGuestFormProps) {
  useEffect(() => {
    // Reset form fields when modal is opened
    if (open) {
      form.resetFields();
    }
  }, [open]);

  const [form] = Form.useForm<AddGuestFormValues>();
  const onFinish = async (values: AddGuestFormValues) => {
    try {
      if (!canAddGuests) {
        toast.error(
          'Nu poți adăuga mai mulți invitați. Atingerea limitei pentru planul tău actual.'
        );
        return;
      }
      const guest = {
        guestId: crypto.randomUUID(),
        submissionId: crypto.randomUUID(),
        fullName: `${values.firstName.trim()} ${values.lastName.trim()}`,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        primaryContactPhone: '-',
        dietaryRestrictions: values.dietaryRestrictions || '',
        totalGuests: 1,
        isAttending: true,
        eventId: eventId,
        tableId: null,
        date: new Date().getTime(),
        isPrimaryContact: true,
      };
      await addGuestToEvent(eventId, userId, guest);
      onOk();
      updateGuests && updateGuests(guest);
    } catch (error) {
      toast.error('A apărut o eroare la adăugarea invitatului.');
    }
  };

  return (
    <Modal
      className="add-guest-modal"
      title="Adaugă invitat"
      centered
      open={open}
      onCancel={onClose}
      maskClosable={false}
      width={{
        xs: '90%',
        sm: '80%',
        md: '40%',
        lg: '40%',
        xl: '40%',
        xxl: '40%',
      }}
      footer={false}
    >
      <Form<AddGuestFormValues>
        onFinish={onFinish}
        form={form}
        layout="vertical"
      >
        <div className="flex flex-row gap-2 w-full">
          <Form.Item
            label={'Prenume'}
            name={`firstName`}
            required
            className="w-full"
            rules={[{ required: true, message: 'Prenumele este necesar' }]}
          >
            <Input placeholder="Prenume" className="w-full" />
          </Form.Item>
          <Form.Item
            label={'Nume'}
            name={`lastName`}
            required
            className="w-full"
            rules={[{ required: true, message: 'Numele este necesar' }]}
          >
            <Input placeholder="Nume" className="w-full" />
          </Form.Item>
        </div>
        <Form.Item name="dietaryRestrictions">
          <Input.TextArea placeholder="Restricții alimentare" />
        </Form.Item>
        <Form.Item
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button type="primary" htmlType="submit">
            Adaugă invitat
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
