<template>
  <div class="demo-col">
    <div class="demo-row">
      <x-tag type="primary">主要</x-tag>
      <x-tag type="success">成功</x-tag>
      <x-tag type="warning">警告</x-tag>
      <x-tag type="danger">危险</x-tag>
      <x-tag>默认</x-tag>
    </div>

    <div class="demo-row">
      <x-tag type="primary" plain>主要</x-tag>
      <x-tag type="success" plain>成功</x-tag>
      <x-tag type="danger" plain>危险</x-tag>
    </div>

    <div class="demo-row">
      <x-tag type="primary" size="small">小号</x-tag>
      <x-tag type="primary">默认</x-tag>
      <x-tag type="primary" size="large">大号</x-tag>
      <x-tag type="primary" round>圆角</x-tag>
      <x-tag type="primary" mark>标记</x-tag>
    </div>

    <div class="demo-row">
      <x-tag type="primary" closeable @close="onClose">可关闭</x-tag>
      <x-tag color="#7c3aed">自定义色</x-tag>
      <x-tag color="rgba(59,130,246,.12)" text-color="#2563eb">浅底文字</x-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Toast } from '@xxui/mobile'

const onClose = () => Toast('已关闭')
</script>
