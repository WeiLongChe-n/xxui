<template>
  <div class="demo-col">
    <div class="host">
      <x-pull-refresh v-model="loading" success-text="刷新成功" @refresh="onRefresh">
        <div class="content">
          <p class="content__hint">在触屏设备（或浏览器移动端调试）中下拉即可触发刷新</p>
          <x-cell v-for="i in 5" :key="i" :title="`数据 ${i}`" :value="`第 ${refreshCount} 次刷新`" />
        </div>
      </x-pull-refresh>
    </div>

    <div class="demo-row">
      <x-button size="small" @click="simulate">模拟一次刷新</x-button>
      <span class="hint">已刷新 {{ refreshCount }} 次</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const refreshCount = ref(0)

const onRefresh = () => {
  setTimeout(() => {
    loading.value = false
    refreshCount.value += 1
  }, 900)
}

const simulate = () => {
  if (loading.value) return
  loading.value = true
  onRefresh()
}
</script>

<style scoped>
.demo-col {
  gap: 12px;
}

.host {
  overflow: hidden;
  background: var(--x-background-2);
  border: 1px solid var(--x-border-color);
  border-radius: 12px;
}

.content {
  min-height: 180px;
  background: var(--x-background);
}

.content__hint {
  padding: 16px;
  margin: 0;
  font-size: 12px;
  color: var(--x-text-color-3);
  text-align: center;
}

.hint {
  font-size: 12px;
  color: var(--x-text-color-3);
}
</style>
