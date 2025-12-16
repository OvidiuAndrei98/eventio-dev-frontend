'use client';

import { Button } from 'antd';
import { CanvasElement, EventInstance, Guest } from '@/core/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import TableSelectDrawer from './TableSelectDrawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users } from 'lucide-react';
import UnseatGuestsDrawer from './UnseatGuestDrawer';
import TableDetailsDrawer from './TableDetailsDrawer';
import { AnimatedCounter } from '@/components/incrementingText/incrementingText';
import { Spinner } from '@/components/ui/spinner';

interface ListBasedTableAssignerProps {
  eventInstance: EventInstance | null;
  eventGuests: Guest[];
  canvasElements: CanvasElement[];
  setEventInstance: (event: EventInstance) => void;
  assignTableToGuestsService: (
    eventId: string,
    tableId: string | null,
    guests: { label: string; value: string }[]
  ) => Promise<void>;
  updateTableDetailsService: (
    name: string,
    seats: number,
    tableId: string,
    eventId: string
  ) => Promise<{ event: EventInstance; removedGuestIds: string[] }>;
  fetchEventGuests: () => Promise<void>;
}

const ListBasedTableAssigner = ({
  eventInstance,
  eventGuests,
  canvasElements,
  setEventInstance,
  assignTableToGuestsService,
  updateTableDetailsService,
  fetchEventGuests,
}: ListBasedTableAssignerProps) => {
  const [selectedTable, setSelectedTable] = useState<CanvasElement | null>(
    null
  );
  const [selectedTableForUnseating, setSelectedTableForUnseating] =
    useState<CanvasElement | null>(null);
  const [isUnseatingModalOpen, setIsUnseatingModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [tablesWithStatusloading, setTablesWithStatusLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isUnseating, setIsUnseating] = useState(false);

  const tables = canvasElements.filter((el) => el.type === 'table');

  const tablesWithStatus = tables.map((table) => ({
    ...table,
    guestCount: eventGuests.filter((guest) => guest.tableId === table.elementId)
      .length,
    isFull:
      eventGuests.filter((guest) => guest.tableId === table.elementId).length >=
      (table.seats || 10),
  }));

  const unseatedGuests = eventGuests.filter((guest) => !guest.tableId);

  useEffect(() => {
    setTablesWithStatusLoading(true);
    const timer = setTimeout(() => {
      setTablesWithStatusLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [eventInstance]);

  const handleTableSelect = (table: CanvasElement) => {
    setSelectedTable(table);
    setIsDetailsModalOpen(true);
  };

  const handleGuestsAssign = async (guestsToAssign: Guest[]) => {
    if (!selectedTable || !eventInstance || guestsToAssign.length === 0) return;

    const tableId = selectedTable.elementId;
    const tableName = selectedTable.name;
    const seatsAvailable =
      (selectedTable.seats || 10) - (selectedTable.guestCount || 0);

    if (guestsToAssign.length > seatsAvailable) {
      toast.error(
        `Masa ${tableName} are doar ${seatsAvailable} locuri libere.`
      );
      return;
    }

    setIsAssigning(true);

    // Transformăm lista de Guest în formatul necesar serviciului
    const serviceGuests = guestsToAssign.map((guest) => ({
      label: guest.name,
      value: guest.guestId,
    }));

    try {
      await assignTableToGuestsService(
        eventInstance.eventId,
        tableId,
        serviceGuests
      );

      toast.success(
        `${guestsToAssign.length} invitați așezați la masa ${tableName}.`
      );
      await fetchEventGuests();
    } catch (error) {
      console.error('Eroare la asignarea meselor:', error);
      toast.error('A apărut o eroare la salvarea așezării.');
    } finally {
      setIsAssigning(false);
      setSelectedTable(null);
      setIsSelectionModalOpen(false);
    }
  };

  /**
   *  Funcția de deschidere a Drawer-ului de dez-asignare invitați
   * @param table - Masa de la care se vor dez-asigna invitații
   * @returns void
   */
  const handleOpenUnseatDrawer = (table: CanvasElement) => {
    setSelectedTableForUnseating(table);
    setIsUnseatingModalOpen(true);
  };

  /**
   * Funcția de gestionare a dez-asignării invitaților de la o masă
   * @param guestsToUnseat - Lista de invitați care urmează să fie dez-asignați
   * @returns void
   */
  const handleUnseatGuestsAction = async (guestsToUnseat: Guest[]) => {
    if (
      !selectedTableForUnseating ||
      !eventInstance ||
      guestsToUnseat.length === 0
    )
      return;

    setIsUnseating(true);
    const serviceGuests = guestsToUnseat.map((guest) => ({
      label: guest.name,
      value: guest.guestId,
    }));

    try {
      // Apelare serviciu cu tableId: null pentru a dez-asigna
      await assignTableToGuestsService(
        eventInstance.eventId,
        null,
        serviceGuests
      );

      toast.success(
        `${guestsToUnseat.length} invitați au fost scoși de la masa ${selectedTableForUnseating.name}.`
      );
      await fetchEventGuests();
    } catch (error) {
      console.error('Eroare la dez-asignarea meselor:', error);
      toast.error('A apărut o eroare la scoaterea invitaților de la masă.');
    } finally {
      setIsUnseating(false);
      setSelectedTableForUnseating(null);
      setIsUnseatingModalOpen(false);
    }
  };

  const handleSaveTableDetails = async (
    tableId: string,
    newDetails: { name: string; seats: number }
  ) => {
    if (!eventInstance) return;

    setIsSavingDetails(true);

    try {
      const { event, removedGuestIds } = await updateTableDetailsService(
        newDetails.name,
        newDetails.seats,
        tableId,
        eventInstance.eventId
      );

      // Remove guests from table if their seats were reduced
      if (removedGuestIds.length > 0) {
        await assignTableToGuestsService(
          eventInstance.eventId,
          null,
          removedGuestIds.map((id) => ({ label: '', value: id }))
        );
        toast.info(
          `${removedGuestIds.length} invitați au fost dez-asignați din cauza reducerii locurilor la masă.`
        );
      }

      await fetchEventGuests();
      setEventInstance(event);

      toast.success(`Masa '${newDetails.name}' a fost actualizată.`);
    } catch (error) {
      console.error('Eroare la salvarea detaliilor mesei:', error);
      toast.error('A apărut o eroare la salvarea detaliilor.');
      throw error; // Re-aruncăm eroarea pentru ca formularul să o gestioneze
    } finally {
      setIsSavingDetails(false);
    }
  };

  return (
    <>
      <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Invitați Neatribuiți
          </h2>
          <Users className="w-5 h-5 text-gray-400" />
        </div>

        <div className="mt-1 flex items-baseline justify-center">
          <p className="text-5xl font-extrabold text-red-400">
            <AnimatedCounter
              color={`${unseatedGuests.length === 0 ? 'green' : '#ff5a5c'}`}
              from={0}
              to={unseatedGuests.length}
              duration={2}
            />
          </p>
        </div>

        <div className="mt-4">
          <p className="text-xs text-center text-gray-400">
            Alegeți o masă de mai jos pentru a începe așezarea.
          </p>
        </div>
      </div>
      <div className="bg-white p-2 rounded-lg shadow-sm">
        <h2 className="text-lg font-bold mb-3">Plan Mese (Alege o masă)</h2>
        <div className="space-y-3 h-full">
          {tablesWithStatusloading ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Spinner className="w-4 h-4 text-[var(--primary-color)]" />
            </div>
          ) : (
            <ScrollArea className="h-[calc(100svh-390px)] w-full rounded-md border border-none">
              {tablesWithStatus.length > 0 ? (
                tablesWithStatus.map((table) => (
                  <div
                    key={table.elementId}
                    className="p-2 border rounded-md flex justify-between items-center bg-gray-50 hover:bg-gray-100 cursor-pointer mb-2"
                    onClick={() => handleTableSelect(table)}
                  >
                    <div>
                      <h3 className="font-semibold">{table.name}</h3>
                      <span className="text-sm text-gray-600">
                        Locuri: {table.guestCount}/{table.seats}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {/* Butonul de Scoate (Vizibil doar dacă masa are invitați) */}
                      {table.guestCount > 0 && (
                        <Button
                          size="small"
                          type="dashed"
                          danger
                          onClick={(e) => {
                            e.stopPropagation(); // Previne deschiderea drawer-ului de asignare
                            handleOpenUnseatDrawer(table);
                          }}
                        >
                          Scoate
                        </Button>
                      )}

                      <Button
                        size="small"
                        type="primary"
                        disabled={table.isFull}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTable(table);
                          setIsSelectionModalOpen(true);
                        }}
                      >
                        Așează
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center p-4 mt-4">
                  Nu există mese adăugate pe planul sălii.
                </p>
              )}
            </ScrollArea>
          )}
        </div>
      </div>
      <TableSelectDrawer
        isOpen={isSelectionModalOpen}
        guestName={selectedTable?.name || ''}
        unseatedGuests={unseatedGuests}
        availableSeats={
          (selectedTable?.seats || 10) - (selectedTable?.guestCount || 0)
        }
        onSelect={handleGuestsAssign}
        onClose={() => setIsSelectionModalOpen(false)}
        isAssigning={isAssigning}
      />
      {isUnseatingModalOpen && selectedTableForUnseating !== null && (
        <UnseatGuestsDrawer
          table={selectedTableForUnseating}
          isOpen={isUnseatingModalOpen}
          onUnseat={handleUnseatGuestsAction}
          onClose={() => setIsUnseatingModalOpen(false)}
          isUnseating={isUnseating}
          tableGuests={eventGuests.filter(
            (g) => g.tableId === selectedTableForUnseating.elementId
          )}
        />
      )}
      {isDetailsModalOpen && selectedTable !== null && (
        <TableDetailsDrawer
          onSaveDetails={handleSaveTableDetails}
          table={selectedTable}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          isSaving={isSavingDetails}
        />
      )}
    </>
  );
};

export default ListBasedTableAssigner;
