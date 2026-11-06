<template>
  <div class="layout-demo">
    <x-row :gutter="12">
      <x-col v-for="item in list" :key="item.title" :span="8">
        <div class="card">
          <span class="card__icon"></span>
          <span class="card__title">{{ item.title }}</span>
          <span class="card__desc">{{ item.desc }}</span>
        </div>
      </x-col>
    </x-row>

    <x-row :gutter="[16, 12]">
      <x-col v-for="n in 4" :key="n" :span="12">
        <div class="tile">第 {{ n }} 块</div>
      </x-col>
    </x-row>
  </div>
</template>

<script setup lang="ts">
const list = [
  { title: '待付款', desc: '2 笔' },
  { title: '待收货', desc: '1 笔' },
  { title: '退换货', desc: '暂无' },
]
</script>

<style scoped>
.layout-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: var(--x-background-3);
  border-radius: 8px;
}

.card__icon {
  width: 22px;
  height: 22px;
  background: var(--x-primary-light);
  border-radius: 6px;
}

.card__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--x-text-color);
}

.card__desc {
  font-size: 11px;
  color: var(--x-text-color-3);
}

.tile {
  padding: 14px 10px;
  font-size: 12px;
  color: var(--x-text-color-2);
  text-align: center;
  background: var(--x-background-3);
  border-radius: 8px;
}
</style>
