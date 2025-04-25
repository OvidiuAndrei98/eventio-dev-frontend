import { useDroppable } from '@dnd-kit/core'
import React from 'react'
import CanvaDraggableElement from './draggable-element/CanvaDragableElement'
import { CanvasElement } from '@/core/types'

const DraggableCanvas = ({
  id,
  canvasElements,
  tableEditActive,
  setActiveEditTableId,
  onDelete,
  isEditing,
  eventId,
}: {
  id: string
  // De schimbat in types.ts
  canvasElements: CanvasElement[]
  tableEditActive: (state: boolean) => void
  setActiveEditTableId: (value: CanvasElement) => void
  onDelete: (id: string) => void
  isEditing: boolean
  eventId?: string
}) => {
  const { setNodeRef } = useDroppable({
    id: id,
    data: {
      parent: null,
      isContainer: true,
    },
  })

  return (
    <div
      ref={setNodeRef}
      className="tables-canvas-section bg-[#F6F6F6] h-full overflow-y-auto rounded-lg p-2 w-full relative"
    >
      {canvasElements.map((element) => (
        <CanvaDraggableElement
          onClick={() => {
            if (element.type === 'table') {
              tableEditActive(true)
              setActiveEditTableId(element)
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
        />
      ))}
    </div>
  )
}

export default DraggableCanvas
