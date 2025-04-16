'use client'

import { Button } from 'antd'
import React, { useContext, useRef, useState } from 'react'
import RoundTableIcon from '@/public/round-table.png'
import RoundTableV2Icon from '@/public/round-table-v2.png'
import VerticalTable from '@/public/vertical-table.png'
import HorizontalTable from '@/public/horizontal-table.png'
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
import { CanvasElement } from '@/core/types'
import { EventContext } from '../layout'
import { updateEventTableOrganization } from '@/service/event/updateEventTableOrganization'
import LateralDrawer from './components/lateral-drawer/LateralDrawer'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface CanvasListElementDefinition {
  type: string
  typeId: string
  name: string
  icon: StaticImageData
  subTypes?: CanvasListElementDefinition[]
}

const ELEMENTS: CanvasListElementDefinition[] = [
  {
    type: 'table',
    typeId: 'table',
    name: 'Masa',
    icon: RoundTableIcon,
    subTypes: [
      {
        typeId: 'round-table',
        name: 'Masa rotunda',
        icon: RoundTableV2Icon,
        type: 'table',
      },
      {
        typeId: 'horizontal-table',
        name: 'Masa orizontala',
        icon: HorizontalTable,
        type: 'table',
      },
      {
        typeId: 'vertical-table',
        name: 'Masa verticala',
        icon: VerticalTable,
        type: 'table',
      },
    ],
  },
  {
    typeId: 'stage',
    name: 'Scena',
    icon: StageIcon,
    type: 'stage',
    subTypes: [
      {
        typeId: 'horizontal-stage',
        name: 'Scena orizontala',
        icon: StageIcon,
        type: 'stage',
      },
      {
        typeId: 'vertical-stage',
        name: 'Scena verticala',
        icon: StageIcon,
        type: 'stage',
      },
    ],
  },
  {
    typeId: 'bar',
    name: 'Bar',
    icon: BarIcon,
    type: 'bar',
    subTypes: [
      {
        typeId: 'horizontal-bar',
        name: 'Bar orizontal',
        icon: BarIcon,
        type: 'bar',
      },
      {
        typeId: 'vertical-bar',
        name: 'Bar vertical',
        icon: BarIcon,
        type: 'bar',
      },
    ],
  },
  {
    typeId: 'presidium',
    name: 'Prezidiu',
    icon: BarIcon,
    type: 'presidium',
    subTypes: [
      {
        typeId: 'horizontal-presidium',
        name: 'Prezidiu orizontal',
        icon: BarIcon,
        type: 'presidium',
      },
      {
        typeId: 'vertical-presidium',
        name: 'prezidiu vertical',
        icon: BarIcon,
        type: 'presidium',
      },
    ],
  },
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
  const [activeEditTable, setActiveEditTable] = useState<CanvasElement | null>(
    null
  )
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>(
    eventInstance?.eventTableOrganization.elements ?? []
  )
  const [activeSidebarField, setActiveSidebarField] = useState<{
    name: string
    icon: StaticImageData
    type: string
    typeId: string
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
      const { name, type, typeId } = activeData
      const id = active.id
      setActiveSidebarField({
        name: name,
        icon: activeData.icon,
        type: type,
        typeId: typeId,
      })
      // Create a new field that'll be added to the fields array
      // if we drag it over the canvas.
      currentDragFieldRef.current = {
        elementId: id,
        name: name,
        positions: { x: 0, y: 0 },
        type: type,
        typeId: typeId,
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
    const canvasElement: HTMLElement | null = document.querySelector(
      '.tables-canvas-section'
    )
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
    if (!e.active.data.current.fromSideBar && canvasElement) {
      const cvElement = canvasElements.find((x) => x.elementId === e.active.id)!
      cvElement.positions.x += (e.delta.x / canvasElement.offsetWidth) * 100
      cvElement.positions.y += (e.delta.y / canvasElement.offsetHeight) * 100
      const _cvelements = canvasElements.map((x) => {
        if (x.elementId === cvElement.elementId) return cvElement
        return x
      })
      setCanvasElements(_cvelements)
    }
  }

  return (
    <div className="bg-[#F6F6F6] h-screen w-full">
      <div className="tables-controls-section p-4 flex gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button type="default">Export salon</Button>
          <Button type="default">Export invitati</Button>
        </div>
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
          Editeaza
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
        <div className="tables-content-section p-4 rounded-lg shadow-md h-[calc(100vh-8rem)] gap-4 overflow-hidden bg-white grid grid-cols-[200px_1fr]">
          <div
            className="tables-objects-section bg-white h-full overflow-y-auto flex flex-col gap-4"
            key={sidebarFieldsRegenKey}
          >
            <h1 className="text-xl font-semibold">Elemente</h1>
            {ELEMENTS.map((element) =>
              element.subTypes ? (
                <TooltipProvider delayDuration={2}>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger className="flex gap-2 items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                      {element.name}
                    </TooltipTrigger>
                    <TooltipContent className="p-4 shadow-md bg-[white] min-w-[200px] flex flex-col gap-2">
                      {element.subTypes?.map((sbt, index) => (
                        <DraggableElement
                          key={index}
                          name={sbt.name}
                          icon={sbt.icon}
                          type={sbt.type}
                          typeId={sbt.typeId}
                        />
                      ))}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <DraggableElement
                  name={element.name}
                  icon={element.icon}
                  type={element.type}
                  typeId={element.typeId}
                />
              )
            )}
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
            setActiveEditTableId={(activeEditTable: CanvasElement) =>
              setActiveEditTable(activeEditTable)
            }
            id="canvas"
            canvasElements={canvasElements}
          />
        </div>
      </DndContext>
      <LateralDrawer
        tableElement={activeEditTable}
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
