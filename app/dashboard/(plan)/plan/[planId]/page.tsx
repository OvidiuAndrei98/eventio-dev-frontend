'use client';

import TablePlanRenderer from '@/app/dashboard/components/TablePlanRenderer';
import { useEventContext } from '@/core/context/EventContext';
import { Guest } from '@/core/types';
import { PLANYVITE_EVENT_PLAN_FEATURES } from '@/lib/planyviteEventPlanTiers';
import { updatePlanEventTableNameById } from '@/service/event/updatePlanEventTableName';
import { updatePlanEventTableOrganization } from '@/service/event/updatePlanEventTableOrganization';
import { addGuestsToPlanEventBatch } from '@/service/guest/addGuestsToPlanEventBatch';
import { assignTableToPlanEventGuests } from '@/service/guest/assignTableToPlanEventGuests';
import { queryPlanEventGuests } from '@/service/guest/queryPlanEventGuests';
import { queryPlanEventGuestsByTable } from '@/service/guest/queryPlanEventGuestsByTable';
import { Button } from 'antd';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PlanPage() {
  const { eventInstance } = useEventContext();
  const maxGuestsAvailable =
    PLANYVITE_EVENT_PLAN_FEATURES[eventInstance?.eventPlan || 'basic']
      .maxGuests;
  const isNonUltimate =
    !eventInstance?.eventPlan || eventInstance.eventPlan !== 'ultimate';

  const [guestsList, setGuestsList] = useState<Guest[]>([]);

  const fetchGuestList = async (eventId: string) => {
    const guests = await queryPlanEventGuests(
      eventId,
      eventInstance?.eventPlan || 'basic'
    );
    setGuestsList(guests);
  };

  useEffect(() => {
    if (eventInstance?.eventId) {
      fetchGuestList(eventInstance.eventId);
    }
  }, [eventInstance?.eventId]);

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="h-[calc(100%-58px)]">
        <TablePlanRenderer
          addGuestsService={addGuestsToPlanEventBatch}
          assignTableToGuestsService={assignTableToPlanEventGuests}
          queryGuestsByTableService={queryPlanEventGuestsByTable}
          queryGuestsService={queryPlanEventGuests}
          updateTablesService={updatePlanEventTableOrganization}
          guestListChanged={() => fetchGuestList(eventInstance!.eventId)}
          updateTableService={updatePlanEventTableNameById}
        />
      </div>
    </div>
  );
}
