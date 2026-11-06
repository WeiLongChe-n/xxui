<template>
  <div class="layout-demo">
    <vl-row :gutter="8" justify="center">
      <vl-col :span="6"><div class="box">居中</div></vl-col>
      <vl-col :span="6"><div class="box box--soft">居中</div></vl-col>
    </vl-row>

    <vl-row :gutter="8" justify="space-between">
      <vl-col :span="8"><div class="box">两端</div></vl-col>
      <vl-col :span="8"><div class="box box--soft">对齐</div></vl-col>
    </vl-row>

    <vl-row :gutter="8" align="middle" class="tall">
      <vl-col :span="8"><div class="box box--tall">高</div></vl-col>
      <vl-col :span="8"><div class="box">中</div></vl-col>
      <vl-col :span="8"><div class="box box--soft">中</div></vl-col>
    </vl-row>

    <vl-row :gutter="8" align="bottom">
      <vl-col :span="8"><div class="box box--tall">底</div></vl-col>
      <vl-col :span="8"><div class="box">部</div></vl-col>
      <vl-col :span="8"><div class="box box--soft">对齐</div></vl-col>
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

.tall {
  min-height: 84px;
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

.box--tall {
  height: 68px;
}

.box--soft {
  color: var(--vl-text-color-2);
  background: var(--vl-background-3);
}
</style>
