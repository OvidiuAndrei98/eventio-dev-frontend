'use client';

import { Button } from 'antd';
import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  MouseEvent as ReactMouseEvent,
} from 'react';
import {
  PlusOutlined,
  MinusOutlined,
  ExpandOutlined,
  StarOutlined,
} from '@ant-design/icons';
import RoundTableIcon from '@/public/round-table.png';
import RoundTableV2Icon from '@/public/round-table-v2.png';
import VerticalTable from '@/public/vertical-table.png';
import HorizontalTable from '@/public/horizontal-table.png';
import StageIcon from '@/public/stage-icon.png';
import BarIcon from '@/public/bar-icon.png';
import { StaticImageData } from 'next/image';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import DraggableElement from './components/draggable-canvas/draggable-element/DraggableElement';
import DraggableCanvas from './components/draggable-canvas/DraggableCanvas';
import { CanvasElement, Guest } from '@/core/types';
import { updateEventTableOrganization } from '@/service/event/updateEventTableOrganization';
import LateralDrawer from './components/lateral-drawer/LateralDrawer';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import { queryGuestsByTable } from '@/service/guest/queryGuestsByTable';
import { createXlsxWorkbook } from '@/lib/utils';
import { assignTableToGuests } from '@/service/guest/assignTableToGuest';
import { useEventContext } from '@/core/context/EventContext';
import { PLANYVITE_EVENT_PLAN_FEATURES } from '@/lib/planyviteEventPlanTiers';

const LOGICAL_CANVAS_WIDTH = 1920;
const LOGICAL_CANVAS_HEIGHT = 1080;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2.0;
const ZOOM_STEP = 0.1;
const LOGICAL_ELEMENT_SIZE = 80;
const LOGICAL_CENTER_OFFSET = LOGICAL_ELEMENT_SIZE / 2;

const CANVAS_ID = 'draggable-canvas';

export interface CanvasListElementDefinition {
  type: string;
  typeId: string;
  name: string;
  icon: StaticImageData;
  subTypes?: CanvasListElementDefinition[];
}

export interface DragEventData {
  name: string;
  icon: StaticImageData;
  type: string;
  typeId: string;
  isEditing: boolean;
  modifiers: [];
  fromSideBar: boolean;
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
  {
    typeId: 'others',
    name: 'Diverse',
    icon: BarIcon,
    type: 'others',
    subTypes: [
      {
        typeId: 'candy-bar',
        name: 'Candy bar',
        icon: BarIcon,
        type: 'others',
      },
      {
        typeId: 'photo-booth',
        name: 'Photo booth',
        icon: BarIcon,
        type: 'others',
      },
      {
        typeId: 'cheese-bar',
        name: 'Cheese bar',
        icon: BarIcon,
        type: 'others',
      },
      {
        typeId: 'entrance',
        name: 'Intrare',
        icon: BarIcon,
        type: 'others',
      },
      {
        typeId: 'dance-floor',
        name: 'Ring dans',
        icon: BarIcon,
        type: 'others',
      },
    ],
  },
];

const TablesPage = () => {
  const { eventInstance, setEventInstance } = useEventContext();

  // State-uri Dnd
  const [tableEditActive, setTableEditActive] = useState(false);
  const [activeEditTable, setActiveEditTable] = useState<CanvasElement | null>(
    null
  );
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>(
    eventInstance?.eventTableOrganization.elements ?? []
  );
  const [activeSidebarField, setActiveSidebarField] = useState<any | null>(
    null
  );
  const [sidebarFieldsRegenKey, setSidebarFieldsRegenKey] = useState(
    Date.now()
  );
  const [activeFieldData, setActiveFieldData] = useState<{
    modifiers: [];
  } | null>(null);
  const [editModeOn, setEditModeOn] = useState(false);
  const [deleteTablesLoading, setDeleteTablesLoading] = useState(false);

  // --- ZOOM & PAN STATE ---
  const [zoomScale, setZoomScale] = useState(1.0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const currentDragFieldRef = useRef<any | null>(null);

  // Stari pentru Panning manual
  const [isPanning, setIsPanning] = useState(false);
  const panStartCoords = useRef({ x: 0, y: 0 });
  const panOffsetStart = useRef({ x: 0, y: 0 });

  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  // Constants for Plan
  type EventPlanKey = keyof typeof PLANYVITE_EVENT_PLAN_FEATURES;
  const isBasicPlan =
    !eventInstance?.eventPlan || eventInstance.eventPlan === 'basic';
  const isPremiumPlan = eventInstance?.eventPlan === 'premium';
  const planKey: EventPlanKey =
    (eventInstance?.eventPlan as EventPlanKey) || 'basic';
  const maxElements =
    PLANYVITE_EVENT_PLAN_FEATURES[planKey].maxTablePlanElements ?? 2;

  useEffect(() => {
    if (eventInstance) {
      setCanvasElements(eventInstance?.eventTableOrganization.elements);
    }
  }, [eventInstance]);

  // --- FUNCTIE CALCUL INITIAL (PĂSTRATĂ pentru butonul de "Fit to Screen") ---
  const fitToScreen = useCallback(() => {
    if (canvasWrapperRef.current) {
      const availableWidth = canvasWrapperRef.current.clientWidth;
      const availableHeight = canvasWrapperRef.current.clientHeight;

      const scaleX = availableWidth / LOGICAL_CANVAS_WIDTH;
      const scaleY = availableHeight / LOGICAL_CANVAS_HEIGHT;

      const newScale = Math.min(scaleX, scaleY) * 0.9;

      const scaledCanvasWidth = LOGICAL_CANVAS_WIDTH * newScale;
      const scaledCanvasHeight = LOGICAL_CANVAS_HEIGHT * newScale;

      const centerX = (availableWidth - scaledCanvasWidth) / 2;
      const centerY = (availableHeight - scaledCanvasHeight) / 2;

      setZoomScale(newScale);
      setPanOffset({ x: centerX, y: centerY });
    }
  }, []);

  // --- useLayoutEffect GOAL: Pornește cu Zoom 1.0 și Pan 0,0 ---
  useLayoutEffect(() => {
    setZoomScale(1.0);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  // --- HANDLERS PENTRU ZOOM MANUAL ---
  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  };

  const handleMouseDown = (e: ReactMouseEvent) => {
    if (e.button !== 0) return;

    const isDraggableElement = (e.target as HTMLElement).closest(
      '[data-element-type]'
    );

    if (isDraggableElement || activeDragId !== null) return;

    setIsPanning(true);
    panStartCoords.current = { x: e.clientX, y: e.clientY };
    panOffsetStart.current = { x: panOffset.x, y: panOffset.y };
  };

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (activeDragId !== null) {
      setIsPanning(false);
      return;
    }

    if (!isPanning) return;

    const deltaX = e.clientX - panStartCoords.current.x;
    const deltaY = e.clientY - panStartCoords.current.y;

    setPanOffset({
      x: panOffsetStart.current.x + deltaX,
      y: panOffsetStart.current.y + deltaY,
    });
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }
  };

  // Folosim MouseSensor pentru elementele DndKit
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 0, // Fără distanță minimă de activare
    },
  });

  const sensors = useSensors(mouseSensor);

  const handleDragStart = (e: DragStartEvent) => {
    const { active } = e;

    if (isPanning) {
      setIsPanning(false);
    }
    setActiveDragId(active.id as string);

    const activeData = active.data.current as DragEventData;
    if (!activeData) return;

    setActiveFieldData(activeData);

    if (activeData.fromSideBar) {
      const { name, type, typeId, isEditing } = activeData;
      setActiveSidebarField({
        name,
        icon: activeData.icon,
        type,
        typeId,
        isEditing,
      });
      currentDragFieldRef.current = {
        elementId: active.id as string,
        name,
        positions: { x: 0, y: 0 },
        type,
        typeId,
        fromSideBar: true,
      };
    }
  };

  const cleanUp = () => {
    setActiveSidebarField(null);
    setActiveFieldData(null);
    currentDragFieldRef.current = null;
    setSidebarFieldsRegenKey(Date.now());
  };

  const handleDragEnd = (e: DragEndEvent) => {
    // Resetam ID-ul drag-ului
    setActiveDragId(null); // NOU

    const canvasElement: HTMLElement | null = document.querySelector(
      '.tables-canvas-section'
    );
    const { over } = e;

    if (!over || over.id !== CANVAS_ID) {
      cleanUp();
      return;
    }

    const nextField = currentDragFieldRef.current;

    // ... (Logica de adaugare/mutare neschimbata)

    // CAZ 1: Adaugare Element Nou
    if (nextField && nextField.fromSideBar && canvasElement) {
      const rect = canvasElement.getBoundingClientRect();
      const dropClientX = (e.activatorEvent as any).clientX + e.delta.x;
      const dropClientY = (e.activatorEvent as any).clientY + e.delta.y;

      const relativeToCanvasX = dropClientX - rect.left;
      const relativeToCanvasY = dropClientY - rect.top;

      let newX = relativeToCanvasX / zoomScale;
      let newY = relativeToCanvasY / zoomScale;

      newX = newX - LOGICAL_CENTER_OFFSET;
      newY = newY - LOGICAL_CENTER_OFFSET;

      newX = Math.max(
        0,
        Math.min(LOGICAL_CANVAS_WIDTH - LOGICAL_ELEMENT_SIZE, newX)
      );
      newY = Math.max(
        0,
        Math.min(LOGICAL_CANVAS_HEIGHT - LOGICAL_ELEMENT_SIZE, newY)
      );

      nextField.positions = { x: newX, y: newY };
      setCanvasElements((prev) => [...prev, nextField]);
    }
    // CAZ 2: Mutare Element Existent
    else if (!e.active.data.current?.fromSideBar && canvasElement) {
      const movedElementIndex = canvasElements.findIndex(
        (x) => x.elementId === e.active.id
      );

      if (movedElementIndex !== -1) {
        const currentElement = canvasElements[movedElementIndex];
        const logicalDeltaX = e.delta.x / zoomScale;
        const logicalDeltaY = e.delta.y / zoomScale;

        let newX = currentElement.positions.x + logicalDeltaX;
        let newY = currentElement.positions.y + logicalDeltaY;

        newX = Math.max(
          0,
          Math.min(LOGICAL_CANVAS_WIDTH - LOGICAL_ELEMENT_SIZE, newX)
        );
        newY = Math.max(
          0,
          Math.min(LOGICAL_CANVAS_HEIGHT - LOGICAL_ELEMENT_SIZE, newY)
        );

        setCanvasElements((currentElements) =>
          currentElements.map((el, index) => {
            if (index === movedElementIndex) {
              return { ...el, positions: { x: newX, y: newY } };
            }
            return el;
          })
        );
      }
    }

    cleanUp();
  };

  const exportToPDF = () => {
    const canvasElement = document.querySelector(
      '.tables-canvas-section'
    ) as HTMLElement;

    if (!canvasElement) {
      toast.error('Elementul canvas nu a fost găsit.');
      return;
    }

    // --- PASUL 1: CAPTURAREA IMAGINII CU STILURI SUPRASCRISE ---

    // Suprascriem transformarea CSS pentru a forța scala 1.0 și translația 0,0
    const captureOptions = {
      width: LOGICAL_CANVAS_WIDTH,
      height: LOGICAL_CANVAS_HEIGHT,
      style: {
        transform: 'translate(0px, 0px) scale(1.0)',
        // Asigurăm că nu este ascuns de overflow
        overflow: 'visible',
      },
      // Scurgerea overflow-ului pe viewportWrapper este importantă
      // Vă rugăm să vă asigurați că elementul canvasWrapperRef nu are overflow: hidden,
      // sau că acesta este temporar dezactivat, deși aici ar trebui să fie de ajuns
    };

    domtoimage
      .toPng(canvasElement, captureOptions)
      .then(function (imgData) {
        // --- PASUL 2: GENERARE PDF (Logica anterioară) ---
        const PDF_ORIENTATION = 'l';
        const PDF_UNIT = 'mm';
        const PDF_FORMAT = 'a4';

        const pdf = new jsPDF(PDF_ORIENTATION, PDF_UNIT, PDF_FORMAT);

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const canvasRatio = LOGICAL_CANVAS_WIDTH / LOGICAL_CANVAS_HEIGHT;
        const pdfRatio = pdfWidth / pdfHeight;

        let finalImgWidth, finalImgHeight;

        if (canvasRatio > pdfRatio) {
          finalImgWidth = pdfWidth;
          finalImgHeight = pdfWidth / canvasRatio;
        } else {
          finalImgHeight = pdfHeight;
          finalImgWidth = pdfHeight * canvasRatio;
        }

        const xOffset = (pdfWidth - finalImgWidth) / 2;
        const yOffset = (pdfHeight - finalImgHeight) / 2;

        pdf.addImage(
          imgData,
          'PNG',
          xOffset,
          yOffset,
          finalImgWidth,
          finalImgHeight
        );

        pdf.save('Planificare-Sala-A4.pdf');
      })
      .catch(function (error) {
        console.error('Eroare la generarea imaginii pentru PDF:', error);
        toast.error('A apărut o eroare la generarea PDF-ului.');
      });
  };

  const handlCanvasElementDelete = (id: string) => {
    const canvasElementsCopy = [...canvasElements];
    const removedElementList = canvasElementsCopy.filter(
      (el) => el.elementId !== id
    );
    setCanvasElements(removedElementList);
  };

  const deleteTable = async (id?: string) => {
    let removedElementList: CanvasElement[] = canvasElements;
    if (id) {
      const canvasElementsCopy = [...canvasElements];
      removedElementList = canvasElementsCopy.filter(
        (el) => el.elementId !== id
      );
      setCanvasElements(removedElementList);
    }
    setDeleteTablesLoading(true);
    updateEventTableOrganization(
      {
        elements: removedElementList,
      },
      eventInstance?.eventId
    );
    if (eventInstance) {
      await handleDeleteGuestsFromDeletedTables(
        eventInstance?.eventTableOrganization.elements ?? []
      );

      const eventCopy = eventInstance;
      eventCopy.eventTableOrganization.elements = removedElementList;
      setEventInstance(eventCopy);
    }

    setDeleteTablesLoading(false);
  };

  const exportGuestsToExcel = async () => {
    const guestsTableOrganization: {
      tableName: string;
      guests: Guest[];
    }[] = [];

    if (eventInstance?.eventTableOrganization.elements) {
      await Promise.all(
        eventInstance.eventTableOrganization.elements.map(async (el) => {
          if (el.type === 'table') {
            const tableGuests: Guest[] = await queryGuestsByTable(
              eventInstance.eventId,
              el.elementId
            );
            if (tableGuests.length) {
              guestsTableOrganization.push({
                tableName: el.name,
                guests: tableGuests,
              });
            }
          }
        })
      );
      createXlsxWorkbook(guestsTableOrganization);
    } else {
      toast.error('Adauga un element pentru a putea fi exportat');
    }
  };

  const handleDeleteGuestsFromDeletedTables = async (
    oldTablesArray: CanvasElement[]
  ) => {
    if (!eventInstance) return;

    const removedTablesIds: string[] = [];
    oldTablesArray.forEach((oldTable) => {
      const tableGuests = canvasElements.filter(
        (x) => x.elementId === oldTable.elementId
      );
      if (!tableGuests.length) {
        removedTablesIds.push(oldTable.elementId);
      }
    });
    try {
      removedTablesIds.forEach(async (id) => {
        const guestsToBeRemoved = await queryGuestsByTable(
          eventInstance?.eventId,
          id
        );
        if (guestsToBeRemoved.length) {
          await assignTableToGuests(
            null,
            guestsToBeRemoved.map((guest) => {
              return { value: guest.guestId, label: guest.name };
            })
          );
        }
      });
    } catch (error) {
      console.error('Error deleting guests from deleted tables', error);
      toast.error('A aparut o eroare la stergerea meselor');
    }
  };

  return (
    <div className="bg-[#F6F6F6] h-screen w-full flex flex-col">
      <div className="tables-controls-section p-4 flex gap-4 items-center justify-between shrink-0 h-16">
        <div className="flex gap-2">
          <Button type="default" onClick={exportToPDF}>
            Export salon
          </Button>
          <Button type="default" onClick={exportGuestsToExcel}>
            Export invitati
          </Button>
        </div>
        {editModeOn ? (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setEditModeOn(false);
                setCanvasElements(
                  eventInstance?.eventTableOrganization.elements ?? []
                );
              }}
              type="default"
            >
              Anuleaza
            </Button>
            <Button
              loading={deleteTablesLoading}
              onClick={async () => {
                try {
                  await deleteTable();
                  setEditModeOn(false);
                } catch (error) {
                  toast.error('A aparut o eroare la salvare');
                }
              }}
              type="primary"
            >
              Salveaza
            </Button>
          </div>
        ) : (
          <Button onClick={() => setEditModeOn(true)} type="primary">
            Editeaza
          </Button>
        )}
      </div>

      <DndContext
        modifiers={activeFieldData ? activeFieldData.modifiers : undefined}
        onDragStart={handleDragStart}
        sensors={sensors}
        autoScroll={false}
        onDragEnd={handleDragEnd}
      >
        <div className="tables-content-section p-4 rounded-lg shadow-md flex-1 gap-4 overflow-hidden bg-white grid grid-cols-[200px_1fr] h-[calc(100vh-5rem)]">
          {/* SIDEBAR (ramane neschimbat) */}
          <div
            className="tables-objects-section bg-white h-full overflow-y-auto flex flex-col gap-4"
            key={sidebarFieldsRegenKey}
          >
            <h1 className="text-xl font-semibold">Elemente</h1>
            {ELEMENTS.map((element, index) =>
              element.subTypes ? (
                <TooltipProvider delayDuration={2} key={index}>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger className="flex gap-2 items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white shadow-xs">
                      {element.name}
                    </TooltipTrigger>
                    <TooltipContent className="p-4 shadow-md bg-[white] min-w-[200px] flex flex-col gap-2">
                      {element.subTypes?.map((sbt, idx) => (
                        <DraggableElement
                          isEditing={editModeOn}
                          key={idx}
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
                  key={index}
                  isEditing={editModeOn}
                  name={element.name}
                  icon={element.icon}
                  type={element.type}
                  typeId={element.typeId}
                />
              )
            )}
            {isBasicPlan && (
              <div className="mt-auto mb-4 rounded-lg bg-[#f5edf7] border border-[var(--primary-color)] p-4 shadow flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[var(--primary-color)] font-semibold text-base">
                  <span>
                    <StarOutlined />
                  </span>
                  <span>Funcționalitate Ultimate</span>
                </div>
                <div className="text-[var(--primary-color)] mt-1 mb-2 text-sm">
                  Această funcționalitate este disponibilă doar cu planul
                  Ultimate.
                </div>
                <span className="text-[var(--primary-color)] text-sm font-light">
                  Poti testa aceasta functionalitate cu un numar limitat de
                  elemente si invitati asezati la masa.
                </span>
                <button
                  className="cursor-pointer flex items-center gap-2 border border-[var(--primary-color)] text-[var(--primary-color)] px-3 py-1 rounded-md font-medium hover:bg-[var(--primary-color)]/10 transition"
                  type="button"
                >
                  <span>
                    <StarOutlined />
                  </span>
                  Vezi Detalii
                </button>
              </div>
            )}
          </div>

          <DragOverlay>
            {activeSidebarField ? (
              <DraggableElement {...activeSidebarField} />
            ) : null}
          </DragOverlay>

          {/* === CANVAS WRAPPER + ZOOM/PAN CONTROL (Pan Manual) === */}
          <div
            ref={canvasWrapperRef}
            className="canvas-viewport w-full h-full bg-gray-100 overflow-hidden relative border border-gray-200 rounded-md"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              cursor: isPanning && !editModeOn ? 'grabbing' : 'grab',
            }}
          >
            {/* BUTOANE ZOOM FLOTANTE */}
            <div className="absolute right-4 top-4 z-50 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-lg border border-gray-200">
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={handleZoomIn}
                title="Zoom In"
                disabled={zoomScale >= MAX_ZOOM}
              />
              <div className="text-center text-xs font-semibold text-gray-500 select-none">
                {Math.round(zoomScale * 100)}%
              </div>
              <Button
                type="text"
                icon={<MinusOutlined />}
                onClick={handleZoomOut}
                title="Zoom Out"
                disabled={zoomScale <= MIN_ZOOM}
              />
              <div className="h-[1px] bg-gray-200 my-1 w-full"></div>
              <Button
                type="text"
                icon={<ExpandOutlined />}
                onClick={fitToScreen}
                title="Fit to Screen (Reset)"
              />
            </div>

            {/* ZONA DE CANVAS SCALATA ȘI TRANSLAȚĂ */}
            <div
              className="scaled-canvas-inner-dnd tables-canvas-section"
              style={{
                width: `${LOGICAL_CANVAS_WIDTH}px`,
                height: `${LOGICAL_CANVAS_HEIGHT}px`,
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                transformOrigin: '0 0',
                position: 'relative',
                backgroundColor: 'white',
                boxShadow: '0 0 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.1s ease-out',
                userSelect: 'none',
                cursor: 'default',
                // GRID BACKGROUND
                backgroundImage: `linear-gradient(to right, #e0e0e0 1px, transparent 1px),
                                     linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            >
              <DraggableCanvas
                isEditing={editModeOn}
                tableEditActive={setTableEditActive}
                setActiveEditTableId={setActiveEditTable}
                onDelete={handlCanvasElementDelete}
                id={CANVAS_ID}
                canvasElements={canvasElements}
                eventId={eventInstance?.eventId}
                currentZoomScale={zoomScale}
              />
            </div>
          </div>
        </div>
      </DndContext>
      {activeEditTable && eventInstance && (
        <LateralDrawer
          deleteTable={deleteTable}
          tableElement={activeEditTable}
          eventId={eventInstance?.eventId}
          tableEditActive={tableEditActive}
          setEventInstance={setEventInstance}
          setTableEditActive={setTableEditActive}
        />
      )}
    </div>
  );
};

export default TablesPage;
