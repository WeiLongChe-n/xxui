import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

/** 包根目录：产物必须落在包内，否则发布出去的 dist 是空的 */
const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root,
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
      name: 'XXUI',
      formats: ['es', 'umd'],
      // 包不带 "type": "module"，所以 .js 即 CJS：
      // ESM 用 .mjs 显式声明，UMD 保持 .js 便于 CDN 的 script 标签直接加载
      fileName: (format) => (format === 'es' ? 'xxui.mjs' : 'xxui.umd.js'),
      cssFileName: 'xxui',
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
