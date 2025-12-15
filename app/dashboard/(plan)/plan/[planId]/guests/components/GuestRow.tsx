import { Guest } from '@/core/types';
import React from 'react';
import './GuestRow.css';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';

type GuestRowProps = {
  guest: Guest;
  deleteGuest: (
    guestId: string,
    eventId: string,
    guestSubmissionsTime: number,
    attending: boolean
  ) => Promise<void>;
};

/**
 * Lightweight summary row used in event response UI.
 * - label on the left, value on the right
 * - accepts children via `value` or `children`
 */
export default function GuestRow({
  guest,
  deleteGuest,
}: React.PropsWithChildren<GuestRowProps>) {
  return (
    <div className="guests-table-item">
      <section className="guest-name">{guest.name}</section>

      <section className="guest-date">
        {new Date(guest.date).toLocaleString('ro-RO', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'UTC',
        })}
      </section>
      <section className="guest-actions">
        <Popconfirm
          title="Șterge invitatul"
          description="Ești sigur că vrei să ștergi acest invitat?"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          cancelText="Anulează"
          okText="Șterge"
          onConfirm={() =>
            deleteGuest(
              guest.guestId,
              guest.eventId,
              guest.date,
              guest.isAttending
            )
          }
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </section>
    </div>
  );
}
