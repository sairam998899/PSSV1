import React from 'react';
import { YouTubeVideo } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface SmallTrackThumbnailProps {
  track: YouTubeVideo;
  onClick?: () => void;
}

export function SmallTrackThumbnail({ track, onClick }: SmallTrackThumbnailProps) {
  const { playTrack } = useApp();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      playTrack(track);
    }
  };

  return (
    <div
      className="flex items-center space-x-3 px-3 py-2 cursor-pointer hover:bg-gray-600 rounded"
      onClick={handleClick}
      title={track.title}
    >
      <img
        src={track.thumbnail}
        alt={track.title}
        className="w-12 h-12 rounded-md object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm truncate">{track.title}</p>
        <p className="text-gray-400 text-xs truncate">{track.channelTitle}</p>
      </div>
    </div>
  );
}
