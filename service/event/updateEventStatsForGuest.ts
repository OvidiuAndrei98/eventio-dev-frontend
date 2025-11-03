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
  const dateObj = new Date(guestDate);
  // Keep the date in UTC
  const actionDate = dateObj;
  const yyyy = actionDate.getFullYear();
  const mm = String(actionDate.getMonth() + 1).padStart(2, '0');
  const dd = String(actionDate.getDate()).padStart(2, '0');
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
      date: actionDate
        .toLocaleString('ro-RO', {
          timeZone: 'UTC',
        })
        .slice(0, 10), // format YYYY-MM-DD
    });
  } catch (e: any) {
    await setDoc(
      generalStatsDocRef,
      {
        responses,
        confirmations,
        refusals,
        date: actionDate
          .toLocaleString('ro-RO', {
            timeZone: 'UTC',
          })
          .slice(0, 10), // format YYYY-MM-DD
      },
      { merge: true }
    );
  }
};
