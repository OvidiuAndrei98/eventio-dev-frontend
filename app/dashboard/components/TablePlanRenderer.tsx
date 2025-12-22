'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEventContext } from '@/core/context/EventContext';
import {
  CanvasElement,
  EventInstance,
  eventTableOrganization,
  Guest,
} from '@/core/types';
import { createXlsxWorkbook } from '@/lib/utils';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  Modifiers,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Button } from 'antd';
import jsPDF from 'jspdf';
import { User } from 'lucide-react';
import { StaticImageData } from 'next/image';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';
import DraggableElement from './draggable-canvas/draggable-element/DraggableElement';
import {
  CloseOutlined,
  DragOutlined,
  ExpandOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import GuestListDraggableItems from './draggable-canvas/draggable-element/GuestListDraggableItems';
import DraggableCanvas from './draggable-canvas/DraggableCanvas';
import LateralDrawer from './lateral-drawer/LateralDrawer';
import RoundTableIcon from '@/public/round-table.png';
import RoundTableV2Icon from '@/public/round-table-v2.png';
import VerticalTable from '@/public/vertical-table.png';
import HorizontalTable from '@/public/horizontal-table.png';
import StageIcon from '@/public/stage-icon.png';
import BarIcon from '@/public/bar-icon.png';
import domtoimage from 'dom-to-image';
import AddGuestsFloatingMenu from './add-guests-menu/AddGuestsFloatingMenu';
import { PLANYVITE_EVENT_PLAN_FEATURES } from '@/lib/planyviteEventPlanTiers';
import Link from 'next/link';
import TablePlanExportModal from './table-plan-exports/TablePlanExportModal';

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
  modifiers?: Modifiers;
  fromSideBar: boolean;
}

interface CurrentTableDragField {
  elementId: string;
  name: string;
  positions: { x: number; y: number };
  type: string;
  typeId: string;
  fromSideBar: boolean;
  guestCount: number;
  seats: number;
}

interface CurrentGuestDragField {
  fromSideBar: boolean;
  type: 'guest';
  guestId: string;
  guestName: string;
}

interface TablePlanRendererProps {
  queryGuestsService: (eventId: string, eventPlan: string) => Promise<Guest[]>;
  assignTableToGuestsService: (
    eventId: string,
    tableId: string | null,
    guests: { label: string; value: string }[]
  ) => Promise<void>;
  updateTablesService: (
    elements: eventTableOrganization,
    eventId: string
  ) => Promise<void>;
  queryGuestsByTableService: (
    eventId: string,
    tableId: string
  ) => Promise<Guest[]>;
  addGuestsService: (
    eventId: string,
    userId: string,
    guests: Guest[]
  ) => Promise<void>;
  updateTableService: (
    name: string,
    seats: number,
    tableId: string,
    eventId: string
  ) => Promise<{ event: EventInstance; removedGuestIds: string[] }>;
  queryTableGuestsService: (
    eventId: string,
    tableId: string
  ) => Promise<Guest[]>;
  guestListChanged?: () => Promise<void>;
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

const TablePlanRenderer = (props: TablePlanRendererProps) => {
  const { eventInstance, setEventInstance } = useEventContext();

  const maxGuestsAvailableInTablePlan =
    PLANYVITE_EVENT_PLAN_FEATURES[eventInstance?.eventPlan || 'basic']
      .nrOfGuestsAvailableInTablePlan;

  const maxTablesAllowed =
    PLANYVITE_EVENT_PLAN_FEATURES[eventInstance?.eventPlan || 'basic']
      .maxTablePlanElements;

  const [tableEditActive, setTableEditActive] = useState(false);
  const [activeEditTable, setActiveEditTable] = useState<CanvasElement | null>(
    null
  );
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>(
    eventInstance?.eventTableOrganization.elements ?? []
  );
  const [activeSidebarField, setActiveSidebarField] =
    useState<DragEventData | null>(null);
  const [sidebarFieldsRegenKey, setSidebarFieldsRegenKey] = useState(
    Date.now()
  );
  const [activeFieldData, setActiveFieldData] = useState<DragEventData | null>(
    null
  );
  const [editModeOn, setEditModeOn] = useState(false);
  const [deleteTablesLoading, setDeleteTablesLoading] = useState(false);

  const [zoomScale, setZoomScale] = useState(1.0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const currentDragFieldRef = useRef<
    CurrentTableDragField | CurrentGuestDragField | null
  >(null);

  const [isPanning, setIsPanning] = useState(false);
  const panStartCoords = useRef({ x: 0, y: 0 });
  const panOffsetStart = useRef({ x: 0, y: 0 });

  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const [eventGuests, setEventGuests] = useState<Guest[]>([]);

  const [showGuestList, setShowGuestList] = useState(false);
  const [showAddGuestsMenu, setShowAddGuestsMenu] = useState(false);

  const [activeDragGuest, setActiveDragGuest] = useState<{
    fromSideBar: boolean;
    type: 'guest';
    guestId: string;
    guestName: string;
  } | null>(null);

  const fetchEventGuests = async (eventId: string) => {
    const response = await props.queryGuestsService(
      eventId,
      eventInstance?.eventPlan || 'basic'
    );
    setEventGuests(response);
  };

  const isNonUltimate =
    !eventInstance?.eventPlan || eventInstance.eventPlan !== 'ultimate';

  useEffect(() => {
    if (eventInstance) {
      setCanvasElements(eventInstance?.eventTableOrganization.elements);
      fetchEventGuests(eventInstance.eventId);
    }
  }, [eventInstance]);

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

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    setZoomScale(1.0);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const handleAddGuestsClick = async (
    eventId: string,
    userId: string,
    guests: Guest[]
  ) => {
    if (eventGuests.length + guests.length >= maxGuestsAvailableInTablePlan) {
      toast.error(
        `Nu poți adăuga mai mulți invitați. Limita pentru planul tău este de ${maxGuestsAvailableInTablePlan} invitați.`
      );
      throw new Error('Guest limit exceeded for the current plan.');
    } else {
      await props.addGuestsService(eventId, userId, guests);
    }
  };

  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;

    const isDraggableElement = (e.target as HTMLElement).closest(
      '[data-element-type]'
    );

    if (isDraggableElement || activeDragId !== null) return;

    setIsPanning(true);
    panStartCoords.current = { x: e.clientX, y: e.clientY };
    panOffsetStart.current = { x: panOffset.x, y: panOffset.y };
  };

  const animationRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (activeDragId !== null) {
      setIsPanning(false);
      return;
    }

    if (!isPanning) return;

    const deltaX = e.clientX - panStartCoords.current.x;
    const deltaY = e.clientY - panStartCoords.current.y;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = requestAnimationFrame(() => {
      setPanOffset({
        x: panOffsetStart.current.x + deltaX,
        y: panOffsetStart.current.y + deltaY,
      });
      animationRef.current = null;
    });
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 0,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (e: DragStartEvent) => {
    const { active } = e;

    if (isPanning) {
      setIsPanning(false);
    }
    setActiveDragId(active.id as string);

    const activeData = active.data.current as DragEventData | undefined;
    if (!activeData) return;

    setActiveFieldData(activeData);

    if (activeData.fromSideBar) {
      const { name, type, typeId, isEditing } = activeData;

      if (type === 'guest') {
        setActiveDragGuest({
          fromSideBar: true,
          type: 'guest',
          guestId: active.id as string,
          guestName: name,
        });

        currentDragFieldRef.current = {
          fromSideBar: true,
          type: 'guest',
          guestId: active.id as string,
          guestName: name,
        };
      } else {
        setActiveSidebarField({
          name,
          icon: activeData.icon,
          type,
          typeId,
          isEditing,
          modifiers: activeData.modifiers,
          fromSideBar: true,
        });
        currentDragFieldRef.current = {
          elementId: active.id as string,
          name,
          positions: { x: 0, y: 0 },
          type,
          typeId,
          fromSideBar: true,
          guestCount: 0,
          seats: 10,
        };
      }
    }
  };

  const cleanUp = () => {
    setActiveSidebarField(null);
    setActiveDragGuest(null);
    setActiveFieldData(null);
    currentDragFieldRef.current = null;
    setSidebarFieldsRegenKey(Date.now());
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveDragId(null);

    const canvasElement: HTMLElement | null = document.querySelector(
      '.tables-canvas-section'
    );

    const nextField = currentDragFieldRef.current;

    if (nextField && nextField.type === 'guest') {
      const guestField = nextField as CurrentGuestDragField;
      if (guestField && guestField.fromSideBar && canvasElement) {
        const { over } = e;
        if (!over || over.data.current?.type !== 'table') {
          cleanUp();
          return;
        }
        const tableId = over.id as string;

        if (over.data.current.guestCount >= over.data.current.seats) {
          toast.error(
            'Masa selectata este deja completa. Te rugam sa alegi o alta masa.'
          );
          cleanUp();
          return;
        }

        props
          .assignTableToGuestsService(eventInstance!.eventId, tableId, [
            {
              label: guestField.guestName,
              value: guestField.guestId.replace('guest-', ''),
            },
          ])
          .then(() => {
            fetchEventGuests(eventInstance!.eventId);
            toast.success('Invitat asezat cu succes la masa selectata.');
          });
      }
    } else {
      const tableField = nextField as CurrentTableDragField;
      if (tableField && tableField.fromSideBar && canvasElement) {
        if (
          eventInstance?.eventPlan !== 'ultimate' &&
          canvasElements.length >= maxTablesAllowed
        ) {
          toast.error(
            'Numărul maxim de mese permise pentru planul curent a fost atins. Te rugăm să faci upgrade la planul Ultimate pentru a adăuga mai multe mese.'
          );
          cleanUp();
          return;
        }

        const { over } = e;

        if (!over || over.id !== CANVAS_ID) {
          cleanUp();
          return;
        }
        const rect = canvasElement.getBoundingClientRect();
        const activatorEvent = e.activatorEvent as MouseEvent;
        const dropClientX = activatorEvent.clientX + e.delta.x;
        const dropClientY = activatorEvent.clientY + e.delta.y;

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

        tableField.positions = { x: newX, y: newY };
        setCanvasElements((prev) => [...prev, tableField]);
      } else if (!e.active.data.current?.fromSideBar && canvasElement) {
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

    const captureOptions = {
      width: LOGICAL_CANVAS_WIDTH,
      height: LOGICAL_CANVAS_HEIGHT,
      style: {
        transform: 'translate(0px, 0px) scale(1.0)',
        overflow: 'visible',
      },
    };

    domtoimage
      .toPng(canvasElement, captureOptions)
      .then(function (imgData) {
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

  const updateTables = async (id?: string) => {
    if (!eventInstance) return;

    let removedElementList: CanvasElement[] = canvasElements;
    if (id) {
      const canvasElementsCopy = [...canvasElements];
      removedElementList = canvasElementsCopy.filter(
        (el) => el.elementId !== id
      );
      setCanvasElements(removedElementList);
    }
    setDeleteTablesLoading(true);
    props.updateTablesService(
      {
        elements: removedElementList,
      },
      eventInstance.eventId
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
            const tableGuests: Guest[] = await props.queryGuestsByTableService(
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
        const guestsToBeRemoved = await props.queryGuestsByTableService(
          eventInstance?.eventId,
          id
        );
        if (guestsToBeRemoved.length) {
          await props.assignTableToGuestsService(
            eventInstance.eventId,
            null,
            guestsToBeRemoved.map((guest) => {
              return { value: guest.guestId, label: guest.fullName };
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
    <div className="bg-[#F6F6F6] h-full w-full flex flex-col">
      <div className="tables-controls-section p-4 flex gap-4 items-center justify-between shrink-0 h-16">
        <div className="flex gap-2">
          <Button type="default" onClick={exportToPDF}>
            Export salon
          </Button>
          <Button type="default" onClick={exportGuestsToExcel}>
            Export invitati
          </Button>
        </div>

        {isNonUltimate && (
          <div className="flex items-center gap-4">
            <span className="text-xs text-[var(--primary-color)]">
              {maxGuestsAvailableInTablePlan - eventGuests.length}/
              {maxGuestsAvailableInTablePlan} invitați ramași
            </span>
            {eventInstance?.eventType !== 'tablePlan' ? (
              <Link href={`choose-plan`}>
                <Button type="default">Vezi Planul Ultimate</Button>
              </Link>
            ) : (
              <Link href={`${eventInstance?.eventId}/upgrade-plan`}>
                <Button type="default">Vezi Planul Ultimate</Button>
              </Link>
            )}
          </div>
        )}
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
                  await updateTables();
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
          <div
            className="tables-objects-section bg-white h-full overflow-y-auto flex flex-col gap-4"
            key={sidebarFieldsRegenKey}
          >
            <h1 className="text-xl font-semibold">Elemente</h1>
            {ELEMENTS.map((element) =>
              element.subTypes ? (
                <TooltipProvider delayDuration={2} key={element.typeId}>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger className="flex gap-2 items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white shadow-xs">
                      {element.name}
                    </TooltipTrigger>
                    <TooltipContent className="p-4 shadow-md bg-[white] min-w-[200px] flex flex-col gap-2">
                      {element.subTypes?.map((sbt) => (
                        <DraggableElement
                          isEditing={editModeOn}
                          key={sbt.typeId}
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
                  key={element.typeId}
                  isEditing={editModeOn}
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
            {activeDragGuest ? (
              <div className="p-2 mb-1 bg-gray-100 rounded-md shadow-sm border border-gray-300 hover:bg-blue-100 cursor-grab text-sm flex items-center justify-between">
                <span className="bg-[url(/character-avatar-icon.png)] rounded-full border border-gray-500 bg-cover bg-center shadow-lg w-6 h-6"></span>
                <span>{activeDragGuest.guestName}</span>
              </div>
            ) : null}
          </DragOverlay>

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

            <div className="absolute left-4 top-4 z-50 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-lg border border-gray-400">
              {showGuestList ? (
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={() => setShowGuestList(false)}
                />
              ) : (
                <Button
                  type="text"
                  icon={<DragOutlined />}
                  onClick={() => setShowGuestList(true)}
                >
                  <User size={16} />
                </Button>
              )}

              {showGuestList && (
                <div className="mt-2 p-2 w-[400px] max-h-[400px] overflow-y-auto border-t border-gray-400">
                  <h3 className="text-sm font-semibold mb-2">
                    Invitati Neasezati
                  </h3>
                  <GuestListDraggableItems
                    unseatedGuests={eventGuests.filter(
                      (guest) => !guest.tableId
                    )}
                  />
                </div>
              )}
            </div>
            <div className="absolute left-4 bottom-4 z-50 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-lg border border-gray-400">
              <div className="flex flex-row justify-between items-center">
                {showAddGuestsMenu ? (
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => setShowAddGuestsMenu(false)}
                  />
                ) : (
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => setShowAddGuestsMenu(!showAddGuestsMenu)}
                  >
                    <User size={16} />
                  </Button>
                )}

                {showAddGuestsMenu && <h3 className="mr-4">Adaugă invitați</h3>}
              </div>

              {showAddGuestsMenu && (
                <div className="mt-2 p-2 w-[400px] max-h-[450px] overflow-hidden border-t border-gray-200">
                  <AddGuestsFloatingMenu
                    eventId={eventInstance?.eventId || ''}
                    userId={eventInstance?.userId || ''}
                    addGuestsService={handleAddGuestsClick}
                    refreshGuestList={async () => {
                      props.guestListChanged &&
                        (await props.guestListChanged());
                      await fetchEventGuests(eventInstance!.eventId);
                    }}
                  />
                </div>
              )}
            </div>
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
                eventGuests={eventGuests}
              />
            </div>
          </div>
        </div>
      </DndContext>
      {activeEditTable && eventInstance && (
        <LateralDrawer
          updateGuestList={fetchEventGuests}
          deleteTable={updateTables}
          tableElement={activeEditTable}
          eventId={eventInstance?.eventId}
          tableEditActive={tableEditActive}
          setEventInstance={setEventInstance}
          setTableEditActive={setTableEditActive}
          eventGuestsList={eventGuests}
          updateTableService={props.updateTableService}
          assignTableToGuestsService={props.assignTableToGuestsService}
          queryTableGuestsService={props.queryTableGuestsService}
        />
      )}
      <TablePlanExportModal
        isOpen={true}
        onClose={() => {}}
        tables={canvasElements}
        guests={eventGuests}
      />
    </div>
  );
};

export default TablePlanRenderer;
