import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, YouTubeVideo, Track, Theme, Language } from '../types';
import { StorageService } from '../services/storage';
import { FirestoreService } from '../services/firestore';
import { signInWithGoogle, signOut, onUserChanged } from '../firebase';
import { extractSongMetadata } from '../lib/utils';

type AppAction =
  | { type: 'SET_CURRENT_TRACK'; payload: YouTubeVideo }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_SEARCH_RESULTS'; payload: YouTubeVideo[] }
  | { type: 'SET_TRENDING'; payload: YouTubeVideo[] }
  | { type: 'SET_LIKED_SONGS'; payload: YouTubeVideo[] }
  | { type: 'SET_USER_PLAYLISTS'; payload: Playlist[] }
  | { type: 'SET_PLAY_VIDEO'; payload: boolean }
  | { type: 'SET_VIDEO_PLAYING'; payload: boolean }
  | { type: 'SET_VIDEO_ID'; payload: string | null }
  | { type: 'SET_CARD_MINIMIZED'; payload: boolean }
  | { type: 'SET_USER_MINIMIZED'; payload: boolean }
  | { type: 'SET_LANGUAGE_SUGGESTIONS'; payload: YouTubeVideo[] }
  | { type: 'SET_THEME_LABEL'; payload: string }
  | { type: 'SET_USER'; payload: any }
  | { type: 'LOAD_STORAGE_DATA' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState & { user: any | null; loading: boolean } = {
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
  loading: false,
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

function appReducer(state: AppState & { user: any | null; loading: boolean }, action: AppAction): AppState & { user: any | null; loading: boolean } {
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
        FirestoreService.setUserLikedSongs(state.user.uid, state.likedSongs);
      }
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      StorageService.setLanguage(action.payload);
      if (state.user) {
        FirestoreService.setUserLikedSongs(state.user.uid, state.likedSongs);
      }
      return { ...state, language: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'SET_TRENDING':
      return { ...state, trending: action.payload };
    case 'SET_LIKED_SONGS':
      if (state.user) {
        FirestoreService.setUserLikedSongs(state.user.uid, action.payload);
      } else {
        StorageService.setLikedSongs(action.payload);
      }
      return { ...state, likedSongs: action.payload };
    case 'SET_USER_PLAYLISTS':
      if (state.user) {
        FirestoreService.setUserPlaylists(state.user.uid, action.payload);
      }
      return { ...state, userPlaylists: action.payload };
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
          userPlaylists: [], // Initialize empty playlists for unauthenticated users
        };
      }
      return state;
    case 'SET_THEME_LABEL':
      return { ...state, themeLabel: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
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
    let isMounted = true;
    async function fetchLanguageSuggestions() {
      try {
        let suggestions = [];
        if (state.language === 'all') {
          // Fetch songs without language filter or from multiple languages
          suggestions = await YouTubeService.searchVideos('songs', 20);
        } else {
          suggestions = await YouTubeService.searchVideos('songs', 20, state.language);
        }
        if (isMounted) {
          dispatch({ type: 'SET_LANGUAGE_SUGGESTIONS', payload: suggestions });
        }
      } catch (error) {
        console.error('Error fetching language suggestions:', error);
        if (isMounted) {
          dispatch({ type: 'SET_LANGUAGE_SUGGESTIONS', payload: [] });
        }
      }
    }
    fetchLanguageSuggestions();
    return () => {
      isMounted = false;
    };
  }, [state.language]);

  useEffect(() => {
    let previousUserId: string | null = null;

    const unsubscribe = onUserChanged((user) => {
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('Firebase auth state changed:', user);

      if (user && user.uid) {
        (async () => {
          try {
            console.log(`User signed in: ${user.uid}, fetching liked songs and playlists...`);
            // If user changed from anonymous to authenticated Google user, merge liked songs concurrently
            if (previousUserId && previousUserId !== user.uid) {
              const [previousLikedSongs, currentLikedSongs] = await Promise.all([
                FirestoreService.getUserLikedSongs(previousUserId),
                FirestoreService.getUserLikedSongs(user.uid),
              ]);
              const mergedLikedSongsMap = new Map<string, YouTubeVideo>();

              previousLikedSongs.forEach(song => mergedLikedSongsMap.set(song.id, song));
              currentLikedSongs.forEach(song => mergedLikedSongsMap.set(song.id, song));

              const mergedLikedSongs = Array.from(mergedLikedSongsMap.values());

              await FirestoreService.setUserLikedSongs(user.uid, mergedLikedSongs);
              console.log('Merged liked songs:', mergedLikedSongs);
              dispatch({ type: 'SET_LIKED_SONGS', payload: mergedLikedSongs });

              // Merge playlists similarly
              const [previousPlaylists, currentPlaylists] = await Promise.all([
                FirestoreService.getUserPlaylists(previousUserId),
                FirestoreService.getUserPlaylists(user.uid),
              ]);
              const mergedPlaylistsMap = new Map<string, Playlist>();

              previousPlaylists.forEach(pl => mergedPlaylistsMap.set(pl.id, pl));
              currentPlaylists.forEach(pl => mergedPlaylistsMap.set(pl.id, pl));

              const mergedPlaylists = Array.from(mergedPlaylistsMap.values());

              await FirestoreService.setUserPlaylists(user.uid, mergedPlaylists);
              console.log('Merged playlists:', mergedPlaylists);
              dispatch({ type: 'SET_USER_PLAYLISTS', payload: mergedPlaylists });
            } else {
              const likedSongs = await FirestoreService.getUserLikedSongs(user.uid);
              console.log('Fetched liked songs from Firestore:', likedSongs);
              if (Array.isArray(likedSongs) && likedSongs.length > 0) {
                dispatch({ type: 'SET_LIKED_SONGS', payload: likedSongs });
              } else {
                console.log('No liked songs found in Firestore or empty array');
                dispatch({ type: 'SET_LIKED_SONGS', payload: [] });
              }

              const playlists = await FirestoreService.getUserPlaylists(user.uid);
              console.log('Fetched playlists from Firestore:', playlists);
              if (Array.isArray(playlists) && playlists.length > 0) {
                dispatch({ type: 'SET_USER_PLAYLISTS', payload: playlists });
              } else {
                dispatch({ type: 'SET_USER_PLAYLISTS', payload: [] });
              }
            }
          } catch (error) {
            console.error('Error fetching user data from Firestore:', error);
          } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        })();
      } else {
        // Clear local storage liked songs on sign-out to avoid conflicts
        StorageService.setLikedSongs([]);
        dispatch({ type: 'LOAD_STORAGE_DATA' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }

      previousUserId = user ? user.uid : null;
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

  const toggleLikeSong = async (track: YouTubeVideo) => {
    let updatedLikedSongs = [...state.likedSongs];
    const index = updatedLikedSongs.findIndex((t) => t.id === track.id);
    if (index === -1) {
      updatedLikedSongs.push(track);
    } else {
      updatedLikedSongs.splice(index, 1);
    }
    console.log('Toggling liked songs, updated list:', updatedLikedSongs);
    dispatch({ type: 'SET_LIKED_SONGS', payload: updatedLikedSongs });
    if (state.user) {
      try {
        console.log(`Saving liked songs to Firestore for user ${state.user.uid}`);
        await FirestoreService.setUserLikedSongs(state.user.uid, updatedLikedSongs);
        console.log('Liked songs saved to Firestore');
        // Fetch updated liked songs from Firestore and update state
        const refreshedLikedSongs = await FirestoreService.getUserLikedSongs(state.user.uid);
        console.log('Refreshed liked songs from Firestore:', refreshedLikedSongs);
        dispatch({ type: 'SET_LIKED_SONGS', payload: refreshedLikedSongs });
      } catch (error) {
        console.error('Error saving liked songs to Firestore:', error);
      }
    } else {
      StorageService.setLikedSongs(updatedLikedSongs);
    }
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
      console.log('Attempting Google sign-in');
      await signInWithGoogle();
      console.log('Google sign-in completed');
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('Google sign-in failed. Please check console for details.');
    }
  };

  const signOutHandler = async () => {
    try {
      // Clear local storage liked songs on sign-out
      StorageService.setLikedSongs([]);
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
