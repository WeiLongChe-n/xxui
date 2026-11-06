<template>
  <div class="demo-col">
    <vl-cell-group inset title="基础用法">
      <vl-cell title="单元格" value="内容" />
      <vl-cell title="单元格" value="内容" label="描述信息" />
      <vl-cell title="单元格" value="内容" is-link />
      <vl-cell title="单元格" is-link>
        <template #value>
          <vl-tag type="primary" size="small">自定义</vl-tag>
        </template>
      </vl-cell>
    </vl-cell-group>

    <vl-cell-group inset title="图标与必填">
      <vl-cell title="我的订单" icon="cart" is-link />
      <vl-cell title="收货地址" icon="location" is-link value="3 个地址" />
      <vl-cell title="手机号" icon="phone" required value="138****8888" />
      <vl-cell title="大号单元格" icon="gift" size="large" label="size=large 更适合重点信息" is-link />
    </vl-cell-group>

    <vl-cell-group inset title="无边框">
      <vl-cell title="不显示分割线" value="border=false" :border="false" />
      <vl-cell title="可点击" value="clickable" clickable @click="onClick" />
    </vl-cell-group>
  </div>
</template>

<script setup lang="ts">
import { Toast } from '@vela/mobile'

const onClick = () => Toast('点击了单元格')
</script>
