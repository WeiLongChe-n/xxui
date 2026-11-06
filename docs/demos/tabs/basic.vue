<template>
  <div class="demo-col">
    <div class="tabs-host">
      <vl-tabs v-model="active" @change="onChange">
        <vl-tab name="goods" title="商品详情">
          <div class="panel">商品详情内容</div>
        </vl-tab>
        <vl-tab name="params" title="规格参数">
          <div class="panel">规格参数内容</div>
        </vl-tab>
        <vl-tab name="comment" title="用户评价" :badge="12">
          <div class="panel">用户评价内容</div>
        </vl-tab>
        <vl-tab name="service" title="售后" disabled>
          <div class="panel">售后内容</div>
        </vl-tab>
      </vl-tabs>
    </div>

    <div class="tabs-host">
      <vl-tabs v-model="active2" type="card">
        <vl-tab name="a" title="全部">全部订单</vl-tab>
        <vl-tab name="b" title="待付款" :badge="2">待付款订单</vl-tab>
        <vl-tab name="c" title="已完成">已完成订单</vl-tab>
      </vl-tabs>
      <div class="panel">当前：{{ active2 }}</div>
    </div>

    <div class="tabs-host">
      <vl-tabs v-model="active3" color="#8b4ef5">
        <vl-tab name="1" title="推荐">推荐内容</vl-tab>
        <vl-tab name="2" title="关注">关注内容</vl-tab>
        <vl-tab name="3" title="附近">附近内容</vl-tab>
        <template #nav-right>
          <vl-icon name="filter" size="16" />
        </template>
      </vl-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Toast } from '@vela/mobile'

const active = ref('goods')
const active2 = ref('b')
const active3 = ref('1')

const onChange = (key: string | number) => Toast(`切换到 ${key}`)
</script>

<style scoped>
.demo-col {
  gap: 18px;
}

.tabs-host {
  overflow: hidden;
  background: var(--vl-background-2);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
}

.panel {
  padding: 24px 16px;
  font-size: 13px;
  color: var(--vp-c-text-3);
  text-align: center;
  background: var(--vl-background-2);
}
</style>
