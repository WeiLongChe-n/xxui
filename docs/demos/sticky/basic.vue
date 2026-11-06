<template>
  <div ref="host" class="scroll-host">
    <div class="scroll-host__head">向下滚动查看吸顶效果</div>

    <x-sticky :container="host" :offset-top="0">
      <div class="sticky-bar">
        <x-tabs v-model="active" :sticky="false" @change="() => {}">
          <x-tab name="a" title="推荐" />
          <x-tab name="b" title="关注" />
          <x-tab name="c" title="附近" />
        </x-tabs>
      </div>
    </x-sticky>

    <div class="scroll-host__list">
      <x-cell v-for="i in 16" :key="i" :title="`列表项 ${i}`" :value="`第 ${i} 行`" />
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
  background: var(--x-background-2);
  border: 1px solid var(--x-border-color);
  border-radius: 12px;
}

.scroll-host__head {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  font-size: 12px;
  color: var(--x-text-color-3);
  background: var(--x-background-3);
}

.sticky-bar {
  background: var(--x-background-2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}
</style>
