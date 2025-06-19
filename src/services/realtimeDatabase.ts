import { getDatabase, ref, get, set } from 'firebase/database';
import { app } from '../firebase';
import { YouTubeVideo } from '../types';

const db = getDatabase(app);

export class RealtimeDatabaseService {
  static async getUserLikedSongs(userId: string): Promise<YouTubeVideo[]> {
    try {
      const likedSongsRef = ref(db, `users/${userId}/likedSongs`);
      const snapshot = await get(likedSongsRef);
      if (snapshot.exists()) {
        return snapshot.val() as YouTubeVideo[];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error getting liked songs from Realtime Database:', error);
      return [];
    }
  }

  static async setUserLikedSongs(userId: string, likedSongs: YouTubeVideo[]): Promise<void> {
    try {
      const likedSongsRef = ref(db, `users/${userId}/likedSongs`);
      await set(likedSongsRef, likedSongs);
    } catch (error) {
      console.error('Error setting liked songs to Realtime Database:', error);
    }
  }
}
