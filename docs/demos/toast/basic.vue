<template>
  <div class="demo-col">
    <div class="demo-row">
      <vl-button size="small" @click="showText">文字提示</vl-button>
      <vl-button size="small" type="success" @click="showSuccess">成功</vl-button>
      <vl-button size="small" type="danger" @click="showFail">失败</vl-button>
      <vl-button size="small" type="primary" @click="showLoading">加载中</vl-button>
    </div>

    <div class="demo-row">
      <vl-button size="small" @click="showTop">顶部显示</vl-button>
      <vl-button size="small" @click="showBottom">底部显示</vl-button>
      <vl-button size="small" @click="showLong">较长文案</vl-button>
      <vl-button size="small" @click="showMask">带遮罩</vl-button>
    </div>

    <div class="demo-row">
      <vl-button size="small" @click="showCustomIcon">自定义图标</vl-button>
      <vl-button size="small" @click="showComponent">组件式调用</vl-button>
      <vl-button size="small" @click="clearToast">手动关闭</vl-button>
    </div>

    <vl-toast v-model:show="visible" message="组件式提示" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Toast } from '@vela/mobile'

const visible = ref(false)

const showText = () => Toast('这是一条提示')
const showSuccess = () => Toast.success('保存成功')
const showFail = () => Toast.fail('操作失败，请重试')
const showLoading = () => {
  Toast.loading({ message: '加载中...', duration: 0 })
  setTimeout(() => Toast.clear(), 1500)
}
const showTop = () => Toast({ message: '顶部提示', position: 'top' })
const showBottom = () => Toast({ message: '底部提示', position: 'bottom' })
const showLong = () => Toast('这是一段比较长的提示文案，用于验证多行换行效果')
const showMask = () => Toast({ message: '带遮罩的提示', mask: true, forbidClick: true, duration: 1200 })
const showCustomIcon = () => Toast({ message: '已收藏', icon: 'like', duration: 1200 })
const showComponent = () => (visible.value = true)
const clearToast = () => Toast.clear()
</script>

<style scoped>
.demo-col {
  gap: 12px;
}
</style>
