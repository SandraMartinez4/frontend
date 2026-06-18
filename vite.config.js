import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'



// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/paypal_create_order.php': 'http://localhost/Syanotes/backend',
      '/paypal_capture_order.php': 'http://localhost/Syanotes/backend'
    }
  }
})


