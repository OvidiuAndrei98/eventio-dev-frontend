'use client';

import React, { useEffect } from 'react';
import { Button, Input, Form, InputNumber } from 'antd'; // Folosim Ant Design pentru Formular
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
import { CanvasElement } from '@/core/types';

interface TableDetailsDrawerProps {
  table: CanvasElement;
  isOpen: boolean;
  onClose: () => void;
  onSaveDetails: (
    tableId: string,
    newDetails: { name: string; seats: number }
  ) => Promise<void>;
  isSaving: boolean;
}

const TableDetailsDrawer = ({
  table,
  isOpen,
  onClose,
  onSaveDetails,
  isSaving,
}: TableDetailsDrawerProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen && table) {
      form.setFieldsValue({
        name: table.name,
        seats: table.seats,
      });
    }
  }, [isOpen, table, form]);

  const handleSave = async (values: { name: string; seats: number }) => {
    try {
      await onSaveDetails(table.elementId, values);
      toast.success(`Detaliile mesei '${values.name}' au fost salvate.`);
      onClose(); // Închide Drawer-ul la succes
    } catch (error) {
      console.error('Eroare la salvarea detaliilor mesei:', error);
      toast.error('A apărut o eroare la salvarea detaliilor.');
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="bottom">
      <DrawerContent className="max-h-[50vh] w-full mx-auto md:max-w-md">
        <DrawerHeader>
          <DrawerTitle>Editează Detaliile Mesei</DrawerTitle>
          <DrawerDescription>
            Ajustează numele și capacitatea mesei.
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 flex-grow overflow-hidden">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{ name: table.name, seats: table.seats }}
          >
            {/* Input Nume Masă */}
            <Form.Item
              name="name"
              label="Numele Mesei"
              rules={[
                { required: true, message: 'Numele mesei este obligatoriu!' },
              ]}
            >
              <Input placeholder="Ex: Masa Tineretului" />
            </Form.Item>

            <Form.Item
              name="seats"
              label="Număr Locuri"
              rules={[
                {
                  required: true,
                  message: 'Numărul de locuri este obligatoriu!',
                },
              ]}
            >
              <InputNumber
                min={1}
                max={100}
                placeholder="10"
                className="w-full"
              />
            </Form.Item>

            <DrawerFooter className="p-0 mt-6 border-t-0">
              <div className="flex justify-between gap-2">
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={isSaving}
                  className="flex-grow"
                >
                  Salvează Detaliile
                </Button>
                <DrawerClose asChild>
                  <Button
                    type="default"
                    size="large"
                    onClick={onClose}
                    className="flex-grow"
                  >
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

export default TableDetailsDrawer;
