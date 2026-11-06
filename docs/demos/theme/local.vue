<script setup lang="ts">
const panels = [
  { theme: 'light' as const, brand: 'ocean' as const, title: '浅色 · 海松青' },
  { theme: 'dark' as const, brand: 'violet' as const, title: '深色 · 紫罗兰' },
]
</script>

<template>
  <div class="local-theme">
    <vl-config-provider
      v-for="panel in panels"
      :key="panel.title"
      :theme="panel.theme"
      :brand="panel.brand"
      class="local-theme__panel"
    >
      <p class="local-theme__title">{{ panel.title }}</p>
      <vl-cell-group inset>
        <vl-cell title="订单编号" value="VL20261105" />
        <vl-cell title="配送方式" value="顺丰速运" is-link />
      </vl-cell-group>
      <div class="local-theme__actions">
        <vl-button type="primary" size="small">确认收货</vl-button>
        <vl-button size="small">查看物流</vl-button>
      </div>
      <vl-notice-bar mode="none" text="局部主题只影响该容器内部的组件" />
    </vl-config-provider>
  </div>
</template>

<style scoped>
.local-theme {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.local-theme__panel {
  padding: 12px 0 16px;
  overflow: hidden;
  background: var(--vl-background);
  border-radius: 14px;
}

.local-theme__title {
  margin: 4px 16px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vl-text-color-2);
}

.local-theme__actions {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
}
</style>
