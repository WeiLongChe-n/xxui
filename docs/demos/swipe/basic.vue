<template>
  <div class="demo-col">
    <vl-swipe :autoplay="3000" height="160">
      <vl-swipe-item v-for="item in slides" :key="item.title">
        <div class="slide" :style="{ background: item.background }">
          <p class="slide__title">{{ item.title }}</p>
          <p class="slide__desc">{{ item.desc }}</p>
        </div>
      </vl-swipe-item>
    </vl-swipe>

    <vl-swipe ref="swipeRef" :autoplay="false" height="120" indicator-color="#3b82f6">
      <vl-swipe-item v-for="i in 3" :key="i">
        <div class="slide slide--plain">
          <p class="slide__title">第 {{ i }} 屏（手动滑动）</p>
        </div>
      </vl-swipe-item>
    </vl-swipe>

    <div class="demo-row">
      <vl-button size="small" @click="swipeRef?.prev()">上一张</vl-button>
      <vl-button size="small" @click="swipeRef?.next()">下一张</vl-button>
      <vl-button size="small" type="primary" @click="swipeRef?.swipeTo(2)">跳到第 3 张</vl-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const swipeRef = ref<{ next: () => void; prev: () => void; swipeTo: (index: number) => void }>()

const slides = [
  { title: '多主题', desc: '6 套配色 × 明暗模式', background: 'linear-gradient(135deg,#3b82f6,#6366f1)' },
  { title: 'TypeScript', desc: '全量类型定义', background: 'linear-gradient(135deg,#0ea5e9,#22d3ee)' },
  { title: '移动端优先', desc: '安全区与手势适配', background: 'linear-gradient(135deg,#16a34a,#4ade80)' },
]
</script>

<style scoped>
.demo-col {
  gap: 16px;
}

.slide {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 0 24px;
  color: #fff;
}

.slide--plain {
  color: var(--vl-text-color);
  background: var(--vl-background-3);
}

.slide__title {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 600;
}

.slide__desc {
  margin: 0;
  font-size: 12px;
  opacity: 0.85;
}

:deep(.vl-swipe) {
  overflow: hidden;
  border-radius: 12px;
}
</style>
