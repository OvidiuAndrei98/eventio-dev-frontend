'use client';

import { useEffect, useMemo, useState } from 'react';
import '@/styles/globals.css';
import { EventInstance } from '@/core/types';
import { queryEventsByUser } from '@/service/event/queryEventsByUser';
import EventsTable from './components/eventsTable/EventsTable';
import { getColumns } from './components/eventsTable/columns';
import { Button } from 'antd';
import { PlusIcon } from 'lucide-react';
import NewInvitationModal from './components/newInvitationModal/NewInvitationModal';
import { useAuth } from '@/core/context/authContext';

const DashboardPage = () => {
  const [queryEventLoading, setQueryEventLoading] = useState(true);
  const [events, setEvents] = useState<EventInstance[]>([]);
  const user = useAuth().userDetails;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user?.userId) {
      setQueryEventLoading(false);
      return;
    }
    queryEventsByUser(user.userId).then((events) => {
      setEvents(events);
      setQueryEventLoading(false);
    });
  }, [user]);

  const handleEventDelete = (eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.eventId !== eventId)
    );
  };

  const onModalOk = () => {
    setOpen(false);
  };

  const onModalClose = () => {
    setOpen(false);
  };

  const columns = useMemo(
    () => getColumns({ handleEventDelete: handleEventDelete }),
    [handleEventDelete]
  );

  return (
    <div className="events-container h-full p-4 bg-[#F6F6F6] h-calc(100% - 48px) overflow-y-auto">
      <h1 className="text-2xl font-bold">Bine ai venit, {user?.displayName}</h1>
      <div className="container min-h-[300px] my-4 mx-auto p-4 bg-white rounded-md shadow-sm relative">
        {queryEventLoading ? (
          <span className="loader"></span>
        ) : (
          <>
            <div className="flex flex-row items-start justify-between">
              <div>
                <h1 className="font-semibold">Invitațiile mele</h1>
                <span className="text-sm text-slate-500">
                  {events.length} invitații
                </span>
              </div>
              <Button
                className="p-4"
                type="default"
                onClick={() => setOpen(true)}
              >
                <PlusIcon size={16} /> Invitație nouă
              </Button>
            </div>
            <EventsTable columns={columns} data={events} />
          </>
        )}
      </div>
      <div className="container mx-auto py-10 bg-white rounded-md shadow-sm p-4 flex flex-col items-center justify-center">
        {events.length === 0 ? (
          <h1 className="text-center text-black text-2xl font-bold">
            Nu ai evenimente adăugate
          </h1>
        ) : (
          <h1 className="text-center text-black text-2xl font-bold">
            Vrei să încerci și alt model?
          </h1>
        )}
        <span className="text-center text-slate-500">
          Ai la dispoziție un număr nelimitat de invitații.
        </span>
        <Button
          className="mt-4 p-4"
          type="primary"
          onClick={() => setOpen(true)}
        >
          Creează invitație
        </Button>
      </div>
      <NewInvitationModal open={open} onOk={onModalOk} onClose={onModalClose} />
    </div>
  );
};

export default DashboardPage;
