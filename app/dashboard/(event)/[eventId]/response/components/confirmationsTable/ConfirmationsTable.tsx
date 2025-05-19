import { Collapse } from 'antd';
import ConfirmationCardHeader from './ConfirmationCardHeader';
import { SmileOutlined } from '@ant-design/icons';
import './ConfirmationsTable.css';
import ConfirmationCardContent from './ConfirmationCardContent';
import { Guest } from '@/core/types';
import { useEffect, useState } from 'react';

interface ConfirmationsTableProps {
  guests: Guest[];
}

const ConfirmationsTable = ({ guests }: ConfirmationsTableProps) => {
  const [confirmedGuests, setConfirmedGuests] = useState<Guest[]>([]);

  useEffect(() => {
    const confirmedGuestsList = guests.filter((guest) => guest.isAttending);
    setConfirmedGuests(confirmedGuestsList);
  }, [guests]);

  return (
    <div className="confirmations-container">
      <div className="confirmations-table-container">
        <div className="flex justify-between px-4 py-2 items-center">
          <span className="secondary-title !text-lg md:!text-2xl">
            Raspunsuri confirmate
          </span>
          <div className="bg-[#E8FFE8] p-2 md:py-3 md:px-3 flex gap-2 items-center rounded-md border-1 border-dotted border-[#83ff83]">
            <SmileOutlined style={{ color: 'green', fontSize: 20 }} />
            Confirmari
            <span>{guests.filter((guest) => guest.isAttending).length}</span>
          </div>
        </div>
        <div className="confirmations-table-header">
          <span>Invitat</span>
          <span>Data</span>
          <span>Detalii</span>
        </div>
        <div className="collapsible-table">
          <Collapse
            collapsible="icon"
            accordion
            expandIconPosition="end"
            items={confirmedGuests.map((guest, index) => {
              return {
                key: index,
                label: <ConfirmationCardHeader guest={guest} />,
                children: <ConfirmationCardContent guest={guest} />,
              };
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationsTable;
