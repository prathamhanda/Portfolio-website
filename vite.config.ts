import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { vercelFunctions } from "./vite-plugins/vercelFunctions";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // No proxy for /api/*: the vercelFunctions plugin below runs the real
    // handlers from api/, matching production routing exactly. The previous
    // proxy forwarded /api/github-contribs to GitHub's SVG endpoint, which
    // returned markup instead of the JSON the client expects, so local and
    // production behaved differently for the same URL.
  },
  plugins: [
    react(),
    // Serves /api/chat and /api/github-contribs/:user from the api/ folder.
    vercelFunctions(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'radix-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
          ],
          'ui-vendor': ['lucide-react', 'recharts', 'embla-carousel-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}));
