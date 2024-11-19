import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const PORT = Number(process.env.LEARN_WEB_FRONTEND_PORT ?? 8009);


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: 'LEARN_WEB_FRONTEND_',
  server: {
    port: PORT,
    open: true,
  },
  preview: {
    port: 8001,
    open: true,
  },
  build: {
    outDir: 'build',
    assetsDir: 'resource',
  },
  resolve: {
    alias: {
      '@learn/web/frontend/simple_survey_form'
        : path.resolve(__dirname, './src/main/learn/web/frontend/simple_survey_form'),
      '@resource'
        : path.resolve(__dirname, './src/main/resource'),
    },
  },
})
