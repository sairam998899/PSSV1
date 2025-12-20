import { Track, YouTubeVideo } from '../types';

const RECENTLY_PLAYED_KEY = 'neontunes_recently_played';
const HISTORY_KEY = 'neontunes_history';
const THEME_KEY = 'neontunes_theme';
const LANGUAGE_KEY = 'neontunes_language';

export class StorageService {
  static getRecentlyPlayed(): Track[] {
    try {
      const data = localStorage.getItem(RECENTLY_PLAYED_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static setRecentlyPlayed(tracks: Track[]): void {
    try {
      localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(tracks.slice(0, 10)));
    } catch (error) {
      console.error('Failed to save recently played:', error);
    }
  }

  static getLikedSongs(): YouTubeVideo[] {
    try {
      const data = localStorage.getItem('neontunes_liked_songs');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static setLikedSongs(songs: YouTubeVideo[]): void {
    try {
      localStorage.setItem('neontunes_liked_songs', JSON.stringify(songs));
    } catch (error) {
      console.error('Failed to save liked songs:', error);
    }
  }

  static getHistory(): Track[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      if (data) {
        const tracks = JSON.parse(data);
        return tracks.map((track: any) => ({
          ...track,
          playedAt: new Date(track.playedAt),
        }));
      }
      return [];
    } catch {
      return [];
    }
  }

  static setHistory(tracks: Track[]): void {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(tracks));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }

  static addToHistory(track: Track): void {
    const history = this.getHistory();
    const recentlyPlayed = this.getRecentlyPlayed();
    
    // Remove if already exists to avoid duplicates
    const filteredHistory = history.filter(t => t.id !== track.id);
    const filteredRecent = recentlyPlayed.filter(t => t.id !== track.id);
    
    // Add to beginning of arrays
    const newHistory = [track, ...filteredHistory];
    const newRecent = [track, ...filteredRecent];
    
    this.setHistory(newHistory);
    this.setRecentlyPlayed(newRecent);
  }

  static getTheme(): string {
    return localStorage.getItem(THEME_KEY) || 'dark';
  }

  static setTheme(theme: string): void {
    localStorage.setItem(THEME_KEY, theme);
  }

  static getLanguage(): string {
    return localStorage.getItem(LANGUAGE_KEY) || 'all';
  }

  static setLanguage(language: string): void {
    localStorage.setItem(LANGUAGE_KEY, language);
  }
}
