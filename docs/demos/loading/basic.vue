<template>
  <div class="demo-col">
    <div class="demo-row loading-row">
      <x-loading />
      <x-loading type="spinner" />
      <x-loading type="dots" />
    </div>

    <div class="demo-row loading-row">
      <x-loading size="14" />
      <x-loading size="22" />
      <x-loading size="32" color="#16a34a" />
      <x-loading size="32" color="#8b4ef5" type="dots" />
    </div>

    <div class="demo-row loading-row">
      <x-loading text="加载中..." />
      <x-loading type="spinner" text="玩命加载" size="18" />
      <x-loading vertical text="纵向排列" />
    </div>

    <div class="demo-row">
      <x-button type="primary" loading loading-text="提交中">提交订单</x-button>
      <x-button loading>默认按钮</x-button>
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
