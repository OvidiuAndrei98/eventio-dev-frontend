import { doc, updateDoc } from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { Template } from '@/core/types';

export const updateTemplateSettings = async (
  templateId: string,
  settings: Template['settings']
): Promise<void> => {
  try {
    const templateRef = doc(db, 'templates', templateId);
    await updateDoc(templateRef, {
      settings: settings,
    });
  } catch (error) {
    console.error(`Error updating template settings: ${templateId}: `, error);
    throw error;
  }
};
