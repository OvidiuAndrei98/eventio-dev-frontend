import MultiselectDropdown from '@/components/multiselectDropdown/MultiselectDropdown'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Guest } from '@/core/types'
import { queryConfirmedGuestsByEventId } from '@/service/guest/queryConfirmedGuestsByEventId'
import { DeleteOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import React, { useState } from 'react'

const LateralDrawer = ({
  eventId,
  tableEditActive,
  setTableEditActive,
}: {
  eventId: string
  tableEditActive: boolean
  setTableEditActive: (state: boolean) => void
}) => {
  const [value, setValue] = useState<{ label: string; value: string }[]>([])

  async function fetchGuestList(eventId: string): Promise<Guest[]> {
    const guests = await queryConfirmedGuestsByEventId(eventId)
    return guests
  }

  return (
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
        <div className="py-0 px-4 flex flex-col items-center gap-4">
          <h1 className="text-md font-nomral self-start">Invitati</h1>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-200">
              <span className="text-sm font-medium">Penica Andrei</span>
              <DeleteOutlined className="hover:!text-red-500 cursor-pointer" />
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-200">
              <span className="text-sm font-medium">Penica Andrei</span>
              <DeleteOutlined className="hover:!text-red-500 cursor-pointer" />
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-200">
              <span className="text-sm font-medium">Penica Andrei</span>
              <DeleteOutlined className="hover:!text-red-500 cursor-pointer" />
            </div>
          </div>
          <Button type="default" className="mx-[auto]">
            Adauga invitati
          </Button>
          <MultiselectDropdown
            eventId={eventId}
            mode="multiple"
            value={value}
            placeholder="Select users"
            fetchOptions={fetchGuestList}
            style={{ width: '100%' }}
            onChange={(newValue) => {
              console.log(newValue)
              if (Array.isArray(newValue)) {
                setValue(newValue)
              }
            }}
          />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="primary">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default LateralDrawer
