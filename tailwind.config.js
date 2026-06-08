/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0F172A',
          dark: '#020617',
          light: '#334155',
          50: '#F1F5F9',
        },
        accent: {
          DEFAULT: '#D4A017',
          dark: '#B8860B',
          light: '#F0D78C',
        },
        ink: '#1E293B',
        cream: '#F8FAFC',
        dark: '#0F172A',
        light: '#ffffff',
        admin: {
          bg: '#F5F1EA',
          accent: '#144534',
          'accent-light': '#1B5E42',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Tajawal', 'IBM Plex Sans Arabic', 'Tahoma', 'system-ui', 'sans-serif'],
        heading: ['Cairo', 'Tajawal', 'Tahoma', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.22em',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(15, 23, 42, 0.06)',
        card: '0 12px 40px rgba(15, 23, 42, 0.08)',
        lift: '0 20px 60px rgba(15, 23, 42, 0.14)',
        gold: '0 14px 30px rgba(212, 160, 23, 0.28)',
        brand: '0 2px 8px rgba(15, 23, 42, 0.16)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.625rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'cta-pulse': {
          '0%, 100%': {
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.16)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.22), 0 0 0 3px rgba(15, 23, 42, 0.08)',
            transform: 'scale(1.02)',
          },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        marquee: 'marquee 28s linear infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        'cta-pulse': 'cta-pulse 2s ease-in-out infinite',
      },
    }
  },
  plugins: []
};
