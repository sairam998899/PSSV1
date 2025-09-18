import React from 'react';
import { motion } from 'framer-motion';
import { Music, Settings, Globe, Palette } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Theme, Language } from '../../types';

export function Header() {
  const { state, dispatch, signInWithGoogle, signOutUser } = useApp();

  const themes: { value: Theme; label: string; gradient: string }[] = [
    { value: 'dark', label: 'Dark', gradient: 'from-gray-900 to-gray-800' },
    { value: 'neon', label: 'Neon', gradient: 'from-purple-900 via-blue-900 to-cyan-900' },
    { value: 'purple', label: 'Blue', gradient: 'from-purple-800 to-pink-800' },
  ];

  const languages: { value: Language; label: string }[] = [
    { value: 'all', label: 'All Languages' },
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'te', label: 'Telugu' },
    { value: 'ta', label: 'Tamil' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-glass-medium border-b border-white/10"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-2 rounded-xl bg-gradient-to-r from-glow-blue to-glow-green">
              <Music className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-glow-blue to-neon-aqua bg-clip-text text-transparent dark:text-white text-white">
                HPSS
              </h1>
              <p className="text-xs text-gray-400">Hanumanthu Private streaming service</p>
            </div>
          </motion.div>

          <div className="flex flex-wrap items-center space-x-2 sm:space-x-4">
            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-glass-light backdrop-blur-sm border border-white/10 hover:border-glow-blue/50 transition-all text-sm">
                <Globe className="h-4 w-4" />
                <span>{languages.find(l => l.value === state.language)?.label}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 py-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: lang.value })}
                    className={`w-full text-left px-4 py-2 hover:bg-white/10 transition-colors ${
                      state.language === lang.value ? 'text-glow-blue' : 'text-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selector */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-glass-light backdrop-blur-sm border border-white/10 hover:border-glow-blue/50 transition-all text-sm">
                <Palette className="h-4 w-4" />
                <span className="capitalize">{themes.find(t => t.value === state.theme)?.label || state.theme}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-32 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 py-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto z-50">
                {themes.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => dispatch({ type: 'SET_THEME', payload: theme.value })}
                    className={`w-full text-left px-4 py-2 hover:bg-white/10 transition-colors ${
                      state.theme === theme.value ? 'text-glow-blue' : 'text-blue-500'
                    }`}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Google Sign-In / Sign-Out Button */}
            {state.user ? (
              <button
                onClick={signOutUser}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm"
                title={`Sign out ${state.user.displayName || state.user.email}`}
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
