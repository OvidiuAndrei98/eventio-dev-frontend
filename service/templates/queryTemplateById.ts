import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { Template } from '@/core/types';

export const queryTemplateById = async (
  // eventId: string,
  // userId: string,
  templateId: string
): Promise<Template> => {
  try {
    let tempalte: DocumentData = {};
    const q = query(
      collection(db, 'templates'),
      where('templateId', '==', templateId)
      // where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      tempalte = doc.data();
    });

    return tempalte as Template;
  } catch (error) {
    console.error(`Error fetching template by ID: ${templateId}: `, error);
    throw error;
  }
};
