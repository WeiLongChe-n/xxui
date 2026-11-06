<template>
  <div class="demo-col">
    <div class="row">
      <p class="demo-label">theme + brand：局部深色 + 紫罗兰</p>
      <x-config-provider theme="dark" brand="violet" class="panel">
        <x-cell-group inset>
          <x-cell title="订单状态" value="待发货" is-link />
          <x-cell title="收货地址" value="杭州市余杭区" is-link />
        </x-cell-group>
        <div class="actions">
          <x-button type="primary" size="small">主要按钮</x-button>
          <x-tag type="primary">标签</x-tag>
        </div>
      </x-config-provider>
    </div>

    <div class="row">
      <p class="demo-label">theme-vars：只覆盖个别变量</p>
      <x-config-provider :theme-vars="{ '--x-primary': '#ff5000', '--x-radius': '2px' }" class="panel panel--light">
        <x-cell-group inset>
          <x-cell title="品牌红 + 直角" value="themeVars" is-link />
        </x-cell-group>
        <div class="actions">
          <x-button type="primary" size="small">主要按钮</x-button>
          <x-button type="primary" size="small" plain>朴素按钮</x-button>
        </div>
      </x-config-provider>
    </div>
  </div>
</template>

<style scoped>
.demo-col {
  gap: 20px;
}

.row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-label {
  margin: 0;
  font-size: 12px;
  color: var(--x-text-color-3);
}

.panel {
  padding: 12px 0 16px;
  overflow: hidden;
  background: var(--x-background);
  border-radius: 12px;
}

.panel--light {
  border: 1px solid var(--x-border-color);
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 12px 16px 0;
}
</style>
