import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    host: true,
    allowedHosts: ['sloane-orthostichous-saul.ngrok-free.dev', 'apollo-separated-elements-link.trycloudflare.com']
  }
  
})