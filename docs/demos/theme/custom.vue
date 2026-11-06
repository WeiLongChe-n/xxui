<script setup lang="ts">
const gradientVars = {
  '--x-primary': 'linear-gradient(135deg, #ff8a3d, #ff5000)',
  '--x-radius': '2px',
  '--x-cell-font-size': '16px',
  '--x-cell-padding': '14px 18px',
}

const warmVars = {
  '--x-saturation': '96%',
  '--x-hue': '28',
  '--x-radius-lg': '20px',
}
</script>

<template>
  <div class="custom-theme">
    <x-config-provider :theme-vars="gradientVars" class="custom-theme__card">
      <p class="custom-theme__caption">渐变主色 + 直角 + 更大字号</p>
      <x-field label="手机号" placeholder="请输入手机号" />
      <div class="custom-theme__actions">
        <x-button type="primary" block>立即预约</x-button>
      </div>
    </x-config-provider>

    <x-config-provider :theme-vars="warmVars" class="custom-theme__card">
      <p class="custom-theme__caption">色相 28 + 大圆角</p>
      <x-cell-group inset>
        <x-cell title="积分余额" value="12,800" is-link />
        <x-cell title="优惠券" value="3 张" is-link />
      </x-cell-group>
      <div class="custom-theme__actions">
        <x-button type="primary" block>去兑换</x-button>
      </div>
    </x-config-provider>
  </div>
</template>

<style scoped>
.custom-theme {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.custom-theme__card {
  padding: 12px 0 16px;
  overflow: hidden;
  background: var(--x-background-2);
  border: 1px solid var(--x-border-color);
  border-radius: 14px;
}

.custom-theme__caption {
  margin: 0 16px 10px;
  font-size: 12px;
  color: var(--x-text-color-3);
}

.custom-theme__actions {
  padding: 14px 16px 0;
}
</style>
