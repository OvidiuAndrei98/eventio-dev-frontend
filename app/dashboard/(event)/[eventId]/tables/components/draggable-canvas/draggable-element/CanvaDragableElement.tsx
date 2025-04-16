import { useDraggable } from '@dnd-kit/core'
import React from 'react'
import { restrictToParentElement } from '@dnd-kit/modifiers'

const CanvaDraggableElement = ({
  id,
  name,
  positions,
  type,
  typeId,
  onClick,
}: {
  id: string
  name: string
  positions: { x: number; y: number }
  type: string
  typeId: string
  onClick?: () => void
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      name: name,
      id: id,
      fromSideBar: false,
      modifiers: [restrictToParentElement],
    },
  })

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    position: 'absolute',
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        ...style,
        left: positions.x + '%',
        top: positions.y + '%',
        position: 'absolute',
        background: 'transparent',
      }}
      onClick={() => onClick?.()}
    >
      {getElementHtmlByType(type, name, typeId)}
    </div>
  )
}

export default CanvaDraggableElement

const getElementHtmlByType = (type: string, name: string, id: string) => {
  switch (type) {
    case 'table':
      if (id === 'round-table') {
        return (
          <div className="text-center rounded-full h-[100px] w-[100px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
            {name}
          </div>
        )
      } else if (id === 'horizontal-table') {
        return (
          <div className="text-center rounded-sm h-[60px] w-[140px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
            {name}
          </div>
        )
      } else {
        return (
          <div className="text-center rounded-sm h-[140px] w-[60px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
            {name}
          </div>
        )
      }
    case 'presidium':
      if (id === 'vertical-presidium') {
        return (
          <div className="text-center rounded-sm h-[60px] w-[160px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
            {name}
          </div>
        )
      } else {
        return (
          <div className="text-center rounded-sm h-[160px] w-[60px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
            {name}
          </div>
        )
      }
    case 'bar':
      if (id === 'horizontal-bar') {
        return (
          <div className="text-center rounded-md h-[60px] w-[200px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
            {name}
          </div>
        )
      } else {
        return (
          <div className=" rounded-md h-[200px] w-[60px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
            {name}
          </div>
        )
      }
    case 'stage':
      if (id === 'horizontal-stage') {
        return (
          <div className="text-center rounded-md h-[100px] w-[200px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
            {name}
          </div>
        )
      } else {
        return (
          <div className=" rounded-md h-[200px] w-[100px] flex gap-2 items-center justify-center p-3 text-base font-bold text-gray-900 bg-gray-300 hover:bg-gray-400 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
            {name}
          </div>
        )
      }
    default:
      break
  }
}
