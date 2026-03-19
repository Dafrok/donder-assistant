import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// 获取 git commit hash（短版本）
let gitHash = 'unknown';
try {
  gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
} catch (e) {
  console.warn('未能获取 git hash');
}

// 获取构建时间
const buildTime = new Date().toISOString();

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  base: process.env.GITHUB_ACTIONS ? '/taiko-rating-app/' : '/',
  resolve: {
    alias: {}
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'esnext',
    minify: 'terser',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.py')) {
            return 'assets/py/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false,
    headers: {
      // Pyodide 需要这些 headers
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },
  define: {
    'process.env.NODE_ENV': '"development"',
    global: 'globalThis',
    '__BUILD_TIME__': JSON.stringify(buildTime),
    '__GIT_HASH__': JSON.stringify(gitHash)
  }
});
