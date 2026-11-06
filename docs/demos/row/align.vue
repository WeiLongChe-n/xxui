<template>
  <div class="layout-demo">
    <x-row :gutter="8" justify="center">
      <x-col :span="6"><div class="box">居中</div></x-col>
      <x-col :span="6"><div class="box box--soft">居中</div></x-col>
    </x-row>

    <x-row :gutter="8" justify="space-between">
      <x-col :span="8"><div class="box">两端</div></x-col>
      <x-col :span="8"><div class="box box--soft">对齐</div></x-col>
    </x-row>

    <x-row :gutter="8" align="middle" class="tall">
      <x-col :span="8"><div class="box box--tall">高</div></x-col>
      <x-col :span="8"><div class="box">中</div></x-col>
      <x-col :span="8"><div class="box box--soft">中</div></x-col>
    </x-row>

    <x-row :gutter="8" align="bottom">
      <x-col :span="8"><div class="box box--tall">底</div></x-col>
      <x-col :span="8"><div class="box">部</div></x-col>
      <x-col :span="8"><div class="box box--soft">对齐</div></x-col>
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

.tall {
  min-height: 84px;
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

.box--tall {
  height: 68px;
}

.box--soft {
  color: var(--x-text-color-2);
  background: var(--x-background-3);
}
</style>
