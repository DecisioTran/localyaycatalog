import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { dynamicBase } from 'vite-plugin-dynamic-base'

process.env = {
  ...process.env,
  ...loadEnv(process.env.NODE_ENV ?? 'development', process.cwd()),
}
const rootpath = './src'

export default defineConfig({
  root: rootpath,
  base:
    process.env.NODE_ENV === 'production'
      ? 'window.yayheroMeta.viteDynamicBase'
      : '/',

  plugins: [
    react(),
    dynamicBase({
      publicPath: 'window.yayheroMeta.viteDynamicBase',
    }),
  ],

  resolve: {
    alias: [
      { find: '@src', replacement: path.resolve(__dirname, 'src') },
      // fix less import by: @import ~
      { find: /^~/, replacement: '' },
    ],
  },
  build: {
    manifest: true,
    emptyOutDir: true,
    outDir: path.resolve('../../assets', 'dist/hero'),
    assetsDir: '',
    rollupOptions: {
      input: {
        'main.tsx': path.resolve(__dirname, rootpath, 'main.tsx'),
      },
    },
  },
  server: {
    cors: true,
    strictPort: true,
    port: 3000,
    origin: `${process.env.VITE_SERVER_ORIGIN}`,
    hmr: {
      port: 3000,
      host: 'localhost',
      protocol: 'ws',
    },
  },
})
