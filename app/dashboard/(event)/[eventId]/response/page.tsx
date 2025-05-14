'use client';

import { Tabs, TabsProps } from 'antd';
import './page.css';
import SummaryTable from './components/SummaryTable';
import ConfirmationsTable from './components/confirmationsTable/ConfirmationsTable';
import RefusalsTable from './components/refusalsTable/RefusalsTable';
import { useEffect, useState } from 'react';
import { Guest } from '@/core/types';
import { useEventContext } from '@/core/context/EventContext';
import { queryGuestsByEvent } from '@/service/guest/queryGuestsByEvent';
import { toast } from 'sonner';

const ResponsePage = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const { eventInstance } = useEventContext();

  useEffect(() => {
    if (eventInstance?.eventId) {
      try {
        queryGuestList(eventInstance.eventId);
      } catch (error) {
        toast.error('Eroare la incarcarea listei de invitati');
      }
    }
  }, [eventInstance]);

  const queryGuestList = async (eventId: string) => {
    const guestsList = await queryGuestsByEvent(eventId);
    setGuests(guestsList);
  };
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Sumar',
      children: <SummaryTable guests={guests} />,
    },
    {
      key: '2',
      label: 'Confirmari',
      children: <ConfirmationsTable />,
    },
    {
      key: '3',
      label: 'Refuzuri',
      children: <RefusalsTable />,
    },
  ];

  return (
    <div className="response-container">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};

export default ResponsePage;
