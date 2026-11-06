<template>
  <div class="layout-demo">
    <vl-row :gutter="8">
      <vl-col :span="8"><div class="box">span 8</div></vl-col>
      <vl-col :span="8" :offset="8"><div class="box">offset 8</div></vl-col>
    </vl-row>

    <vl-row :gutter="8">
      <vl-col :span="6" :offset="6"><div class="box box--soft">offset 6</div></vl-col>
      <vl-col :span="4"><div class="box">span 4</div></vl-col>
    </vl-row>

    <vl-row :gutter="8">
      <vl-col :span="12" order="2"><div class="box">B · order 2</div></vl-col>
      <vl-col :span="12" order="1"><div class="box box--soft">A · order 1</div></vl-col>
    </vl-row>

    <vl-row :gutter="8">
      <vl-col width="40%"><div class="box">width 40%</div></vl-col>
      <vl-col width="60%"><div class="box box--soft">width 60%</div></vl-col>
    </vl-row>
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
  color: var(--vl-primary);
  background: var(--vl-primary-light);
  border-radius: 6px;
}

.box--soft {
  color: var(--vl-text-color-2);
  background: var(--vl-background-3);
}
</style>
