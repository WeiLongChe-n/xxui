<template>
  <div class="demo-col">
    <div class="demo-row">
      <x-badge :content="5" standalone />
      <x-badge :content="99" standalone />
      <x-badge :content="120" standalone />
      <x-badge dot standalone />
      <x-badge :content="0" standalone show-zero />
    </div>

    <div class="demo-row">
      <x-badge :content="3">
        <div class="box" />
      </x-badge>
      <x-badge :content="12" color="#16a34a">
        <div class="box" />
      </x-badge>
      <x-badge dot>
        <div class="box" />
      </x-badge>
    </div>
  </div>
</template>

<style scoped>
.box {
  width: 44px;
  height: 44px;
  background: var(--x-background-3);
  border-radius: 12px;
}
</style>
