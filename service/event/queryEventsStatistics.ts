import { EventStats } from '@/core/types';
import db from '@/lib/firebase/fireStore';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

/**
 * Query statistics documents for the last 7 days for a given event.
 * @param eventId - The event's unique identifier.
 * @returns Array of EventStats objects for the last 7 days.
 */
export const queryEventsStatisticsPerWeek = async (
  eventId: string
): Promise<EventStats[]> => {
  // Calculează datele pentru ultimele 7 zile
  const today = new Date();
  const last7Days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    last7Days.push(`${yyyy}-${mm}-${dd}`);
  }

  const statsColRef = collection(db, 'events', eventId, 'stats');
  const q = query(statsColRef, where('date', 'in', last7Days));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    console.warn(
      `No statistics found for event ${eventId} in the last 7 days.`
    );
    return [];
  }
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    responses: doc.data().responses ?? 0,
    confirmations: doc.data().confirmations ?? 0,
    refusals: doc.data().refusals ?? 0,
    date: doc.data().date ?? '',
  }));
};

export const queryEventGeneralStatistics = async (
  eventId: string
): Promise<EventStats> => {
  const statsDocRef = doc(db, 'events', eventId, 'stats', 'generalStats');
  const docSnap = await getDoc(statsDocRef);
  if (!docSnap.exists()) {
    console.warn(`No general statistics found for event ${eventId}.`);
    return {
      id: 'generalStats',
      responses: 0,
      confirmations: 0,
      refusals: 0,
      date: '',
    };
  }
  const data = docSnap.data();
  return {
    id: 'generalStats',
    responses: data.responses ?? 0,
    confirmations: data.confirmations ?? 0,
    refusals: data.refusals ?? 0,
    date: data.date ?? '',
  };
};
