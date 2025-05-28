import db from '@/lib/firebase/fireStore';
import { User } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from 'firebase/storage';

export const uploadProfilePicture = async (
  url: string,
  user: User
): Promise<string | undefined> => {
  const storage = getStorage();
  const avatarStgRef = ref(storage, user.uid + '/profilePicture');
  await uploadString(avatarStgRef, url, 'data_url');
  await getDownloadURL(avatarStgRef).then((downloadURL) => {
    const userRef = doc(db, 'users', user.uid);

    updateDoc(userRef, {
      photoURL: downloadURL,
    });
    return downloadURL;
  });
  return undefined;
};
