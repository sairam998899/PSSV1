import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, Repeat } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { YouTubeService } from '../../services/youtube';
import { MusicCard } from './MusicCard';

declare global {
  interface Window {
    YT: any;
  }
}

interface MusicPlayerProps {
  onToggleMaximize: () => void;
  cardMinimizedByUser: boolean;
  cardMinimized: boolean;
  setCardMinimizedByUser: React.Dispatch<React.SetStateAction<boolean>>;
  setCardMinimized: (minimized: boolean) => void;
}

export function MusicPlayer({
  onToggleMaximize,
  cardMinimizedByUser,
  cardMinimized,
  setCardMinimizedByUser,
  setCardMinimized,
}: MusicPlayerProps) {
  const { state, dispatch, toggleLikeSong, playTrack, setUserMinimized } = useApp();
  const playerRef = useRef<HTMLDivElement>(null);
  const repeatModeRef = useRef(false);
  const [player, setPlayer] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isReady, setIsReady] = useState(false);
  const [lastSkipBackPress, setLastSkipBackPress] = useState<number | null>(null);
  const [repeatMode, setRepeatMode] = useState(false);

  // Helper function to format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === Infinity || seconds < 0) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleRepeatMode = () => {
    setRepeatMode((prev) => {
      repeatModeRef.current = !prev;
      return !prev;
    });
  };

  useEffect(() => {
    let interval: any = null;

    const tryInitPlayer = () => {
      if (!player && (window as any).YT && playerRef.current && state.currentTrack) {
        const ytPlayer = new (window as any).YT.Player(playerRef.current, {
          height: '0',
          width: '0',
          videoId: state.currentTrack.id,
          playerVars: {
            playsinline: 1,
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

              // Poll for duration until valid
              let durationInterval = setInterval(() => {
                const dur = ytPlayer.getDuration();
                console.log('YT Player duration:', dur);
                if (dur && dur > 0) {
                  setDuration(dur);
                  if ('mediaSession' in navigator) {
                    navigator.mediaSession.setPositionState({
                      duration: dur,
                      playbackRate: 1,
                      position: 0,
                    });
                  }
                  clearInterval(durationInterval);
                }
              }, 500);

              if ('mediaSession' in navigator && state.currentTrack != null) {
                navigator.mediaSession.metadata = new window.MediaMetadata({
                  title: state.currentTrack!.title,
                  artist: state.currentTrack!.channelTitle,
                  artwork: [
                    { src: state.currentTrack!.thumbnail, sizes: '96x96', type: 'image/png' },
                    { src: state.currentTrack!.thumbnail, sizes: '128x128', type: 'image/png' },
                    { src: state.currentTrack!.thumbnail, sizes: '192x192', type: 'image/png' },
                    { src: state.currentTrack!.thumbnail, sizes: '256x256', type: 'image/png' },
                    { src: state.currentTrack!.thumbnail, sizes: '384x384', type: 'image/png' },
                    { src: state.currentTrack!.thumbnail, sizes: '512x512', type: 'image/png' },
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
                  const time = ytPlayer.getCurrentTime();
                  if (time > 1) {
                    ytPlayer.seekTo(0, true);
                    setCurrentTime(0);
                  } else {
                    if (state.history.length > 1) {
                      const previousTrack = state.history[state.history.length - 2];
                      playTrack(previousTrack);
                    } else {
                      ytPlayer.seekTo(0, true);
                      setCurrentTime(0);
                    }
                  }
                });
                navigator.mediaSession.setActionHandler('nexttrack', async () => {
                  if (state.currentTrack!.channelTitle) {
                    const results = await YouTubeService.searchVideos(state.currentTrack!.channelTitle + ' song', 20);
                    if (results.length > 0) {
                      const randomIndex = Math.floor(Math.random() * results.length);
                      const randomVideo = results[randomIndex];
                      playTrack(randomVideo);
                      return;
                    }
                  }
                  ytPlayer.seekTo(0, true);
                  setCurrentTime(0);
                  ytPlayer.playVideo();
                });
                navigator.mediaSession.setActionHandler('seekto', (details) => {
                  if (details.seekTime !== undefined) {
                    ytPlayer.seekTo(details.seekTime, true);
                    setCurrentTime(details.seekTime);
                  }
                });
                navigator.mediaSession.setActionHandler('seekforward', () => {
                  const current = ytPlayer.getCurrentTime();
                  const newTime = Math.min(current + 10, ytPlayer.getDuration());
                  ytPlayer.seekTo(newTime, true);
                  setCurrentTime(newTime);
                });
                navigator.mediaSession.setActionHandler('seekbackward', () => {
                  const current = ytPlayer.getCurrentTime();
                  const newTime = Math.max(current - 10, 0);
                  ytPlayer.seekTo(newTime, true);
                  setCurrentTime(newTime);
                });
              }
            },
            onStateChange: async (event: any) => {
              if (event.data === (window as any).YT.PlayerState.PLAYING) {
                dispatch({ type: 'SET_PLAYING', payload: true });
              } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
                dispatch({ type: 'SET_PLAYING', payload: false });
              } else if (event.data === (window as any).YT.PlayerState.ENDED) {
                dispatch({ type: 'SET_PLAYING', payload: false });
                if (repeatModeRef.current && player) {
                  console.log('Repeat mode active: restarting current track');
                  setTimeout(() => {
                    if (player) {
                      player.seekTo(0, true);
                      player.playVideo();
                    }
                  }, 200);
                } else {
                  // Play next song based on genre and theme
                  if (state.currentTrack !== null) {
                    const buildSearchQuery = () => {
                      // Attempt to use genre and theme if available, else fallback to title and channelTitle
                      const genre = (state.currentTrack as any).genre || '';
                      const theme = (state.currentTrack as any).theme || '';
      const title = state.currentTrack!.title || '';
      const channel = state.currentTrack!.channelTitle || '';
                      let queryParts = [];
                      if (genre) queryParts.push(genre);
                      if (theme) queryParts.push(theme);
                      if (!genre && !theme) {
                        // fallback to title and channel
                        queryParts.push(title);
                        queryParts.push(channel);
                      }
                      return queryParts.join(' ') + ' song';
                    };

                    const query = buildSearchQuery();
                    try {
                      const results = await YouTubeService.searchVideos(query, 20);
                      if (results.length > 0) {
                        const randomIndex = Math.floor(Math.random() * results.length);
                        const randomVideo = results[randomIndex];
                        playTrack(randomVideo);
                      }
                    } catch (error) {
                      console.error('Error fetching next song:', error);
                    }
                  }
                }
              }
            },
          },
        });
        setPlayer(ytPlayer);
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      }
    };

    if (!(window as any).YT) {
      // Poll for YT API readiness
      interval = setInterval(() => {
        tryInitPlayer();
      }, 100);
    } else {
      tryInitPlayer();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [player, state.currentTrack, volume, dispatch, state.playVideo]);

  // Update player when currentTrack changes
  useEffect(() => {
    if (player && state.currentTrack && isReady) {
      player.loadVideoById(state.currentTrack.id);
      setDuration(0); // reset duration to 0 on track change
      setCurrentTime(0);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: state.currentTrack.title,
          artist: state.currentTrack.channelTitle,
          artwork: [
            { src: state.currentTrack.thumbnail, sizes: '96x96', type: 'image/png' },
            { src: state.currentTrack.thumbnail, sizes: '128x128', type: 'image/png' },
            { src: state.currentTrack.thumbnail, sizes: '192x192', type: 'image/png' },
            { src: state.currentTrack.thumbnail, sizes: '256x256', type: 'image/png' },
            { src: state.currentTrack.thumbnail, sizes: '384x384', type: 'image/png' },
            { src: state.currentTrack.thumbnail, sizes: '512x512', type: 'image/png' },
          ],
        });
      }

      // Poll for duration until valid
      let durationInterval = setInterval(() => {
        const dur = player.getDuration();
        console.log('YT Player duration on track change:', dur);
        if (dur && dur > 0) {
          setDuration(dur);
          clearInterval(durationInterval);
        }
      }, 500);
    }
  }, [state.currentTrack, player, isReady]);

  // Removed useEffect that forces cardMinimized to false on play to respect user minimize action

  // Handler to minimize the card when close button is clicked
  const handleMinimize = () => {
    setCardMinimized(true);
    setUserMinimized(true);
  };

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

  // New effect to update currentTime periodically while playing and handle repeat
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (player && isReady && state.isPlaying) {
      interval = setInterval(() => {
        const time = player.getCurrentTime();
        const dur = player.getDuration();
        setCurrentTime(time);
        setDuration(dur);
        if ('mediaSession' in navigator) {
          navigator.mediaSession.setPositionState({
            duration: dur,
            playbackRate: 1,
            position: time,
          });
        }
        if (repeatModeRef.current && dur > 0 && time >= dur - 0.5) {
          console.log('Repeat mode active: restarting current track via polling');
          player.seekTo(0, true);
          player.playVideo();
        }
      }, 500);
    } else if (!state.isPlaying && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [player, isReady, state.isPlaying]);

  const handlePrevious = () => {
    const now = Date.now();
    if (currentTime > 1) {
      // If more than 1 second into the track, restart it
      player?.seekTo(0, true);
      setCurrentTime(0);
      player?.playVideo();
      setLastSkipBackPress(null);
    } else {
      // If pressed twice within 1 second or at start, play previous track if available
      if (lastSkipBackPress && now - lastSkipBackPress < 1000) {
        if (state.history.length > 1) {
          const previousTrack = state.history[state.history.length - 2];
          if (previousTrack) {
            playTrack(previousTrack);
          }
        } else if (player && isReady) {
          // No previous track, restart current track
          player.seekTo(0, true);
          player.playVideo();
        }
        setLastSkipBackPress(null);
      } else {
        setLastSkipBackPress(now);
      }
    }
  };

  const handleNext = async () => {
    // Always fetch random video from YouTube API based on current artist
    if (state.currentTrack?.channelTitle) {
      const results = await YouTubeService.searchVideos(state.currentTrack.channelTitle + ' song', 20);
      if (results.length > 0) {
        const randomIndex = Math.floor(Math.random() * results.length);
        const randomVideo = results[randomIndex];
        playTrack(randomVideo);
        return;
      }
    }
    // If no results, restart current track
    player?.seekTo(0, true);
    setCurrentTime(0);
    player?.playVideo();
  };

  if (!state.currentTrack) return null;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (player && isReady) {
      player.setVolume(newVolume);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = Number(e.target.value);
    if (player && isReady) {
      player.seekTo(seekTo, true);
      setCurrentTime(seekTo);
    }
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div className="absolute inset-0 bg-black/80"></div>

          <div className="relative p-4">
            <div className="container mx-auto">
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-between rounded-2xl p-4 border border-white/10 gap-4">
                <div ref={playerRef} style={{ height: 0, width: 0, overflow: 'hidden' }} />

                <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 flex-1 min-w-0 min-w-[150px] relative rounded-xl">
                  <motion.img
                    src={state.currentTrack?.thumbnail}
                    alt={state.currentTrack?.title}
                    className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl object-cover cursor-pointer relative z-20"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => {
                      if (cardMinimizedByUser || cardMinimized) {
                        setCardMinimized(false);
                        setUserMinimized(false);
                        setCardMinimizedByUser(false);
                      } else {
                        setCardMinimized(true);
                        setUserMinimized(true);
                        setCardMinimizedByUser(true);
                      }
                    }}
                  />
                  <div className="min-w-0 flex-1 z-20 relative mt-2 sm:mt-0">
                    <h3 className="text-white font-semibold truncate text-sm sm:text-base">
                      {state.currentTrack?.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm truncate">
                      {state.currentTrack?.channelTitle}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 sm:p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors z-20 mt-2 sm:mt-0"
                    onClick={() => {
                      if (state.currentTrack) {
                        toggleLikeSong(state.currentTrack);
                      }
                    }}
                  >
                    <Heart
                      className={`h-4 sm:h-5 w-4 sm:w-5 ${
                        state.currentTrack != null && state.likedSongs.some((song) => song.id === state.currentTrack?.id)
                          ? 'text-red-500'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    />
                  </motion.button>
                </div>

                <div className="flex items-center space-x-2 mx-2 sm:mx-8 flex-1 justify-center max-w-[250px]">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrevious}
                    className="p-1 sm:p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
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
                      // Do not change cardMinimized or userMinimized here to avoid controlling MusicCard visibility
                    }}
                    className="p-3 sm:p-4 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition-all"
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
                  onClick={handleNext}
                  className="p-1 sm:p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <SkipForward className="h-4 sm:h-5 w-4 sm:w-5 text-white" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleRepeatMode}
                  className={`p-1 sm:p-2 rounded-full transition-colors ${
                    repeatMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                  aria-label="Toggle Repeat"
                  title="Toggle Repeat"
                >
                  <Repeat className="h-4 sm:h-5 w-4 sm:w-5 text-white" />
                </motion.button>
                </div>

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
                    className="w-full max-w-xs sm:max-w-xl h-1 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-blue-500 to-green-400"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1 select-none max-w-xs sm:max-w-xl space-x-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>|</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
