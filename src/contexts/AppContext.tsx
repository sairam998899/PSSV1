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
  | { type: 'LOAD_STORAGE_DATA' };

const initialState: AppState = {
  currentTrack: null,
  isPlaying: false,
  recentlyPlayed: [],
  history: [],
  theme: 'dark' as Theme,
  language: 'all' as Language,
  searchResults: [],
  trending: [],
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  playTrack: (track: YouTubeVideo) => void;
}>({
  state: initialState,
  dispatch: () => null,
  playTrack: () => null,
});

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      return { ...state, currentTrack: action.payload };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
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
    case 'LOAD_STORAGE_DATA':
      return {
        ...state,
        recentlyPlayed: StorageService.getRecentlyPlayed(),
        history: StorageService.getHistory(),
        theme: StorageService.getTheme() as Theme,
        language: StorageService.getLanguage() as Language,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'LOAD_STORAGE_DATA' });
  }, []);

  const playTrack = (track: YouTubeVideo) => {
    const trackWithPlayTime: Track = {
      ...track,
      playedAt: new Date(),
    };
    
    StorageService.addToHistory(trackWithPlayTime);
    dispatch({ type: 'SET_CURRENT_TRACK', payload: track });
    dispatch({ type: 'SET_PLAYING', payload: true });
    dispatch({ type: 'LOAD_STORAGE_DATA' });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, playTrack }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);