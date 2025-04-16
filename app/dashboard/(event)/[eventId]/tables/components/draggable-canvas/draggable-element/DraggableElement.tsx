import { useDraggable } from '@dnd-kit/core'
import React, { useRef } from 'react'
import Image, { StaticImageData } from 'next/image'
import { nanoid } from 'nanoid'
import { on } from 'events'

const DraggableElement = ({
  name,
  icon,
  type,
  typeId,
}: {
  name: string
  icon: StaticImageData
  type: string
  typeId: string
}) => {
  const id = useRef(nanoid())
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    attributes: {
      role: 'button',
      roleDescription: 'draggable element',
      tabIndex: 0,
    },
    id: id.current,
    data: {
      name: name,
      typeId: typeId,
      fromSideBar: true,
      icon: icon,
      type: type,
    },
  })

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="flex gap-2 items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
    >
      <Image src={icon} alt="Round Table" width={24} height={24} />
      {name}
    </div>
  )
}

export default DraggableElement
