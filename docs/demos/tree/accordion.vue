<template>
  <div class="demo-tree">
    <vl-tree
      v-model:selected="selected"
      v-model:expanded-keys="expanded"
      :data="data"
      accordion
      :indent="16"
    />
    <p class="demo-tree__tip">手风琴模式：同一层级同时只展开一个节点，点击箭头切换。</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TreeNode, TreeKey } from '@vela/mobile'

const selected = ref<TreeKey | null>('suzhou')
const expanded = ref<TreeKey[]>(['jiangsu'])

const data: TreeNode[] = [
  {
    key: 'zhejiang',
    label: '浙江省',
    icon: 'location',
    children: [
      {
        key: 'hangzhou',
        label: '杭州市',
        children: [{ key: 'xihu', label: '西湖区' }],
      },
      {
        key: 'ningbo',
        label: '宁波市',
        children: [{ key: 'haishu', label: '海曙区' }],
      },
    ],
  },
  {
    key: 'jiangsu',
    label: '江苏省',
    icon: 'location',
    children: [
      {
        key: 'suzhou',
        label: '苏州市',
        children: [
          { key: 'gusu', label: '姑苏区' },
          { key: 'wuzhong', label: '吴中区' },
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
  color: var(--vl-text-color-2);
}
</style>
