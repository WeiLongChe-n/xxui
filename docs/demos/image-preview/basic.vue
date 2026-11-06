<template>
  <div class="preview-demo">
    <div class="preview-demo__grid">
      <button
        v-for="(image, index) in images"
        :key="index"
        type="button"
        class="preview-demo__item"
        @click="open(index)"
      >
        <img :src="image" alt="示例图片" />
      </button>
    </div>
    <p class="preview-demo__tip">点击任意图片打开预览，可左右滑动切换。</p>
  </div>
</template>

<script setup lang="ts">
import { ImagePreview } from '@xxui/mobile'

const palettes = [
  ['#6366f1', '#a855f7'],
  ['#0ea5e9', '#22d3ee'],
  ['#10b981', '#84cc16'],
  ['#f59e0b', '#ef4444'],
  ['#ec4899', '#8b5cf6'],
]

const makeImage = (index: number) => {
  const [from, to] = palettes[index]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1080"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="720" height="1080" fill="url(#g)"/><text x="360" y="580" font-size="140" font-weight="700" fill="rgba(255,255,255,0.92)" text-anchor="middle" font-family="-apple-system,sans-serif">${index + 1}</text><text x="360" y="660" font-size="34" fill="rgba(255,255,255,0.75)" text-anchor="middle" font-family="-apple-system,sans-serif">XXUI Preview</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const images = palettes.map((_, index) => makeImage(index))

const open = (index: number) => {
  ImagePreview({ images, startPosition: index })
}
</script>

<style scoped>
.preview-demo {
  width: 100%;
}

.preview-demo__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.preview-demo__item {
  padding: 0;
  overflow: hidden;
  cursor: zoom-in;
  background: var(--x-background-3);
  border: 0;
  border-radius: 8px;
  aspect-ratio: 3 / 4;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.preview-demo__tip {
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--x-text-color-3);
}
</style>
