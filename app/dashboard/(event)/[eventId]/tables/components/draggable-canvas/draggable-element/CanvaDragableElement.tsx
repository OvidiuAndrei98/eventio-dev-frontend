import { useDraggable } from '@dnd-kit/core';
import React, { useCallback, useEffect, useState } from 'react';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { DeleteOutlined } from '@ant-design/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DropdownOption } from '@/core/types';
import { queryGuestsByTable } from '@/service/guest/queryGuestsByTable';
import { toast } from 'sonner';

const CanvaDraggableElement = ({
  id,
  name,
  positions,
  type,
  typeId,
  isEditing,
  onDelete,
  onClick,
  eventId,
  currentZoomScale, // <-- NOU: Adaugat pentru a compensa scalarea containerului
}: {
  id: string;
  name: string;
  positions: { x: number; y: number };
  type: string;
  typeId: string;
  isEditing: boolean;
  onDelete: (id: string) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  eventId?: string;
  currentZoomScale: number; // <-- NOU: Tipul prop-ului
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      name: name,
      id: id,
      fromSideBar: false,
      modifiers: [restrictToParentElement],
    },
    disabled: !isEditing,
  });

  // --- LOGICĂ DE TRANSFORMARE REVIZUITĂ PENTRU COMPENSAREA SCALĂRII ---
  const dndTranslate = transform
    ? `translate3d(${transform.x / currentZoomScale}px, ${
        transform.y / currentZoomScale
      }px, 0)` // <-- MODIFICARE CHEIE: Scalăm invers translația DndKit
    : undefined;

  const style = {
    // Aplicăm translația ajustată
    transform: dndTranslate,
    // Poziția inițială (cea salvată)
    left: positions.x + 'px',
    top: positions.y + 'px',
    position: 'absolute' as const,
    background: 'transparent',
    padding: '15px',
  };

  const getElementHtmlByType = (
    type: string,
    name: string,
    id: string,
    elementId: string
  ) => {
    switch (type) {
      case 'table':
        const TableBase = ({
          sizesString,
          rounded,
        }: {
          sizesString: string;
          rounded: boolean;
        }) => {
          return (
            <TooltipProvider delayDuration={2}>
              <Tooltip delayDuration={300}>
                <TooltipTrigger
                  className={`text-center ${sizesString} rounded-${
                    rounded ? 'full' : 'sm'
                  } flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-[#f1ebf4] hover:bg-[#ECE2F2] group dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white border-solid border-1 border-gray-100`}
                >
                  {name}
                </TooltipTrigger>
                <TooltipContent className="p-4 shadow-md bg-[white] min-w-[250px] flex flex-col gap-2 pointer-events-auto">
                  <TooltipContentComponent
                    eventId={eventId ?? ''}
                    name={name}
                    type={type}
                    id={elementId}
                  />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        };

        if (id === 'round-table') {
          return <TableBase rounded={true} sizesString="w-[100px] h-[100px]" />;
        } else if (id === 'horizontal-table') {
          return <TableBase rounded={false} sizesString="w-[160px] h-[80px]" />;
        } else {
          return <TableBase rounded={false} sizesString="w-[80px] h-[160px]" />;
        }
      case 'presidium':
        if (id === 'vertical-presidium') {
          return (
            <div className="text-center rounded-sm h-[180px] w-[80px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white border-solid border-1 border-gray-100">
              {name}
            </div>
          );
        } else {
          return (
            <div className="text-center rounded-sm h-[80px] w-[180px]  flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white border-solid border-1 border-gray-100">
              {name}
            </div>
          );
        }
      case 'bar':
        if (id === 'horizontal-bar') {
          return (
            <div className="text-center rounded-md h-[80px] w-[220px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white border-solid border-1 border-gray-100">
              {name}
            </div>
          );
        } else {
          return (
            <div className=" rounded-md h-[220px] w-[80px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white border-solid border-1 border-gray-100">
              {name}
            </div>
          );
        }
      case 'others':
        if (id === 'dance-floor') {
          return (
            <div className="text-center rounded-md h-[270px] w-[270px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
              {name}
            </div>
          );
        } else if (id === 'entrance') {
          return (
            <div className="rounded-md h-[120px] w-[40px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white border-solid border-1 border-gray-100">
              <span className="rotate-270">{name}</span>
            </div>
          );
        } else {
          return (
            <div className="rounded-md h-[100px] w-[100px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white border-solid border-1 border-gray-100">
              {name}
            </div>
          );
        }
      case 'stage':
        if (id === 'horizontal-stage') {
          return (
            <div className="text-center rounded-md h-[120px] w-[220px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
              {name}
            </div>
          );
        } else {
          return (
            <div className=" rounded-md h-[220px] w-[120px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white border-solid border-1 border-gray-100">
              {name}
            </div>
          );
        }
      default:
        break;
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={(e) => !isEditing && onClick?.(e)}
      data-element-type="table"
    >
      {isEditing && (
        <span className="absolute top-0 right-0 z-[2]">
          <DeleteOutlined
            className="!text-[#0a0a0a] hover:!text-red-500"
            onClick={() => onDelete(id)}
          />
        </span>
      )}
      {getElementHtmlByType(type, name, typeId, id)}
    </div>
  );
};

export default CanvaDraggableElement;

const TooltipContentComponent = ({
  id,
  type,
  eventId,
  name,
}: {
  id: string;
  type: string;
  eventId: string;
  name: string;
}) => {
  const [tableGuests, setTableGuests] = useState<DropdownOption[]>([]);
  const [loadingGuests, setLoadingGuests] = useState(false);

  const queryTableGuests = useCallback(async () => {
    if (id && type === 'table' && eventId) {
      try {
        setLoadingGuests(true);
        const guests = await queryGuestsByTable(eventId, id);
        setTableGuests(
          guests.map((guest) => {
            return { label: guest.name, value: guest.guestId };
          })
        );
        setTimeout(() => {
          setLoadingGuests(false);
        }, 200);
      } catch (error) {
        toast.error('A aparut o eroare, te rugam sa reincarci pagina');
      }
    }
  }, [eventId, id, type]); // Am pastrat dependintele originale pentru useCallback

  useEffect(() => {
    queryTableGuests();
  }, [queryTableGuests]);

  return loadingGuests ? (
    <div className="flex items-center justify-center w-full h-full min-w-[220px] min-h-[60px]">
      <span className="loader"></span>
    </div>
  ) : (
    <div>
      <div className="flex items-center gap-4 w-full mb-2">
        <h1 className="text-[#22133C] text-lg font-semibold">Detalii {name}</h1>
        <span className="text-slate-500 text-xs">
          {tableGuests.length} Invitati
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {tableGuests.length > 0 &&
          tableGuests.map((guest) => {
            return (
              <span
                key={guest.value}
                className="text-[#22133C] flex items-center justify-between px-2 py-1 bg-gray-100 rounded-md shadow-md hover:bg-gray-200 transition-colors duration-200"
              >
                {guest.label}
              </span>
            );
          })}
        {tableGuests.length <= 0 && (
          <span className="text-slate-600 text-[16px] text-center">
            Niciun invitat asezat la masa
          </span>
        )}
      </div>
    </div>
  );
};
