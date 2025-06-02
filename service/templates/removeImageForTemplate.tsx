import { User } from '@/core/types';
import { getStorage, ref, deleteObject } from 'firebase/storage';

export const removeImageForTemplate = async (
  user: User,
  templateId: string,
  name: string
): Promise<void> => {
  const storage = getStorage();
  const imageRef = ref(storage, user.userId + `/${templateId}/${name}`);
  deleteObject(imageRef);
};
