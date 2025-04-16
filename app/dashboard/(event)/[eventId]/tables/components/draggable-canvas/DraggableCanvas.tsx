import { DragOverlay, useDroppable } from '@dnd-kit/core'
import React from 'react'
import CanvaDraggableElement from './draggable-element/CanvaDragableElement'

const DraggableCanvas = ({
  id,
  canvasElements,
  tableEditActive,
}: {
  id: string
  canvasElements: {
    name: string
    elementId: string
    positions: { x: number; y: number }
  }[]
  tableEditActive: (state: boolean) => void
}) => {
  const { setNodeRef } = useDroppable({
    id: 'unique-id',
    data: {
      parent: null,
      isContainer: true,
    },
  })

  return (
    <div
      ref={setNodeRef}
      className="tables-list-section bg-[#F6F6F6] h-full overflow-y-auto rounded-lg p-2 shadow-md w-full relative"
    >
      {canvasElements.map((element) => (
        <CanvaDraggableElement
          onClick={() => tableEditActive(true)}
          id={element.elementId}
          name={element.name}
          key={element.elementId}
          positions={element.positions}
        />
      ))}
    </div>
  )
}

export default DraggableCanvas
