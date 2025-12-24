import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Disc, Music, Globe } from 'lucide-react';
import { YouTubeService } from '../../services/youtube';
import { StorageService } from '../../services/storage';

interface Album {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  language: string;
  publishedAt: string;
}

const LANGUAGES = [
  { code: 'pa', name: 'Punjabi', flag: '🇵🇰', example: 'Unforgettable by Imran Khan' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', example: 'Coffee with Kadhal' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', example: 'Arjun Reddy' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', example: 'Gully Boy' },
  { code: 'en', name: 'English', flag: '🇺🇸', example: 'Divide by Ed Sheeran' }
];

export function AlbumView() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDailyAlbums = async () => {
      try {
        // Check if we have cached albums from today
        const cached = StorageService.getDailyAlbums();
        const today = new Date().toDateString();

        if (cached && cached.date === today && cached.albums.length > 0) {
          setAlbums(cached.albums);
          setLoading(false);
          return;
        }

        // Fetch new albums for each language
        const newAlbums: Album[] = [];

        for (const language of LANGUAGES) {
          try {
            // Search for popular albums in this language
            const searchQuery = `${language.name} album music`;
            const results = await YouTubeService.searchVideos(searchQuery, 5, language.code);

            // Convert videos to albums (using channel as artist)
            const languageAlbums = results.slice(0, 3).map((video: any) => ({
              id: video.id,
              title: video.title.replace(/\s*\([^)]*\)/g, '').replace(/\s*\[[^\]]*\]/g, '').trim(), // Remove brackets
              artist: video.channelTitle,
              thumbnail: video.thumbnail,
              language: language.name,
              publishedAt: video.publishedAt
            }));

            newAlbums.push(...languageAlbums);
          } catch (error) {
            console.error(`Failed to load ${language.name} albums:`, error);
          }
        }

        // Shuffle and limit to 15 albums
        const shuffled = newAlbums.sort(() => Math.random() - 0.5).slice(0, 15);
        setAlbums(shuffled);

        // Cache for today
        StorageService.setDailyAlbums({ date: today, albums: shuffled });
        setLoading(false);
      } catch (error) {
        console.error('Failed to load daily albums:', error);
        setLoading(false);
      }
    };

    loadDailyAlbums();
  }, []);

  const getLanguageColor = (language: string) => {
    const colors = {
      'Punjabi': 'from-purple-500 to-pink-500',
      'Tamil': 'from-orange-500 to-red-500',
      'Telugu': 'from-green-500 to-teal-500',
      'Hindi': 'from-blue-500 to-indigo-500',
      'English': 'from-cyan-500 to-blue-500'
    };
    return colors[language as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getLanguageFlag = (language: string) => {
    return LANGUAGES.find(l => l.name === language)?.flag || '🎵';
  };

  if (loading) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8 md:p-10 premium-shadow relative overflow-hidden"
      >
        <div className="flex items-center space-x-5 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-glow-blue to-glow-green shadow-xl flex items-center justify-center animate-pulse">
            <Disc className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">Daily Albums</h2>
            <p className="text-gray-400 text-base flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Loading fresh albums...
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="animate-pulse"
            >
              <div className="aspect-square rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"></div>
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-white/10 rounded"></div>
                <div className="h-3 bg-white/5 rounded"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="glass-card rounded-3xl p-8 md:p-10 premium-shadow relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-glow-green rounded-full blur-3xl transform -translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-glow-blue rounded-full blur-3xl transform translate-x-24 translate-y-24" />
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-5 mb-8"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-glow-green to-glow-blue shadow-xl flex items-center justify-center">
              <Disc className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">Daily Albums</h2>
            <p className="text-gray-400 text-base flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Fresh albums from around the world
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {albums.map((album, index) => (
            <motion.div
              key={`${album.id}-${index}`}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.1 * index,
                duration: 0.5,
                ease: "easeOut"
              }}
              whileHover={{ y: -8, scale: 1.05, transition: { duration: 0.2 } }}
              className="group cursor-pointer transform transition-all duration-300"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 group-hover:border-white/30 transition-all duration-300">
                <img
                  src={album.thumbnail}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Language badge */}
                <div className="absolute top-3 right-3">
                  <div className={`px-2 py-1 rounded-full bg-gradient-to-r ${getLanguageColor(album.language)} text-white text-xs font-medium shadow-lg backdrop-blur-sm border border-white/20 flex items-center gap-1`}>
                    <span>{getLanguageFlag(album.language)}</span>
                    <span className="hidden sm:inline">{album.language}</span>
                  </div>
                </div>

                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-glow-blue transition-colors duration-300">
                  {album.title}
                </h3>
                <p className="text-gray-400 text-xs line-clamp-1">
                  {album.artist}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
