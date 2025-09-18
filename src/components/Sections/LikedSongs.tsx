import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { TrackCard } from '../Tracks/TrackCard';

export default function LikedSongs() {
  const { state, playTrack, toggleLikeSong } = useApp();

  console.log('LikedSongs component - likedSongs state:', state.likedSongs);

  if (!state.likedSongs || state.likedSongs.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-8">
        You have no liked songs yet.
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {state.likedSongs.map((song, index) => (
        <TrackCard
          key={song.id}
          index={index}
          track={song}
          onPlay={() => playTrack(song)}
          onToggleLike={() => toggleLikeSong(song)}
          isLiked={true}
        />
      ))}
    </div>
  );
}
