import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from 'antd';
import { queryNotAssignedConfirmedGuestsByEventId } from '@/service/guest/queryNotAssignedConfirmedGuestsByEventId';
import { DropdownOption, Guest } from '@/core/types';
import { PLANYVITE_EVENT_PLAN_FEATURES } from '@/lib/planyviteEventPlanTiers';
import { useEventContext } from '@/core/context/EventContext';
import MultiselectDropdown from '@/components/multiselectDropdown/MultiselectDropdown';

type EventPlanKey = keyof typeof PLANYVITE_EVENT_PLAN_FEATURES;

interface ModalProps {
  eventId: string;
  isOpen: boolean;
  guestList: Guest[];
  updateGuestList: (values: DropdownOption[]) => void;
  onOpenChange?: (open: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onOpenChange,
  updateGuestList,
  guestList,
}) => {
  const [value, setValue] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    setValue([]);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} modal={true} onOpenChange={onOpenChange}>
      <DialogContent
        className="xs:max-w-[425px] bg-white  md:min-h-[300px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Adauga invitati</DialogTitle>
          <DialogDescription>
            Selecteaza invitatii din lista de mai jos, salveaza dupa ce termini.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <MultiselectDropdown
            mode="multiple"
            value={value}
            placeholder="Selecteaza invitatii"
            style={{ width: '100%' }}
            onChange={(newValue) => {
              if (Array.isArray(newValue)) {
                setValue(newValue);
              }
            }}
            options={guestList.map((guest) => ({
              label: guest.name,
              value: guest.guestId,
            }))}
          />
        </div>
        <DialogFooter>
          <Button
            type="default"
            className="self-end"
            onClick={() => {
              updateGuestList(value), onOpenChange?.(false);
            }}
          >
            Adauga
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
