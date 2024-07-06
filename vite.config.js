import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [
    preact({
      include: "**/**/*.js",
    }),
    cssInjectedByJsPlugin()
  ],
  build: {
    lib: {
      entry: './src/CookieBannerWidget.jsx',
      name: 'CookieBannerWidget',
      fileName: (format) => `cookie-banner-widget.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: [], 
      output: {
        globals: {
          preact: 'Preact'
        }
      }
    }
  },
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat'
    }
  },
  server: {
    watch: {
        usePolling: true
    }
}
});