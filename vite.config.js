import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        game1: './src/games/game1/index.html',
        game2: './src/games/game2/index.html', 
        game3: './src/games/game3/index.html'
      }
    }
  },
  server: {
    open: true
  }
})