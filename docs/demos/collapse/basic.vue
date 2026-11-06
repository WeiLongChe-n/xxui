<template>
  <div class="demo-col">
    <div class="block">
      <p class="demo-label">基础用法（v-model 绑定展开项数组）</p>
      <x-collapse v-model="active">
        <x-collapse-item name="1" title="什么是 XXUI？">
          XXUI 是一套基于 Vue 3 的移动端组件库，所有样式由 CSS 变量驱动，支持运行时换肤。
        </x-collapse-item>
        <x-collapse-item name="2" title="如何切换主题？">
          调用 setTheme / setBrand 或使用 useTheme 组合式 API，详见「主题定制」。
        </x-collapse-item>
        <x-collapse-item name="3" title="支持哪些浏览器？">
          iOS Safari 12+、Android Chrome 80+，以及主流桌面浏览器。
        </x-collapse-item>
      </x-collapse>
    </div>

    <div class="block">
      <p class="demo-label">手风琴模式（同时只展开一个）</p>
      <x-collapse v-model="accordionActive" accordion>
        <x-collapse-item name="a" title="订单管理" value="12 条">
          管理全部订单，支持筛选与批量操作。
        </x-collapse-item>
        <x-collapse-item name="b" title="售后服务" value="待处理 2">
          退换货、维修与投诉处理入口。
        </x-collapse-item>
        <x-collapse-item name="c" title="账号设置" disabled>
          该模块暂不可用。
        </x-collapse-item>
      </x-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref(['1'])
const accordionActive = ref('a')
</script>

<style scoped>
.demo-col {
  gap: 20px;
}

.block {
  overflow: hidden;
  border: 1px solid var(--x-border-color);
  border-radius: 12px;
}

.demo-label {
  padding: 12px 16px;
  margin: 0;
  font-size: 12px;
  color: var(--x-text-color-3);
  background: var(--x-background-3);
}
</style>
