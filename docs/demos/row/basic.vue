<template>
  <div class="layout-demo">
    <vl-row>
      <vl-col :span="24"><div class="box">span 24</div></vl-col>
    </vl-row>

    <vl-row>
      <vl-col :span="12"><div class="box">12</div></vl-col>
      <vl-col :span="12"><div class="box box--soft">12</div></vl-col>
    </vl-row>

    <vl-row>
      <vl-col v-for="n in 3" :key="n" :span="8"><div class="box">8</div></vl-col>
    </vl-row>

    <vl-row>
      <vl-col v-for="n in 4" :key="n" :span="6">
        <div :class="['box', { 'box--soft': n % 2 === 0 }]">6</div>
      </vl-col>
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
