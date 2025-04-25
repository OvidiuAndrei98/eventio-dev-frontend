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
import { CanvasElement, DropdownOption, EventInstance } from '@/core/types'
import { updateTableNameById } from '@/service/event/updateTableNameById'
import { assignTableToGuests } from '@/service/guest/assignTableToGuest'
import { queryGuestsByTable } from '@/service/guest/queryGuestsByTable'
import { DeleteOutlined } from '@ant-design/icons'
import { Button, Form, FormProps, Input } from 'antd'
import React, { use, useEffect, useState } from 'react'
import { toast } from 'sonner'

type FieldType = {
  name: string
}

const LateralDrawer = ({
  tableElement,
  eventId,
  tableEditActive,
  setTableEditActive,
  setEventInstance,
}: {
  tableElement: CanvasElement
  eventId: string
  tableEditActive: boolean
  setTableEditActive: (state: boolean) => void
  setEventInstance: (event: EventInstance) => void
}) => {
  const [form] = Form.useForm()
  const [addGuestsOpen, setAddGuestsOpen] = useState(false)
  const [tableGuests, setTableGuests] = useState<DropdownOption[]>([])
  const [removedGuestsList, setRemovedGuestsList] = useState<DropdownOption[]>(
    []
  )
  const [inputValue, setInputValue] = useState<string>(tableElement.name)

  const queryTableGuests = async () => {
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
    queryTableGuests()
  }, [])

  useEffect(() => {
    setInputValue(tableElement.name)
  }, [tableElement.name])

  useEffect(() => {
    queryTableGuests()
    form.setFieldsValue({
      name: tableElement?.name,
    })
  }, [tableElement?.elementId, tableEditActive, tableElement.name])

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

  const onFinish: FormProps<FieldType>['onFinish'] = async () => {
    const updatedEvent = await updateTableNameById(
      inputValue,
      tableElement?.elementId,
      eventId
    )
    updateGuestsTableRef()
    setEventInstance(updatedEvent)
    toast.success('Masa actualizata cu succes')
    setTableEditActive(false)
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = () => {
    toast.error('Masa nu a putut fii actualizata')
  }

  return (
    <>
      <Sheet open={tableEditActive} onOpenChange={setTableEditActive}>
        <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <SheetHeader>
            <SheetTitle className="text-xl">Editeaza masa</SheetTitle>
            <SheetDescription>
              Editeaza masa. Apasa pe save cand ai terminat.
            </SheetDescription>
          </SheetHeader>
          <div className="p-4">
            <h1 className="text-md font-nomral mb-2">Detalii masa</h1>
            <Form
              form={form}
              autoFocus={false}
              name="table-edit"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                label="Nume"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Numele este obligatoriu.',
                  },
                ]}
              >
                <Input onChange={(e) => setInputValue(e.target.value)} />
              </Form.Item>
            </Form>
          </div>
          <div className="py-0 flex flex-col max-h-[60%] overflow-hidden items-center gap-4">
            <h1 className="text-md font-nomral self-start ml-4">Invitati</h1>
            <div className="flex flex-col gap-4 w-full overflow-y-auto py-2 px-4">
              {tableGuests.length ? (
                tableGuests.map((guest) => (
                  <div
                    className="flex items-center justify-between p-2 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-200"
                    key={guest.value}
                  >
                    <span className="text-sm font-medium">{guest.label}</span>
                    <DeleteOutlined
                      className="hover:!text-red-500 cursor-pointer"
                      onClick={() => handleGuestsDelete(guest)}
                    />
                  </div>
                ))
              ) : (
                <span className="text-sm self-center text-slate-600">
                  Inca nu ai adaugat niciun invitat
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
              <Button type="primary" onClick={() => form.submit()}>
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
