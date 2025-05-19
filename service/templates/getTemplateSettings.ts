import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { Template } from '@/core/types';

export const getTemplateSettings = async (
  eventId: string,
  templateId: string
): Promise<Template['settings']> => {
  try {
    let templateSettings: DocumentData = {};
    const q = query(
      collection(db, 'templates'),
      where('templateId', '==', templateId),
      where('eventId', '==', eventId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      templateSettings = doc.data()['settings'];
    });

    return templateSettings as Template['settings'];
  } catch (error) {
    console.error(`Error fetching template by ID: ${templateId}: `, error);
    throw error;
  }
};
