import { User } from '@/core/types';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from 'firebase/storage';

export const uploadImageForTemplate = async (
  url: string,
  user: User,
  templateId: string,
  name: string
): Promise<string | undefined> => {
  try {
    const storage = getStorage();
    const imageRef = ref(storage, user.userId + `/${templateId}/${name}`);
    await uploadString(imageRef, url, 'data_url').then((snapshot) => {
      console.log(snapshot);
    });

    return await getDownloadURL(imageRef).then((downloadURL) => {
      return downloadURL;
    });
  } catch (error) {
    console.error(`Error uploading iamge: ${name}: `, error);
    throw error;
  }

  //   return undefined;
};
