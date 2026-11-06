<template>
  <div class="demo-col">
    <div class="demo-row loading-row">
      <vl-loading />
      <vl-loading type="spinner" />
      <vl-loading type="dots" />
    </div>

    <div class="demo-row loading-row">
      <vl-loading size="14" />
      <vl-loading size="22" />
      <vl-loading size="32" color="#16a34a" />
      <vl-loading size="32" color="#8b4ef5" type="dots" />
    </div>

    <div class="demo-row loading-row">
      <vl-loading text="加载中..." />
      <vl-loading type="spinner" text="玩命加载" size="18" />
      <vl-loading vertical text="纵向排列" />
    </div>

    <div class="demo-row">
      <vl-button type="primary" loading loading-text="提交中">提交订单</vl-button>
      <vl-button loading>默认按钮</vl-button>
    </div>
  </div>
</template>

<style scoped>
.demo-col {
  gap: 20px;
}

.loading-row {
  gap: 24px;
  min-height: 40px;
}
</style>
