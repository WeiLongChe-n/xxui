<template>
  <div class="demo-col">
    <div class="block">
      <vl-empty description="购物车还是空的">
        <vl-button type="primary" size="small" @click="onGo">去逛逛</vl-button>
      </vl-empty>
    </div>

    <div class="demo-grid">
      <div class="block">
        <vl-empty image="search" description="没有找到相关商品" />
      </div>
      <div class="block">
        <vl-empty image="network" description="网络开小差了" />
      </div>
      <div class="block">
        <vl-empty image="error" description="加载失败，请重试" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Toast } from '@vela/mobile'

const onGo = () => Toast('跳转商品列表')
</script>

<style scoped>
.demo-col {
  gap: 16px;
}

.block {
  overflow: hidden;
  background: var(--vl-background-2);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
}
</style>
