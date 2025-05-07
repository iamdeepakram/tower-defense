
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    open: true,
    host: '0.0.0.0',
    allowedHosts: [
      "772cbec1-40f5-4199-9d7f-9149bb75105f-00-6z9mv3lriu87.pike.replit.dev"
    ]
  }
});
