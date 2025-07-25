import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '../firebase';
import { YouTubeVideo, Playlist } from '../types';

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

  static async getUserPlaylists(userId: string): Promise<Playlist[]> {
    try {
      console.log(`FirestoreService: Fetching playlists for user ${userId}`);
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        if (data.playlists && Array.isArray(data.playlists)) {
          console.log(`FirestoreService: Found playlists for user ${userId}`, data.playlists);
          return data.playlists as Playlist[];
        }
      }
      console.log(`FirestoreService: No playlists found for user ${userId}`);
      return [];
    } catch (error) {
      console.error('Error getting playlists from Firestore:', error);
      return [];
    }
  }

  static async setUserPlaylists(userId: string, playlists: Playlist[]): Promise<void> {
    try {
      console.log(`FirestoreService: Setting playlists for user ${userId}`, playlists);
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, { playlists }, { merge: true });
    } catch (error) {
      console.error('Error setting playlists to Firestore:', error);
    }
  }
}
