<template>
  <div class="demo-col">
    <div class="nav-host">
      <vl-nav-bar title="页面标题" @click-left="onBack" />
      <p class="demo-note">默认带返回箭头，点击触发 click-left</p>
    </div>

    <div class="nav-host">
      <vl-nav-bar title="带文字按钮" left-text="返回" right-text="编辑" @click-right="onEdit">
        <template #right>
          <span class="nav-action">编辑</span>
        </template>
      </vl-nav-bar>
      <p class="demo-note">使用 left-text / right-text 或插槽自定义两侧</p>
    </div>

    <div class="nav-host">
      <vl-nav-bar :left-arrow="false" title="无返回箭头">
        <template #right>
          <vl-icon name="setting" size="18" />
        </template>
      </vl-nav-bar>
      <p class="demo-note">left-arrow=false 适合首页等无返回场景</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Toast } from '@vela/mobile'

const onBack = () => Toast('返回上一页')
const onEdit = () => Toast('编辑')
</script>

<style scoped>
.demo-col {
  gap: 18px;
}

.nav-host {
  overflow: hidden;
  border: 1px solid var(--vl-border-color);
  border-radius: 12px;
}

.nav-host .demo-note {
  padding: 8px 12px 10px;
  margin: 0;
  border-top: 1px dashed var(--vl-border-color);
}

.nav-action {
  font-size: 13px;
  color: var(--vl-primary);
}
</style>
