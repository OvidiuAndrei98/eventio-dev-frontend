import { Collapse } from 'antd';
import ConfirmationCardHeader from './ConfirmationCardHeader';
import { SmileOutlined, StarOutlined } from '@ant-design/icons';
import './ConfirmationsTable.css';
import ConfirmationCardContent from './ConfirmationCardContent';
import { Guest } from '@/core/types';
import { useContext, useEffect, useState } from 'react';
import { EventContext } from '@/core/context/EventContext';
import Image from 'next/image';
import NoDataIllustration from '@/public/no-data-illustration.svg';

interface ConfirmationsTableProps {
  guests: Guest[];
}

const ConfirmationsTable = ({ guests }: ConfirmationsTableProps) => {
  const [confirmedGuests, setConfirmedGuests] = useState<Guest[]>([]);
  const { eventInstance } = useContext(EventContext);

  const isBasicPlan =
    !eventInstance?.eventPlan || eventInstance.eventPlan === 'basic';

  useEffect(() => {
    const confirmedGuestsList = guests.filter((guest) => guest.isAttending);
    setConfirmedGuests(confirmedGuestsList);
  }, [guests]);

  if (confirmedGuests.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <h1 className="primary-title text-center">
          Nu există răspunsuri confirmate
        </h1>
        <Image src={NoDataIllustration} alt="No-data" />
      </div>
    );
  }

  return (
    <div className="confirmations-container">
      <div className="confirmations-table-container">
        {isBasicPlan && (
          <div className="text-[var(--primary-color)] text-center font-medium response-alert">
            Pentru a vedea toate răspunsurile, ai nevoie de planul{' '}
            <span className="font-bold text-[var(--premium-color)]">
              Premium
            </span>{' '}
            sau <span className="font-bold">Ultimate</span>.
          </div>
        )}
        <div className="flex justify-between py-2 items-center">
          <span className="secondary-title">
            Raspunsuri confirmate
            {isBasicPlan && (
              <span style={{ color: '#FFB347', marginLeft: 6 }}>
                <StarOutlined />
              </span>
            )}
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
