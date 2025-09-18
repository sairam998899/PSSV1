import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { YouTubeVideo, Playlist } from '../../types';
import { SmallTrackThumbnail } from '../Tracks/SmallTrackThumbnail';

export function Playlists() {
  const { state, playTrack } = useApp();
  const [expandedPlaylistId, setExpandedPlaylistId] = useState<string | null>(null);

  const toggleExpand = (playlistId: string) => {
    setExpandedPlaylistId(expandedPlaylistId === playlistId ? null : playlistId);
  };

  if (!state.userPlaylists || state.userPlaylists.length === 0) {
    return <p className="text-gray-400 p-4">No playlists available.</p>;
  }

  return (
    <div className="p-4 bg-gray-900 rounded-lg text-white max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Your Playlists</h2>
      {state.userPlaylists.map((playlist: Playlist) => (
        <div key={playlist.id} className="mb-4 border border-gray-700 rounded">
          <button
            className="w-full text-left px-4 py-2 bg-gray-800 hover:bg-gray-700 flex justify-between items-center"
            onClick={() => toggleExpand(playlist.id)}
          >
            <span>{playlist.name} ({playlist.tracks.length} tracks)</span>
            <span>{expandedPlaylistId === playlist.id ? '-' : '+'}</span>
          </button>
          {expandedPlaylistId === playlist.id && (
            <ul className="bg-gray-700 max-h-48 overflow-y-auto">
              {playlist.tracks.map((track: YouTubeVideo) => (
                <li key={track.id}>
                  <SmallTrackThumbnail track={track} onClick={() => playTrack(track)} />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
