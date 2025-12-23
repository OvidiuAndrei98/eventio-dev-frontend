'use client';

import MobileTablePlanContainer from '@/app/dashboard/components/mobile-table-plan/MobileTablePlanContainer';
import TablePlanRenderer from '@/app/dashboard/components/TablePlanRenderer';
import { updatePlanEventTableNameById } from '@/service/event/updatePlanEventTableName';
import { updatePlanEventTableOrganization } from '@/service/event/updatePlanEventTableOrganization';
import { addGuestsToPlanEventBatch } from '@/service/guest/addGuestsToPlanEventBatch';
import { assignTableToPlanEventGuests } from '@/service/guest/assignTableToPlanEventGuests';
import { queryPlanEventGuests } from '@/service/guest/queryPlanEventGuests';
import { queryPlanEventGuestsByTable } from '@/service/guest/queryPlanEventGuestsByTable';
import { useEffect, useState } from 'react';

export default function PlanPage() {
  const [isMobile, setIsMobile] = useState(false);

  // Functie de detectare a ecranului mobil
  const checkIsMobile = () => {
    if (typeof window === 'undefined') return false;
    const isTouchScreen =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth < 768;
    return isTouchScreen || isSmallScreen;
  };

  useEffect(() => {
    const mobile = checkIsMobile();
    setIsMobile(mobile);

    const handleResize = () => {
      const newMobileStatus = checkIsMobile();
      if (newMobileStatus !== isMobile) {
        setIsMobile(newMobileStatus);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="h-[calc(100%-58px)]">
        {isMobile ? (
          <MobileTablePlanContainer
            updateTablesService={updatePlanEventTableOrganization}
            addGuestsService={addGuestsToPlanEventBatch}
            assignTableToGuestsService={assignTableToPlanEventGuests}
            queryEventGuestsService={queryPlanEventGuests}
            updateTableDetailsService={updatePlanEventTableNameById}
          />
        ) : (
          <TablePlanRenderer
            queryTableGuestsService={queryPlanEventGuestsByTable}
            addGuestsService={addGuestsToPlanEventBatch}
            assignTableToGuestsService={assignTableToPlanEventGuests}
            queryGuestsByTableService={queryPlanEventGuestsByTable}
            queryGuestsService={queryPlanEventGuests}
            updateTablesService={updatePlanEventTableOrganization}
            updateTableService={updatePlanEventTableNameById}
          />
        )}
      </div>
    </div>
  );
}
