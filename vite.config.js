import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts:["way.golu.codes","abc.golu.codes"],
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 5173, // you can replace this port with any port
  },
    preview: {
    port: 5173, // change to your desired port
    host: '0.0.0.0', // optional: to make it accessible externally
  },
})
