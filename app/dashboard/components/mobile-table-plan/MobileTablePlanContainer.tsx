'use client';

import { Button } from 'antd';
import { useEffect, useState } from 'react';
import ListBasedTableAssigner from './ListBasedTableAssigner';
import { useEventContext } from '@/core/context/EventContext';
import { CanvasElement, EventInstance, Guest } from '@/core/types';
import { UserAddOutlined } from '@ant-design/icons';
import { ListCheck } from 'lucide-react';

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
    guests: { label: string; value: string }[]
  ) => Promise<void>;
  queryTableGuestsService: (
    eventId: string,
    tablePlan: string
  ) => Promise<Guest[]>;
}

const TablePlanContainer = (props: MobileTablePlanContainerProps) => {
  const [interactionMode, setInteractionMode] = useState<'canvas' | 'list'>(
    'list'
  );
  const { eventInstance, setEventInstance } = useEventContext();
  const [eventGuests, setEventGuests] = useState<Guest[]>([]);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);

  const fetchEventGuests = async () => {
    if (!eventInstance) return;
    const guests = await props.queryTableGuestsService(
      eventInstance.eventId,
      eventInstance.eventPlan
    );
    setEventGuests(guests);
    setCanvasElements(eventInstance?.eventTableOrganization.elements || []);
  };

  useEffect(() => {
    fetchEventGuests();
  }, [eventInstance]);

  return (
    <div className="table-plan-app-wrapper bg-gray-50 h-[calc(100vh-64px)] w-full grid grid-cols-1 grid-rows-[auto_auto_1fr] p-2 gap-4">
      {/* Header-ul cu Butonul de Switch */}
      <div className="tables-controls-section p-2 flex gap-2 items-center justify-between border-b">
        <div className="flex flex-row gap-4 items-center">
          <Button
            icon={<UserAddOutlined />}
            className="!w-[48px] !h-[48px]"
          ></Button>
          <Button icon={<ListCheck />} className="!w-[48px] !h-[48px]"></Button>
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
          setEventInstance={setEventInstance}
          updateTableDetailsService={props.updateTableDetailsService}
          eventInstance={eventInstance}
          eventGuests={eventGuests}
          canvasElements={canvasElements}
          assignTableToGuestsService={props.assignTableToGuestsService}
          fetchEventGuests={fetchEventGuests}
        />
      )}
    </div>
  );
};

export default TablePlanContainer;
