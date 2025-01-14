/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './frontend/**/*.html',
    './frontend/**/*.js',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-bkg': "url('../img/bkg4.webp')",
      },
      fontFamily: {
        pike: ['Pike', 'sans-serif'],
        pix: ['pix', 'sans-serif'],
      },
      keyframes: {
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 3px rgba(255, 255, 255, 0.4)' },
          '25%': { boxShadow: '0 0 6px rgba(255, 255, 255, 0.6)' },
          '50%': { boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)' },
          '75%': { boxShadow: '0 0 6px rgba(255, 255, 255, 0.6)' },
          '100%': { boxShadow: '0 0 3px rgba(255, 255, 255, 0.4)' },
        },
        greenGlow: {
          '0%': { boxShadow: '0 0 4px rgba(34, 197, 94, 0.4)' },
          '50%': { boxShadow: '0 0 8px rgba(34, 197, 94, 1)' },
          '100%': { boxShadow: '0 0 4px rgba(34, 197, 94, 0.3)' },
        },
        shake: {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '50%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-5px)' },
          '100%': { transform: 'translateX(0)' },
        },
        showUpTada:{
        '60%': { transform: 'scale(0.9)' }, 
        '70%': { transform: 'scale(1.1)' },
        '80%': { transform: 'scale(1)' },
        '90%': { transform: 'scale(1.1)' },
        '100%': { transform: 'scale(1)' },
        },
        colorCycle: {
        '0%': { color: '#f472b6' }, 
        '5%': { color: '#db85c7' }, 
        '16%': { color: '#c084fc' },
        '33%': { color: '#22d3ee' },
        '50%': { color: '#14b8a6' },
        '66%': { color: '#19ff4b' }, 
        '83%': { color: '#facc15' }, 
        '93%': { color: '#a855f7' }, 
        '100%': { color: '#f472b6' }, 
      },
         glowShadowCycle: {
         '0%': {
          textShadow: '0 0 2px #000, 0 0 4px #f472b6, 0 0 6px #000',
        },
        '12.5%': {
          textShadow: '0 0 2px #000, 0 0 4px #db85c7, 0 0 6px #4B0082',
        },
        '25%': {
          textShadow: '0 0 3px #000, 0 0 5px #c084fc, 0 0 7px #22d3ee',
        },
        '37.5%': {
          textShadow: '0 0 3px #000, 0 0 5px #22d3ee, 0 0 8px #14b8a6',
        },
        '50%': {
          textShadow: '0 0 4px #000, 0 0 6px #14b8a6, 0 0 9px #19ff4b',
        },
        '62.5%': {
          textShadow: '0 0 4px #000, 0 0 6px #19ff4b, 0 0 9px #facc15',
        },
        '75%': {
          textShadow: '0 0 4px #000, 0 0 6px #facc15, 0 0 9px #a855f7',
        },
        '87.5%': {
          textShadow: '0 0 4px #000, 0 0 6px #a855f7, 0 0 9px #f472b6',
        },
        '100%': {
          textShadow: '0 0 2px #000, 0 0 4px #f472b6, 0 0 6px #000',
        },
      },
      glowText: {
        '0%': { textShadow: '0 0 5px #000, 0 0 10px #FF69B4, 0 0 15px #000' },
        '100%': { textShadow: '0 0 10px #000, 0 0 15px #4B0082, 0 0 30px #00CED1' },
        },
        borderGlow: {
        '0%': { boxShadow: '0 0 1px #000, 0 0 6px #FF69B4, 0 0 12px #000' },
        '100%': { boxShadow: '0 0 12px #000, 0 0 15px #4B0082, 0 0 30px #00CED1' },
      },
        
      },
      animation: {
        fade: 'fade 2s ease-in-out infinite', 
        greenGlow: 'greenGlow 1.5s infinite ease-in-out',
        glow: 'glow 1.3s ease-in-out infinite',
        shake: 'shake 1.5s ease-in-out infinite',
        showUpTada: 'showUpTada 1.5s ease-in-out 1',
        glowShadowCycle: 'glowShadowCycle 5s ease-in-out infinite',
        colorCycle: 'colorCycle 2.5s infinite',
        colorFast: 'colorCycle 0.8s infinite',
        colorSlow: 'colorCycle 6s infinite',
        glowText: 'glowText 1.5s ease-in-out infinite alternate',
        borderGlow: 'borderGlow 1.5s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
}

