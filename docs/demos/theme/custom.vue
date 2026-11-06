<script setup lang="ts">
const gradientVars = {
  '--vl-primary': 'linear-gradient(135deg, #ff8a3d, #ff5000)',
  '--vl-radius': '2px',
  '--vl-cell-font-size': '16px',
  '--vl-cell-padding': '14px 18px',
}

const warmVars = {
  '--vl-saturation': '96%',
  '--vl-hue': '28',
  '--vl-radius-lg': '20px',
}
</script>

<template>
  <div class="custom-theme">
    <vl-config-provider :theme-vars="gradientVars" class="custom-theme__card">
      <p class="custom-theme__caption">渐变主色 + 直角 + 更大字号</p>
      <vl-field label="手机号" placeholder="请输入手机号" />
      <div class="custom-theme__actions">
        <vl-button type="primary" block>立即预约</vl-button>
      </div>
    </vl-config-provider>

    <vl-config-provider :theme-vars="warmVars" class="custom-theme__card">
      <p class="custom-theme__caption">色相 28 + 大圆角</p>
      <vl-cell-group inset>
        <vl-cell title="积分余额" value="12,800" is-link />
        <vl-cell title="优惠券" value="3 张" is-link />
      </vl-cell-group>
      <div class="custom-theme__actions">
        <vl-button type="primary" block>去兑换</vl-button>
      </div>
    </vl-config-provider>
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
  background: var(--vl-background-2);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
}

.custom-theme__caption {
  margin: 0 16px 10px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.custom-theme__actions {
  padding: 14px 16px 0;
}
</style>
