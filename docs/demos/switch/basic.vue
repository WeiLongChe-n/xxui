<template>
  <div class="demo-col">
    <x-cell-group inset title="基础用法">
      <x-cell title="开启通知">
        <template #value>
          <x-switch v-model="value1" />
        </template>
      </x-cell>
      <x-cell title="自定义尺寸（32px）">
        <template #value>
          <x-switch v-model="value2" size="32" />
        </template>
      </x-cell>
      <x-cell title="带文字">
        <template #value>
          <x-switch v-model="value3" active-text="开" inactive-text="关" />
        </template>
      </x-cell>
    </x-cell-group>

    <x-cell-group inset title="状态">
      <x-cell title="加载中">
        <template #value>
          <x-switch v-model="value4" loading />
        </template>
      </x-cell>
      <x-cell title="禁用">
        <template #value>
          <x-switch v-model="value5" disabled />
        </template>
      </x-cell>
      <x-cell title="自定义颜色">
        <template #value>
          <x-switch v-model="value6" active-color="#16a34a" inactive-color="#f59e0b" />
        </template>
      </x-cell>
      <x-cell title="自定义值">
        <template #value>
          <x-switch v-model="value7" active-value="on" inactive-value="off" />
        </template>
      </x-cell>
    </x-cell-group>

    <p class="demo-note">当前自定义值：{{ value7 }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value1 = ref(true)
const value2 = ref(false)
const value3 = ref(true)
const value4 = ref(true)
const value5 = ref(true)
const value6 = ref(true)
const value7 = ref<'on' | 'off'>('on')
</script>

<style scoped>
.demo-col {
  gap: 16px;
}
</style>
