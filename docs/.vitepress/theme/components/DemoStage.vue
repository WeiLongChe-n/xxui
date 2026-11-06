<script setup lang="ts">
import MobilePreview from './MobilePreview.vue'
import { stageActiveItem, stageWide } from '../utils/demo-stage'
</script>

<template>
  <div v-if="stageWide && stageActiveItem" class="stage">
    <div class="stage__head">
      <span class="stage__dot" aria-hidden="true" />
      <span class="stage__label">实时预览</span>
      <span class="stage__title">{{ stageActiveItem.title || '当前示例' }}</span>
    </div>

    <!-- 全页只此一个沙箱，示例内容由各 DemoBlock Teleport 进来 -->
    <MobilePreview
      stage
      :padding="stageActiveItem.padding"
      :background="stageActiveItem.background"
    />
  </div>
</template>

<style scoped>
.stage {
  position: relative;
  padding: 14px 12px 16px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  box-shadow: 0 12px 32px rgba(16, 18, 26, 0.06);
}

.stage__head {
  display: flex;
  gap: 7px;
  align-items: center;
  padding: 0 4px 10px;
  font-size: 12px;
}

.stage__dot {
  position: relative;
  width: 7px;
  height: 7px;
  background: var(--vp-c-brand-1);
  border-radius: 50%;
}

.stage__dot::after {
  position: absolute;
  inset: -3px;
  content: '';
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 50%;
  opacity: 0.35;
  animation: stage-pulse 2s ease-out infinite;
}

@keyframes stage-pulse {
  0% {
    opacity: 0.5;
    transform: scale(0.7);
  }

  70%,
  100% {
    opacity: 0;
    transform: scale(1.35);
  }
}

.stage__label {
  color: var(--vp-c-text-3);
}

.stage__title {
  overflow: hidden;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (min-width: 1280px) {
  /* 固定在右侧作为独立一列，滚动时始终可见 */
  .stage {
    position: fixed;
    top: calc(var(--vp-nav-height) + 20px);
    right: 20px;
    z-index: 25;
    width: clamp(320px, 27vw, 352px);
    max-height: calc(100vh - var(--vp-nav-height) - 40px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .stage__dot::after {
    animation: none;
  }
}
</style>
