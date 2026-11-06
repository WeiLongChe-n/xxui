<template>
  <div class="dropdown-demo">
    <x-dropdown-menu>
      <x-dropdown-item v-model="sort" :options="sortOptions" title="综合排序" />
      <x-dropdown-item
        v-model="filters"
        :options="filterOptions"
        title="筛选"
        multiple
      />
      <x-dropdown-item title="更多">
        <div class="dropdown-demo__custom">
          <span v-for="item in tags" :key="item" class="dropdown-demo__tag">{{ item }}</span>
        </div>
      </x-dropdown-item>
    </x-dropdown-menu>

    <p class="dropdown-demo__value">
      排序：{{ sortText }} · 筛选：{{ filters.length }} 项
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DropdownValue } from '@xxui/mobile'

const sort = ref<DropdownValue>('default')
const filters = ref<DropdownValue[]>([])

const sortOptions = [
  { text: '综合排序', value: 'default' },
  { text: '销量优先', value: 'sales' },
  { text: '价格从低到高', value: 'price-asc' },
  { text: '价格从高到低', value: 'price-desc' },
  { text: '好评优先', value: 'rate' },
]

const filterOptions = [
  { text: '包邮', value: 'free' },
  { text: '现货', value: 'stock' },
  { text: '新品', value: 'new' },
  { text: '仅看有货', value: 'available' },
  { text: '品牌旗舰店', value: 'brand', disabled: true },
]

const tags = ['7 天无理由', '极速退款', '正品保障']

const sortText = computed(
  () => sortOptions.find((item) => item.value === sort.value)?.text ?? '综合排序',
)
</script>

<style scoped>
.dropdown-demo {
  width: 100%;
  min-height: 320px;
  background: var(--x-background-2);
}

.dropdown-demo__value {
  margin: 0;
  padding: 12px 16px;
  font-size: 12px;
  color: var(--x-text-color-2);
}

.dropdown-demo__custom {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 14px 16px;
}

.dropdown-demo__tag {
  padding: 6px 12px;
  font-size: 12px;
  color: var(--x-text-color-2);
  background: var(--x-background-3);
  border-radius: 999px;
}
</style>
