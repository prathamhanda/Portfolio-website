import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // In local dev, forward /api/github-contribs/<user>.json to GitHub's contributions SVG
      '/api/github-contribs': {
        target: 'https://github.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => {
          // path: /api/github-contribs/<user>.json -> /users/<user>/contributions
          const m = path.match(/^\/api\/github-contribs\/(.+?)\.json$/);
          if (m) return `/users/${m[1]}/contributions`;
          return path.replace(/^\/api\/github-contribs/, '/users');
        },
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
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
