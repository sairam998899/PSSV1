import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Eye, Video, PlusCircle } from 'lucide-react';
import { YouTubeVideo } from '../../types';
import { useApp } from '../../contexts/AppContext';

import { Heart } from 'lucide-react';
import { AddToPlaylistModal } from './AddToPlaylistModal';

interface TrackCardProps {
  track: YouTubeVideo;
  index: number;
  showPlayedAt?: boolean;
  playedAt?: Date;
  onPlay?: () => void;
  onToggleLike?: () => void;
  isLiked?: boolean;
  onVideoPlay?: () => void;
}

export function TrackCard({ track, index, showPlayedAt, playedAt, onPlay, onToggleLike, isLiked, onVideoPlay }: TrackCardProps) {
  const { playTrack } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlay = () => {
    if (onPlay) {
      onPlay();
    } else {
      playTrack(track);
    }
  };

  const handleVideoPlay = () => {
    if (onVideoPlay) {
      onVideoPlay();
    } else {
      playTrack(track, true); // pass true to indicate video play
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="group relative p-4 rounded-2xl bg-glass-light backdrop-blur-sm border border-white/10 hover:border-glow-blue transition-all duration-300 hover:shadow-lg hover:shadow-glow-blue"
      >
        {/* Background gradient on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-glow-blue/10 to-glow-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex items-start space-x-4">
          {/* Thumbnail */}
          <div className="relative flex-shrink-0">
            <img
              src={track.thumbnail}
              alt={track.title}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
            >
              <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
            </motion.button>
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-lg leading-tight mb-1 truncate group-hover:text-neon-aqua transition-colors">
                {track.title}
              </h3>
            <p className="text-gray-400 text-sm mb-2 truncate">
              {track.channelTitle}
            </p>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {track.duration && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{track.duration}</span>
                </div>
              )}
              {track.viewCount && (
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{track.viewCount}</span>
                </div>
              )}
              {showPlayedAt && playedAt && (
                <span>
                  {new Date(playedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Like Button */}
          {onToggleLike && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleLike}
              className="flex-shrink-0 p-2 rounded-full bg-glass-light hover:bg-glow-blue/20 transition-colors"
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'text-glow-blue' : 'text-gray-400'}`} />
            </motion.button>
          )}

          {/* Add to Playlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={openModal}
            className="flex-shrink-0 p-2 rounded-full bg-glass-light hover:bg-glow-green/20 transition-colors ml-2"
            title="Add to Playlist"
          >
            <PlusCircle className="h-6 w-6 text-green-400" />
          </motion.button>

          {/* Quick Play Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlay}
            className="flex-shrink-0 p-3 rounded-full bg-gradient-to-r from-glow-blue to-glow-green opacity-0 group-hover:opacity-100 transition-all hover:shadow-lg hover:shadow-glow-blue"
          >
            <Play className="h-5 w-5 text-white ml-0.5" fill="currentColor" />
          </motion.button>

          {/* Video Play Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleVideoPlay}
            className="flex-shrink-0 p-3 rounded-full bg-gradient-to-r from-glow-red to-glow-pink opacity-0 group-hover:opacity-100 transition-all hover:shadow-lg hover:shadow-glow-red ml-2"
            title="Play Video"
          >
            <Video className="h-5 w-5 text-white" />
          </motion.button>
        </div>
      </motion.div>
      <AddToPlaylistModal track={track} isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
