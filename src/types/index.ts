export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration?: string;
  publishedAt?: string;
  viewCount?: string;
}

export interface Track extends YouTubeVideo {
  playedAt: Date;
  language?: string;
  year?: number;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: YouTubeVideo[];
}

export type Theme = 'dark' | 'neon' | 'purple' | 'blue';
export type Language = 'en' | 'hi' | 'te' | 'ta' | 'pa' | 'all';

export interface AppState {
  currentTrack: YouTubeVideo | null;
  isPlaying: boolean;
  recentlyPlayed: Track[];
  history: Track[];
  likedSongs: YouTubeVideo[];
  userPlaylists: Playlist[];
  theme: Theme;
  language: Language;
  searchResults: YouTubeVideo[];
  trending: YouTubeVideo[];
  languageSuggestions: YouTubeVideo[];
  playVideo: boolean;
  videoPlaying: boolean;
  videoId: string | null;
  cardMinimized: boolean;
  userMinimized: boolean;
  themeLabel: string;
}
