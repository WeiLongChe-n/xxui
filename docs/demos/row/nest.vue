<template>
  <x-row :gutter="8">
    <x-col :span="16">
      <div class="outer">
        <span class="outer__label">左 · span 16</span>
        <x-row :gutter="6">
          <x-col :span="12"><div class="inner">内 12</div></x-col>
          <x-col :span="12"><div class="inner">内 12</div></x-col>
        </x-row>
      </div>
    </x-col>
    <x-col :span="8">
      <div class="outer">
        <span class="outer__label">右 · span 8</span>
        <div class="inner inner--full">自适应高度</div>
      </div>
    </x-col>
  </x-row>
</template>

<style scoped>
.outer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  padding: 10px;
  background: var(--x-background-3);
  border-radius: 8px;
}

.outer__label {
  font-size: 12px;
  color: var(--x-text-color-2);
}

.inner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  font-size: 11px;
  color: var(--x-primary);
  background: var(--x-primary-light);
  border-radius: 6px;
}

.inner--full {
  flex: 1;
  height: auto;
  min-height: 34px;
}
</style>
