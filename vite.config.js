import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env };
  if (process.env.NETLIFY === 'true') {
    const apiUrl = new URL(env.VITE_FLEETPROOF_API_URL || 'http://localhost');
    if (apiUrl.protocol !== 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(apiUrl.hostname)) {
      throw new Error('Configure VITE_FLEETPROOF_API_URL with the public HTTPS mock API URL before deploying.');
    }
  }
  return { plugins: [vue()] };
});
