'use client';

import { SearchOutlined } from '@ant-design/icons';
import { Input, InputRef } from 'antd';
import { useEffect, useRef, useState } from 'react';
import '../guests/components/GuestsTable.css';
import { Guest } from '@/core/types';
import { useEventContext } from '@/core/context/EventContext';
import { queryPlanEventGuests } from '@/service/guest/queryPlanEventGuests';
import GuestRow from './components/GuestRow';
import { deletePlanEventGuestById } from '@/service/guest/deletePlanEventGuestById';

const GuestsPage = () => {
  const [searchText, setSearchText] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const { eventInstance } = useEventContext();

  const fetchGuests = async () => {
    if (!eventInstance) return;
    const guests = await queryPlanEventGuests(
      eventInstance.eventId,
      eventInstance.eventPlan
    );
    setGuests(guests);
  };

  useEffect(() => {
    fetchGuests();
  }, [eventInstance]);

  // TODO optimize deleteGuest to not re-fetch all guests
  const deleteGuest = async (
    guestId: string,
    eventId: string
  ): Promise<void> => {
    try {
      await deletePlanEventGuestById(guestId, eventId);
      await fetchGuests();
    } catch (error) {
      console.error('Eroare la ștergerea invitatului:', error);
    }
  };

  return (
    <div className="paln-guests-container summary-container-outer p-4 bg-gray-50 w-full h-full">
      <div className="summary-container">
        <div className="flex row items-center justify-between border p-[8px] gap-[16px]">
          <Input
            placeholder="Cauta invitat"
            suffix={<SearchOutlined />}
            className="max-w-[200px]"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            ref={searchInput}
          />
        </div>
        <div className="table-container">
          <section className="summary-header guests-table-item">
            <span className="guest-name">Nume Invitat</span>
            <span className="guest-date">Data</span>
            <span className="guest-action">Acțiune</span>
          </section>
          {guests
            .filter((g) => g)
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .filter((guest) => {
              if (searchText === '') return true;
              return guest.fullName
                .toLowerCase()
                .includes(searchText.toLowerCase());
            })
            .map((guest) => (
              <GuestRow
                key={guest.guestId}
                guest={guest}
                deleteGuest={deleteGuest}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
export default GuestsPage;
