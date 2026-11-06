<template>
  <div class="demo-col">
    <div class="demo-row">
      <vl-tag type="primary">主要</vl-tag>
      <vl-tag type="success">成功</vl-tag>
      <vl-tag type="warning">警告</vl-tag>
      <vl-tag type="danger">危险</vl-tag>
      <vl-tag>默认</vl-tag>
    </div>

    <div class="demo-row">
      <vl-tag type="primary" plain>主要</vl-tag>
      <vl-tag type="success" plain>成功</vl-tag>
      <vl-tag type="danger" plain>危险</vl-tag>
    </div>

    <div class="demo-row">
      <vl-tag type="primary" size="small">小号</vl-tag>
      <vl-tag type="primary">默认</vl-tag>
      <vl-tag type="primary" size="large">大号</vl-tag>
      <vl-tag type="primary" round>圆角</vl-tag>
      <vl-tag type="primary" mark>标记</vl-tag>
    </div>

    <div class="demo-row">
      <vl-tag type="primary" closeable @close="onClose">可关闭</vl-tag>
      <vl-tag color="#7c3aed">自定义色</vl-tag>
      <vl-tag color="rgba(59,130,246,.12)" text-color="#2563eb">浅底文字</vl-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Toast } from '@vela/mobile'

const onClose = () => Toast('已关闭')
</script>
