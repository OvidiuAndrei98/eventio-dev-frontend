import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import CanvaDraggableElement from './draggable-element/CanvaDragableElement';
import { CanvasElement, Guest } from '@/core/types';

const DraggableCanvas = ({
  id,
  canvasElements,
  tableEditActive,
  setActiveEditTableId,
  onDelete,
  isEditing,
  eventId,
  currentZoomScale,
  eventGuests,
}: {
  id: string;
  canvasElements: CanvasElement[];
  tableEditActive: (state: boolean) => void;
  setActiveEditTableId: (value: CanvasElement) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
  eventId?: string;
  currentZoomScale: number;
  eventGuests: Guest[];
}) => {
  const { setNodeRef } = useDroppable({
    id: id,
    data: {
      parent: null,
      isContainer: true,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="tables-canvas-section h-full overflow-y-auto rounded-lg p-2 w-full relative"
    >
      {canvasElements.map((element) => (
        <CanvaDraggableElement
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (element.type === 'table') {
              tableEditActive(true);
              setActiveEditTableId(element);
            }
          }}
          onDelete={(id) => onDelete(id)}
          id={element.elementId}
          name={element.name}
          key={element.elementId}
          positions={element.positions}
          type={element.type}
          typeId={element.typeId}
          isEditing={isEditing}
          eventId={eventId}
          currentZoomScale={currentZoomScale}
          seats={element.seats}
          tableNumber={element.number}
          guests={eventGuests
            .filter((guest) => guest.tableId?.includes(element.elementId))
            .map((guest) => ({ label: guest.fullName, value: guest.guestId }))}
        />
      ))}
    </div>
  );
};

export default DraggableCanvas;
