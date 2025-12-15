'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import '@/styles/globals.css';
import { EventInstance, EventPlan, PlanEventInstance } from '@/core/types';
import { queryEventsByUser } from '@/service/event/queryEventsByUser';
import EventsTable from './components/eventsTable/EventsTable';
import { getColumns } from './components/eventsTable/columns';
import { Button } from 'antd';
import { PlusIcon } from 'lucide-react';
import NewInvitationModal from './components/newInvitationModal/NewInvitationModal';
import { useAuth } from '@/core/context/authContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Input from 'antd/es/input/Input';
import { toast } from 'sonner';
import { createPlanEvent } from '@/service/event/createPlanEvent';
import { queryPlanEventsByUser } from '@/service/event/queryPlanEventsByUser';
import PlanEventsTable from './components/planEventsTable/PlanEventsTable';
import { getPlanColumns } from './components/planEventsTable/planColumns';

const DashboardPage = () => {
  const [queryEventLoading, setQueryEventLoading] = useState(true);
  const [queryPlanEventLoading, setQueryPlanEventLoading] = useState(true);
  const [events, setEvents] = useState<EventInstance[]>([]);
  const [planEvents, setPlanEvents] = useState<PlanEventInstance[]>([]);
  const [planName, setPlanName] = useState('');
  const user = useAuth().userDetails;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user?.userId) {
      setQueryEventLoading(false);
      setQueryPlanEventLoading(false);
      return;
    }
    queryEventsByUser(user.userId).then((events) => {
      setEvents(events);
      setQueryEventLoading(false);
    });
    queryPlanEventsByUser(user.userId).then((planEvents) => {
      setPlanEvents(planEvents);
      setQueryPlanEventLoading(false);
    });
  }, [user]);

  const handleEventDelete = useCallback((eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.eventId !== eventId)
    );
  }, []);

  const handlePlanEventDelete = useCallback((eventId: string) => {
    setPlanEvents((prevEvents) =>
      prevEvents.filter((event) => event.eventId !== eventId)
    );
  }, []);

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

  const planColumns = useMemo(
    () => getPlanColumns({ handleEventDelete: handlePlanEventDelete }),
    [handlePlanEventDelete]
  );

  const createNewPlan = async () => {
    if (planEvents.length > 0) {
      toast.error('Poți crea un singur plan în contul tău.');
      return;
    }

    const newPlanEvent: PlanEventInstance = {
      guests: [],
      eventDate: new Date().toISOString(),
      eventId: crypto.randomUUID(),
      eventName: planName,
      eventPlan: user?.planEventUltimateLicense
        ? EventPlan.ultimate
        : EventPlan.basic,
      userId: user!.userId,
      eventType: 'tablePlan',
      eventTableOrganization: {
        elements: [],
      },
    };
    await createPlanEvent(newPlanEvent, user!.userId);
    setPlanEvents((prevPlans) => [...prevPlans, newPlanEvent]);
    toast.success(`Planul "${planName}" a fost creat cu succes!`);
    // Resetează numele planului după creare
    setPlanName('');
  };

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
      <div className="location-plan-mngmt container min-h-[300px] my-4 mx-auto p-4 bg-white rounded-md shadow-sm relative">
        {queryPlanEventLoading ? (
          <span className="loader"></span>
        ) : (
          <>
            <div className="flex flex-row items-start justify-between">
              <div>
                <h1 className="font-semibold">Planurile mele</h1>
                <span className="text-sm text-slate-500">
                  {planEvents.length} Planuri
                </span>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="p-4 mr-2" type="default">
                    <PlusIcon size={16} /> Plan nou
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="mr-[100px]">
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Creează un plan</h3>
                    <Input
                      placeholder="Numele planului"
                      value={planName}
                      onChange={(e) => setPlanName(e.target.value)}
                    />
                    <Button
                      className="mt-4 w-full"
                      type="primary"
                      onClick={createNewPlan}
                    >
                      Creează plan
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <PlanEventsTable columns={planColumns} data={planEvents} />
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
