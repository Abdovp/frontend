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
          DEFAULT: '#13294B',
          dark: '#0C1B33',
          light: '#1E3A63',
          50: '#EEF2F8',
        },
        accent: {
          DEFAULT: '#C9A227',
          dark: '#AE8A19',
          light: '#E4C463',
        },
        ink: '#0E1116',
        cream: '#EEF2F8',
        dark: '#0E1116',
        light: '#ffffff',
      },
      fontFamily: {
        sans: ['Tajawal', 'IBM Plex Sans Arabic', 'Tahoma', 'system-ui', 'sans-serif'],
        heading: ['Cairo', 'Tajawal', 'Tahoma', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.22em',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(14, 17, 22, 0.06)',
        card: '0 12px 40px rgba(14, 17, 22, 0.08)',
        lift: '0 20px 60px rgba(14, 17, 22, 0.14)',
        gold: '0 14px 30px rgba(201, 162, 39, 0.28)',
        brand: '0 2px 8px rgba(19, 41, 75, 0.16)',
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
            boxShadow: '0 2px 8px rgba(19, 41, 75, 0.16)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow: '0 4px 12px rgba(19, 41, 75, 0.22), 0 0 0 3px rgba(19, 41, 75, 0.08)',
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
