'use client'

import { Button, Form, Input } from 'antd'
import React, { useContext, useRef, useState } from 'react'
import RoundTableIcon from '@/public/round-table.png'
import StageIcon from '@/public/stage-icon.png'
import BarIcon from '@/public/bar-icon.png'
import { StaticImageData } from 'next/image'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import DraggableElement from './components/draggable-canvas/draggable-element/DraggableElement'
import DraggableCanvas from './components/draggable-canvas/DraggableCanvas'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { Guest, TableElement } from '@/core/types'
import { EventContext } from '../layout'
import { updateEventTableOrganization } from '@/service/event/updateEventTableOrganization'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { DeleteOutlined } from '@ant-design/icons'
import MultiselectDropdown from '@/components/multiselectDropdown/MultiselectDropdown'
import { queryConfirmedGuestsByEventId } from '@/service/guest/queryConfirmedGuestsByEventId'
import LateralDrawer from './components/lateral-drawer/LateralDrawer'

const ELEMENTS = [
  { id: 'round-table', name: 'Round Table', icon: RoundTableIcon },
  { id: 'stage', name: 'Stage', icon: StageIcon },
  { id: 'bar', name: 'Bar', icon: BarIcon },
]

/**
 * Component that renders the tables page.
 * It includes a sidebar with draggable elements and a canvas area for arranging tables.
 * @returns {JSX.Element}
 */
const TablesPage = () => {
  // Event instance data
  const eventInstance = useContext(EventContext)

  const [tableEditActive, setTableEditActive] = useState(false)
  const [canvasElements, setCanvasElements] = useState<TableElement[]>(
    eventInstance?.eventTableOrganization.elements ?? []
  )
  const [activeSidebarField, setActiveSidebarField] = useState<{
    name: string
    icon: StaticImageData
  } | null>()
  const [sidebarFieldsRegenKey, setSidebarFieldsRegenKey] = useState(Date.now())
  const [activeFieldData, setActiveFieldData] = useState<{
    modifiers: []
  } | null>(null)
  const currentDragFieldRef: any = useRef()

  // Used to prevent drag event to fire on a normal click
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const handleDragStart = (e: any) => {
    const { active } = e
    const activeData = active.data.current
    setActiveFieldData(activeData)

    // This is where the cloning starts.
    // We set up a ref to the field we're dragging
    // from the sidebar so that we can finish the clone
    // in the onDragEnd handler.
    if (activeData.fromSideBar) {
      const { name } = activeData
      const id = active.id
      setActiveSidebarField({ name: name, icon: activeData.icon })
      // Create a new field that'll be added to the fields array
      // if we drag it over the canvas.
      currentDragFieldRef.current = {
        elementId: id,
        name: name,
        positions: { x: 0, y: 0 },
      }
      return
    }
  }

  const cleanUp = () => {
    setActiveSidebarField(null)
    setActiveFieldData(null)
    currentDragFieldRef.current = null
    setSidebarFieldsRegenKey(Date.now())
  }

  const handleDragEnd = (e: any) => {
    const { over } = e

    // We dropped outside of the over so clean up so we can start fresh.
    if (!over) {
      cleanUp()
    }

    const nextField = currentDragFieldRef.current

    if (nextField) {
      setCanvasElements((draft) => {
        return [...draft, nextField]
      })

      cleanUp()
    }
    if (!e.active.data.current.fromSideBar) {
      const cvElement = canvasElements.find((x) => x.elementId === e.active.id)!
      cvElement.positions.x += e.delta.x
      cvElement.positions.y += e.delta.y
      const _cvelements = canvasElements.map((x) => {
        if (x.elementId === cvElement.elementId) return cvElement
        return x
      })
      setCanvasElements(_cvelements)
    }
  }

  return (
    <div className="bg-[#F6F6F6] h-screen w-full">
      <div className="tables-controls-section p-4 flex gap-4 items-center">
        <Button type="primary">Test</Button>
        <Button type="primary">Test</Button>
        <Button
          onClick={() =>
            updateEventTableOrganization(
              {
                elements: canvasElements,
              },
              eventInstance?.eventId
            )
          }
          type="primary"
        >
          Save
        </Button>
      </div>
      <DndContext
        modifiers={
          activeFieldData ? activeFieldData.modifiers : [restrictToWindowEdges]
        }
        onDragStart={handleDragStart}
        sensors={sensors}
        autoScroll
        onDragEnd={handleDragEnd}
      >
        <div className="tables-content-section p-4 rounded-lg shadow-md h-[calc(100vh-9rem)] gap-4 overflow-hidden bg-white grid grid-cols-[200px_1fr]">
          <div
            className="tables-objects-section bg-white h-full overflow-y-auto flex flex-col gap-4"
            key={sidebarFieldsRegenKey}
          >
            <h1 className="text-xl font-semibold">Elemente</h1>
            {ELEMENTS.map((element) => (
              <DraggableElement
                key={element.id}
                name={element.name}
                icon={element.icon}
              />
            ))}
          </div>
          <DragOverlay>
            {activeSidebarField ? (
              <DraggableElement {...activeSidebarField} />
            ) : null}
          </DragOverlay>
          <DraggableCanvas
            tableEditActive={(tableEditActive: boolean) =>
              setTableEditActive(tableEditActive)
            }
            id="canvas"
            canvasElements={canvasElements}
          />
        </div>
      </DndContext>
      <LateralDrawer
        eventId={eventInstance?.eventId!}
        tableEditActive={tableEditActive}
        setTableEditActive={(tableEditActive) =>
          setTableEditActive(tableEditActive)
        }
      />
    </div>
  )
}

export default TablesPage
