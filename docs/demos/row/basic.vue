<template>
  <div class="layout-demo">
    <x-row>
      <x-col :span="24"><div class="box">span 24</div></x-col>
    </x-row>

    <x-row>
      <x-col :span="12"><div class="box">12</div></x-col>
      <x-col :span="12"><div class="box box--soft">12</div></x-col>
    </x-row>

    <x-row>
      <x-col v-for="n in 3" :key="n" :span="8"><div class="box">8</div></x-col>
    </x-row>

    <x-row>
      <x-col v-for="n in 4" :key="n" :span="6">
        <div :class="['box', { 'box--soft': n % 2 === 0 }]">6</div>
      </x-col>
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
