<template>
  <div class="demo-col">
    <div class="demo-row">
      <x-button size="small" type="primary" @click="show1 = true">基础面板</x-button>
      <x-button size="small" @click="show2 = true">带标题描述</x-button>
      <x-button size="small" @click="show3 = true">带间距</x-button>
    </div>

    <x-action-sheet
      v-model:show="show1"
      :actions="actions1"
      @select="onSelect"
    />

    <x-action-sheet
      v-model:show="show2"
      title="选择支付方式"
      description="请选择本次支付使用的渠道"
      :actions="actions2"
      @select="onSelect"
    />

    <x-action-sheet
      v-model:show="show3"
      :actions="actions3"
      :gap="12"
      @select="onSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Toast, type ActionSheetAction } from '@xxui/mobile'

const show1 = ref(false)
const show2 = ref(false)
const show3 = ref(false)

const actions1: ActionSheetAction[] = [
  { name: '拍照' },
  { name: '从相册选择' },
  { name: '扫描二维码' },
]

const actions2: ActionSheetAction[] = [
  { name: '微信支付', subname: '推荐使用', icon: 'service' },
  { name: '支付宝', icon: 'qr' },
  { name: '银行卡', subname: '余额不足', disabled: true, icon: 'tag' },
]

const actions3: ActionSheetAction[] = [
  { name: '编辑', icon: 'edit' },
  { name: '分享', icon: 'share' },
  { name: '删除', icon: 'delete', color: '#ef4444' },
]

const onSelect = (action: ActionSheetAction) => Toast(`选择了：${action.name}`)
</script>

<style scoped>
.demo-col {
  gap: 12px;
}
</style>
