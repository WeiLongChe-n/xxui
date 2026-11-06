<template>
  <div class="demo-tree">
    <x-tree v-model:checked="checked" :data="data" multiple check-strictly default-expand-all />
    <p class="demo-tree__tip">
      父子互不联动，已选 {{ checked.length }} 项；「鄞州区」为禁用节点。
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TreeNode, TreeKey } from '@xxui/mobile'

const checked = ref<TreeKey[]>(['hangzhou'])

const data: TreeNode[] = [
  {
    key: 'zhejiang',
    label: '浙江省',
    children: [
      {
        key: 'hangzhou',
        label: '杭州市',
        children: [
          { key: 'xihu', label: '西湖区' },
          { key: 'yuhang', label: '余杭区' },
        ],
      },
      {
        key: 'ningbo',
        label: '宁波市',
        children: [
          { key: 'haishu', label: '海曙区' },
          { key: 'yinzhou', label: '鄞州区', disabled: true },
        ],
      },
    ],
  },
]
</script>

<style scoped>
.demo-tree {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.demo-tree__tip {
  margin: 0;
  padding: 0 12px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--x-text-color-2);
}
</style>
