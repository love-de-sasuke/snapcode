import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        'mesh-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '50% 80%' },
          '100%': { backgroundPosition: '100% 30%' },
        },
        'success-pop': {
          '0%': { transform: 'scale(0.75)', opacity: '0' },
          '60%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
      },
      animation: {
        mesh: 'mesh-shift 18s ease-in-out infinite alternate',
        'success-pop': 'success-pop 1s ease-out forwards',
      },
      boxShadow: {
        silk: 'inset 0 0 0 1px rgba(255,255,255,0.18), 0 25px 80px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
}
export default config
