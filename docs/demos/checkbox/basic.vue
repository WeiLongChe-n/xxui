<template>
  <div class="demo-col">
    <x-cell-group inset title="复选框组">
      <x-cell title="选择口味">
        <template #value>
          <span class="hint">{{ checked.length }} 项已选</span>
        </template>
      </x-cell>
      <div class="padding">
        <x-checkbox-group v-model="checked" :max="2">
          <x-checkbox v-for="item in flavors" :key="item" :name="item">{{ item }}</x-checkbox>
        </x-checkbox-group>
        <p class="demo-note">最多可选 2 项</p>
      </div>
    </x-cell-group>

    <x-cell-group inset title="纵向排列">
      <div class="padding">
        <x-checkbox-group v-model="checked2" direction="vertical">
          <x-checkbox name="a">已阅读《用户协议》</x-checkbox>
          <x-checkbox name="b">接收活动通知</x-checkbox>
          <x-checkbox name="c" disabled>已下架选项</x-checkbox>
        </x-checkbox-group>
      </div>
    </x-cell-group>

    <x-cell-group inset title="独立使用">
      <div class="padding">
        <x-checkbox v-model="single" shape="round">圆形复选框</x-checkbox>
      </div>
    </x-cell-group>
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
  color: var(--x-text-color-3);
}
</style>
