import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { crawlable } from './scripts/crawlable.mjs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), crawlable(loadEnv(mode, process.cwd()).VITE_SITE_URL)],
}))
