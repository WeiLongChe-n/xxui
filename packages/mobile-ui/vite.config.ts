import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.vue'],
      outDir: 'dist/types',
      tsconfigPath: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
      cleanVueFileName: true,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    target: 'es2018',
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'VelaUI',
      formats: ['es', 'umd'],
      fileName: (format) => `vela-ui.${format}.js`,
      cssFileName: 'vela-ui',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        exports: 'named',
      },
    },
  },
})
