import { useDraggable } from '@dnd-kit/core'
import React from 'react'
import Image, { StaticImageData } from 'next/image'
import RoundTableIcon from '@/public/round-table.png'
import { restrictToParentElement } from '@dnd-kit/modifiers'

const CanvaDraggableElement = ({
  id,
  name,
  positions,
  onClick,
}: {
  id: string
  name: string
  positions: { x: number; y: number }
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
        left: positions.x,
        top: positions.y,
        position: 'absolute',
      }}
      onClick={() => onClick?.()}
      className="flex gap-2 items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white bg-[red]"
    >
      <div className="w-[200px]">
        <Image src={RoundTableIcon} alt="Round Table" width={24} height={24} />
      </div>
      {name}
    </div>
  )
}

export default CanvaDraggableElement
