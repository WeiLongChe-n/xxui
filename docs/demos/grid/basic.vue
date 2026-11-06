<template>
  <div class="demo-col">
    <x-grid>
      <x-grid-item v-for="item in items" :key="item.text" :icon="item.icon" :text="item.text" />
    </x-grid>

    <x-grid :columns="3" border>
      <x-grid-item icon="coupon" text="优惠券" :badge="2" />
      <x-grid-item icon="cart" text="购物车" :badge="12" />
      <x-grid-item icon="gift" text="积分商城" dot />
    </x-grid>

    <x-grid :columns="4" :gap="10" :border="false" square clickable @click="onClick">
      <x-grid-item icon="phone" text="话费充值" />
      <x-grid-item icon="service" text="在线客服" />
      <x-grid-item icon="location" text="附近门店" />
      <x-grid-item icon="setting" text="设置" />
    </x-grid>
  </div>
</template>

<script setup lang="ts">
import { Toast } from 'xxui-mobile'

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
