import { doc, updateDoc } from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { TemplateSection } from '@/core/types';

export const updateTemplate = async (
  templateId: string,
  elements: TemplateSection[]
): Promise<void> => {
  try {
    const templateRef = doc(db, 'templates', templateId);
    await updateDoc(templateRef, {
      elements: elements,
    });
  } catch (error) {
    console.error(`Error updating template elements: ${templateId}: `, error);
    throw error;
  }
};
