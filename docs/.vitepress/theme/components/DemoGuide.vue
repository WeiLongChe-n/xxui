<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { stageHasDemos, stageWide } from '../utils/demo-stage'

const route = useRoute()

/**
 * 页面级引导：只在本页存在示例、且宽屏启用右侧预览盒时出现一次。
 *
 * 之前每个示例卡片里都放一条「交互演示在右侧预览框中，点击本卡片可切换」，
 * 一页重复六七次，把卡片正文挤成了空占位。规则讲一次就够。
 */
const visible = computed(
  () => stageWide.value && stageHasDemos.value && route.path.startsWith('/components/'),
)
</script>

<template>
  <aside v-if="visible" class="demo-guide">
    <span class="demo-guide__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="15" height="15">
        <rect
          x="7"
          y="2.5"
          width="10"
          height="19"
          rx="2.5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
        />
        <path d="M10.5 5.5h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      </svg>
    </span>
    <p class="demo-guide__text">
      交互演示统一收在右侧预览框中，滚动页面会自动切换；点击左侧示例卡片可立即切换过去。
    </p>
  </aside>
</template>

<style scoped>
.demo-guide {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 10px 14px;
  margin: 0 0 24px;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
}

.demo-guide__icon {
  display: inline-flex;
  flex: none;
  align-items: center;
  margin-top: 1px;
  color: var(--vp-c-brand-1);
}

.demo-guide__text {
  margin: 0;
}
</style>
