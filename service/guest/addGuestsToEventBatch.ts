import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
  DocumentSnapshot,
  getCountFromServer,
} from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { Guest } from '@/core/types';
import { queryEventById } from '../event/queryEventById';
import { updateEventStatsForGuest } from '../event/updateEventStatsForGuest';
import { PLANYVITE_EVENT_PLAN_FEATURES } from '@/lib/planyviteEventPlanTiers';

type EventPlanKey = keyof typeof PLANYVITE_EVENT_PLAN_FEATURES;

/**
 * Calculează statisticile de răspuns (Confirmări, Refuzuri) dintr-o listă de invitați.
 * @param guests - Lista de obiecte Guest.
 * @returns Un obiect cu statisticile calculate.
 */
const calculateStats = (guests: Guest[]) => {
  let confirmations = 0;
  let refusals = 0;
  let responses = 0;

  guests.forEach((guest) => {
    if (guest.isAttending === true) {
      confirmations++;
      responses++;
    } else if (guest.isAttending === false) {
      refusals++;
      responses++;
    } else if (guest.isAttending !== undefined && guest.isAttending !== null) {
      // Logică de siguranță suplimentară, de obicei inclusă în confirmări/refuzuri
      responses++;
    }
  });
  return { confirmations, refusals, responses };
};

export const addGuestsToEventBatch = async (
  eventId: string,
  userId: string,
  guests: Guest[]
): Promise<void> => {
  try {
    const foundEvent = await queryEventById(eventId, userId);

    if (!foundEvent) {
      throw new Error(`Event not found, guest batch can't be added.`);
    }

    const guestsRef = collection(db, 'events', eventId, 'guests');

    const primaryGuest = guests.find((g) => g.primaryContactPhone);
    if (!primaryGuest || !primaryGuest.primaryContactPhone) {
      throw new Error('Primary contact phone missing for guest batch.');
    }
    const normalizedPhone = primaryGuest.primaryContactPhone;

    const phoneQuery = query(
      guestsRef,
      where('primaryContactPhone', '==', normalizedPhone)
    );
    const phoneSnap = await getDocs(phoneQuery);

    let submissionSnap: Awaited<ReturnType<typeof getDocs>>;

    const {
      confirmations: newConfirmations,
      refusals: newRefusals,
      responses: newResponses,
    } = calculateStats(guests);

    let oldConfirmations = 0;
    let oldRefusals = 0;
    let oldResponses = 0;

    let submissionIdToUse: string | undefined;
    let isUpdate = false;

    if (!phoneSnap.empty) {
      const guestDoc = phoneSnap.docs[0] as DocumentSnapshot<Guest>;
      if (guestDoc?.data()?.primaryContactPhone !== '-') {
        submissionIdToUse = guestDoc.data()?.submissionId;
      }

      if (!submissionIdToUse) {
        console.warn(
          `Submission ID missing for phone ${normalizedPhone}. Treating as new.`
        );
      } else {
        isUpdate = true;
        const submissionQuery = query(
          guestsRef,
          where('submissionId', '==', submissionIdToUse)
        );
        submissionSnap = await getDocs(submissionQuery);

        submissionSnap.docs.forEach((docSnap) => {
          const resp = docSnap.get('isAttending');
          if (resp === true) oldConfirmations++;
          if (resp === false) oldRefusals++;
          if (resp !== undefined && resp !== null) oldResponses++;
        });

        const batch = writeBatch(db);

        submissionSnap.docs.forEach((docSnap) => {
          batch.delete(doc(db, 'events', eventId, 'guests', docSnap.id));
        });

        guests.forEach((guest) => {
          const guestData: Guest = {
            ...guest,
            submissionId: submissionIdToUse!,
          };
          const guestRef = doc(db, 'events', eventId, 'guests', guest.guestId);
          batch.set(guestRef, guestData);
        });

        await batch.commit();
      }
    }

    if (!isUpdate) {
      // Check guest limit for basic plan
      const guestCountSnapshot = await getCountFromServer(guestsRef);
      const currentGuestCount = guestCountSnapshot.data().count;
      const newTotalGuests = currentGuestCount + guests.length;

      const planKey: EventPlanKey = (
        foundEvent?.eventPlan in PLANYVITE_EVENT_PLAN_FEATURES
          ? foundEvent?.eventPlan
          : 'basic'
      ) as EventPlanKey;
      const limit = PLANYVITE_EVENT_PLAN_FEATURES[planKey].maxGuests;

      if (newTotalGuests > limit) {
        throw new Error(
          `Guest limit exceeded. Maximum ${limit} guests allowed for ${planKey} plan. Current: ${currentGuestCount}, Attempting to add: ${guests.length}`
        );
      }

      const batch = writeBatch(db);

      submissionIdToUse = guests[0]?.submissionId || doc(guestsRef).id;

      guests.forEach((guest) => {
        const guestData: Guest = {
          ...guest,
          submissionId: submissionIdToUse!,
        };
        const guestRef = doc(db, 'events', eventId, 'guests', guest.guestId);
        batch.set(guestRef, guestData);
      });

      await batch.commit();

      oldConfirmations = 0;
      oldRefusals = 0;
      oldResponses = 0;
    }

    const deltaConfirmations = newConfirmations - oldConfirmations;
    const deltaRefusals = newRefusals - oldRefusals;
    const deltaResponses = newResponses - oldResponses;

    if (
      deltaResponses !== 0 ||
      deltaConfirmations !== 0 ||
      deltaRefusals !== 0
    ) {
      await updateEventStatsForGuest(
        eventId,
        new Date().getTime(),
        deltaResponses,
        deltaConfirmations,
        deltaRefusals
      );
    }
  } catch (error) {
    console.error('Error adding guest batch to event', error);
    throw error;
  }
};
