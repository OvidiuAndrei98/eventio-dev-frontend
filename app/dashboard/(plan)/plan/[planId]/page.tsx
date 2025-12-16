'use client';

import TablePlanRenderer from '@/app/dashboard/components/TablePlanRenderer';
import { updatePlanEventTableNameById } from '@/service/event/updatePlanEventTableName';
import { updatePlanEventTableOrganization } from '@/service/event/updatePlanEventTableOrganization';
import { addGuestsToPlanEventBatch } from '@/service/guest/addGuestsToPlanEventBatch';
import { assignTableToPlanEventGuests } from '@/service/guest/assignTableToPlanEventGuests';
import { queryGuestsByTable } from '@/service/guest/queryGuestsByTable';
import { queryPlanEventGuests } from '@/service/guest/queryPlanEventGuests';
import { queryPlanEventGuestsByTable } from '@/service/guest/queryPlanEventGuestsByTable';

export default function PlanPage() {
  return (
    <div className="h-screen w-full flex flex-col">
      <div className="h-[calc(100%-58px)]">
        <TablePlanRenderer
          queryTableGuestsService={queryPlanEventGuestsByTable}
          addGuestsService={addGuestsToPlanEventBatch}
          assignTableToGuestsService={assignTableToPlanEventGuests}
          queryGuestsByTableService={queryPlanEventGuestsByTable}
          queryGuestsService={queryPlanEventGuests}
          updateTablesService={updatePlanEventTableOrganization}
          updateTableService={updatePlanEventTableNameById}
        />
      </div>
    </div>
  );
}
