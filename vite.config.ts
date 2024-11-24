import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import generateFile from 'vite-plugin-generate-file'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    // add custom headers to Cloudflare Pages
    // enabling OPFS feature in the browser
    generateFile([{
      type: 'template',
      output: '_headers',
      template: './_headerstemplate.ejs',
      contentType: 'text/plain',
      data: {
        paths: {
          '/*': {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedded-Policy': 'require-corp',
          },
        },
      },
    }]),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
