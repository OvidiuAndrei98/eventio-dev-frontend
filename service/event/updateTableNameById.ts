import {
  doc,
  updateDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { EventInstance } from '@/core/types';

export const updateTableNameById = async (
  name: string,
  seats: number,
  tableId: string,
  eventId: string
): Promise<{ event: EventInstance; removedGuestIds: string[] }> => {
  try {
    if (!eventId) {
      throw new Error('Missing event id');
    }

    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    const event = eventSnap.data() as EventInstance;
    const removedGuestIds: string[] = [];

    const tableIndex = event.eventTableOrganization.elements.findIndex(
      (el) => el.elementId === tableId
    );

    if (tableIndex !== -1) {
      const currentSeats =
        event.eventTableOrganization.elements[tableIndex].seats || 10;

      if (seats < currentSeats) {
        const guestsCollectionRef = collection(db, 'events', eventId, 'guests');
        const seatedGuestsQuery = query(
          guestsCollectionRef,
          where('tableId', '==', tableId)
        );
        const seatedGuestsSnapshot = await getDocs(seatedGuestsQuery);
        const seatedCount = seatedGuestsSnapshot.size;

        const guestsToRemoveCount = seatedCount - seats;

        if (guestsToRemoveCount > 0) {
          const batch = writeBatch(db);
          let removedCount = 0;

          seatedGuestsSnapshot.forEach((guestDoc) => {
            if (removedCount < guestsToRemoveCount) {
              const guestRef = doc(
                db,
                'events',
                eventId,
                'guests',
                guestDoc.id
              );

              batch.update(guestRef, {
                tableId: null,
              });
              removedGuestIds.push(guestDoc.id);
              removedCount++;
            }
          });

          await batch.commit();
        }
      }

      event.eventTableOrganization.elements[tableIndex].name = name;
      event.eventTableOrganization.elements[tableIndex].seats = seats;
    } else {
      console.error('Table with id:' + tableId + ' not found');
    }

    await updateDoc(eventRef, {
      eventTableOrganization: event.eventTableOrganization,
    });

    // Returnează evenimentul actualizat local
    return { event: event, removedGuestIds: removedGuestIds };
  } catch (error) {
    console.error('Error updating talbe with id: ' + tableId, error);
    throw error;
  }
};
