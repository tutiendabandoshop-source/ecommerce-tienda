const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FDFAF7',
          foreground: '#2D2D2D',
        },
        secondary: {
          DEFAULT: '#E3A5A0', // Rosa más intenso para botones y acentos
          light: '#E8C1C0',   // Versión suave para fondos
          foreground: '#FFFFFF',
        },
        terracota: '#E6B8A2', // Acento secundario
        text: {
          primary: '#2D2D2D',
          secondary: '#6B6B6B',
        },
        card: {
          DEFAULT: '#FFFFFF',
          border: '#EDEDED',
        },
        success: '#C7E0C7',
        warning: '#F7E6C4',
        border: '#EDEDED',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', ...defaultTheme.fontFamily.serif],
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        title: ['var(--font-bebas)', 'Bebas Neue', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        card: '20px',
        button: '14px',
        badge: '9999px',
      },
      boxShadow: {
        soft: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        medium: '0 10px 15px -3px rgba(0,0,0,0.1)',
        card: '0 4px 20px rgba(38, 70, 83, 0.12)',
        hover: '0 12px 32px rgba(255, 87, 34, 0.18)',
        float: '0 16px 40px rgba(42, 157, 143, 0.25)',
        glow: '0 0 24px rgba(255, 87, 34, 0.4)',
        neon: '0 0 20px rgba(0, 180, 216, 0.5)',
      },
      spacing: {
        xs: '8px',
        sm: '16px',
        md: '24px',
        lg: '48px',
        xl: '64px',
        '2xl': '96px',
      },
      animationDelay: {
        200: '200ms',
        400: '400ms',
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out forwards',
        fadeInHero: 'fadeIn 0.7s ease-out forwards',
        slideUp: 'slideUp 0.4s ease-out forwards',
        slideDown: 'slideDown 0.4s ease-out forwards',
        scaleIn: 'scaleIn 0.3s ease-out forwards',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 87, 34, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(255, 87, 34, 0.5)' },
        },
      },
    },
  },
  plugins: [
    function ({ addVariant, addUtilities }) {
      addVariant('hover-capable', '@media (hover: hover) and (pointer: fine)');
      addVariant('touch-only', '@media (hover: none) and (pointer: coarse)');
      addUtilities({
        '.tap-scale': {
          transition: 'transform 0.15s ease-out',
          '-webkit-tap-highlight-color': 'transparent',
          'touch-action': 'manipulation',
        },
        '.tap-scale:active': {
          transform: 'scale(0.97)',
        },
      });
    },
  ],
}
