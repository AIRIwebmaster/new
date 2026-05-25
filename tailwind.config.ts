import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: '#FFFFFF',
        foreground: '#222222',
        primary: {
          DEFAULT: '#347054',
          foreground: '#FFFFFF',
          50: '#e8f5ed',
          100: '#d1eadb',
          200: '#a3d5b7',
          300: '#75c093',
          400: '#47ab6f',
          500: '#347054',
          600: '#2a5a43',
          700: '#204332',
          800: '#152d22',
          900: '#0b1611',
        },
        accent: {
          DEFAULT: '#98C93C',
          foreground: '#FFFFFF',
          50: '#f4f9e8',
          100: '#e9f3d1',
          200: '#d3e7a3',
          300: '#bddb75',
          400: '#a7cf47',
          500: '#98C93C',
          600: '#7aa130',
          700: '#5b7924',
          800: '#3d5018',
          900: '#1e280c',
        },
        lime: {
          DEFAULT: '#aae128',
          foreground: '#222222',
          50: '#f6fce8',
          100: '#edfad1',
          200: '#dbf4a3',
          300: '#c9ef75',
          400: '#b7e947',
          500: '#aae128',
          600: '#88b420',
          700: '#668718',
          800: '#445a10',
          900: '#222d08',
        },
        grey: {
          DEFAULT: '#555555',
          dark: '#222222',
          light: '#888888',
          50: '#f5f5f5',
          100: '#ebebeb',
          200: '#d6d6d6',
        },
        muted: {
          DEFAULT: '#f5f5f5',
          foreground: '#555555',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['var(--font-saira)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.75rem, 5vw + 1rem, 4.5rem)', { lineHeight: '1.08', fontWeight: '700' }],
        'display-sm': ['clamp(2.25rem, 4vw + 0.5rem, 3.25rem)', { lineHeight: '1.12', fontWeight: '700' }],
        'h1': ['clamp(2.25rem, 3.5vw + 0.5rem, 3rem)', { lineHeight: '1.15', fontWeight: '700' }],
        'h2': ['clamp(1.75rem, 2.5vw + 0.5rem, 2.5rem)', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['clamp(1.375rem, 2vw + 0.25rem, 1.75rem)', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['clamp(1.125rem, 1.5vw + 0.25rem, 1.375rem)', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['clamp(1.0625rem, 1.25vw + 0.125rem, 1.25rem)', { lineHeight: '1.7' }],
        'body': ['clamp(0.9375rem, 1vw + 0.125rem, 1.125rem)', { lineHeight: '1.7' }],
        'small': ['clamp(0.8125rem, 0.9vw + 0.0625rem, 0.9375rem)', { lineHeight: '1.5' }],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
