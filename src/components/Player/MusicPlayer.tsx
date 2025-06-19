import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { YouTubeService } from '../../services/youtube';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function MusicPlayer() {
  const { state, dispatch } = useApp();
  const playerRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!player && window.YT && playerRef.current) {
      const ytPlayer = new window.YT.Player(playerRef.current, {
        height: '0',
        width: '0',
        videoId: state.currentTrack?.id,
        playerVars: {
          playsinline: 1, // Enable inline playback on iOS and Android
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          autoplay: 1,
        },
        events: {
          onReady: () => {
            setIsReady(true);
            ytPlayer.setVolume(volume);
            setDuration(ytPlayer.getDuration());
            // Setup Media Session API
            if ('mediaSession' in navigator) {
              navigator.mediaSession.metadata = new window.MediaMetadata({
                title: state.currentTrack?.title || '',
                artist: state.currentTrack?.channelTitle || '',
                artwork: [
                  { src: state.currentTrack?.thumbnail || '', sizes: '96x96', type: 'image/png' },
                  { src: state.currentTrack?.thumbnail || '', sizes: '128x128', type: 'image/png' },
                  { src: state.currentTrack?.thumbnail || '', sizes: '192x192', type: 'image/png' },
                  { src: state.currentTrack?.thumbnail || '', sizes: '256x256', type: 'image/png' },
                  { src: state.currentTrack?.thumbnail || '', sizes: '384x384', type: 'image/png' },
                  { src: state.currentTrack?.thumbnail || '', sizes: '512x512', type: 'image/png' },
                ],
              });
              navigator.mediaSession.setActionHandler('play', () => {
                ytPlayer.playVideo();
                dispatch({ type: 'SET_PLAYING', payload: true });
              });
              navigator.mediaSession.setActionHandler('pause', () => {
                ytPlayer.pauseVideo();
                dispatch({ type: 'SET_PLAYING', payload: false });
              });
              navigator.mediaSession.setActionHandler('previoustrack', () => {
                // Implement previous track logic if available
              });
              navigator.mediaSession.setActionHandler('nexttrack', () => {
                // Implement next track logic if available
              });
            }
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              dispatch({ type: 'SET_PLAYING', payload: true });
            } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
              dispatch({ type: 'SET_PLAYING', payload: false });
            }
          },
        },
      });
      setPlayer(ytPlayer);
    }
  }, [player, state.currentTrack, volume, dispatch]);
  
  // Handle page visibility change to keep playing in background
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && player && isReady && state.isPlaying) {
        player.playVideo();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [player, isReady, state.isPlaying]);

  useEffect(() => {
    if (player && isReady) {
      player.loadVideoById(state.currentTrack?.id);
      player.playVideo();

      // Update duration after video metadata is loaded
      const updateDuration = () => {
        const dur = player.getDuration();
        if (dur && !isNaN(dur)) {
          setDuration(dur);
        } else {
          setTimeout(updateDuration, 500);
        }
      };
      updateDuration();
    }
  }, [state.currentTrack, player, isReady]);

  useEffect(() => {
    let interval: number;
    if (player && isReady && state.isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime(player.getCurrentTime());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [player, isReady, state.isPlaying]);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = Number(e.target.value);
    if (player && isReady) {
      player.seekTo(seekTo, true);
      setCurrentTime(seekTo);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (player && isReady) {
      player.setVolume(newVolume);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) {
      return '0:00';
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!state.currentTrack) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        {/* Background blur overlay */}
        <div className="absolute inset-0 backdrop-blur-xl bg-black/40" />

        <div className="relative p-4">
          <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-between bg-glass-medium backdrop-blur-xl rounded-2xl p-4 border border-white/10 gap-4">

          {/* Track Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0 min-w-[150px]">
            <motion.img
              src={state.currentTrack.thumbnail}
              alt={state.currentTrack.title}
              className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl object-cover"
              whileHover={{ scale: 1.1 }}
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-semibold truncate text-sm sm:text-base">
                {state.currentTrack.title}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm truncate">
                {state.currentTrack.channelTitle}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 sm:p-2 rounded-full bg-glass-light hover:bg-glow-blue/20 transition-colors"
            >
              <Heart className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 hover:text-glow-blue" />
            </motion.button>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2 mx-2 sm:mx-8 flex-1 justify-center max-w-[250px]">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 sm:p-2 rounded-full bg-glass-light hover:bg-glow-blue/20 transition-colors"
            >
              <SkipBack className="h-4 sm:h-5 w-4 sm:w-5 text-white" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (state.isPlaying) {
                  player?.pauseVideo();
                } else {
                  player?.playVideo();
                }
                dispatch({ type: 'SET_PLAYING', payload: !state.isPlaying });
              }}
              className="p-3 sm:p-4 rounded-full bg-gradient-to-r from-glow-blue to-glow-green shadow-lg hover:shadow-glow-blue transition-all"
            >
              {state.isPlaying ? (
                <Pause className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
              ) : (
                <Play className="h-5 sm:h-6 w-5 sm:w-6 text-white ml-0.5 sm:ml-1" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 sm:p-2 rounded-full bg-glass-light hover:bg-glow-blue/20 transition-colors"
            >
              <SkipForward className="h-4 sm:h-5 w-4 sm:w-5 text-white" />
            </motion.button>
          </div>

          {/* Volume & Progress */}
          <div className="flex items-center space-x-4 flex-1 justify-end min-w-[150px] max-w-full">
            <div className="flex items-center space-x-2 max-w-[100px]">
              <Volume2 className="h-5 w-5 text-gray-400" />
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-24 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
              />
            </div>
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeekChange}
              className="w-full max-w-xs sm:max-w-xl h-1 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-glow-blue to-glow-green"
              style={{
                background: `linear-gradient(to right, #00e5ff, #00ffcc)`,
              }}
            />
            <div className="text-xs sm:text-sm text-gray-400 w-20 sm:w-24 text-right">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>
          </div>
        </div>

        {/* Hidden YouTube Player */}
        <div className="absolute -top-96 left-0 opacity-0 pointer-events-none" ref={playerRef} />
      </motion.div>
    </AnimatePresence>
  );
}
