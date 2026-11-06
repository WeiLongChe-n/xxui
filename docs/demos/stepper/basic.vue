<template>
  <div class="demo-col">
    <x-cell-group inset title="基础用法">
      <x-cell title="数量" :label="`当前值：${value1}`">
        <template #value>
          <x-stepper v-model="value1" :min="0" :max="10" />
        </template>
      </x-cell>
      <x-cell title="小数步长 0.5">
        <template #value>
          <x-stepper v-model="value2" :min="0" :max="10" :step="0.5" :decimal-length="1" />
        </template>
      </x-cell>
      <x-cell title="限制输入">
        <template #value>
          <x-stepper v-model="value3" :min="1" :max="99" integer disable-input />
        </template>
      </x-cell>
    </x-cell-group>

    <x-cell-group inset title="状态与尺寸">
      <x-cell title="禁用">
        <template #value>
          <x-stepper v-model="value4" disabled />
        </template>
      </x-cell>
      <x-cell title="大尺寸">
        <template #value>
          <x-stepper v-model="value5" :button-size="34" input-width="44" />
        </template>
      </x-cell>
    </x-cell-group>

    <x-cell-group inset title="拦截变更">
      <x-cell title="不能少于 3" :label="'beforeChange 可拦截非法值'">
        <template #value>
          <x-stepper v-model="value6" :min="0" :before-change="beforeChange" />
        </template>
      </x-cell>
    </x-cell-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Toast } from 'xxui-mobile'

const value1 = ref(1)
const value2 = ref(1.5)
const value3 = ref(5)
const value4 = ref(2)
const value5 = ref(1)
const value6 = ref(3)

const beforeChange = (value: number) => {
  if (value < 3) {
    Toast('最少购买 3 件')
    return false
  }
  return true
}
</script>

<style scoped>
.demo-col {
  gap: 16px;
}
</style>
