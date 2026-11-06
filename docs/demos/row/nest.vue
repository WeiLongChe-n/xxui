<template>
  <vl-row :gutter="8">
    <vl-col :span="16">
      <div class="outer">
        <span class="outer__label">左 · span 16</span>
        <vl-row :gutter="6">
          <vl-col :span="12"><div class="inner">内 12</div></vl-col>
          <vl-col :span="12"><div class="inner">内 12</div></vl-col>
        </vl-row>
      </div>
    </vl-col>
    <vl-col :span="8">
      <div class="outer">
        <span class="outer__label">右 · span 8</span>
        <div class="inner inner--full">自适应高度</div>
      </div>
    </vl-col>
  </vl-row>
</template>

<style scoped>
.outer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  padding: 10px;
  background: var(--vl-background-3);
  border-radius: 8px;
}

.outer__label {
  font-size: 12px;
  color: var(--vl-text-color-2);
}

.inner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  font-size: 11px;
  color: var(--vl-primary);
  background: var(--vl-primary-light);
  border-radius: 6px;
}

.inner--full {
  flex: 1;
  height: auto;
  min-height: 34px;
}
</style>
