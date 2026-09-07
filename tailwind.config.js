export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        clay: {
          50: '#FDF4EF',
          100: '#F9E4D8',
          200: '#F1C6AC',
          300: '#E7A47F',
          400: '#DF8452',
          500: '#D9622B',
          600: '#BC4E1E',
          700: '#963C17',
          800: '#6E2C11',
          900: '#481D0B',
        },
        ink: {
          50: '#F4F5F8',
          100: '#E8EAF1',
          200: '#D2D7E3',
          300: '#B0B9CD',
          400: '#7F8CA9',
          500: '#5C7099',
          600: '#3E5583',
          700: '#2A3F68',
          800: '#1B2C4E',
          900: '#12203C',
        },
        leaf: {
          50: '#EDF7F0',
          100: '#D3EBDB',
          500: '#1F7A3D',
          600: '#186231',
          700: '#124A25',
        },
        gold: {
          50: '#FDF6E7',
          100: '#FAECC9',
          500: '#E8A93B',
          600: '#C68A24',
          700: '#8F6215',
        },
        chili: {
          50: '#FBEDEA',
          100: '#F6D8D1',
          500: '#C1442D',
          600: '#9D3624',
        },
        sand: {
          DEFAULT: '#F7F5F1',
          100: '#F7F5F1',
          200: '#EFEBE4',
          300: '#E3DDD2',
          400: '#CFC7B8',
        },
      },
      fontFamily: {
        sans: ['Noto Sans', 'system-ui', 'sans-serif'],
        deva: ['Noto Sans Devanagari', 'Noto Sans', 'sans-serif'],
      },
      fontSize: {
        'artisan-body': ['1.125rem', { lineHeight: '1.7rem' }],
        'artisan-label': ['1.5rem', { lineHeight: '2rem' }],
      },
      borderRadius: {
        card: '1.25rem',
        sheet: '1.75rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(18,32,60,0.06), 0 10px 26px -14px rgba(18,32,60,0.16)',
        lift: '0 18px 40px -18px rgba(18,32,60,0.35)',
        frame: '0 40px 80px -30px rgba(18,32,60,0.45)',
      },
      keyframes: {
        'mic-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.55' },
          '50%': { transform: 'scale(1.35)', opacity: '0' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.35)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'mic-pulse': 'mic-pulse 1.8s cubic-bezier(0.23, 1, 0.32, 1) infinite',
        wave: 'wave 0.9s ease-in-out infinite',
      },
    },
  },
}
