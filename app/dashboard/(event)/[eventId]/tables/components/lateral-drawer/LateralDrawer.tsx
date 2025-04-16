import Modal from '@/app/dashboard/(event)/[eventId]/tables/components/modal/AddGuestsModal'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { CanvasElement, DropdownOption, Guest } from '@/core/types'
import { assignTableToGuests } from '@/service/guest/assignTableToGuest'
import { queryGuestsByTable } from '@/service/guest/queryGuestsByTable'
import { DeleteOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import React, { useEffect, useState } from 'react'

const LateralDrawer = ({
  tableElement,
  eventId,
  tableEditActive,
  setTableEditActive,
}: {
  tableElement: CanvasElement | null
  eventId: string
  tableEditActive: boolean
  setTableEditActive: (state: boolean) => void
}) => {
  const [addGuestsOpen, setAddGuestsOpen] = useState(false)
  const [tableGuests, setTableGuests] = useState<DropdownOption[]>([])
  const [removedGuestsList, setRemovedGuestsList] = useState<DropdownOption[]>(
    []
  )

  const queryTableQuests = async () => {
    if (tableElement?.elementId) {
      const guests = await queryGuestsByTable(eventId, tableElement?.elementId)
      setTableGuests(
        guests.map((guest) => {
          return { label: guest.guestInfo.name, value: guest.guestId }
        })
      )
    }
  }

  // Initial query
  useEffect(() => {
    queryTableQuests()
  }, [])

  useEffect(() => {
    queryTableQuests()
  }, [tableElement?.elementId, tableEditActive])

  const handleGuestsDelete = (guest: DropdownOption) => {
    setRemovedGuestsList((oldValues) => {
      return [...oldValues, guest]
    })
    setTableGuests((oldValues) => {
      return [...oldValues.filter((g) => g.value !== guest.value)]
    })
  }

  const updateGuestsTableRef = async () => {
    assignTableToGuests(tableElement?.elementId, tableGuests)
    if (removedGuestsList.length) {
      assignTableToGuests(null, removedGuestsList)
      // Reset the list after each save
      setRemovedGuestsList([])
    }
  }

  return (
    <>
      <Sheet open={tableEditActive} onOpenChange={setTableEditActive}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-xl">Editeaza masa</SheetTitle>
            <SheetDescription>
              Editeaza masa. Apasa pe save cand ai terminat.
            </SheetDescription>
          </SheetHeader>
          <div className="p-4">
            <h1 className="text-md font-nomral mb-2">Detalii masa</h1>
            <Form
              name="table-edit"
              // onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                initialValue={tableElement?.name}
                label="Nume"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Numele este obligatoriu.',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Form>
          </div>
          <div className="py-0 flex flex-col max-h-[60%] overflow-hidden items-center gap-4">
            <h1 className="text-md font-nomral self-start ml-4">Invitati</h1>
            <div className="flex flex-col gap-4 w-full overflow-y-auto py-2 px-4">
              {tableGuests.length ? (
                tableGuests.map((guest) => (
                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-200">
                    <span className="text-sm font-medium">{guest.label}</span>
                    <DeleteOutlined
                      className="hover:!text-red-500 cursor-pointer"
                      onClick={() => handleGuestsDelete(guest)}
                    />
                  </div>
                ))
              ) : (
                <span className="text-sm self-center text-slate-600">
                  Inca nu ai adaugat nici un invitat
                </span>
              )}
            </div>
            <Button
              type="default"
              className="mx-[auto]"
              onClick={() => setAddGuestsOpen(true)}
            >
              Adauga invitati
            </Button>
          </div>
          <SheetFooter>
            <SheetClose className="self-end flex gap-2">
              <Button type="default">Sterge masa</Button>
              <Button type="primary" onClick={updateGuestsTableRef}>
                Salveaza
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      {tableElement && (
        <Modal
          updateGuestList={(newValues: DropdownOption[]) =>
            setTableGuests((oldValues) => {
              return [
                ...oldValues,
                ...newValues.filter((v) =>
                  oldValues.every((o) => o.value !== v.value)
                ),
              ]
            })
          }
          isOpen={addGuestsOpen}
          onOpenChange={setAddGuestsOpen}
          eventId={eventId}
        />
      )}
    </>
  )
}

export default LateralDrawer
