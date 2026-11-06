<template>
  <div ref="host" class="scroll-host">
    <div class="scroll-host__head">向下滚动查看吸顶效果</div>

    <vl-sticky :container="host" :offset-top="0">
      <div class="sticky-bar">
        <vl-tabs v-model="active" :sticky="false" @change="() => {}">
          <vl-tab name="a" title="推荐" />
          <vl-tab name="b" title="关注" />
          <vl-tab name="c" title="附近" />
        </vl-tabs>
      </div>
    </vl-sticky>

    <div class="scroll-host__list">
      <vl-cell v-for="i in 16" :key="i" :title="`列表项 ${i}`" :value="`第 ${i} 行`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const host = ref<HTMLElement>()
const active = ref('a')
</script>

<style scoped>
.scroll-host {
  height: 320px;
  overflow-y: auto;
  background: var(--vl-background-2);
  border: 1px solid var(--vl-border-color);
  border-radius: 12px;
}

.scroll-host__head {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  font-size: 12px;
  color: var(--vl-text-color-3);
  background: var(--vl-background-3);
}

.sticky-bar {
  background: var(--vl-background-2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}
</style>
