'use client';

import React, { useEffect } from 'react';
import { Button, Input, Form, InputNumber, Radio } from 'antd';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';

import { toast } from 'sonner';
import { PLANYVITE_EVENT_PLAN_FEATURES } from '@/lib/planyviteEventPlanTiers';
import {
  CanvasElement,
  EventInstance,
  eventTableOrganization,
} from '@/core/types';

interface AddTableDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTable: (
    eventTableOrganization: eventTableOrganization,
    eventId: string
  ) => Promise<void>;
  eventPlan: keyof typeof PLANYVITE_EVENT_PLAN_FEATURES;
  eventTablesCount: number;
  eventInstance: EventInstance | null;
  setEventInstance: (event: EventInstance) => void;
}

const AddTableDrawer = ({
  isOpen,
  onClose,
  onCreateTable,
  eventPlan,
  eventTablesCount,
  eventInstance,
  setEventInstance,
}: AddTableDrawerProps) => {
  const [form] = Form.useForm();
  const [isCreatingTable, setIsCreatingTable] = React.useState(false);
  const [tableType, setTableType] = React.useState<
    'round-table' | 'horizontal-table' | 'vertical-table'
  >('round-table');

  useEffect(() => {
    form.setFieldsValue({ type: tableType });
  }, [tableType, form]);

  const handleSubmit = async (values: {
    name: string;
    seats: number;
    type: string;
  }) => {
    if (isCreatingTable) return;
    setIsCreatingTable(true);
    if (!values.name || !values.seats) {
      toast.error('Te rugăm să completezi toate câmpurile necesare.');
      return;
    }
    if (
      eventTablesCount >
      PLANYVITE_EVENT_PLAN_FEATURES[eventPlan].maxTablePlanElements
    ) {
      toast.error(
        'Ai atins numărul maxim de mese permise pentru planul tău actual.'
      );
      return;
    }

    const canvasElement: CanvasElement = {
      elementId: crypto.randomUUID(),
      type: 'table',
      typeId: values.type,
      name: values.name,
      seats: values.seats,
      positions: { x: 50, y: 50 },
      guestCount: 0,
      number: eventTablesCount + 1,
    };
    try {
      await addTableToEvent(canvasElement);
      form.resetFields();
      onClose();
      setIsCreatingTable(false);
      setEventInstance({
        ...eventInstance!,
        eventTableOrganization: {
          ...eventInstance!.eventTableOrganization,
          elements: [
            ...eventInstance!.eventTableOrganization.elements,
            canvasElement,
          ],
        },
      });
      toast.success('Masa a fost adăugată cu succes!');
    } catch (error) {
      toast.error('Nu am putut adăuga masa.');
      setIsCreatingTable(false);
    }
  };

  const addTableToEvent = async (canvasElement: CanvasElement) => {
    if (!eventInstance) return;

    const updatedElements = [
      ...eventInstance.eventTableOrganization.elements,
      canvasElement,
    ];

    await onCreateTable(
      {
        elements: updatedElements,
      },
      eventInstance.eventId
    );
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="bottom">
      <DrawerContent className="max-h-[95vh] w-full mx-auto md:max-w-md">
        <DrawerHeader>
          <DrawerTitle>Adaugă Masă Nouă</DrawerTitle>
          <DrawerDescription>
            Configurează tipul și capacitatea noii mese de pe plan.
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 overflow-y-auto">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ type: 'round', seats: 10 }}
          >
            {/* Selecție Tip Masă */}
            <Form.Item
              name="type"
              label="Tipul Mesei"
              rules={[{ required: true }]}
            >
              <Radio.Group
                className="w-full"
                value={tableType}
                onChange={(e) =>
                  setTableType(
                    e.target.value as
                      | 'round-table'
                      | 'horizontal-table'
                      | 'vertical-table'
                  )
                }
              >
                <div className="grid grid-cols-3 gap-2">
                  <Radio.Button
                    value="round-table"
                    className="h-20 flex flex-col items-center justify-center text-center"
                  >
                    <div className="text-xl">◯</div>
                    <div className="text-[10px]">Rotundă</div>
                  </Radio.Button>
                  <Radio.Button
                    value="horizontal-table"
                    className="h-20 flex flex-col items-center justify-center text-center"
                  >
                    <div className="text-xl">▭</div>
                    <div className="text-[10px]">Orizontală</div>
                  </Radio.Button>
                  <Radio.Button
                    value="vertical-table"
                    className="h-20 flex flex-col items-center justify-center text-center"
                  >
                    <div className="text-xl rotate-90">▭</div>
                    <div className="text-[10px]">Verticală</div>
                  </Radio.Button>
                </div>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="name"
              label="Nume/Număr Masă"
              rules={[
                { required: true, message: 'Introdu un nume pentru masă' },
              ]}
            >
              <Input placeholder="Ex: Masa 12 sau VIP 1" size="large" />
            </Form.Item>

            <Form.Item
              name="seats"
              label="Număr de Locuri"
              rules={[
                { required: true, message: 'Specifică numărul de locuri' },
              ]}
            >
              <InputNumber min={1} max={50} className="w-full" size="large" />
            </Form.Item>

            <DrawerFooter className="px-0 mt-8">
              <div className="flex flex-row gap-2 w-full">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={isCreatingTable}
                  className="w-full h-12 text-lg"
                >
                  Creează Masa
                </Button>
                <DrawerClose asChild>
                  <Button type="default" size="large" className="w-full">
                    Anulează
                  </Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddTableDrawer;
