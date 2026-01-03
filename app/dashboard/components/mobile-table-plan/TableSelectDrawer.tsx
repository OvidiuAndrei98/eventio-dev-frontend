'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button, List, Tag, Checkbox } from 'antd'; // Utilizăm Checkbox de la Ant Design
import { Guest } from '@/core/types'; // Asigurăm importul tipului Guest
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

interface TableSelectDrawerProps {
  guestName: string;
  unseatedGuests: Guest[];
  availableSeats: number;
  isAssigning: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (guestsToAssign: Guest[]) => void;
}

const TableSelectDrawer = ({
  guestName,
  unseatedGuests,
  availableSeats,
  isOpen,
  onSelect,
  onClose,
  isAssigning,
}: TableSelectDrawerProps) => {
  const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedGuestIds([]);
    }
  }, [isOpen]);

  const selectedGuests = useMemo(() => {
    return unseatedGuests.filter((guest) =>
      selectedGuestIds.includes(guest.guestId)
    );
  }, [selectedGuestIds, unseatedGuests]);

  const handleGuestToggle = (guest: Guest, isChecked: boolean) => {
    if (isChecked) {
      if (selectedGuestIds.length < availableSeats) {
        setSelectedGuestIds((prev) => [...prev, guest.guestId]);
      } else {
        toast.warning(
          `Masa ${guestName} mai are doar ${availableSeats} locuri libere.`
        );
      }
    } else {
      setSelectedGuestIds((prev) => prev.filter((id) => id !== guest.guestId));
    }
  };

  const handleConfirmAssign = () => {
    if (selectedGuests.length === 0) {
      toast.warning('Vă rugăm selectați cel puțin un invitat.');
      return;
    }

    onSelect(selectedGuests);
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
          <DrawerTitle>Așează invitați la Masa: **{guestName}**</DrawerTitle>
          <DrawerDescription>
            Locuri disponibile: <Tag color="green">{availableSeats}</Tag> |
            Selectați: <Tag color="blue">{selectedGuestIds.length}</Tag>
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 flex-grow overflow-hidden">
          <h3 className="font-semibold mb-2">
            Invitați Neatribuiți ({unseatedGuests.length})
          </h3>
          <ScrollArea className="h-[calc(100%_-_24px)] w-full border rounded-md">
            <List
              size="small"
              dataSource={unseatedGuests}
              className="bg-white"
              renderItem={(guest) => {
                const isChecked = selectedGuestIds.includes(guest.guestId);
                const isDisabled =
                  !isChecked && selectedGuestIds.length >= availableSeats;

                return (
                  <List.Item className="!py-2 px-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center w-full">
                      <span>{guest.fullName}</span>
                      <Checkbox
                        checked={isChecked}
                        disabled={isDisabled}
                        onChange={(e) =>
                          handleGuestToggle(guest, e.target.checked)
                        }
                      />
                    </div>
                  </List.Item>
                );
              }}
            />
          </ScrollArea>
        </div>

        <DrawerFooter className="flex flex-row justify-between p-4 border-t">
          <Button
            type="primary"
            size="large"
            onClick={handleConfirmAssign}
            disabled={selectedGuests.length === 0}
            loading={isAssigning}
            className="flex-grow mr-2"
          >
            Așează {selectedGuests.length} invitat
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

export default TableSelectDrawer;
