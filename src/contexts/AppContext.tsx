import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, YouTubeVideo, Track, Theme, Language } from '../types';
import { StorageService } from '../services/storage';
import { FirestoreService } from '../services/firestore';
import { signInWithGoogle, signOut, onUserChanged } from '../firebase';

type AppAction =
  | { type: 'SET_CURRENT_TRACK'; payload: YouTubeVideo }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_SEARCH_RESULTS'; payload: YouTubeVideo[] }
  | { type: 'SET_TRENDING'; payload: YouTubeVideo[] }
  | { type: 'SET_LIKED_SONGS'; payload: YouTubeVideo[] }
  | { type: 'SET_PLAY_VIDEO'; payload: boolean }
  | { type: 'SET_VIDEO_PLAYING'; payload: boolean }
  | { type: 'SET_VIDEO_ID'; payload: string | null }
  | { type: 'SET_CARD_MINIMIZED'; payload: boolean }
  | { type: 'SET_USER_MINIMIZED'; payload: boolean }
  | { type: 'SET_LANGUAGE_SUGGESTIONS'; payload: YouTubeVideo[] }
  | { type: 'SET_THEME_LABEL'; payload: string }
  | { type: 'SET_USER'; payload: any }
  | { type: 'LOAD_STORAGE_DATA' };

const initialState: AppState & { user: any | null } = {
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
  userMinimized: false,
  themeLabel: 'dark',
  user: null,
};

const AppContext = createContext<{
  state: AppState & { user: any | null };
  dispatch: React.Dispatch<AppAction>;
  playTrack: (track: YouTubeVideo, playVideo?: boolean) => void;
  toggleLikeSong: (track: YouTubeVideo) => void;
  setVideoPlaying: (playing: boolean) => void;
  setVideoId: (id: string | null) => void;
  setCardMinimized: (minimized: boolean) => void;
  setUserMinimized: (minimized: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}>({
  state: initialState,
  dispatch: () => null,
  playTrack: () => null,
  toggleLikeSong: () => null,
  setVideoPlaying: () => null,
  setVideoId: () => null,
  setCardMinimized: () => null,
  setUserMinimized: () => null,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
});

function appReducer(state: AppState & { user: any | null }, action: AppAction): AppState & { user: any | null } {
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
      if (state.user) {
        FirestoreService.setUserData(state.user.uid, {
          likedSongs: state.likedSongs,
          preferences: { theme: action.payload, language: state.language },
        });
      }
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      StorageService.setLanguage(action.payload);
      if (state.user) {
        FirestoreService.setUserData(state.user.uid, {
          likedSongs: state.likedSongs,
          preferences: { theme: state.theme, language: action.payload },
        });
      }
      return { ...state, language: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'SET_TRENDING':
      return { ...state, trending: action.payload };
    case 'SET_LIKED_SONGS':
      if (state.user) {
        FirestoreService.setUserData(state.user.uid, {
          likedSongs: action.payload,
          preferences: { theme: state.theme, language: state.language },
        });
      } else {
        StorageService.setLikedSongs(action.payload);
      }
      return { ...state, likedSongs: action.payload };
    case 'SET_LANGUAGE_SUGGESTIONS':
      return { ...state, languageSuggestions: action.payload };
    case 'SET_CARD_MINIMIZED':
      return { ...state, cardMinimized: action.payload };
    case 'LOAD_STORAGE_DATA':
      if (!state.user) {
        return {
          ...state,
          recentlyPlayed: StorageService.getRecentlyPlayed(),
          history: StorageService.getHistory(),
          likedSongs: StorageService.getLikedSongs(),
          theme: StorageService.getTheme() as Theme,
          language: StorageService.getLanguage() as Language,
        };
      }
      return state;
    case 'SET_THEME_LABEL':
      return { ...state, themeLabel: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
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

  useEffect(() => {
    const unsubscribe = onUserChanged(async (user) => {
      console.log('Firebase auth state changed:', user);
      dispatch({ type: 'SET_USER', payload: user });
      if (user) {
        try {
          const userData = await FirestoreService.getUserData(user.uid);
          console.log('Fetched user data from Firestore:', userData);
          if (userData) {
            dispatch({ type: 'SET_LIKED_SONGS', payload: userData.likedSongs || [] });
            dispatch({ type: 'SET_THEME', payload: userData.preferences?.theme || 'dark' });
            dispatch({ type: 'SET_LANGUAGE', payload: userData.preferences?.language || 'all' });
          } else {
            dispatch({ type: 'SET_LIKED_SONGS', payload: [] });
            dispatch({ type: 'SET_THEME', payload: 'dark' });
            dispatch({ type: 'SET_LANGUAGE', payload: 'all' });
          }
        } catch (error) {
          console.error('Error fetching user data from Firestore:', error);
        }
      } else {
        dispatch({ type: 'LOAD_STORAGE_DATA' });
      }
    });
    return () => unsubscribe();
  }, []);

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

  const signInWithGoogleHandler = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  const signOutHandler = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        playTrack,
        toggleLikeSong,
        setVideoPlaying,
        setVideoId,
        setCardMinimized: (minimized: boolean) => dispatch({ type: 'SET_CARD_MINIMIZED', payload: minimized }),
        setUserMinimized,
        signInWithGoogle: signInWithGoogleHandler,
        signOutUser: signOutHandler,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
