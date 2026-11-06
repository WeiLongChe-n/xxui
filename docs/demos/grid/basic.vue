<template>
  <div class="demo-col">
    <vl-grid>
      <vl-grid-item v-for="item in items" :key="item.text" :icon="item.icon" :text="item.text" />
    </vl-grid>

    <vl-grid :columns="3" border>
      <vl-grid-item icon="coupon" text="优惠券" :badge="2" />
      <vl-grid-item icon="cart" text="购物车" :badge="12" />
      <vl-grid-item icon="gift" text="积分商城" dot />
    </vl-grid>

    <vl-grid :columns="4" :gap="10" :border="false" square clickable @click="onClick">
      <vl-grid-item icon="phone" text="话费充值" />
      <vl-grid-item icon="service" text="在线客服" />
      <vl-grid-item icon="location" text="附近门店" />
      <vl-grid-item icon="setting" text="设置" />
    </vl-grid>
  </div>
</template>

<script setup lang="ts">
import { Toast } from '@vela/mobile'

const items = [
  { icon: 'home', text: '首页' },
  { icon: 'cart', text: '购物车' },
  { icon: 'coupon', text: '优惠券' },
  { icon: 'user', text: '我的' },
]

const onClick = () => Toast('宫格点击')
</script>

<style scoped>
.demo-col {
  gap: 16px;
}
</style>
