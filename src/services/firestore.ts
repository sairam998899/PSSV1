import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '../firebase';
import { YouTubeVideo } from '../types';

const db = getFirestore(app);

export class FirestoreService {
  static async getUserLikedSongs(userId: string): Promise<YouTubeVideo[]> {
    try {
      console.log(`FirestoreService: Fetching liked songs for user ${userId}`);
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        if (data.likedSongs && Array.isArray(data.likedSongs)) {
          console.log(`FirestoreService: Found liked songs for user ${userId}`, data.likedSongs);
          return data.likedSongs as YouTubeVideo[];
        }
      }
      console.log(`FirestoreService: No liked songs found for user ${userId}`);
      return [];
    } catch (error) {
      console.error('Error getting liked songs from Firestore:', error);
      return [];
    }
  }

  static async setUserLikedSongs(userId: string, likedSongs: YouTubeVideo[]): Promise<void> {
    try {
      console.log(`FirestoreService: Setting liked songs for user ${userId}`, likedSongs);
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, { likedSongs }, { merge: true });
    } catch (error) {
      console.error('Error setting liked songs to Firestore:', error);
    }
  }
}
