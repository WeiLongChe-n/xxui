<template>
  <div class="demo-col">
    <vl-cell-group inset title="复选框组">
      <vl-cell title="选择口味">
        <template #value>
          <span class="hint">{{ checked.length }} 项已选</span>
        </template>
      </vl-cell>
      <div class="padding">
        <vl-checkbox-group v-model="checked" :max="2">
          <vl-checkbox v-for="item in flavors" :key="item" :name="item">{{ item }}</vl-checkbox>
        </vl-checkbox-group>
        <p class="demo-note">最多可选 2 项</p>
      </div>
    </vl-cell-group>

    <vl-cell-group inset title="纵向排列">
      <div class="padding">
        <vl-checkbox-group v-model="checked2" direction="vertical">
          <vl-checkbox name="a">已阅读《用户协议》</vl-checkbox>
          <vl-checkbox name="b">接收活动通知</vl-checkbox>
          <vl-checkbox name="c" disabled>已下架选项</vl-checkbox>
        </vl-checkbox-group>
      </div>
    </vl-cell-group>

    <vl-cell-group inset title="独立使用">
      <div class="padding">
        <vl-checkbox v-model="single" shape="round">圆形复选框</vl-checkbox>
      </div>
    </vl-cell-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const flavors = ['原味', '香草', '抹茶', '巧克力', '草莓']
const checked = ref<(string | number)[]>(['原味', '抹茶'])
const checked2 = ref<(string | number)[]>(['a'])
const single = ref(true)
</script>

<style scoped>
.demo-col {
  gap: 16px;
}

.padding {
  padding: 12px 16px 16px;
}

.hint {
  font-size: 12px;
  color: var(--vl-text-color-3);
}
</style>
