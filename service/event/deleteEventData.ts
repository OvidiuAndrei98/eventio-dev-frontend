import { getStorage, ref, listAll, deleteObject } from 'firebase/storage';
// import { deleteGuestsByEventId } from '../guest/deleteGuestsByEventId';

export const deleteEventData = async (
  // eventId: string,
  userId: string,
  templateId: string
): Promise<void> => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, userId + `/${templateId}`);

    if (storageRef) {
      listAll(storageRef).then((listResults) => {
        const promises = listResults.items.map((item) => {
          return deleteObject(item);
        });
        Promise.all(promises);
      });
    }
    // await deleteGuestsByEventId(eventId);
  } catch (error) {
    console.error('Error deleting event data:', error);
    throw error;
  }
};
