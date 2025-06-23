import React, { useState } from 'react';
import { Playlist, YouTubeVideo } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface AddToPlaylistModalProps {
  track: YouTubeVideo;
  isOpen: boolean;
  onClose: () => void;
}

export function AddToPlaylistModal({ track, isOpen, onClose }: AddToPlaylistModalProps) {
  const { state, dispatch } = useApp();
  const [newPlaylistName, setNewPlaylistName] = useState('');

  if (!isOpen) return null;

  const handleAddToPlaylist = (playlistId: string) => {
    const playlistIndex = state.userPlaylists.findIndex(p => p.id === playlistId);
    if (playlistIndex === -1) return;

    const playlist = state.userPlaylists[playlistIndex];
    const trackExists = playlist.tracks.some(t => t.id === track.id);
    if (!trackExists) {
      const updatedPlaylist = {
        ...playlist,
        tracks: [...playlist.tracks, track],
      };
      const updatedPlaylists = [...state.userPlaylists];
      updatedPlaylists[playlistIndex] = updatedPlaylist;
      dispatch({ type: 'SET_USER_PLAYLISTS', payload: updatedPlaylists });
    }
    onClose();
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    const newPlaylist = {
      id: Date.now().toString(),
      name: newPlaylistName.trim(),
      tracks: [track],
    };
    dispatch({ type: 'SET_USER_PLAYLISTS', payload: [...state.userPlaylists, newPlaylist] });
    setNewPlaylistName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-80">
        <h2 className="text-white text-lg mb-4">Add to Playlist</h2>
        <div className="mb-4 max-h-48 overflow-y-auto">
          {state.userPlaylists.length === 0 && (
            <p className="text-gray-400">No playlists found. Create one below.</p>
          )}
          {state.userPlaylists.map((playlist) => (
            <button
              key={playlist.id}
              className="block w-full text-left px-3 py-2 mb-2 rounded bg-glass-light hover:bg-glow-blue text-white"
              onClick={() => handleAddToPlaylist(playlist.id)}
            >
              {playlist.name} ({playlist.tracks.length} tracks)
            </button>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="New playlist name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
          />
          <button
            onClick={handleCreatePlaylist}
            className="px-4 py-2 bg-glow-green rounded text-black font-semibold hover:bg-green-500"
          >
            Create
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-glow-red rounded text-white hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
