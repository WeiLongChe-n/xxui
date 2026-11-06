<template>
  <div class="demo-col">
    <div class="row">
      <p class="demo-label">theme + brand：局部深色 + 紫罗兰</p>
      <vl-config-provider theme="dark" brand="violet" class="panel">
        <vl-cell-group inset>
          <vl-cell title="订单状态" value="待发货" is-link />
          <vl-cell title="收货地址" value="杭州市余杭区" is-link />
        </vl-cell-group>
        <div class="actions">
          <vl-button type="primary" size="small">主要按钮</vl-button>
          <vl-tag type="primary">标签</vl-tag>
        </div>
      </vl-config-provider>
    </div>

    <div class="row">
      <p class="demo-label">theme-vars：只覆盖个别变量</p>
      <vl-config-provider :theme-vars="{ '--vl-primary': '#ff5000', '--vl-radius': '2px' }" class="panel panel--light">
        <vl-cell-group inset>
          <vl-cell title="品牌红 + 直角" value="themeVars" is-link />
        </vl-cell-group>
        <div class="actions">
          <vl-button type="primary" size="small">主要按钮</vl-button>
          <vl-button type="primary" size="small" plain>朴素按钮</vl-button>
        </div>
      </vl-config-provider>
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
  color: var(--vp-c-text-3);
}

.panel {
  padding: 12px 0 16px;
  overflow: hidden;
  background: var(--vl-background);
  border-radius: 12px;
}

.panel--light {
  border: 1px solid var(--vp-c-divider);
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 12px 16px 0;
}
</style>
