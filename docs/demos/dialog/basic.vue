<template>
  <div class="demo-col">
    <div class="demo-row">
      <vl-button size="small" type="primary" @click="onConfirm">确认对话框</vl-button>
      <vl-button size="small" @click="onAlert">提示对话框</vl-button>
      <vl-button size="small" @click="onRound">圆角按钮</vl-button>
    </div>

    <div class="demo-row">
      <vl-button size="small" @click="onAsync">异步关闭</vl-button>
      <vl-button size="small" @click="onComponent">组件式调用</vl-button>
      <vl-button size="small" @click="onCustom">自定义内容</vl-button>
    </div>

    <vl-dialog
      v-model:show="visible"
      title="组件式对话框"
      message="通过 v-model:show 控制显隐，适合需要嵌入表单或复杂内容的场景。"
      show-cancel-button
      @confirm="onComponentConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, Toast } from '@vela/mobile'

const visible = ref(false)

const onConfirm = async () => {
  const confirmed = await Dialog.confirm({
    title: '确认删除',
    message: '删除后不可恢复，确定要删除这条记录吗？',
  })
  Toast(confirmed ? '已删除' : '已取消')
}

const onAlert = () => {
  Dialog.alert({ title: '提示', message: '这是一条仅展示确认按钮的提示。' })
}

const onRound = async () => {
  const confirmed = await Dialog.confirm({
    title: '开通会员',
    message: '首月仅需 ¥9.9，随时可取消。',
    theme: 'round-button',
    confirmButtonText: '立即开通',
  })
  Toast(confirmed ? '开通成功' : '再看看')
}

const onAsync = () => {
  Dialog.confirm({
    title: '提交订单',
    message: '点击确认后按钮会进入加载状态，1.5 秒后关闭。',
    beforeClose: (action) =>
      new Promise((resolve) => {
        if (action !== 'confirm') return resolve(true)
        setTimeout(() => {
          Toast.success('提交成功')
          resolve(true)
        }, 1500)
      }),
  })
}

const onComponent = () => (visible.value = true)
const onComponentConfirm = () => Toast('组件式确认')

const onCustom = () => {
  Dialog({
    title: '选择操作',
    message: '对话框支持插槽，但函数式调用更适合纯文本场景，复杂内容建议使用组件。',
    showCancelButton: true,
    confirmButtonColor: '#16a34a',
  })
}
</script>

<style scoped>
.demo-col {
  gap: 12px;
}
</style>
