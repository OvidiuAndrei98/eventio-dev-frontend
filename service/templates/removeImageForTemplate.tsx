import { User } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

export const removeImageForTemplate = async (
  user: User,
  templateId: string,
  name: string
): Promise<void> => {
  const storage = getStorage();
  const imageRef = ref(storage, user.uid + `/${templateId}/${name}`);
  deleteObject(imageRef);
};
