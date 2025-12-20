import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader, Clock, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { YouTubeService } from '../../services/youtube';
import { SearchSuggestionCard } from '../Tracks/SearchSuggestionCard';

const scrollbarStyles = `
  .search-results-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  }
  .search-results-scroll::-webkit-scrollbar {
    width: 6px;
  }
  .search-results-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .search-results-scroll::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    transition: background 0.2s ease;
  }
  .search-results-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

const languageSuggestions: Record<string, string[]> = {
  all: ['Pop Music', 'Rock Classics', 'Indie Hits', 'Electronic', 'Jazz'],
  telugu: ['Telugu Hits', 'Tollywood Songs', 'Telugu Classics', 'Telugu Folk', 'Telugu Devotional'],
  hindi: ['Bollywood Hits', 'Hindi Classics', 'Hindi Pop', 'Hindi Devotional', 'Hindi Remix'],
  english: ['Pop Music', 'Rock Classics', 'Indie Hits', 'Electronic', 'Jazz'],
};

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const { dispatch, state } = useApp();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Handle input changes and fetch real search results
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length > 2) { // Only search when query is at least 3 characters
        setShowSuggestions(true);
        try {
          const results = await YouTubeService.searchVideos(query, 5, state.language);
          setSearchResults(results);
        } catch (error) {
          console.error('Error fetching search suggestions:', error);
          setSearchResults([]);
        }
      } else {
        setShowSuggestions(false);
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300); // Debounce for 300ms
    return () => clearTimeout(debounceTimer);
  }, [query, state.language]);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e?: React.FormEvent, searchQuery?: string) => {
    if (e) e.preventDefault();
    const queryToSearch = searchQuery || query;
    if (!queryToSearch.trim() || isLoading) return;

    // Save to recent searches
    const updatedRecent = [queryToSearch, ...recentSearches.filter(s => s !== queryToSearch)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));

    setIsLoading(true);
    try {
      console.log(`Searching for "${queryToSearch}" with language "${state.language}"`);
      let results = await YouTubeService.searchVideos(queryToSearch, 20, state.language);
      if (results.length === 0 && state.language !== 'all') {
        console.log('No results found with current language filter, retrying with language "all"');
        results = await YouTubeService.searchVideos(queryToSearch, 20, 'all');
      }
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
      console.log(`Search returned ${results.length} results`);
    } catch (error) {
      console.error('Search failed:', error);
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
    } finally {
      setIsLoading(false);
      setShowSuggestions(false);
    }
  };

  const defaultSuggestions = languageSuggestions[state.language] || languageSuggestions['all'];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto relative"
        ref={searchRef}
      >
      <form onSubmit={handleSearch} className="relative">
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for songs, artists, or videos..."
            className="w-full px-6 py-4 pl-14 bg-glass-dark backdrop-blur-sm border border-white/20 rounded-2xl text-black placeholder-gray-400 focus:outline-none focus:border-neon-aqua/50 focus:ring-2 focus:ring-neon-aqua/20 transition-all"
            style={{ color: 'black', caretColor: 'black' }}
          />
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-neon-aqua transition-colors" />

          <motion.button
            type="submit"
            disabled={isLoading || !query.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-glow-blue to-glow-green rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-glow-blue/25"
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              'Search'
            )}
          </motion.button>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-glass-dark backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 max-h-96 overflow-hidden"
          >
            <div className="p-2">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>Recent searches</span>
                  </div>
                  {recentSearches.slice(0, 3).map((recent, index) => (
                    <motion.button
                      key={`recent-${index}`}
                      onClick={() => {
                        setQuery(recent);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                      whileHover={{ scale: 1.02 }}
                    >
                      {recent}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-400">
                    <Search className="h-4 w-4" />
                    <span>Search Results</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto search-results-scroll">
                    {searchResults.slice(0, 3).map((track, index) => (
                      <div
                        key={`result-${track.id}`}
                        onClick={() => handleSearch(undefined, track.title)}
                        className="cursor-pointer"
                      >
                        <SearchSuggestionCard track={track} index={index} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-400">
                  <TrendingUp className="h-4 w-4" />
                  <span>Trending</span>
                </div>
                {['Top 40 Hits', 'New Releases', 'Viral Songs', 'Classic Rock'].map((trending, index) => (
                  <motion.button
                    key={`trending-${index}`}
                    onClick={() => {
                      setQuery(trending);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                    whileHover={{ scale: 1.02 }}
                  >
                    <TrendingUp className="h-4 w-4 inline mr-3 text-gray-400" />
                    {trending}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default search suggestions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {defaultSuggestions.map((suggestion) => (
          <motion.button
            key={suggestion}
            whileHover={{ scale: 1.05 }}
            onClick={() => setQuery(suggestion)}
            className="px-4 py-2 bg-glass-light backdrop-blur-sm border border-white/10 rounded-full text-sm text-gray-300 hover:border-neon-purple/50 hover:text-white transition-all"
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </motion.div>
  </>
  );
}
