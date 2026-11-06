<template>
  <div class="demo-col">
    <div class="demo-row">
      <x-switch v-model="loading" />
      <span class="text">{{ loading ? '加载中' : '加载完成' }}</span>
    </div>

    <x-skeleton :loading="loading" :rows="3" animated>
      <x-cell-group inset>
        <x-cell title="标题" value="内容" label="骨架屏结束后展示真实内容" />
        <x-cell title="标题" value="内容" />
      </x-cell-group>
    </x-skeleton>

    <x-skeleton :loading="true" avatar :rows="2" animated />

    <x-skeleton :loading="true" avatar avatar-shape="square" :avatar-size="56" :rows="3" round />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)
</script>

<style scoped>
.demo-col {
  gap: 16px;
}

.text {
  font-size: 12px;
  color: var(--x-text-color-3);
}
</style>
