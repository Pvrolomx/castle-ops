import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        castle: {
          gold: '#C9A227',
          dark: '#1A1A1A',
          sand: '#F5F1E8'
        }
      }
    }
  },
  plugins: []
}
export default config
