<template>
  <div class="layout-demo">
    <x-row :gutter="8">
      <x-col :span="8"><div class="box">span 8</div></x-col>
      <x-col :span="8" :offset="8"><div class="box">offset 8</div></x-col>
    </x-row>

    <x-row :gutter="8">
      <x-col :span="6" :offset="6"><div class="box box--soft">offset 6</div></x-col>
      <x-col :span="4"><div class="box">span 4</div></x-col>
    </x-row>

    <x-row :gutter="8">
      <x-col :span="12" order="2"><div class="box">B · order 2</div></x-col>
      <x-col :span="12" order="1"><div class="box box--soft">A · order 1</div></x-col>
    </x-row>

    <x-row :gutter="8">
      <x-col width="40%"><div class="box">width 40%</div></x-col>
      <x-col width="60%"><div class="box box--soft">width 60%</div></x-col>
    </x-row>
  </div>
</template>

<style scoped>
.layout-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-size: 12px;
  color: var(--x-primary);
  background: var(--x-primary-light);
  border-radius: 6px;
}

.box--soft {
  color: var(--x-text-color-2);
  background: var(--x-background-3);
}
</style>
