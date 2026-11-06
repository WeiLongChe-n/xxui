<template>
  <div class="demo-col">
    <div class="demo-row">
      <vl-switch v-model="loading" />
      <span class="text">{{ loading ? '加载中' : '加载完成' }}</span>
    </div>

    <vl-skeleton :loading="loading" :rows="3" animated>
      <vl-cell-group inset>
        <vl-cell title="标题" value="内容" label="骨架屏结束后展示真实内容" />
        <vl-cell title="标题" value="内容" />
      </vl-cell-group>
    </vl-skeleton>

    <vl-skeleton :loading="true" avatar :rows="2" animated />

    <vl-skeleton :loading="true" avatar avatar-shape="square" :avatar-size="56" :rows="3" round />
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
  color: var(--vp-c-text-3);
}
</style>
