<template>
  <div class="demo-col">
    <div class="tabbar-host">
      <div class="tabbar-host__content">
        <p class="tabbar-host__title">{{ currentTitle }}</p>
      </div>
      <vl-tabbar v-model="active" :fixed="false">
        <vl-tabbar-item name="home" icon="home" text="首页" />
        <vl-tabbar-item name="cart" icon="cart" text="购物车" :badge="3" />
        <vl-tabbar-item name="message" icon="comment" text="消息" dot />
        <vl-tabbar-item name="user" icon="user" text="我的" />
      </vl-tabbar>
    </div>

    <div class="tabbar-host">
      <div class="tabbar-host__content">
        <p class="tabbar-host__title">自定义选中色</p>
      </div>
      <vl-tabbar v-model="active2" :fixed="false" active-color="#16a34a" inactive-color="#9699a6">
        <vl-tabbar-item name="a" icon="star" active-icon="like" text="收藏" />
        <vl-tabbar-item name="b" icon="shop" text="店铺" />
        <vl-tabbar-item name="c" icon="setting" text="设置" />
      </vl-tabbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const active = ref('home')
const active2 = ref('a')

const titles: Record<string, string> = {
  home: '首页内容',
  cart: '购物车内容',
  message: '消息内容',
  user: '我的内容',
}

const currentTitle = computed(() => titles[String(active.value)])
</script>

<style scoped>
.demo-col {
  gap: 18px;
}

.tabbar-host {
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
}

.tabbar-host__content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  background: var(--vl-background);
}

.tabbar-host__title {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-3);
}
</style>
