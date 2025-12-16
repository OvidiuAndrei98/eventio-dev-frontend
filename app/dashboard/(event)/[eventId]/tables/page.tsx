'use client';

import MobileTablePlanContainer from '@/app/dashboard/components/mobile-table-plan/MobileTablePlanContainer';
import TablePlanRenderer from '@/app/dashboard/components/TablePlanRenderer';
import { updateEventTableOrganization } from '@/service/event/updateEventTableOrganization';
import { updateTableNameById } from '@/service/event/updateTableNameById';
import { addGuestsToEventBatch } from '@/service/guest/addGuestsToEventBatch';
import { assignTableToGuests } from '@/service/guest/assignTableToGuest';
import { queryGuestsByEvent } from '@/service/guest/queryGuestsByEvent';
import { queryGuestsByTable } from '@/service/guest/queryGuestsByTable';
import { useEffect, useState } from 'react';

const TablesPage = () => {
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
    <div className="h-[calc(100%-58px)]">
      {isMobile ? (
        <MobileTablePlanContainer
          assignTableToGuestsService={assignTableToGuests}
          queryTableGuestsService={queryGuestsByTable}
          updateTableDetailsService={updateTableNameById}
        />
      ) : (
        <TablePlanRenderer
          queryTableGuestsService={queryGuestsByTable}
          addGuestsService={addGuestsToEventBatch}
          assignTableToGuestsService={assignTableToGuests}
          queryGuestsByTableService={queryGuestsByTable}
          queryGuestsService={queryGuestsByEvent}
          updateTablesService={updateEventTableOrganization}
          updateTableService={updateTableNameById}
        />
      )}
    </div>
  );
};

export default TablesPage;
