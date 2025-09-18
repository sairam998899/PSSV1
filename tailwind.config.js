/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        deepBlueBlack: '#001021',
        tealNebula: '#0a4d4d',
        neonAqua: '#00fff7',
        transparentBlue: 'rgba(0, 128, 255, 0.2)',
        glowBlue: '#00e5ff',
        glowGreen: '#00ffcc',
        glass: {
          light: 'rgba(255, 255, 255, 0.07)',
          dark: 'rgba(255, 255, 255, 0.15)',
          border: 'rgba(255, 255, 255, 0.2)',
        },
      },
      backgroundImage: {
        'neon-abyss-gradient': 'linear-gradient(145deg, #001021, #0a4d4d)',
      },
      boxShadow: {
        'glow-blue': '0 0 10px #00e5ff',
        'glow-green': '0 0 10px #00ffcc',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderColor: {
        glass: 'rgba(255, 255, 255, 0.2)',
      },
      backgroundColor: {
        glass: 'rgba(255, 255, 255, 0.07)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #0fffc1' },
          '100%': { boxShadow: '0 0 20px #0fffc1, 0 0 30px #0fffc1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
    },
  },
  plugins: [],
};
