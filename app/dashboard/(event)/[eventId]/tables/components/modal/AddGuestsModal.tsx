import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from 'antd'
import MultiselectDropdown from '../../../../../../../components/multiselectDropdown/MultiselectDropdown'
import { queryConfirmedGuestsByEventId } from '@/service/guest/queryConfirmedGuestsByEventId'
import { DropdownOption } from '@/core/types'

interface ModalProps {
  eventId: string
  isOpen: boolean
  updateGuestList: (values: DropdownOption[]) => void
  onOpenChange?: (open: boolean) => void
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onOpenChange,
  eventId,
  updateGuestList,
}) => {
  const [value, setValue] = useState<{ label: string; value: string }[]>([])

  useEffect(() => {
    setValue([])
  }, [isOpen])

  async function fetchGuestList(
    eventId: string
  ): Promise<{ label: string; value: string }[]> {
    const guests = await queryConfirmedGuestsByEventId(eventId)
    return guests.map((guest) => {
      return {
        label: guest.guestInfo.name,
        value: guest.guestId,
      }
    })
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
                setValue(newValue)
              }
            }}
          />
        </div>
        <DialogFooter>
          <Button
            type="default"
            className="self-end"
            onClick={() => {
              updateGuestList(value), onOpenChange?.(false)
            }}
          >
            Adauga
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Modal
