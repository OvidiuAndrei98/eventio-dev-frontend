import { useDndContext, useDraggable, useDroppable } from '@dnd-kit/core'; // Adăugat useDroppable
import React from 'react';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { DeleteOutlined } from '@ant-design/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DropdownOption } from '@/core/types';

// --- CONSTANTE PENTRU DIMENSIUNI (LOGICE) ---
const TABLE_ROUND_SIZE = 100;
const TABLE_HORIZONTAL_HEIGHT = 80;
const CHAIR_SIZE = 20;
const DISTANCE_FROM_TABLE = 15;
const DEFAULT_SEAT_COUNT = 10;

const SPACE_PER_RECTANGULAR_SEAT = 60;
const PADDING_SIZE = DISTANCE_FROM_TABLE + CHAIR_SIZE / 2;

// =================================================================================
// --- Componenta TooltipContentComponent ---
// =================================================================================

const TooltipContentComponent = ({
  name,
  tableGuests,
}: {
  name: string;
  tableGuests: DropdownOption[];
}) => {
  return (
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

// =================================================================================
// --- Componenta de randare a Scaunelor și Mesei ---
// =================================================================================

interface TableProps {
  name: string;
  typeId: string;
  guestCount: number;
  totalSeats: number;
  sizesString: string;
  rounded: boolean;
  TooltipBaseContent: React.ReactNode;
  elementId: string;
  eventId: string;
  isEditing: boolean;
  onDelete: (id: string) => void;
  isOver: boolean;
}

const TableWithChairs: React.FC<TableProps> = ({
  typeId,
  guestCount,
  totalSeats,
  sizesString,
  TooltipBaseContent,
  elementId,
  isEditing,
  onDelete,
  isOver,
}) => {
  const numSeats = totalSeats;
  const seats: React.ReactElement[] = [];

  const sizeParts = sizesString.match(/w-\[(\d+)px\] h-\[(\d+)px\]/);
  const tableW = sizeParts ? parseInt(sizeParts[1], 10) : TABLE_ROUND_SIZE;
  const tableH = sizeParts ? parseInt(sizeParts[2], 10) : TABLE_ROUND_SIZE;

  const chairHalf = CHAIR_SIZE / 2;

  let totalW: number;
  let totalH: number;

  if (typeId === 'round-table') {
    const tableRadius = tableW / 2;
    totalW = totalH = 2 * (tableRadius + PADDING_SIZE);
  } else {
    totalW = tableW + 2 * PADDING_SIZE;
    totalH = tableH + 2 * PADDING_SIZE;
  }

  const tableOffsetX = PADDING_SIZE;
  const tableOffsetY = PADDING_SIZE;

  const placeSeatsOnSide = (
    count: number,
    side: 'top' | 'bottom' | 'left' | 'right'
  ) => {
    if (count <= 0) return;

    const isHorizontalPlacement = side === 'top' || side === 'bottom';
    const effectiveLength = isHorizontalPlacement ? tableW : tableH;

    const spacing = effectiveLength / (count + 1);

    for (let i = 0; i < count; i++) {
      const isOccupied = seats.length < guestCount;

      // ATENȚIE: Am actualizat clasa pentru scaunele dreptunghiulare
      const chairClassName = isOccupied
        ? 'bg-[url(/character-avatar-icon.png)] bg-cover bg-center border-gray-500 rounded-sm border shadow-lg'
        : 'bg-gray-400 rounded-sm border border-gray-500 shadow-sm';

      let seatX = 0;
      let seatY = 0;

      const positionAlongEdge = (i + 1) * spacing - effectiveLength / 2;

      if (isHorizontalPlacement) {
        seatX = tableOffsetX + tableW / 2 + positionAlongEdge;
        seatY =
          side === 'top'
            ? tableOffsetY - DISTANCE_FROM_TABLE - chairHalf
            : tableOffsetY + tableH + DISTANCE_FROM_TABLE + chairHalf;
      } else {
        seatY = tableOffsetY + tableH / 2 + positionAlongEdge;
        seatX =
          side === 'left'
            ? tableOffsetX - DISTANCE_FROM_TABLE - chairHalf
            : tableOffsetX + tableW + DISTANCE_FROM_TABLE + chairHalf;
      }

      seats.push(
        <div
          key={`${side}-${i}-${elementId}`}
          className={`absolute ${chairClassName}`}
          style={{
            width: CHAIR_SIZE,
            height: CHAIR_SIZE,
            transform: 'translate(-50%, -50%)',
            left: `${seatX}px`,
            top: `${seatY}px`,
          }}
        />
      );
    }
  };

  // --- LOGICĂ PENTRU MASA ROTUNDĂ ---
  if (typeId === 'round-table') {
    const tableRadius = tableW / 2;
    const placementRadius = tableRadius + DISTANCE_FROM_TABLE + chairHalf;
    const totalSize = 2 * (tableRadius + PADDING_SIZE);
    const center = totalSize / 2;

    for (let i = 0; i < numSeats; i++) {
      const angle = (i / numSeats) * 2 * Math.PI;
      const seatX = center + placementRadius * Math.cos(angle);
      const seatY = center + placementRadius * Math.sin(angle);

      const isOccupied = i < guestCount;
      const chairClassName = isOccupied
        ? 'bg-[url(/character-avatar-icon.png)] rounded-full border border-gray-500 bg-cover bg-center shadow-lg'
        : 'bg-gray-400 rounded-full border border-gray-500 shadow-sm';

      seats.push(
        <div
          key={i}
          className={`absolute ${chairClassName}`}
          style={{
            width: CHAIR_SIZE,
            height: CHAIR_SIZE,
            transform: 'translate(-50%, -50%)',
            left: `${seatX}px`,
            top: `${seatY}px`,
          }}
        />
      );
    }

    return (
      <div
        className="relative"
        data-element-type="table-chair-wrapper"
        style={{
          width: totalSize,
          height: totalSize,
        }}
      >
        {seats}
        {isEditing && (
          <span className="absolute -top-3 -right-3 z-[2]">
            <DeleteOutlined
              className="!text-[#0a0a0a] hover:!text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(elementId);
              }}
            />
          </span>
        )}
        <div
          className={`absolute ${
            isOver
              ? 'border-2 border-green-500 shadow-xl transition-all duration-100'
              : ''
          }`}
          style={{
            width: tableW,
            height: tableH,
            left: `${tableOffsetX}px`,
            top: `${tableOffsetY}px`,
          }}
        >
          {TooltipBaseContent}
        </div>
      </div>
    );
  }

  // --- LOGICĂ PENTRU MESE DREPTUNGHIULARE (Orizontală / Verticală) ---
  else if (typeId === 'horizontal-table' || typeId === 'vertical-table') {
    const isHorizontal = typeId === 'horizontal-table';

    const seatsOnSide1 = Math.ceil(numSeats / 2);
    const seatsOnSide2 = Math.floor(numSeats / 2);

    const longSideLength = isHorizontal ? tableW : tableH;
    const maxSeatsPerLongEdge = Math.floor(
      longSideLength / SPACE_PER_RECTANGULAR_SEAT
    );

    const seatsToPlaceOn1 = Math.min(seatsOnSide1, maxSeatsPerLongEdge);
    const seatsToPlaceOn2 = Math.min(seatsOnSide2, maxSeatsPerLongEdge);

    if (isHorizontal) {
      placeSeatsOnSide(seatsToPlaceOn1, 'top');
      placeSeatsOnSide(seatsToPlaceOn2, 'bottom');
    } else {
      placeSeatsOnSide(seatsToPlaceOn1, 'left');
      placeSeatsOnSide(seatsToPlaceOn2, 'right');
    }

    return (
      <div
        className="relative"
        data-element-type="table-chair-wrapper"
        style={{
          width: totalW,
          height: totalH,
        }}
      >
        {seats}
        {isEditing && (
          <span className="absolute -top-3 -right-3 z-[2]">
            <DeleteOutlined
              className="!text-[#0a0a0a] hover:!text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(elementId);
              }}
            />
          </span>
        )}
        <div
          className={`absolute ${
            isOver
              ? 'border-2 border-green-500 shadow-xl transition-all duration-100'
              : ''
          }`}
          style={{
            width: tableW,
            height: tableH,
            left: `${tableOffsetX}px`,
            top: `${tableOffsetY}px`,
          }}
        >
          {TooltipBaseContent}
        </div>
      </div>
    );
  }

  return <>{TooltipBaseContent}</>;
};

// =================================================================================
// --- Componenta Principală CanvaDraggableElement ---
// =================================================================================

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
  currentZoomScale,
  seats,
  tableNumber,
  guests,
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
  currentZoomScale: number;
  tableNumber: number | null | undefined;
  seats?: number;
  /** Number of seated guests */
  guests: DropdownOption[]; // Tipul prop-ului
}) => {
  // 1. Hook-ul Draggable
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef, // Redenumit pentru a nu se suprapune
    transform,
  } = useDraggable({
    id,
    data: {
      name: name,
      id: id,
      fromSideBar: false,
      modifiers: [restrictToParentElement],
    },
    disabled: !isEditing,
  });

  // 2. Hook-ul Droppable cu logică pentru a verifica tipul elementului drag
  const { active } = useDndContext();

  const { setNodeRef: setDroppableNodeRef, isOver: rawIsOver } = useDroppable({
    id,
    data: {
      type: 'table',
      tableId: id,
      seats: seats || DEFAULT_SEAT_COUNT,
      guestCount: guests.length,
      tableNumber: tableNumber,
    },
    disabled: type !== 'table',
  });

  const isOver = rawIsOver && active?.data?.current?.type === 'guest';

  // 3. Funcție pentru combinarea referințelor
  const setCombinedNodeRef = (node: HTMLDivElement | null) => {
    setDraggableNodeRef(node);
    setDroppableNodeRef(node);
  };

  const guestCount = guests.length;
  const totalSeats =
    seats || (typeId === 'round-table' ? DEFAULT_SEAT_COUNT : 0);

  // Dnd Translate ajustat pentru zoom
  const dndTranslate = transform
    ? `translate3d(${transform.x / currentZoomScale}px, ${
        transform.y / currentZoomScale
      }px, 0)`
    : undefined;

  // DIMENSIUNILE ELEMENTULUI DRAGGABLE (necesare pentru a compensa offset-ul)
  let elementW = 0;
  let elementH = 0;
  const seatsPerLongSide = Math.ceil(totalSeats / 2);

  // LOGICĂ DE CALCUL DIMENSIUNI (Rămâne neschimbată)
  if (type === 'table') {
    if (typeId === 'round-table') {
      elementW = elementH = 2 * (TABLE_ROUND_SIZE / 2 + PADDING_SIZE);
    } else if (typeId === 'horizontal-table') {
      const dynamicWidth = Math.max(
        160,
        seatsPerLongSide * SPACE_PER_RECTANGULAR_SEAT
      );
      elementW = dynamicWidth + 2 * PADDING_SIZE;
      elementH = TABLE_HORIZONTAL_HEIGHT + 2 * PADDING_SIZE;
    } else if (typeId === 'vertical-table') {
      const dynamicHeight = Math.max(
        160,
        seatsPerLongSide * SPACE_PER_RECTANGULAR_SEAT
      );
      elementW = TABLE_HORIZONTAL_HEIGHT + 2 * PADDING_SIZE;
      elementH = dynamicHeight + 2 * PADDING_SIZE;
    }
  } else if (type === 'presidium') {
    if (typeId === 'vertical-presidium') {
      elementW = 80;
      elementH = 180;
    } else {
      elementW = 180;
      elementH = 80;
    }
  } else if (type === 'bar') {
    if (id === 'horizontal-bar') {
      elementW = 220;
      elementH = 80;
    } else {
      elementW = 80;
      elementH = 220;
    }
  } else if (type === 'others') {
    if (id === 'dance-floor') {
      elementW = 270;
      elementH = 270;
    } else if (id === 'entrance') {
      elementW = 40;
      elementH = 120;
    } else {
      elementW = 100;
      elementH = 100;
    }
  } else if (type === 'stage') {
    if (id === 'horizontal-stage') {
      elementW = 220;
      elementH = 120;
    } else {
      elementW = 120;
      elementH = 220;
    }
  }

  const style = {
    transform: dndTranslate,
    left: positions.x - elementW / 2 + 'px',
    top: positions.y - elementH / 2 + 'px',
    position: 'absolute' as const,
    background: 'transparent',
    padding: '0',
    width: elementW + 'px',
    height: elementH + 'px',
  };

  const getTooltipBaseContent = (rounded: boolean, name: string) => (
    <TooltipProvider delayDuration={2}>
      <Tooltip delayDuration={300}>
        <TooltipTrigger
          className={`text-center rounded-${
            rounded ? 'full' : 'sm'
          } w-full h-full flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-[#f1ebf4] hover:bg-[#ECE2F2] group dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white border-solid border-1 border-gray-100`}
        >
          {name}
        </TooltipTrigger>
        <TooltipContent className="p-4 shadow-md bg-[white] min-w-[250px] flex flex-col gap-2 pointer-events-auto">
          <TooltipContentComponent name={name} tableGuests={guests} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const getElementHtmlByType = (
    type: string,
    name: string,
    id: string,
    elementId: string,
    isEditing: boolean,
    onDelete: (id: string) => void
  ) => {
    switch (type) {
      case 'table':
        let sizesString = '';
        let rounded = false;

        const seatsPerLongSide = Math.ceil(totalSeats / 2);

        if (id === 'round-table') {
          sizesString = `w-[${TABLE_ROUND_SIZE}px] h-[${TABLE_ROUND_SIZE}px]`;
          rounded = true;
        } else if (id === 'horizontal-table') {
          const dynamicWidth = Math.max(
            160,
            seatsPerLongSide * SPACE_PER_RECTANGULAR_SEAT
          );
          sizesString = `w-[${dynamicWidth}px] h-[${TABLE_HORIZONTAL_HEIGHT}px]`;
          rounded = false;
        } else {
          // vertical-table
          const dynamicHeight = Math.max(
            160,
            seatsPerLongSide * SPACE_PER_RECTANGULAR_SEAT
          );
          sizesString = `w-[${TABLE_HORIZONTAL_HEIGHT}px] h-[${dynamicHeight}px]`;
          rounded = false;
        }

        const TooltipContent = getTooltipBaseContent(rounded, name);

        return (
          <TableWithChairs
            name={name}
            typeId={id}
            elementId={elementId}
            eventId={eventId ?? ''}
            guestCount={guestCount}
            totalSeats={totalSeats}
            sizesString={sizesString}
            rounded={rounded}
            TooltipBaseContent={TooltipContent}
            isEditing={isEditing}
            onDelete={onDelete}
            isOver={isOver}
          />
        );

      case 'presidium':
        const PresidiumContent = (
          <div
            className={`text-center rounded-sm ${
              id === 'vertical-presidium'
                ? 'h-[180px] w-[80px]'
                : 'h-[80px] w-[180px]'
            } flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white border-solid border-1 border-gray-100`}
          >
            {name}
          </div>
        );
        return (
          <div className="relative w-full h-full">
            {isEditing && (
              <span className="absolute -top-3 -right-3 z-[2]">
                <DeleteOutlined
                  className="!text-[#0a0a0a] hover:!text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(elementId);
                  }}
                />
              </span>
            )}
            {PresidiumContent}
          </div>
        );

      case 'bar':
        const BarContent = (
          <div
            className={`text-center rounded-md ${
              id === 'horizontal-bar'
                ? 'h-[80px] w-[220px]'
                : 'h-[220px] w-[80px]'
            } flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white border-solid border-1 border-gray-100`}
          >
            {name}
          </div>
        );
        return (
          <div className="relative w-full h-full">
            {isEditing && (
              <span className="absolute -top-3 -right-3 z-[2]">
                <DeleteOutlined
                  className="!text-[#0a0a0a] hover:!text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(elementId);
                  }}
                />
              </span>
            )}
            {BarContent}
          </div>
        );
      case 'others':
        let OthersContent;
        if (id === 'dance-floor') {
          OthersContent = (
            <div className="text-center rounded-md h-[270px] w-[270px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
              {name}
            </div>
          );
        } else if (id === 'entrance') {
          OthersContent = (
            <div className="rounded-md h-[120px] w-[40px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white border-solid border-1 border-gray-100">
              <span className="rotate-270">{name}</span>
            </div>
          );
        } else {
          OthersContent = (
            <div className="rounded-md h-[100px] w-[100px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white border-solid border-1 border-gray-100">
              {name}
            </div>
          );
        }
        return (
          <div className="relative w-full h-full">
            {isEditing && (
              <span className="absolute -top-3 -right-3 z-[2]">
                <DeleteOutlined
                  className="!text-[#0a0a0a] hover:!text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(elementId);
                  }}
                />
              </span>
            )}
            {OthersContent}
          </div>
        );
      case 'stage':
        const StageContent = (
          <div
            className={`text-center rounded-md ${
              id === 'horizontal-stage'
                ? 'h-[120px] w-[220px]'
                : 'h-[220px] w-[120px]'
            } flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white border-solid border-1 border-gray-100`}
          >
            {name}
          </div>
        );
        return (
          <div className="relative w-full h-full">
            {isEditing && (
              <span className="absolute -top-3 -right-3 z-[2]">
                <DeleteOutlined
                  className="!text-[#0a0a0a] hover:!text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(elementId);
                  }}
                />
              </span>
            )}
            {StageContent}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      // APLICĂM REFERINȚA COMBINATĂ PENTRU DRAGGABLE ȘI DROPPABLE
      ref={setCombinedNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        !isEditing && onClick?.(e);
      }}
      data-element-type="draggable-element"
    >
      {getElementHtmlByType(type, name, typeId, id, isEditing, onDelete)}
    </div>
  );
};

export default CanvaDraggableElement;
