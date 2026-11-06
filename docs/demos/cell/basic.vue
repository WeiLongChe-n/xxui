<template>
  <div class="demo-col">
    <x-cell-group inset title="基础用法">
      <x-cell title="单元格" value="内容" />
      <x-cell title="单元格" value="内容" label="描述信息" />
      <x-cell title="单元格" value="内容" is-link />
      <x-cell title="单元格" is-link>
        <template #value>
          <x-tag type="primary" size="small">自定义</x-tag>
        </template>
      </x-cell>
    </x-cell-group>

    <x-cell-group inset title="图标与必填">
      <x-cell title="我的订单" icon="cart" is-link />
      <x-cell title="收货地址" icon="location" is-link value="3 个地址" />
      <x-cell title="手机号" icon="phone" required value="138****8888" />
      <x-cell title="大号单元格" icon="gift" size="large" label="size=large 更适合重点信息" is-link />
    </x-cell-group>

    <x-cell-group inset title="无边框">
      <x-cell title="不显示分割线" value="border=false" :border="false" />
      <x-cell title="可点击" value="clickable" clickable @click="onClick" />
    </x-cell-group>
  </div>
</template>

<script setup lang="ts">
import { Toast } from 'xxui-mobile'

const onClick = () => Toast('点击了单元格')
</script>
