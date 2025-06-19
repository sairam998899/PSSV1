 import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, YouTubeVideo, Track, Theme, Language } from '../types';
import { StorageService } from '../services/storage';

type AppAction =
  | { type: 'SET_CURRENT_TRACK'; payload: YouTubeVideo }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_SEARCH_RESULTS'; payload: YouTubeVideo[] }
  | { type: 'SET_TRENDING'; payload: YouTubeVideo[] }
  | { type: 'SET_LIKED_SONGS'; payload: YouTubeVideo[] }
  | { type: 'SET_PLAY_VIDEO'; payload: boolean }
  | { type: 'LOAD_STORAGE_DATA' }
  | { type: 'SET_VIDEO_PLAYING'; payload: boolean }
  | { type: 'SET_VIDEO_ID'; payload: string | null }
  | { type: 'SET_CARD_MINIMIZED'; payload: boolean }
  // Removed SET_CARD_MAXIMIZED as it is not defined in AppState
  | { type: 'SET_USER_MINIMIZED'; payload: boolean }
  | { type: 'SET_LANGUAGE_SUGGESTIONS'; payload: YouTubeVideo[] }
  | { type: 'SET_THEME_LABEL'; payload: string };

const initialState: AppState = {
  currentTrack: null,
  isPlaying: false,
  recentlyPlayed: [],
  history: [],
  likedSongs: [],
  theme: 'dark' as Theme,
  language: 'all' as Language,
  searchResults: [],
  trending: [],
  languageSuggestions: [],
  playVideo: false,
  videoPlaying: false,
  videoId: null,
  cardMinimized: false,
  userMinimized: false,  // New flag to track user minimize action
  themeLabel: 'dark',
  // Removed cardMaximized from initialState as it is not defined in AppState
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  playTrack: (track: YouTubeVideo, playVideo?: boolean) => void;
  toggleLikeSong: (track: YouTubeVideo) => void;
  setVideoPlaying: (playing: boolean) => void;
  setVideoId: (id: string | null) => void;
  setCardMinimized: (minimized: boolean) => void;
  setUserMinimized: (minimized: boolean) => void;
}>({
  state: initialState,
  dispatch: () => null,
  playTrack: () => null,
  toggleLikeSong: () => null,
  setVideoPlaying: () => null,
  setVideoId: () => null,
  setCardMinimized: () => null,
  setUserMinimized: () => null,
});

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      return { ...state, currentTrack: action.payload };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_VIDEO_PLAYING':
      return { ...state, videoPlaying: action.payload };
    case 'SET_VIDEO_ID':
      return { ...state, videoId: action.payload };
    case 'SET_THEME':
      StorageService.setTheme(action.payload);
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      StorageService.setLanguage(action.payload);
      return { ...state, language: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'SET_TRENDING':
      return { ...state, trending: action.payload };
    case 'SET_LIKED_SONGS':
      return { ...state, likedSongs: action.payload };
    case 'SET_LANGUAGE_SUGGESTIONS':
      return { ...state, languageSuggestions: action.payload };
    case 'SET_CARD_MINIMIZED':
      return { ...state, cardMinimized: action.payload };
    // Removed case for SET_CARD_MAXIMIZED as cardMaximized is not defined in AppState
    // case 'SET_CARD_MAXIMIZED':
    //   return { ...state, cardMaximized: action.payload };
    case 'LOAD_STORAGE_DATA':
      return {
        ...state,
        recentlyPlayed: StorageService.getRecentlyPlayed(),
        history: StorageService.getHistory(),
        likedSongs: StorageService.getLikedSongs(),
        theme: StorageService.getTheme() as Theme,
        language: StorageService.getLanguage() as Language,
      };
    case 'SET_THEME_LABEL':
      return { ...state, themeLabel: action.payload };
    default:
      return state;
  }
}

import { YouTubeService } from '../services/youtube';
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'LOAD_STORAGE_DATA' });
  }, []);

  useEffect(() => {
    async function fetchLanguageSuggestions() {
      if (state.language === 'all') {
        dispatch({ type: 'SET_LANGUAGE_SUGGESTIONS', payload: [] });
        return;
      }
      const suggestions = await YouTubeService.searchVideos('songs', 20, state.language);
      dispatch({ type: 'SET_LANGUAGE_SUGGESTIONS', payload: suggestions });
    }
    fetchLanguageSuggestions();
  }, [state.language]);

  const playTrack = (track: YouTubeVideo, playVideo: boolean = false) => {
    const trackWithPlayTime: Track = {
      ...track,
      playedAt: new Date(),
    };
    
    StorageService.addToHistory(trackWithPlayTime);
    dispatch({ type: 'SET_CURRENT_TRACK', payload: track });
    dispatch({ type: 'SET_PLAYING', payload: true });
    dispatch({ type: 'LOAD_STORAGE_DATA' });
    dispatch({ type: 'SET_PLAY_VIDEO', payload: playVideo });
    // Reset userMinimized to false when a new track is played to allow card to show
    dispatch({ type: 'SET_USER_MINIMIZED', payload: false });
    if (playVideo) {
      dispatch({ type: 'SET_VIDEO_PLAYING', payload: true });
      dispatch({ type: 'SET_VIDEO_ID', payload: track.id });
    } else {
      dispatch({ type: 'SET_VIDEO_PLAYING', payload: false });
      dispatch({ type: 'SET_VIDEO_ID', payload: null });
    }
  };


  const toggleLikeSong = (track: YouTubeVideo) => {
    let updatedLikedSongs = [...state.likedSongs];
    const index = updatedLikedSongs.findIndex((t) => t.id === track.id);
    if (index === -1) {
      updatedLikedSongs.push(track);
    } else {
      updatedLikedSongs.splice(index, 1);
    }
    StorageService.setLikedSongs(updatedLikedSongs);
    dispatch({ type: 'SET_LIKED_SONGS', payload: updatedLikedSongs });
  };

  const setVideoPlaying = (playing: boolean) => {
    dispatch({ type: 'SET_VIDEO_PLAYING', payload: playing });
  };

  const setVideoId = (id: string | null) => {
    dispatch({ type: 'SET_VIDEO_ID', payload: id });
  };

  const setUserMinimized = (minimized: boolean) => {
    dispatch({ type: 'SET_USER_MINIMIZED', payload: minimized });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, playTrack, toggleLikeSong, setVideoPlaying, setVideoId, setCardMinimized: (minimized: boolean) => dispatch({ type: 'SET_CARD_MINIMIZED', payload: minimized }), setUserMinimized }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
