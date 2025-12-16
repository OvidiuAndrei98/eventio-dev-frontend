'use client';

import TablePlanRenderer from '@/app/dashboard/components/TablePlanRenderer';
import { updateEventTableOrganization } from '@/service/event/updateEventTableOrganization';
import { updateTableNameById } from '@/service/event/updateTableNameById';
import { addGuestsToEventBatch } from '@/service/guest/addGuestsToEventBatch';
import { assignTableToGuests } from '@/service/guest/assignTableToGuest';
import { queryGuestsByEvent } from '@/service/guest/queryGuestsByEvent';
import { queryGuestsByTable } from '@/service/guest/queryGuestsByTable';

const TablesPage = () => {
  return (
    <div className="h-[calc(100%-58px)]">
      <TablePlanRenderer
        queryTableGuestsService={queryGuestsByTable}
        addGuestsService={addGuestsToEventBatch}
        assignTableToGuestsService={assignTableToGuests}
        queryGuestsByTableService={queryGuestsByTable}
        queryGuestsService={queryGuestsByEvent}
        updateTablesService={updateEventTableOrganization}
        updateTableService={updateTableNameById}
      />
    </div>
  );
};

export default TablesPage;
