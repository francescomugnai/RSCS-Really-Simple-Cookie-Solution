import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  server: {
    hmr: {
      overlay: false,
    },
  },
  build: {
    lib: {
      entry: './src/CookieBannerWidget.jsx',
      name: 'CookieBannerWidget',
      fileName: (format) => `cookie-banner-widget.${format}.js`,
      formats: ['umd', 'es']
    },
    rollupOptions: {
      external: ['preact'],
      output: {
        globals: {
          preact: 'preact'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'cookie-banner-style.css';
          return assetInfo.name;
        },
      }
    }
  },
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat'
    }
  }
});
