import { doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';

export const updateEventStatsForGuest = async (
  eventId: string,
  guestDate: number,
  responses: number = 1,
  confirmations: number = 0,
  refusals: number = 0
) => {
  // Extrage data calendaristică
  const dateObj = new Date(Number(guestDate));
  // Set timezone to Romania (Europe/Bucharest)
  const roDate = new Date(
    dateObj.toLocaleString('en-US', { timeZone: 'Europe/Bucharest' })
  );
  const yyyy = roDate.getFullYear();
  const mm = String(roDate.getMonth() + 1).padStart(2, '0');
  const dd = String(roDate.getDate()).padStart(2, '0');
  const dayKey = `daily_${yyyy}-${mm}-${dd}`;

  const statsDocRef = doc(db, 'events', eventId, 'stats', dayKey);
  const generalStatsDocRef = doc(
    db,
    'events',
    eventId,
    'stats',
    'generalStats'
  );

  // Update daily stats
  try {
    await updateDoc(statsDocRef, {
      responses: increment(responses),
      confirmations: increment(confirmations),
      refusals: increment(refusals),
    });
  } catch (e: any) {
    await setDoc(
      statsDocRef,
      {
        responses,
        confirmations,
        refusals,
        date: `${yyyy}-${mm}-${dd}`,
      },
      { merge: true }
    );
  }

  // Update general stats
  try {
    await updateDoc(generalStatsDocRef, {
      responses: increment(responses),
      confirmations: increment(confirmations),
      refusals: increment(refusals),
      date: roDate
        .toLocaleString('en-GB', { timeZone: 'Europe/Bucharest' })
        .slice(0, 10), // format YYYY-MM-DD
    });
  } catch (e: any) {
    await setDoc(
      generalStatsDocRef,
      {
        responses,
        confirmations,
        refusals,
        date: roDate
          .toLocaleString('en-GB', { timeZone: 'Europe/Bucharest' })
          .slice(0, 10), // format YYYY-MM-DD,
      },
      { merge: true }
    );
  }
};
