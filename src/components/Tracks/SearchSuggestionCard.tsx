import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Eye, Video, PlusCircle } from 'lucide-react';
import { YouTubeVideo } from '../../types';
import { useApp } from '../../contexts/AppContext';

import { Heart } from 'lucide-react';
import { AddToPlaylistModal } from './AddToPlaylistModal';

interface SearchSuggestionCardProps {
  track: YouTubeVideo;
  index: number;
  showPlayedAt?: boolean;
  playedAt?: Date;
  onPlay?: () => void;
  onToggleLike?: () => void;
  isLiked?: boolean;
  onVideoPlay?: () => void;
}

export function SearchSuggestionCard({ track, index, showPlayedAt, playedAt, onPlay, onToggleLike, isLiked, onVideoPlay }: SearchSuggestionCardProps) {
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -2, scale: 1.02 }}
        className="group relative p-3 rounded-xl bg-glass-light backdrop-blur-sm border border-white/10 hover:border-glow-blue transition-all duration-200 hover:shadow-lg hover:shadow-glow-blue/50"
      >
        {/* Background gradient on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-glow-blue/5 to-glow-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        <div className="relative flex items-center space-x-3">
          {/* Thumbnail */}
          <div className="relative flex-shrink-0">
            <img
              src={track.thumbnail}
              alt={track.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            >
              <Play className="h-6 w-6 text-white ml-0.5" fill="currentColor" />
            </motion.button>
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm leading-tight mb-1 truncate group-hover:text-neon-aqua transition-colors">
              {track.title}
            </h3>
            <p className="text-gray-400 text-xs truncate">
              {track.channelTitle}
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
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
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all">
            {/* Like Button */}
            {onToggleLike && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onToggleLike}
                className="p-1.5 rounded-full bg-glass-light hover:bg-glow-blue/20 transition-colors"
              >
                <Heart className={`h-3 w-3 ${isLiked ? 'text-glow-blue' : 'text-gray-400'}`} />
              </motion.button>
            )}

            {/* Add to Playlist Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={openModal}
              className="p-1.5 rounded-full bg-glass-light hover:bg-glow-green/20 transition-colors"
              title="Add to Playlist"
            >
              <PlusCircle className="h-3 w-3 text-green-400" />
            </motion.button>

            {/* Video Play Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleVideoPlay}
              className="p-1.5 rounded-full bg-glass-light hover:bg-glow-red/20 transition-colors"
              title="Play Video"
            >
              <Video className="h-3 w-3 text-white" />
            </motion.button>
          </div>
        </div>
      </motion.div>
      <AddToPlaylistModal track={track} isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
