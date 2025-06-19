import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { YouTubeVideo, Theme, Language } from '../types';

type UserData = {
  likedSongs: YouTubeVideo[];
  preferences: {
    theme: Theme;
    language: Language;
  };
};

export class FirestoreService {
  static async getUserData(userId: string): Promise<UserData | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserData;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user data from Firestore:', error);
      return null;
    }
  }

  static async setUserData(userId: string, data: UserData): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, data, { merge: true });
    } catch (error) {
      console.error('Error setting user data to Firestore:', error);
    }
  }
}
