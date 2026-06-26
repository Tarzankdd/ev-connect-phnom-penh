import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ev-connect-phnom-penh/',
  plugins: [react()],
});
