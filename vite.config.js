import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Force IPv4: the backend binds to 0.0.0.0, but "localhost" can resolve
      // to ::1 first on Windows, which nothing is listening on.
      "/api": "http://127.0.0.1:5000",
    },
  },
})
