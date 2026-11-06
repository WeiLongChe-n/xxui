<template>
  <div class="demo-col">
    <div class="search-host">
      <x-search
        v-model="keyword"
        placeholder="搜索商品、品牌"
        @search="onSearch"
        @cancel="onCancel"
      />
      <p class="demo-note">输入内容后回车触发 search，右侧按钮触发 cancel</p>
    </div>

    <div class="search-host">
      <x-search v-model="keyword2" shape="round" placeholder="圆形搜索框" :show-action="false" />
    </div>

    <div class="search-host">
      <x-search
        v-model="keyword3"
        placeholder="自定义背景与按钮"
        background="var(--x-primary-light)"
        action-text="搜索"
        right-icon="filter"
      />
    </div>

    <div class="search-host">
      <x-search model-value="" placeholder="禁用状态" disabled />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Toast } from 'xxui-mobile'

const keyword = ref('')
const keyword2 = ref('')
const keyword3 = ref('')

const onSearch = (value: string) => Toast(value ? `搜索：${value}` : '请输入关键词')
const onCancel = () => Toast('已取消')
</script>

<style scoped>
.demo-col {
  gap: 16px;
}

.search-host {
  padding: 4px 0;
  background: var(--x-background-2);
  border-radius: 12px;
}
</style>
