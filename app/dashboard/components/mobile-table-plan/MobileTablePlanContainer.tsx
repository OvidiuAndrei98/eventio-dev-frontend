'use client';

import { Button } from 'antd';
import { useEffect, useState } from 'react';
import ListBasedTableAssigner from './ListBasedTableAssigner';
import { useEventContext } from '@/core/context/EventContext';
import {
  CanvasElement,
  EventInstance,
  EventPlan,
  eventTableOrganization,
  Guest,
} from '@/core/types';
import { UserAddOutlined } from '@ant-design/icons';
import { DownloadIcon, ListCheck } from 'lucide-react';
import AddGuestsModal from './shared-components/AddGuestsModal';
import AddTableDrawer from './shared-components/AddTableModal';
import MobileDeviceNotice from './shared-components/MobileDeviceNotice';
import MobileTablePlanExportModal from '../table-plan-exports/MbilePlanExportModal';
import { createXlsxWorkbook } from '@/lib/utils';
import { toast } from 'sonner';

interface MobileTablePlanContainerProps {
  updateTableDetailsService: (
    name: string,
    seats: number,
    tableId: string,
    eventId: string
  ) => Promise<{ event: EventInstance; removedGuestIds: string[] }>;
  assignTableToGuestsService: (
    eventId: string,
    tableId: string | null,
    tableNumber: number | null | undefined,
    guests: { label: string; value: string }[]
  ) => Promise<void>;
  queryEventGuestsService: (
    eventId: string,
    tablePlan: string
  ) => Promise<Guest[]>;
  addGuestsService: (
    eventId: string,
    userId: string,
    guests: Guest[]
  ) => Promise<void>;
  updateTablesService: (
    eventTableOrganization: eventTableOrganization,
    eventId: string
  ) => Promise<void>;
}

const TablePlanContainer = (props: MobileTablePlanContainerProps) => {
  const [interactionMode, setInteractionMode] = useState<'canvas' | 'list'>(
    'list'
  );
  const { eventInstance, setEventInstance } = useEventContext();
  const [eventGuests, setEventGuests] = useState<Guest[]>([]);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [addGuestsModalOpen, setAddGuestsModalOpen] = useState(false);
  const [addTableModalOpen, setAddTableModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const fetchEventGuests = async () => {
    if (!eventInstance) return;
    const guests = await props.queryEventGuestsService(
      eventInstance.eventId,
      eventInstance.eventPlan
    );
    setEventGuests(guests);
    setCanvasElements(eventInstance?.eventTableOrganization.elements || []);
  };

  useEffect(() => {
    fetchEventGuests();
  }, [eventInstance]);

  const exportGuestsToExcel = async () => {
    const guestsTableOrganization: {
      tableName: string;
      guests: Guest[];
    }[] = [];

    if (eventInstance?.eventTableOrganization.elements) {
      await Promise.all(
        eventInstance.eventTableOrganization.elements.map(async (el) => {
          if (el.type === 'table') {
            const tableGuests: Guest[] = eventGuests.filter((guest) =>
              guest.tableId?.includes(el.elementId)
            );
            if (tableGuests.length) {
              guestsTableOrganization.push({
                tableName: el.name + (el.number ? ` (${el.number})` : ''),
                guests: tableGuests,
              });
            }
          }
        })
      );
      createXlsxWorkbook(guestsTableOrganization);
    } else {
      toast.error('Nu exista invitati asezati la mese pentru acest eveniment.');
    }
  };

  return (
    <div className="table-plan-app-wrapper bg-gray-50 h-[calc(100svh-64px)] w-full grid grid-cols-1 grid-rows-[auto_auto_1fr] p-2 gap-4">
      <MobileDeviceNotice />
      {/* Header-ul cu Butonul de Switch */}
      <div className="tables-controls-section p-2 flex gap-2 items-center justify-between border-b">
        <div className="flex flex-row gap-4 items-center">
          <Button
            onClick={() => setAddGuestsModalOpen(true)}
            icon={<UserAddOutlined />}
            className="!w-[48px] !h-[42px]"
          ></Button>
          <Button
            icon={<ListCheck />}
            className="!w-[42px] !h-[42px]"
            onClick={() => setAddTableModalOpen(true)}
          ></Button>
          <Button
            icon={<DownloadIcon />}
            className="!w-[42px] !h-[42px]"
            onClick={() => setExportModalOpen(true)}
          ></Button>
        </div>
        <Button
          className="!h-[48px]"
          type="default"
          disabled={interactionMode === 'list'}
          onClick={() =>
            setInteractionMode(interactionMode === 'canvas' ? 'list' : 'canvas')
          }
        >
          {interactionMode === 'canvas'
            ? 'Modul Listă'
            : 'Modul Canvas (Harta)'}
        </Button>
      </div>

      {/* Randarea Condiționată */}
      {interactionMode === 'canvas' ? (
        <div></div>
      ) : (
        <ListBasedTableAssigner
          updateTablesService={props.updateTablesService}
          setEventInstance={setEventInstance}
          updateTableDetailsService={props.updateTableDetailsService}
          eventInstance={eventInstance}
          eventGuests={eventGuests}
          canvasElements={canvasElements}
          assignTableToGuestsService={props.assignTableToGuestsService}
          fetchEventGuests={fetchEventGuests}
        />
      )}
      <AddGuestsModal
        eventGuests={eventGuests}
        eventPlan={EventPlan[eventInstance?.eventPlan || 'basic']}
        setAddGuestsModalOpen={setAddGuestsModalOpen}
        open={addGuestsModalOpen}
        addGuestsService={props.addGuestsService}
        eventId={eventInstance?.eventId || ''}
        userId={eventInstance?.userId || ''}
        refreshGuestList={fetchEventGuests}
      />
      <AddTableDrawer
        setEventInstance={setEventInstance}
        eventInstance={eventInstance}
        eventPlan={eventInstance?.eventPlan || 'basic'}
        eventTablesCount={
          canvasElements.filter((el) => el.type === 'table').length
        }
        isOpen={addTableModalOpen}
        onClose={() => setAddTableModalOpen(false)}
        onCreateTable={props.updateTablesService}
      />
      <MobileTablePlanExportModal
        isOpen={exportModalOpen}
        guests={eventGuests}
        onClose={() => setExportModalOpen(false)}
        exportExcel={exportGuestsToExcel}
      />
    </div>
  );
};

export default TablePlanContainer;
