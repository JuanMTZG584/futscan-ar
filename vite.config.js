import { defineConfig } from 'vite'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],

  server: {
    host: true,
    allowedHosts: [
      'sloane-orthostichous-saul.ngrok-free.dev',
      'apollo-separated-elements-link.trycloudflare.com'
    ]
  },

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        seleccion: resolve(__dirname, 'seleccion.html')
      }
    }
  }
})