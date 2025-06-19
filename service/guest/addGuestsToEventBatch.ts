import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { Guest } from '@/core/types';
import { queryEventById } from '../event/queryEventById';
import { updateEventStatsForGuest } from '../event/updateEventStatsForGuest';

/**
 * Adds a guest to an event by saving the guest information in the database.
 *
 * @param eventId - The unique identifier of the event to which the guest is being added.
 * @param userId - The unique identifier of the user performing the operation.
 * @param guests - The guest object containing the details of the guest to be added.
 *
 * @throws Will throw an error if the event is not found or if there is an issue saving the guest information.
 *
 * @returns A promise that resolves when the guest is successfully added to the event.
 */
export const addGuestsToEventBatch = async (
  eventId: string,
  userId: string,
  guests: Guest[]
): Promise<void> => {
  try {
    const foundEvent = await queryEventById(eventId, userId);

    if (!foundEvent) {
      throw new Error(`Event not found, user can't be added`);
    }
    // Normalizează telefonul
    const normalizedPhone = guests.filter((g) => g.primaryContactPhone)[0]
      .primaryContactPhone;

    // 1. Găsește guest-ul cu acest phone
    const guestsRef = collection(db, 'guest_registry');
    const phoneQuery = query(
      guestsRef,
      where('primaryContactPhone', '==', normalizedPhone)
    );
    const phoneSnap = await getDocs(phoneQuery);

    if (!phoneSnap.empty) {
      // 2. Ia submissionId
      const guestDoc = phoneSnap.docs[0];
      const submissionId = guestDoc.get('submissionId');

      // 3. Ia toți invitații cu același submissionId
      const submissionQuery = query(
        guestsRef,
        where('submissionId', '==', submissionId)
      );
      const submissionSnap = await getDocs(submissionQuery);

      // 4. Actualizează răspunsurile și calculează statistici
      let oldConfirmations = 0;
      let oldRefusals = 0;
      let oldResponses = 0;

      submissionSnap.docs.forEach((docSnap) => {
        const resp = docSnap.get('isAttending');
        if (resp === true) oldConfirmations++;
        if (resp === false) oldRefusals++;
        if (resp !== undefined || resp !== null) oldResponses++;
      });

      // Calculează noile răspunsuri pe baza fiecărui guest din guests
      let newConfirmations = 0;
      let newRefusals = 0;
      let newResponses = 0;

      guests.forEach((guest) => {
        if (guest.isAttending === true) newConfirmations++;
        if (guest.isAttending === false) newRefusals++;
        if (guest.isAttending !== undefined) newResponses++;
      });

      // Diferența pentru statistici
      const deltaConfirmations = newConfirmations - oldConfirmations;
      const deltaRefusals = newRefusals - oldRefusals;
      const deltaResponses = newResponses - oldResponses;

      // 5. Șterge toți invitații cu același submissionId și adaugă-i din nou
      const batch = writeBatch(db);

      // Șterge toți invitații existenți cu submissionId
      submissionSnap.docs.forEach((docSnap) => {
        batch.delete(doc(db, 'guest_registry', docSnap.id));
      });

      // Adaugă toți invitații noi
      guests.forEach((guest) => {
        const guestRef = doc(db, 'guest_registry', guest.guestId);
        batch.set(guestRef, guest);
      });

      await batch.commit();

      // Update statistici doar dacă s-a schimbat ceva
      if (
        deltaResponses !== 0 ||
        deltaConfirmations !== 0 ||
        deltaRefusals !== 0
      ) {
        await updateEventStatsForGuest(
          eventId,
          Date.now(),
          deltaResponses,
          deltaConfirmations,
          deltaRefusals
        );
      }
    } else {
      const batch = writeBatch(db);
      guests.forEach((guest) => {
        const guestRef = doc(db, 'guest_registry', guest.guestId);
        batch.set(guestRef, guest);
      });

      await batch.commit();

      for (const guest of guests) {
        if (guest.isAttending) {
          // Update event statistics for each guest who is attending
          await updateEventStatsForGuest(eventId, guest.date, 1, 1, 0);
        } else {
          // Update event statistics for each guest who is not attending
          await updateEventStatsForGuest(eventId, guest.date, 1, 0, 1);
        }
      }
    }
  } catch (error) {
    console.error('Error creating the guest', error);
    throw error;
  }
};
