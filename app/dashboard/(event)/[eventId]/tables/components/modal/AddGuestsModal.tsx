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
import MultiselectDropdown from '../../../../../../../components/multiselectDropdown/MultiselectDropdown';
import { queryNotAssignedConfirmedGuestsByEventId } from '@/service/guest/queryNotAssignedConfirmedGuestsByEventId';
import { DropdownOption } from '@/core/types';
import { PLANYVITE_EVENT_PLAN_FEATURES } from '@/lib/planyviteEventPlanTiers';
import { EventContext, useEventContext } from '@/core/context/EventContext';

type EventPlanKey = keyof typeof PLANYVITE_EVENT_PLAN_FEATURES;

interface ModalProps {
  eventId: string;
  isOpen: boolean;
  updateGuestList: (values: DropdownOption[]) => void;
  onOpenChange?: (open: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onOpenChange,
  eventId,
  updateGuestList,
}) => {
  const [value, setValue] = useState<{ label: string; value: string }[]>([]);
  const { eventInstance } = useEventContext();
  const eventPlanKey: EventPlanKey =
    (eventInstance?.eventPlan as EventPlanKey) || 'basic';
  // Get the maximum number of guests available in the table plan based on the event plan
  // This is used to limit the number of guests that can be added to the table plan
  const maxGuestsAvailableInTablePlan =
    PLANYVITE_EVENT_PLAN_FEATURES[eventPlanKey].nrOfGuestsAvailableInTablePlan;

  useEffect(() => {
    setValue([]);
  }, [isOpen]);

  async function fetchGuestList(
    eventId: string
  ): Promise<{ label: string; value: string }[]> {
    const guests = await queryNotAssignedConfirmedGuestsByEventId(
      eventId,
      maxGuestsAvailableInTablePlan,
      eventInstance?.eventPlan || 'basic'
    );
    return guests.map((guest) => {
      return {
        label: guest.name,
        value: guest.guestId,
      };
    });
  }

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
            eventId={eventId}
            mode="multiple"
            value={value}
            placeholder="Selecteaza invitatii"
            fetchOptions={fetchGuestList}
            style={{ width: '100%' }}
            onChange={(newValue) => {
              if (Array.isArray(newValue)) {
                setValue(newValue);
              }
            }}
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
