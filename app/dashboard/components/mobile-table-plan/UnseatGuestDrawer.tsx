'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button, List, Checkbox, Tag } from 'antd';
import { CanvasElement, Guest } from '@/core/types';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface UnseatGuestsDrawerProps {
  table: CanvasElement;
  isOpen: boolean;
  onClose: () => void;
  onUnseat: (guestsToUnseat: Guest[]) => void;
  isUnseating: boolean;
  tableGuests: Guest[];
}

const UnseatGuestsDrawer = ({
  table,
  isOpen,
  onClose,
  onUnseat,
  isUnseating,
  tableGuests,
}: UnseatGuestsDrawerProps) => {
  const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedGuestIds([]);
    }
  }, [isOpen]);

  const selectedGuests = useMemo(() => {
    return tableGuests.filter((guest) =>
      selectedGuestIds.includes(guest.guestId)
    );
  }, [selectedGuestIds, tableGuests]);

  const handleGuestToggle = (guestId: string, isChecked: boolean) => {
    setSelectedGuestIds((prev) =>
      isChecked ? [...prev, guestId] : prev.filter((id) => id !== guestId)
    );
  };

  const handleConfirmUnseat = () => {
    if (selectedGuests.length === 0) {
      toast.warning('Vă rugăm selectați cel puțin un invitat de scos.');
      return;
    }

    onUnseat(selectedGuests);
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={onClose}
      direction="bottom"
      repositionInputs={false}
    >
      <DrawerContent className="max-h-[90dvh] w-full mx-auto md:max-w-md">
        <DrawerHeader>
          <DrawerTitle>
            Scoate invitați de la Masa: **{table.name}**
          </DrawerTitle>
          <DrawerDescription>
            Total invitați așezați: <Tag color="blue">{table.guestCount}</Tag> |
            Selectați pentru scoatere:{' '}
            <Tag color="red">{selectedGuestIds.length}</Tag>
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 flex-grow overflow-hidden">
          <h3 className="font-semibold mb-2">Invitați Așezați</h3>
          <ScrollArea className="h-[60vh] w-full border rounded-md">
            {tableGuests.length === 0 ? (
              <p className="text-gray-500 p-4">
                Această masă nu are invitați așezați.
              </p>
            ) : (
              <List
                size="small"
                dataSource={tableGuests}
                className="bg-white"
                renderItem={(guest) => {
                  const isChecked = selectedGuestIds.includes(guest.guestId);
                  return (
                    <List.Item className="!py-2 px-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center w-full">
                        <span>{guest.fullName}</span>
                        <Checkbox
                          checked={isChecked}
                          onChange={(e) =>
                            handleGuestToggle(guest.guestId, e.target.checked)
                          }
                        />
                      </div>
                    </List.Item>
                  );
                }}
              />
            )}
          </ScrollArea>
        </div>

        <DrawerFooter className="flex flex-row justify-between p-4 border-t">
          <Button
            type="primary"
            danger
            size="large"
            onClick={handleConfirmUnseat}
            disabled={selectedGuests.length === 0}
            loading={isUnseating}
            className="flex-grow mr-2"
          >
            Scoate {selectedGuests.length} invitat
            {selectedGuests.length !== 1 ? 'i' : ''}
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UnseatGuestsDrawer;
