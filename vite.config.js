import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace 'coe-mom-generator' with your actual GitHub repo name
export default defineConfig({
  plugins: [react()],
  base: '/coe-mom-generator/',
})
