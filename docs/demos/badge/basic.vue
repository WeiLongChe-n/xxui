<template>
  <div class="demo-col">
    <div class="demo-row">
      <vl-badge :content="5" standalone />
      <vl-badge :content="99" standalone />
      <vl-badge :content="120" standalone />
      <vl-badge dot standalone />
      <vl-badge :content="0" standalone show-zero />
    </div>

    <div class="demo-row">
      <vl-badge :content="3">
        <div class="box" />
      </vl-badge>
      <vl-badge :content="12" color="#16a34a">
        <div class="box" />
      </vl-badge>
      <vl-badge dot>
        <div class="box" />
      </vl-badge>
    </div>
  </div>
</template>

<style scoped>
.box {
  width: 44px;
  height: 44px;
  background: var(--vl-background-3);
  border-radius: 12px;
}
</style>
